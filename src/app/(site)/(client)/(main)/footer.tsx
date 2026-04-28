"use client";

import {
  Footer as FlowbiteFooter,
  FooterCopyright,
  FooterIcon,
} from "flowbite-react";
import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <FlowbiteFooter container className="rounded-none p-2 md:p-4">
      <div className="w-full flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <FooterCopyright
          href="#"
          year={2026}
          by="PSHT Cabang Salatiga. All rights reserved."
          className="text-center"
        />
        <div className="flex space-x-6 justify-center">
          <FooterIcon
            target="_blank"
            icon={FaWhatsapp}
            href="https://whatsapp.com/channel/0029VbCHXBwJUM2dyEg5rw2J"
          />
          <FooterIcon
            target="_blank"
            icon={FaFacebook}
            href="https://facebook.com/pshtcabangsalatiga"
          />
          <FooterIcon
            target="_blank"
            icon={FaInstagram}
            href="https://instagram.com/pshtcabangsalatiga"
          />
          <FooterIcon
            target="_blank"
            icon={FaTiktok}
            href="https://tiktok.com/@pshtcabangsalatiga"
          />
          <FooterIcon
            target="_blank"
            icon={FaYoutube}
            href="https://youtube.com/@pshtcabangsalatiga"
          />
        </div>
      </div>
    </FlowbiteFooter>
  );
}
