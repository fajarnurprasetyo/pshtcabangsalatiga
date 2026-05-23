import { google } from "googleapis";
import z from "zod";
import Env from "./env";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: Env.GOOGLE_CLIENT_EMAIL,
    private_key: Env.GOOGLE_PRIVATE_KEY,
  },
  scopes: [
    "https://www.googleapis.com/auth/drive.readonly",
    "https://www.googleapis.com/auth/spreadsheets",
  ],
});

export const sheets = google.sheets({ version: "v4", auth });

const SHEET_HEADER = [
  "Ranting / Komisariat",
  "Nama Lengkap",
  "NIK",
  "L/P",
  "Tempat Lahir",
  "Tanggal Lahir",
  "Agama",
  "Pendidikan",
  "Pekerjaan",
  "Alamat",
  "No. HP",
  "Orang Tua",
  "Presensi",
  "Active",
] as const;

type PreClean<S extends string> = S extends `${infer A}/${infer B}`
  ? `${A}${B}`
  : S;

type Clean<S extends string> =
  PreClean<S> extends `${infer H}${infer T}`
    ? H extends " " | "." | "," | "-" | "_"
      ? ` ${Clean<T>}`
      : `${H}${Clean<T>}`
    : PreClean<S>;

type CamelCase<S extends string> =
  Clean<S> extends `${infer First} ${infer Rest}`
    ? `${Lowercase<First>}${Capitalize<CamelCase<Rest>>}`
    : Lowercase<Clean<S>>;

type MapTuple<T extends readonly string[]> = T extends readonly [
  infer F extends string,
  ...infer R extends string[],
]
  ? readonly [CamelCase<F>, ...MapTuple<R>]
  : readonly [];

type SheetKeys = MapTuple<typeof SHEET_HEADER>;
export type SheetKey = SheetKeys[number];
export type EditableSheetKey = Exclude<
  SheetKey,
  "nik" | "noHp" | "orangTua" | "presensi" | "active"
>;

const SheetKeys = SHEET_HEADER.map((header) =>
  header
    .replace(/[^\w\s]/g, "")
    .trim()
    .split(/\s+/)
    .map((w, i) =>
      i === 0
        ? w.toLowerCase()
        : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
    )
    .join(""),
) as unknown as SheetKeys;

type SheetValues = readonly [
  string,
  string,
  string,
  "L" | "P" | null,
  string | null,
  Date | null,
  string | null,
  string | null,
  string | null,
  string | null,
  string | null,
  string | null,
  string,
  boolean,
];

export type SheetValue = SheetValues[number];

export type Data = {
  [I in Exclude<keyof SheetKeys, keyof any[]> as SheetKeys[I]]: SheetValues[I];
};

export const DataSchema = z.object({
  rantingKomisariat: z.string(),
  namaLengkap: z.string(),
  nik: z.string().regex(/^\d{16}$/),
  lp: z.literal(["L", "P"]),
  tempatLahir: z.preprocess(
    (v) => (v === "" ? null : v),
    z.string().nullable(),
  ),
  tanggalLahir: z.preprocess((v) => {
    if (typeof v !== "number") return null;
    return new Date((v - 25569) * 86400 * 1000);
  }, z.date().nullable()),
  agama: z.preprocess((v) => (v === "" ? null : v), z.string().nullable()),
  pendidikan: z.preprocess((v) => (v === "" ? null : v), z.string().nullable()),
  pekerjaan: z.preprocess((v) => (v === "" ? null : v), z.string().nullable()),
  alamat: z.preprocess((v) => (v === "" ? null : v), z.string().nullable()),
  noHp: z.preprocess(
    (v) => (v === "" ? null : v),
    z
      .string()
      .regex(/^\d+$/)
      .nullable()
      .transform((v) => {
        if (!v) return v;
        if (v.startsWith("0")) return v.replace(/^0/, "62");
        if (v.startsWith("62")) return v;
        return `62${v}`;
      }),
  ),
  orangTua: z.preprocess((v) => (v === "" ? null : v), z.string().nullable()),
  presensi: z.string(),
  active: z.boolean(),
});

export const PartialDataSchema = DataSchema.partial();

function columnName(col: number) {
  return String.fromCharCode(65 + col);
}

export async function fetchRows<
  const F extends readonly [SheetKey, ...SheetKey[]],
  R extends Pick<Data, F[number]>,
>(fields: F): Promise<R[]> {
  const res = await sheets.spreadsheets.values.batchGet({
    spreadsheetId: Env.SPREADSHEET_ID,
    valueRenderOption: "UNFORMATTED_VALUE",
    ranges: [
      ...fields.map((col) => {
        const colName = columnName(SheetKeys.indexOf(col) + 1);
        return `${Env.SPREADSHEET_SHEET}!${colName}:${colName}`;
      }),
    ],
  });

  const columns = res.data.valueRanges?.map((v) => v.values || []) || [];
  const maxRows = Math.max(...columns.map((col) => col.length));

  for (let i = 0; i < fields.length; i++) {
    const expectedHeader = SHEET_HEADER[SheetKeys.indexOf(fields[i])];
    if (columns[i][0]?.[0] !== expectedHeader) return [];
  }

  const rows: R[] = [];

  for (let i = 1; i < maxRows; i++) {
    const obj: Record<string, any> = {};

    for (let j = 0; j < fields.length; j++) {
      obj[fields[j]] = columns[j][i]?.[0];
    }

    const parse = PartialDataSchema.safeParse(obj);
    if (!parse.success) continue;

    rows.push(parse.data as R);
  }

  return rows;
}

