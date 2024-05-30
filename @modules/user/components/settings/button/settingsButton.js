import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/router";
import LinkWrap from "@modules/common/components/link/linkWrap";

import { BsGear } from "react-icons/bs";

import getLayout from "helpers/getLayout";

export default function UserSettingsButton({
  icon,
  activeIcon,
  width,
  height,
  onClick,
}) {
  const { MOBILE } = getLayout();
  const router = useRouter();
  const href = "/user/profile/settings";

  return (
    <LinkWrap
      href={href}
      className="flex settings-center justify-center w-5 h-5"
    >
      {/* {router.asPath.split("/").includes("settings") ? (
        <Image
          src={activeIcon.src}
          width={width ? width : activeIcon.width}
          height={height ? height : activeIcon.height}
        />
      ) : (
        <Image
          src={icon.src}
          width={width ? width : icon.width}
          height={height ? height : icon.height}
        />
      )} */}

      {router.asPath.split("/").includes("help") ? (
        <BsGear className="text-blue" />
      ) : (
        <BsGear />
      )}
    </LinkWrap>
  );
}
