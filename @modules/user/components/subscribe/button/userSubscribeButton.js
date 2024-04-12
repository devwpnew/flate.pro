import { useRouter } from "next/router";
import Image from "next/image";
import LinkWrap from "@modules/common/components/link/linkWrap";
import activeIcon from "public/icons/user-subscribe-grey-solid.svg";

export default function UserSubscribeButton({ icon, width, height }) {
  const href = "/help";
  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault();
    router.push(href);
  };
  return (
    <LinkWrap
      href="/user/profile/subscribe"
      className="flex subscribe-center justify-center w-5 h-5"
    >
      {router.asPath.split("/").includes("help") ? (
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
      )}
    </LinkWrap>
  );
}
