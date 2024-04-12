import Image from "next/image";
import Link from "next/link";

import walletIconWhite from "public/icons/wallet-icon-white.svg";

export default function AdminActionsItem({
  link,
  name,
  icon,
  isActive,
  isChild,
}) {
  return (
    <Link href={link}>
      <div
        className={`flex items-center justify-between gap-2.5 rounded hover:text-white text-white cursor-pointer ${
          !isChild ? "px-[15px] pt-2.5" : ""
        }`}
      >
        <div className="flex items-center gap-2.5 w-full hover:underline underline-offset-4 px-3">
          {icon && (
            <Image src={icon.src} width={icon.width} height={icon.height} />
          )}
          <span
            className={`flex flex-row items-center justify-between w-full text-sm whitespace-nowrap ${
              isActive ? "underline" : ""
            }`}
          >
            {name}
          </span>
        </div>
      </div>
    </Link>
  );
}
