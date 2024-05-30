import { useRouter } from "next/router";
import Image from "next/image";
import LinkWrap from "@modules/common/components/link/linkWrap";
import activeIcon from "public/icons/user-help-blue-filled.svg";


import { BsHeadset } from "react-icons/bs";

export default function UserHelpButton({ icon, width, height }) {
  const href = "/help";
  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault();
    router.push(href);
  };
  return (
    <LinkWrap
      href="/help"
      className="flex items-center justify-center w-5 h-5"
    >
      {/* {router.asPath.split("/").includes("help") ? (
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
        <BsHeadset className="text-blue" />
      ) : (
        <BsHeadset />
      )}

    </LinkWrap>
  );
}