import { useState } from "react";
import { useRouter } from "next/router";

import Image from "next/image";
import Link from "next/link";

export default function AdminActionsItemParent({
  icon,
  link,
  name,
  children,
  isActive,
  hideArrow,
}) {
  const [isOpen, setIsOpen] = useState(isActive);
  const [openUserMenu, setOpenMenu] = useState(isActive);

  const clickHandler = () => {
    setOpenMenu(!openUserMenu);
    setIsOpen(!isOpen);
  };
  return (
    <div
      className={`px-[15px] pt-2.5 ${isOpen && "pb-2.5 bg-bluelight"}`}
      style={{
        background: isOpen && "#0F4DD5",
        boxShadow: isOpen && "inset 0px 3px 4px rgba(0, 0, 0, 0.25)",
      }}
    >
      <div
        className={`flex items-center justify-between gap-2.5 rounded hover:text-white text-white cursor-pointer ${
          isOpen && "pb-5"
        }`}
      >
        <div
          className="flex items-center gap-2.5 w-full"
          onClick={() => link === "#" && clickHandler()}
        >
          <Link href={link === "#" ? "#" : link}>
            <Image src={icon.src} width={icon.width} height={icon.height} />
          </Link>
          <div className="flex justify-between items-center gap-2.5 w-full">
            <Link href={link === "#" ? "#" : link}>
              <span
                className={`text-sm hover:underline underline-offset-4 ${
                  isActive ? "underline" : ""
                }`}
              >
                {name}
              </span>
            </Link>
            {!hideArrow && (
              <ArrowBottom onClick={() => clickHandler()} isOpen={isOpen} />
            )}
          </div>
        </div>
      </div>

      <div className={`${isOpen ? "block pl-2.5" : "hidden"}`}>{children}</div>
    </div>
  );
}

export function ArrowBottom({ onClick, isOpen }) {
  return (
    <svg
      style={{ rotate: isOpen ? "180deg" : "0deg" }}
      onClick={onClick}
      width="14"
      height="9"
      viewBox="0 0 14 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 7L7.53033 7.53033L7 8.06066L6.46967 7.53033L7 7ZM13.5303 1.53033L7.53033 7.53033L6.46967 6.46967L12.4697 0.46967L13.5303 1.53033ZM6.46967 7.53033L0.46967 1.53033L1.53033 0.46967L7.53033 6.46967L6.46967 7.53033Z"
        fill="#F8FAFC"
      />
    </svg>
  );
}
