"use client";

import { Button, Label, Modal, ModalBody, TextInput } from "flowbite-react";
import _ from "lodash";
import type { User } from "next-auth";
import { useState } from "react";

interface FormProps {
  user: User;
}

export default function Form(props: FormProps) {
  const [user, setUser] = useState(props.user);
  const changed = !_.isEqual(user, props.user);

  const updateUser = (update: Partial<User>) =>
    setUser((data) => ({ ...data, ...update }));

  const updatePerson = (update: Partial<User["person"]>) =>
    // @ts-expect-error: Ignore person.name undefined
    setUser((data) => ({
      ...data,
      person: { ...data.person, ...update },
    }));

  return (
    <>
      <form className="flex flex-col flex-1 gap-2 md:gap-4">
        <div>
          <div>
            <Label htmlFor="name">Nama Lengkap</Label>
          </div>
          <TextInput
            id="name"
            className="mt-2"
            value={user.person?.name || ""}
            onChange={({ target }) => updatePerson({ name: target.value })}
          />
        </div>
        <div>
          <div>
            <Label htmlFor="username">Nama Pengguna</Label>
          </div>
          <TextInput
            id="username"
            className="mt-2"
            value={user.username || ""}
            onChange={({ target }) => updateUser({ username: target.value })}
          />
        </div>
        <div>
          <div>
            <Label htmlFor="name">Email</Label>
          </div>
          <TextInput
            id="email"
            className="mt-2"
            value={user.email || ""}
            onChange={({ target }) => updateUser({ email: target.name })}
          />
        </div>
        <div>
          <div>
            <Label htmlFor="name">Nomor Telepon</Label>
          </div>
          <TextInput
            id="phone"
            className="mt-2"
            value={user.phone || ""}
            onChange={({ target }) => updateUser({ phone: target.value })}
          />
        </div>
        <div className="flex flex-col">
          <div>
            <Label htmlFor="name">Kata Sandi</Label>
          </div>
          <TextInput
            disabled
            readOnly
            id="phone"
            type="password"
            className="mt-2"
            defaultValue="********"
          />
          <button
            type="button"
            className="self-end mt-1 focus:outline-0 text-primary-700 hover:underline focus:underline cursor-pointer"
          >
            Ubah kata sandi
          </button>
        </div>
        <Button type="submit" disabled={!changed}>
          Simpan
        </Button>
      </form>
      <Modal popup size="md">
        <ModalBody>
          <div className="flex flex-col gap-4">
            <h3 className="mt-6 font-medium text-xl">Ubah kata sandi</h3>
            <TextInput
              type="text"
              name="old-password"
              placeholder="Kata sandi lama"
            />
            <TextInput
              type="text"
              name="new-password"
              placeholder="Kata sandi baru"
            />
            <TextInput
              type="text"
              name="password-confirm"
              placeholder="Ulangi kata sandi"
            />
            <div className="flex self-end gap-2">
              <Button outline color="red">
                Batal
              </Button>
              <Button>Simpan</Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}
