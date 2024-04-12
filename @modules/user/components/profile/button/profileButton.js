import { useRouter } from "next/router";
import Image from "next/image";
import LinkWrap from "@modules/common/components/link/linkWrap";

export default function ProfileButton({ icon, activeIcon, width, height }) {
  const href = "/user/profile";
  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <LinkWrap
      href={href}
      className="flex items-center justify-center min-w-5 min-h-5"
      onClick={handleClick}
    >
      <div className="flex flex-col items-center h-[53px] w-[50px] justify-between pt-2">
        {router.asPath.split("/").includes("profile") ? (
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
        <span className="text-exs text-greymiddle">Профиль</span>
      </div>
    </LinkWrap>
  );
}