export async function findRowIndex<
  const F extends readonly [SheetKey, ...SheetKey[]],
  P extends Pick<Data, F[number]>,
>(fields: F, predicate: P | ((data: P) => boolean)): Promise<number>;
export async function findRowIndex(predicate: Partial<Data>): Promise<number>;
export async function findRowIndex(
  arg_0: Partial<Data> | [SheetKey, ...SheetKey[]],
  arg_1?: Partial<Data> | ((data: Partial<Data>) => boolean),
) {
  let fields!: [SheetKey, ...SheetKey[]];
  let predicate: Partial<Data> = {};
  let match: ((data: Partial<Data>) => boolean) | undefined;

  if (!Array.isArray(arg_0)) {
    fields = (Object.keys(arg_0) as SheetKey[]).filter(
      (k) => arg_0[k] !== undefined,
    ) as [SheetKey, ...SheetKey[]];
    predicate = arg_0;
  } else {
    fields = [...new Set(arg_0)] as [SheetKey, ...SheetKey[]];
    if (typeof arg_1 === "object") {
      predicate = arg_1;
    } else if (arg_1) {
      match = arg_1;
    }
  }

  if (!match) {
    match = (data) => {
      for (const field of fields) {
        if (data[field] !== predicate[field]) {
          return false;
        }
      }
      return true;
    };
  }

  const rows = await fetchRows(fields);

  for (const row of rows) {
    if (match(row)) return rows.indexOf(row) + 2;
  }

  // for (let i = 1; i < maxRows; i++) {
  //   const obj: Record<string, any> = {};

  //   for (let j = 0; j < fields.length; j++) {
  //     obj[fields[j]] = columns[j][i]?.[0];
  //   }

  //   const parse = PartialDataSchema.safeParse(obj);
  //   if (!parse.success) continue;

  //   if (match(parse.data)) return i + 1;
  // }

  return -1;
}

export async function updateData(
  nik: Data["nik"],
  data: Omit<Partial<Data>, "nik">,
) {
  const row = await findRowIndex({ nik });

  if (row > 0) {
    const res = await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: Env.SPREADSHEET_ID,
      requestBody: {
        valueInputOption: "USER_ENTERED",
        data: Object.entries(data)
          .map(([key, value]) => {
            const keyIndex = SheetKeys.indexOf(key as SheetKey);
            if (keyIndex === -1) return null;

            return {
              range: `${Env.SPREADSHEET_SHEET}!${columnName(keyIndex + 1)}${row}`,
              values: [[value]],
            };
          })
          .filter((item) => !!item),
      },
    });
    return !!res.data.totalUpdatedCells && res.data.totalUpdatedCells > 0;
  }

  return false;
}

type HasDuplicate<T extends readonly any[]> = T extends readonly [
  infer F,
  ...infer R,
]
  ? F extends R[number]
    ? true
    : HasDuplicate<R>
  : false;

export async function searchData<
  const F extends readonly [SheetKey, ...SheetKey[]],
  P extends Pick<Data, F[number]>,
>(
  fields: HasDuplicate<F> extends true ? never : F,
  predicate: P | ((data: P) => boolean),
): Promise<Data | undefined>;
export async function searchData(
  predicate: Partial<Data>,
): Promise<Data | undefined>;
export async function searchData(
  arg_0: Partial<Data> | [SheetKey, ...SheetKey[]],
  arg_1?: Partial<Data> | ((data: Data) => boolean),
) {
  // @ts-expect-error
  const row = await findRowIndex(arg_0, arg_1);

  if (row > 0) {
    const res = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: Env.SPREADSHEET_ID,
      valueRenderOption: "UNFORMATTED_VALUE",
      ranges: [
        `${Env.SPREADSHEET_SHEET}!B1:${columnName(SheetKeys.length)}1`,
        `${Env.SPREADSHEET_SHEET}!B${row}:${columnName(SheetKeys.length)}${row}`,
      ],
    });

    const [headerRange, dataRange] = res.data.valueRanges ?? [];
    const header = headerRange?.values?.[0];
    const values = dataRange?.values?.[0];

    if (!header || !values) return;
    if (header.length !== SHEET_HEADER.length) return;
    if (header.some((v, i) => v !== SHEET_HEADER[i])) return;

    const obj = Object.fromEntries(SheetKeys.map((key, i) => [key, values[i]]));
    const parsed = DataSchema.safeParse(obj);
    if (!parsed.success || !parsed.data.active) return;
    return parsed.data;
  }
}

export async function searchDataByNik(nik: Data["nik"]) {
  return await searchData({ nik });
}

export async function searchDataByHp(hp: NonNullable<Data["noHp"]>) {
  return await searchData({ noHp: hp });
}

const drive = google.drive({ version: "v3", auth });

export async function fetchPicture(nik: string) {
  try {
    const {
      data: { files },
    } = await drive.files.list({
      q: `'1in--L6bTLZQ983N_Wo4HhTf80jnpzj6q' in parents and name contains '${nik}' and trashed = false`,
      fields: "files(id)",
    });

    const file = files?.[0];
    if (!file?.id) return null;

    const media = await drive.files.get(
      { fileId: file.id, alt: "media" },
      { responseType: "arraybuffer" },
    );

    const buffer = Buffer.from(media.data as ArrayBuffer);
    return `data:${file.mimeType};base64,${buffer.toString("base64")}`;
  } catch (err) {
    console.error(err);
    return null;
  }
}
