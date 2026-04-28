"use client";

import { UserRole, type Branch } from "@/generated/prisma/browser";
import { UsernameSchema } from "@/libs/shared/schemas/user";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import {
  Button,
  ButtonGroup,
  HelperText,
  HR,
  Label,
  TextInput,
} from "flowbite-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { FaCheck, FaSpinner, FaXmark } from "react-icons/fa6";
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

export default function RegisterPage() {
  const [username, setUsername] = React.useState("");
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

  const usernameCheckRef = React.useRef(0);
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

  const [password, setPassword] = React.useState("");
  const [passwordError] = useToggle(false);
  const [showPassword] = useToggle(false);

  const [name, setName] = React.useState("");

  const [branch, setBranch] = React.useState<Branch | null>(null);
  const [branchQuery, setBranchQuery] = React.useState("");
  const branchQueryRef = React.useRef(0);
  const [branchOptions, setBranchOptions] = React.useState<
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

  const [role, setRole] = React.useState<UserRole>(UserRole.SISWA);

  const [loading, setLoading] = useBoolean(false);

  const submit = async (formData: FormData) => {
    setLoading(true);

    const payload = Object.fromEntries(formData.entries());
    const { data } = await register(payload);

    if (data) {
      await signIn("credentials", { ...data, callbackUrl: "/" });
      return;
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center">
      <main className="max-w-2xl w-full px-8 sm:px-16 py-10 sm:py-16">
        <h1 className="text-3xl font-semibold text-center select-none">
          Daftar
        </h1>

        <HR />

        <form
          action={submit}
          autoComplete="off"
          className="flex flex-col gap-4"
        >
          {/* Username */}
          <div>
            <Label
              htmlFor="input-username"
              color={usernameValid && usernameAvailable ? "default" : "failure"}
              className="block mb-2"
            >
              Nama Pengguna
            </Label>
            <div className="relative">
              <TextInput
                required
                id="input-username"
                name="username"
                autoComplete="off"
                type="text"
                placeholder="johndoe"
                color={usernameValid && usernameAvailable ? "gray" : "failure"}
                value={username}
                onChange={({ target }) => {
                  setUsername(target.value);
                  setUsernameUserChanged(true);
                  setUsernameChecking(
                    UsernameSchema.safeParse(target.value).success,
                  );
                }}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {usernameChecking ? (
                  <FaSpinner className="animate-spin" />
                ) : !usernameValid || !usernameAvailable ? (
                  <FaXmark className="text-red-600" />
                ) : (
                  username && <FaCheck className="text-green-500" />
                )}
              </div>
            </div>
            {usernameHelperText && (
              <HelperText>{usernameHelperText}</HelperText>
            )}
          </div>

          {/* Password */}
          <div>
            <Label
              htmlFor="input-password"
              color={passwordError ? "failure" : "default"}
              className="block mb-2"
            >
              Kata Sandi
            </Label>
            <TextInput
              required
              id="input-password"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="new-password"
              color={passwordError ? "failure" : "gray"}
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
            {passwordError && (
              <HelperText>Kata sandi minimal 8 karakter</HelperText>
            )}
          </div>

          {/* Full Name */}
          <div>
            <Label htmlFor="input-name" className="block mb-2">
              Nama Lengkap
            </Label>
            <TextInput
              required
              id="input-name"
              name="name"
              autoComplete="off"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={({ target }) => {
                setName(target.value);
                if (!usernameUserChanged) {
                  const username = generateUsername(target.value);
                  setUsername(username);
                  setUsernameChecking(
                    UsernameSchema.safeParse(username).success,
                  );
                }
              }}
            />
          </div>

          {/* Branch */}
          <div>
            <Combobox
              value={branch}
              onChange={setBranch}
              onClose={() => setBranchQuery("")}
            >
              <Label htmlFor="input-branch" className="block mb-2">
                Cabang
              </Label>
              <div className="relative">
                <input
                  hidden
                  name="branch-id"
                  type="hidden"
                  defaultValue={branch?.id}
                />
                <ComboboxInput
                  required
                  id="input-branch"
                  autoComplete="off"
                  placeholder="Salatiga"
                  displayValue={(branch: Branch | null) => branch?.name || ""}
                  onChange={({ target }) => {
                    setBranchQuery(target.value);
                    setBranchOptionsLoading(true);
                  }}
                  className="block w-full border focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 p-2.5 text-sm rounded-lg"
                />

                {branchOptionsLoading && (
                  <FaSpinner className="absolute animate-spin right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                )}

                {branchQuery && (
                  <ComboboxOptions className="absolute z-10 mt-1 w-full rounded-lg bg-white dark:bg-gray-900 text-sm shadow-lg overflow-hidden">
                    <div className="max-h-60 overflow-y-auto overflow-x-hidden">
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
                                    ? "bg-gray-200 dark:bg-gray-800"
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
            </Combobox>
          </div>

          {/* Sub-branch */}
          <div>
            <Label htmlFor="input-sub-branch" className="block mb-2">
              Ranting
            </Label>
            <TextInput
              id="input-sub-branch"
              type="text"
              name="sub-branch"
              autoComplete="off"
              placeholder="Tengaran"
            />
          </div>

          {/* Role */}
          <div>
            <Label className="block mb-2">Status Keanggotaan</Label>
            <input hidden name="role" type="hidden" defaultValue={role} />
            <ButtonGroup className="w-full">
              {[
                { role: UserRole.SISWA, label: "Siswa" },
                { role: UserRole.WARGA, label: "Warga" },
              ].map((item) => (
                <Button
                  key={item.role}
                  size="sm"
                  className="flex-1 focus:ring-0"
                  onClick={() => setRole(item.role)}
                  color={item.role === role ? "default" : "alternative"}
                >
                  {item.label}
                </Button>
              ))}
            </ButtonGroup>
          </div>

          <Button
            type="submit"
            className="mt-3"
            disabled={
              !username ||
              !usernameValid ||
              !usernameAvailable ||
              password.length < 8 ||
              name.length < 3 ||
              loading
            }
          >
            Daftar
          </Button>
        </form>

        <div className="flex items-center gap-4">
          <HR className="flex-1" />
          <span className="text-sm select-none">atau</span>
          <HR className="flex-1" />
        </div>

        {/* <button className="w-full rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 cursor-pointer">
          <GoogleIcon className="inline-block w-5 h-5 mr-2" />
          Sign up with Google
        </button> */}

        <p className="text-sm text-center select-none">
          Sudah punya akun?&nbsp;
          <Link
            href="/login"
            className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            Masuk
          </Link>
        </p>
      </main>
    </div>
  );
}
