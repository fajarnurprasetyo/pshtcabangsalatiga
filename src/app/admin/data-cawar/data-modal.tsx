import { Textarea, TextInput } from "@/components";
import dayjs from "@/libs/dayjs";
import {
  Badge,
  Button,
  Datepicker,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Radio,
  Select,
} from "flowbite-react";
import _ from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { HiCalendar, HiPencil, HiSave, HiTrash } from "react-icons/hi";
import { MdOutlineImageNotSupported, MdWhatsapp } from "react-icons/md";
import { useAsync, useBoolean } from "react-use";
import z from "zod";
import { getData, type Data } from "./actions";

const HpSchema = z.string().regex(/^\d{0,14}$/);

export default function DataModal() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nik = searchParams.get("s");
  const { value: data } = useAsync(() => getData(nik), [nik]);

  const [update, setUpdate] = useState<Partial<NonNullable<Data>>>({});
  const changed = Object.keys(update).length > 0;
  const setUpdateData = (data: Partial<NonNullable<Data>>) =>
    setUpdate((prev) => ({ ...prev, ...data }));

  const tanggalLahir = update.tanggalLahir ?? data?.tanggalLahir;
  const presensi = _.countBy(data?.presensi?.split(""));

  const [edit, setEdit] = useBoolean(false);
  const [saving, setSaving] = useBoolean(false);
  const canEdit = edit && !saving;

  const handleClose = () => {
    router.back();
    const params = new URLSearchParams(searchParams);
    params.delete("s");
    router.replace(`?${params}`, { scroll: false });
  };

  const handleSave = () => {
    if (saving) return;

    setSaving(true);

    handleClose();
  };

  useEffect(() => {
    if (!nik) return;
    setEdit(false);
    setSaving(false);
    setUpdate({});
  }, [nik]);

  return (
    <Modal
      dismissible
      show={!!nik}
      onClose={handleClose}
      theme={{
        content: {
          base: "max-md:p-0 max-md:max-w-none",
          inner:
            "max-md:w-full max-md:h-full max-md:max-h-none max-md:rounded-none",
        },
      }}
    >
      <ModalHeader>{nik}</ModalHeader>
      <ModalBody className="flex-1">
        {!data ? (
          "Loading..."
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex justify-center items-center self-center border-2 border-gray-200 rounded-sm w-[40%] aspect-3/4 overflow-hidden text-gray-500">
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
            {/* Nama Lengkap */}
            <div>
              <Label>Nama Lengkap</Label>
              <TextInput
                className="mt-1"
                readOnly={!canEdit}
                value={update.namaLengkap ?? data.namaLengkap}
                onChange={({ target }) =>
                  setUpdateData({ namaLengkap: target.value })
                }
              />
            </div>
            {/* Gender */}
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
                      disabled={!canEdit}
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
            {/* Tempat Lahir */}
            <div>
              <Label>Tempat Lahir</Label>
              <TextInput
                className="mt-1"
                readOnly={!canEdit}
                value={update.tempatLahir ?? data.tempatLahir ?? ""}
                onChange={({ target }) =>
                  setUpdateData({ tempatLahir: target.value })
                }
              />
            </div>
            {/* Tanggal Lahir */}
            <div>
              <Label>Tanggal Lahir</Label>
              {canEdit ? (
                <Datepicker
                  language="ID-id"
                  className="mt-1"
                  value={tanggalLahir}
                  onChange={(tanggalLahir) => {
                    setUpdateData({ tanggalLahir });
                  }}
                />
              ) : (
                <TextInput
                  readOnly
                  className="mt-1"
                  icon={HiCalendar}
                  defaultValue={
                    tanggalLahir
                      ? dayjs.tz(tanggalLahir).format("D MMMM YYYY")
                      : ""
                  }
                />
              )}
            </div>
            {/* Agama */}
            <div>
              <Label>Agama</Label>
              {canEdit ? (
                <Select
                  className="mt-1"
                  value={update.agama ?? data.agama ?? ""}
                  onChange={({ target }) =>
                    setUpdateData({ agama: target.value })
                  }
                >
                  <option disabled value="">
                    -
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
              ) : (
                <TextInput
                  readOnly
                  className="mt-1"
                  defaultValue={update.agama ?? data.agama ?? "-"}
                />
              )}
            </div>
            {/* Pendidikan */}
            <div>
              <Label>Pendidikan</Label>
              {canEdit ? (
                <Select
                  className="mt-1"
                  value={update.pendidikan ?? data.pendidikan ?? ""}
                  onChange={({ target }) =>
                    setUpdateData({ pendidikan: target.value })
                  }
                >
                  <option disabled value="">
                    -
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
              ) : (
                <TextInput
                  readOnly
                  className="mt-1"
                  defaultValue={update.pendidikan ?? data.pendidikan ?? "-"}
                />
              )}
            </div>
            {/* Pekerjaan */}
            <div>
              <Label>Pekerjaan</Label>
              {canEdit ? (
                <Select
                  className="mt-1"
                  value={update.pekerjaan ?? data.pekerjaan ?? ""}
                  onChange={({ target }) =>
                    setUpdateData({ pekerjaan: target.value })
                  }
                >
                  <option disabled value="">
                    -
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
              ) : (
                <TextInput
                  readOnly
                  className="mt-1"
                  defaultValue={update.pekerjaan ?? data.pekerjaan ?? "-"}
                />
              )}
            </div>
            {/* Alamat */}
            <div>
              <Label>Alamat</Label>
              <Textarea
                rows={3}
                readOnly={!canEdit}
                className="resize-none"
                value={update.alamat ?? data.alamat ?? ""}
                onChange={({ target }) => {
                  setUpdateData({ alamat: target.value });
                }}
              />
            </div>
            {/* No. HP */}
            <div>
              <Label>Nomor HP</Label>
              <div className="flex mt-1">
                <TextInput
                  readOnly={!canEdit}
                  value={update.noHp ?? data.noHp ?? ""}
                  onChange={({ target }) => {
                    const parsed = HpSchema.safeParse(target.value);
                    if (!parsed.success) return;
                    setUpdateData({ noHp: parsed.data });
                  }}
                  theme={{
                    base: "flex-1",
                    field: { input: { base: "!rounded-r-none" } },
                  }}
                />
                <Button
                  as="a"
                  color="green"
                  target="_blank"
                  href={`https://wa.me/${update.noHp ?? data.noHp}`}
                  className="px-4 rounded-l-none h-10.5 text-xl"
                >
                  <MdWhatsapp />
                </Button>
              </div>
            </div>
            {/* Orang Tua */}
            <div>
              <Label>Orang Tua</Label>
              <TextInput
                readOnly
                className="mt-1"
                defaultValue={data.orangTua ?? ""}
              />
            </div>
            {/* Presensi */}
            <Badge className="self-center mt-2">
              <div className="flex gap-2">
                <div>
                  <strong>Hadir:</strong> {presensi.H || 0}
                </div>
                <div>
                  <strong>Sakit:</strong> {presensi.S || 0}
                </div>
                <div>
                  <strong>Izin:</strong> {presensi.I || 0}
                </div>
                <div>
                  <strong>Alpa:</strong> {presensi.A || 0}
                </div>
              </div>
            </Badge>
          </div>
        )}
      </ModalBody>
      <ModalFooter className="justify-end">
        {!edit ? (
          <Button disabled={!data} onClick={() => setEdit(true)}>
            <HiPencil className="mr-2" />
            Edit
          </Button>
        ) : (
          <>
            <Button
              color="red"
              onClick={() => {
                setUpdate({});
                setEdit(false);
              }}
            >
              <HiTrash className="mr-2" />
              Batal
            </Button>
            <Button
              className="gap-2"
              onClick={handleSave}
              disabled={!changed || saving}
            >
              {saving ? <CgSpinner className="animate-spin" /> : <HiSave />}
              Simpan
            </Button>
          </>
        )}
      </ModalFooter>
    </Modal>
  );
}
