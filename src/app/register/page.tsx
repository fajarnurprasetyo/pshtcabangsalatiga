"use client";

import { Container } from "@/components/Container";
import { UserRole, type Branch } from "@/generated/prisma/browser";
import { UsernameSchema } from "@/schemas/user";
import {
  Button,
  HelperText,
  HR,
  Label,
  Radio,
  TextInput,
} from "flowbite-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import { useRef, useState, type SubmitEvent } from "react";
import { CgSpinner } from "react-icons/cg";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { useBoolean, useDebounce, useToggle } from "react-use";
import { checkUsername, findBranch, register } from "./actions";

function generateUsername(name: string) {
  if (name.length < 3) return "";
  const lowerName = name.toLowerCase().replace(/\s+/g, "");
  const randomNum = Math.floor(Math.random() * 900) + 100;
  return `${lowerName}${randomNum}`;
}

// function getPasswordStrength(password: string) {
//   let score = 0;
//   if (password.length >= 8) score++;
//   if (/[a-z]/.test(password)) score++;
//   if (/[A-Z]/.test(password)) score++;
//   if (/[0-9]/.test(password)) score++;
//   if (/[^A-Za-z0-9]/.test(password)) score++;
//   return score;
// }

// function getPasswordLabel(score: number) {
//   if (score <= 1) return "Weak";
//   if (score <= 3) return "Medium";
//   return "Strong";
// }

// function getPasswordBarColor(score: number) {
//   if (score <= 1) return "bg-red-500";
//   if (score <= 3) return "bg-yellow-500";
//   return "bg-green-500";
// }

interface FromProps {
  callbackUrl?: string;
}

