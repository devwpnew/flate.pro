import { useRouter } from "next/router";
import Image from "next/image";
import LinkWrap from "@modules/common/components/link/linkWrap";
import activeIcon from "public/icons/messages-blue-filled.svg";
import { useEffect, useState } from "react";
import api from "pages/api/service/api";
import { useSelector } from "react-redux";
import Tooltip from "@modules/common/components/tooltip/tooltip";

export default function UserMessagesButton({ icon, width, height, title }) {
  const href = "/user/profile/messages";
  const router = useRouter();
  const user = useSelector((state) => state.userLogin.value);
  const [unreadMessages, setUnreadMessages] = useState(null);
  const [isShowText, setIsShowText] = useState(false);

  useEffect(() => {
    (async function getUnreadMessages() {
      const unreadCount = await api.get.messagesUnread(user.id);
      setUnreadMessages(unreadCount);
    })();
  }, [unreadMessages]);

  const handleClick = (e) => {
    e.preventDefault();
    router.push(href);
  };

  const hoverHandler = (event) => {
    if (event?.type === "mouseleave") {
      setIsShowText(false);
    } else {
      setIsShowText(true);
    }
  };

  return (
    <LinkWrap
      href="/user/profile/messages"
      className="flex items-center justify-center w-5 h-5 relative"
      onMouseOver={hoverHandler}
      onMouseLeave={hoverHandler}
    >
      {router.asPath.split("/").includes("messages") ? (
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
      {unreadMessages > 0 && (
        <div className="absolute right-[-1px] top-[-1px] bg-red rounded-full w-3 h-3 text-white text-exs flex justify-center items-center">
          {unreadMessages}
        </div>
      )}
      <Tooltip
        text={title}
        className="bg-grey absolute left-[-23px] bottom-[-20px] text-exs text-white rounded px-1"
        isShow={isShowText}
      />
    </LinkWrap>
  );
}
