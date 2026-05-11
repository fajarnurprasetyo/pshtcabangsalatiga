"use client";

import { Container } from "@/components/Container";
import dayjs from "@/libs/dayjs";
import {
  Button,
  Datepicker,
  HelperText,
  Label,
  Radio,
  Select,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useEffect, useState, type SubmitEvent } from "react";
import { CgSpinner } from "react-icons/cg";
import { MdOutlineImageNotSupported, MdSave } from "react-icons/md";
import { useBoolean, useDebounce } from "react-use";
import { twMerge } from "tailwind-merge";
import z from "zod";
import { fetchData, saveData, type Data } from "./actions";

const NikSchema = z.string().regex(/^\d{0,16}$/);
const StrictNikSchema = NikSchema.min(16);
const HpSchema = z.string().regex(/^\d{0,14}$/);

export default function Form() {
  const [nik, setNik] = useState("");
  const valid = StrictNikSchema.safeParse(nik).success;

  const [loading, setLoading] = useBoolean(false);
  const [data, setData] = useState<Data | null>(null);
  const [update, setUpdate] = useState<Partial<NonNullable<Data>>>({});
  const changed = Object.keys(update).length > 0;
  const [saving, setSaving] = useBoolean(false);

  const setUpdateData = (data: Partial<NonNullable<Data>>) => {
    console.log(data);
    setUpdate((prev) => ({ ...prev, ...data }));
  };

  useEffect(() => {
    setData(null);
    setLoading(valid);
  }, [valid]);

  useDebounce(
    async () => {
      if (valid) {
        const data = await fetchData(nik!);
        setData(data);
      }
      setLoading(false);
    },
    300,
    [nik],
  );

  const handleSave = async (event: SubmitEvent) => {
    event.preventDefault();
    if (!changed || saving) return;

    setSaving(true);
    const data = {
      ...update,
      tanggalLahir: dayjs(update.tanggalLahir).format("DD/MM/YYYY"),
    };
    const success = await saveData(nik!, data);
    setSaving(false);

    alert(success ? "Data berhasil disimpan." : "Gagal menyimpan data.");
  };

  return (
    <Container className="overflow-y-auto">
      <Label>Nomor Induk Kependudukan</Label>
      <TextInput
        autoFocus
        disabled={loading}
        className="mt-2"
        value={nik || ""}
        onChange={({ target }) => {
          const parsed = NikSchema.safeParse(target.value);
          if (!parsed.success) return;
          setNik(parsed.data);
        }}
      />
      <HelperText className="text-red-700">
        {nik &&
          (!valid
            ? "NIK tidak valid."
            : !loading && !data && "Data tidak ditemukan.")}
      </HelperText>
      <form
        onSubmit={handleSave}
        className={twMerge(
          "flex flex-col flex-1 gap-2 mt-2",
          loading && "items-center justify-center",
        )}
      >
        {loading ? (
          <CgSpinner className="text-4xl animate-spin" />
        ) : (
          data && (
            <>
              <div className="flex justify-center items-center self-center border-2 border-gray-500 rounded-sm w-[33%] aspect-3/4 text-gray-500">
                {data.photo ? (
                  <img src={data.photo} className="w-full h-full" />
                ) : (
                  <div className="flex flex-col items-center">
                    <MdOutlineImageNotSupported className="text-3xl" />
                    <div className="mt-1 font-semibold text-xs">
                      Tidak ada foto
                    </div>
                  </div>
                )}
              </div>
              <div>
                <Label>Nama Lengkap</Label>
                <TextInput
                  className="mt-1"
                  value={update.namaLengkap ?? data.namaLengkap}
                  onChange={({ target }) =>
                    setUpdateData({ namaLengkap: target.value })
                  }
                />
              </div>

              <div>
                <Label>Gender</Label>
                <div className="flex gap-4 mt-1">
                  {[
                    { label: "Laki-laki", value: "L" },
                    { label: "Perempuan", value: "P" },
                  ].map(({ label, value }) => (
                    <div key={value} className="flex items-center gap-2">
                      <Radio
                        id={`gender-${value}`}
                        name="gender"
                        value={value}
                        checked={(update.lp ?? data.lp) === value}
                        onChange={({ target }) =>
                          target.checked && setUpdateData({ lp: value as any })
                        }
                      />
                      <Label htmlFor={`gender-${value}`}>{label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Tempat Lahir</Label>
                <TextInput
                  className="mt-1"
                  value={update.tempatLahir ?? data.tempatLahir ?? ""}
                  onChange={({ target }) =>
                    setUpdateData({ tempatLahir: target.value })
                  }
                />
              </div>

              <div>
                <Label>Tanggal Lahir</Label>
                <Datepicker
                  language="ID-id"
                  className="mt-1"
                  value={update.tanggalLahir ?? data.tanggalLahir}
                  onChange={(tanggalLahir) => {
                    setUpdateData({ tanggalLahir });
                  }}
                />
              </div>

              <div>
                <Label>Agama</Label>
                <Select
                  className="mt-2"
                  value={update.agama ?? data.agama ?? ""}
                  onChange={({ target }) =>
                    setUpdateData({ agama: target.value })
                  }
                >
                  <option disabled value="">
                    -- Agama --
                  </option>
                  {[
                    "Islam",
                    "Kristen",
                    "Katolik",
                    "Hindu",
                    "Budha",
                    "Khonghucu",
                  ].map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </Select>
              </div>

              <div>
                <Label>Pendidikan terakhir</Label>
                <Select
                  className="mt-2"
                  value={update.pendidikan ?? data.pendidikan ?? ""}
                  onChange={({ target }) =>
                    setUpdateData({ pendidikan: target.value })
                  }
                >
                  <option disabled value="">
                    -- Pendidikan --
                  </option>
                  {[
                    "SD",
                    "SMP",
                    "SMA",
                    "SMK",
                    "MI",
                    "MTs",
                    "MA",
                    "D1",
                    "D2",
                    "D3",
                    "D4",
                    "S1",
                    "S2",
                    "S3",
                    "Lainnya",
                  ].map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </Select>
              </div>

              <div>
                <Label>Pekerjaan</Label>
                <Select
                  className="mt-2"
                  value={update.pekerjaan ?? data.pekerjaan ?? ""}
                  onChange={({ target }) =>
                    setUpdateData({ pekerjaan: target.value })
                  }
                >
                  <option disabled value="">
                    -- Pekerjaan --
                  </option>
                  {[
                    "PNS",
                    "Pegawai Swasta",
                    "Pegawai BUMN",
                    "TNI",
                    "POLRI",
                    "Guru",
                    "Profesional",
                    "Pensiun",
                    "Pelajar",
                    "Mahasiswa",
                    "Wiraswasta",
                    "Petani/Nelayan",
                    "Buruh",
                    "Pedagang",
                    "Sopir/Driver",
                    "Tenaga Kesehatan",
                    "Belum/Tidak Bekerja",
                  ].map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </Select>
              </div>

              <div>
                <Label>Alamat</Label>
                <Textarea
                  rows={3}
                  value={update.alamat ?? data.alamat ?? ""}
                  onChange={({ target }) => {
                    setUpdateData({ alamat: target.value });
                  }}
                />
              </div>

              <div>
                <Label>Nomor HP</Label>
                <TextInput
                  className="mt-1"
                  value={update.noHp ?? data.noHp ?? ""}
                  onChange={({ target }) => {
                    const parsed = HpSchema.safeParse(target.value);
                    if (!parsed.success) return;
                    setUpdateData({ noHp: parsed.data });
                  }}
                />
              </div>

              <div>
                <Label>Presensi Latber</Label>
                <TextInput disabled defaultValue={data.presensi} />
              </div>

              <Button
                type="submit"
                disabled={!changed || saving}
                className="self-end gap-2 mt-2"
              >
                {saving ? <CgSpinner className="animate-spin" /> : <MdSave />}
                Simpan
              </Button>
            </>
          )
        )}
      </form>
    </Container>
  );
}
