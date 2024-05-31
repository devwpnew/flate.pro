import { useRouter } from "next/router";
import Image from "next/image";
import LinkWrap from "@modules/common/components/link/linkWrap";
import { BsFillPersonFill } from "react-icons/bs";



export default function ProfileButton({ icon, activeIcon, width, height, className }) {
  const href = "/user/profile";
  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <LinkWrap
      href={href}
      onClick={handleClick}
    >
      <div>
        {router.asPath.split("/").includes("profile") ? (
          <BsFillPersonFill className={className} />
        ) : (
          <BsFillPersonFill className={className} />
        )}

        <p className="text-[.7rem]">Профиль</p>
      </div>
    </LinkWrap>
  );
}