function Form({ callbackUrl }: FromProps) {
  const [username, setUsername] = useState("");
  const [usernameUserChanged, setUsernameUserChanged] = useBoolean(false);
  const [usernameChecking, setUsernameChecking] = useBoolean(false);

  const usernameValid =
    !usernameUserChanged || UsernameSchema.safeParse(username).success;
  const [usernameAvailable, setUsernameAvailable] = useBoolean(true);

  const usernameHelperText = !usernameValid
    ? "Nama pengguna tidak valid!"
    : !usernameAvailable
      ? "Nama pengguna tidak tersedia!"
      : null;

  const usernameCheckRef = useRef(0);
  useDebounce(
    async () => {
      if (!username || !usernameValid) {
        setUsernameChecking(false);
        return;
      }

      const id = ++usernameCheckRef.current;
      const available = await checkUsername(username);
      if (id !== usernameCheckRef.current) return;

      setUsernameAvailable(available);
      setUsernameChecking(false);
    },
    300,
    [usernameValid, username],
  );

  const [password, setPassword] = useState("");
  const [passwordError] = useToggle(false);
  const [showPassword] = useToggle(false);

  const [name, setName] = useState("");

  const [branch, setBranch] = useState<Branch | null>(null);
  const [branchQuery, setBranchQuery] = useState("");
  const branchQueryRef = useRef(0);
  const [branchOptions, setBranchOptions] = useState<
    Awaited<ReturnType<typeof findBranch>>
  >([]);
  const [branchOptionsLoading, setBranchOptionsLoading] = useBoolean(false);

  useDebounce(
    async () => {
      const query = branchQuery.trim();

      if (!query) {
        setBranchOptions([]);
        setBranchOptionsLoading(false);
        return;
      }

      const id = ++branchQueryRef.current;
      const options = await findBranch(query);
      if (id !== branchQueryRef.current) return;

      setBranchOptions(options);

      setBranchOptionsLoading(false);
    },
    300,
    [branchQuery],
  );

  const [role, setRole] = useState<UserRole>("SISWA");

  const [loading, setLoading] = useBoolean(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);

    const formData = new FormData(event.target);
    const payload = Object.fromEntries(formData.entries());
    const { data } = await register(payload);

    if (data) {
      await signIn("credentials", { ...data, callbackUrl });
      return;
    }

    setLoading(false);
  };

  return (
    <form
      autoComplete="off"
      className="flex flex-col gap-4"
      onSubmit={handleSubmit}
    >
      <TextInput
        required
        autoFocus
        type="text"
        name="name"
        autoComplete="off"
        placeholder="Nama Lengkap"
        value={name}
        onChange={({ target }) => {
          setName(target.value);
          if (!usernameUserChanged) {
            const username = generateUsername(target.value);
            setUsername(username);
            setUsernameChecking(UsernameSchema.safeParse(username).success);
          }
        }}
      />

      <div>
        <TextInput
          required
          type="text"
          name="username"
          autoComplete="off"
          color={usernameValid && usernameAvailable ? "gray" : "failure"}
          placeholder="Nama Pengguna"
          rightIcon={(props) =>
            usernameChecking ? (
              <CgSpinner
                {...props}
                className={`${props.className} animate-spin`}
              />
            ) : !usernameValid || !usernameAvailable ? (
              <FaXmark
                {...props}
                className={`${props.className} text-red-500`}
              />
            ) : (
              username && (
                <FaCheck
                  {...props}
                  className={`${props.className} text-green-500`}
                />
              )
            )
          }
          value={username}
          onChange={({ target }) => {
            setUsername(target.value);
            setUsernameUserChanged(true);
            setUsernameChecking(UsernameSchema.safeParse(target.value).success);
          }}
        />
        {usernameHelperText && (
          <HelperText className="mt-1">{usernameHelperText}</HelperText>
        )}
      </div>

      <div>
        <TextInput
          required
          type={showPassword ? "text" : "password"}
          name="password"
          autoComplete="new-password"
          color={
            password.length > 0 && password.length < 8 ? "failure" : "gray"
          }
          placeholder="Kata Sandi"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        {passwordError && (
          <HelperText className="mt-1">
            Kata sandi minimal 8 karakter
          </HelperText>
        )}
      </div>

      <div>
        {/* <Combobox
          value={branch}
          onChange={setBranch}
          onClose={() => setBranchQuery("")}
        >
          <div className="relative">
            <input hidden name="branch-id" defaultValue={branch?.id} />

            <ComboboxInput
              required
              autoComplete="off"
              placeholder="Cabang"
              displayValue={(branch: Branch | null) => branch?.name || ""}
              onChange={({ target }) => {
                setBranch(null);
                setBranchQuery(target.value);
                setBranchOptionsLoading(true);
              }}
              className="block bg-gray-50 disabled:opacity-50 p-2.5 border border-gray-300 focus:border-primary-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 w-full text-gray-900 text-sm disabled:cursor-not-allowed placeholder-gray-500"
            />

            {branchOptionsLoading && (
              <CgSpinner className="top-1/2 right-3 absolute -translate-y-1/2 animate-spin pointer-events-none" />
            )}

            {branchQuery && (
              <ComboboxOptions className="z-10 absolute bg-white shadow-lg mt-1 rounded-lg w-full overflow-hidden text-sm">
                <div className="max-h-60 overflow-x-hidden overflow-y-auto">
                  {branchOptions.length === 0 && (
                    <div className="px-2.5 py-2 text-gray-500">
                      {branchOptionsLoading
                        ? "Memuat..."
                        : "Data tidak ditemukan"}
                    </div>
                  )}

                  {branchOptions.map((branch) => (
                    <ComboboxOption key={branch.id} value={branch}>
                      {({ focus, disabled, selected }) => (
                        <div
                          className={`flex px-2.5 py-2 align-center gap-1 cursor-default ${
                            disabled
                              ? "text-gray-500"
                              : focus
                                ? "bg-gray-200"
                                : ""
                          }`}
                        >
                          <div className="font-bold">
                            {`${branch.id}`.padStart(3, "0")}
                          </div>
                          <div className="flex-1">{branch.name}</div>
                          {selected && <FaCheck />}
                        </div>
                      )}
                    </ComboboxOption>
                  ))}
                </div>
              </ComboboxOptions>
            )}
          </div>
        </Combobox> */}
      </div>

      <div>
        <TextInput
          type="text"
          name="sub-branch"
          autoComplete="off"
          placeholder="Ranting"
        />
      </div>

      <div>
        <Label className="block mb-2">Status Keanggotaan</Label>
        <div className="flex gap-4">
          {[
            { value: "SISWA", label: "Siswa" },
            { value: "WARGA", label: "Warga" },
          ].map((item) => (
            <div key={item.value} className="flex items-center gap-2">
              <Radio
                id={`user-role-${item.value}`}
                name="role"
                value={item.value}
                checked={item.value === role}
                onClick={() => setRole(item.value as UserRole)}
              />
              <Label htmlFor={`user-role-${item.value}`}>{item.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        disabled={
          name.length < 3 ||
          !username ||
          !usernameValid ||
          !usernameAvailable ||
          password.length < 8 ||
          !branch ||
          loading
        }
      >
        {loading ? <CgSpinner className="animate-spin" /> : "Daftar"}
      </Button>
    </form>
  );
}

export default function RegisterPage() {
  notFound();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <main className="flex flex-1 justify-center items-center">
      <Container className="rounded-xl max-w-xl">
        <h1 className="font-semibold text-3xl text-center select-none">
          Daftar
        </h1>

        <HR />

        <Form callbackUrl={callbackUrl} />

        <div className="flex items-center gap-4">
          <HR className="flex-1" />
          <span className="text-sm select-none">atau</span>
          <HR className="flex-1" />
        </div>

        <p className="text-sm text-center select-none">
          Sudah punya akun?&nbsp;
          <Link
            href={`/login?callbackUrl=${callbackUrl}`}
            className="font-medium text-primary-700 hover:underline"
          >
            Masuk
          </Link>
        </p>
      </Container>
    </main>
  );
}
