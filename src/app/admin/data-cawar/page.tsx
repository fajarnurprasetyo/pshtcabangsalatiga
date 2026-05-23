"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
} from "flowbite-react";
import { useRouter, useSearchParams } from "next/navigation";
import { CgSpinner } from "react-icons/cg";
import { useAsync } from "react-use";
import { getRows } from "./actions";
import DataModal from "./data-modal";

export default function DataCawarPage() {
  const { value: rows } = useAsync(getRows);

  const router = useRouter();
  const searchParams = useSearchParams();

  const filter = searchParams.get("q") || "";
  const setFilter = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set("q", value);
    else params.delete("q");
    router.replace(`?${params}`, { scroll: false });
  };

  const setSelected = (value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set("s", value);
    else params.delete("s");
    router.push(`?${params}`, { scroll: false });
  };

  return (
    <>
      <div className="flex flex-col h-dvh">
        <div className="p-2">
          <TextInput
            placeholder="Search"
            value={filter}
            onChange={({ target }) => setFilter(target.value)}
          />
        </div>
        <div className="flex-1 overflow-auto">
          <Table
            striped
            hoverable
            theme={{
              root: { shadow: "drop-shadow-none", base: "select-none table-fixed" },
            }}
          >
            <TableHead className="top-0 z-10 sticky table-fixed">
              <TableRow>
                <TableHeadCell className="w-10">#</TableHeadCell>
                <TableHeadCell className="w-30">Ranting</TableHeadCell>
                <TableHeadCell>Nama Lengkap</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="text-nowrap">
              {!rows ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <div className="flex justify-center items-center">
                      <CgSpinner className="mr-2 animate-spin" />
                      Loading
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                rows
                  ?.filter((row) =>
                    row.namaLengkap
                      .toLowerCase()
                      .includes(filter.toLowerCase()),
                  )
                  ?.map((row, i) => (
                    <TableRow
                      key={i}
                      className="cursor-pointer"
                      onClick={() => setSelected(row.nik)}
                    >
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{row.rantingKomisariat}</TableCell>
                      <TableCell className="truncate">{row.namaLengkap}</TableCell>
                    </TableRow>
                  ))
              )}
              <TableRow className="not-first:hidden">
                <TableCell colSpan={3} className="text-center">
                  Data tidak ditemukan
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
      <DataModal />
    </>
  );
}
