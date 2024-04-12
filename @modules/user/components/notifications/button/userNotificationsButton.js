import api from "pages/api/service/api";

import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

import LinkWrap from "@modules/common/components/link/linkWrap";
import Image from "next/image";
import Tooltip from "@modules/common/components/tooltip/tooltip";

export default function UserNotificationsButton({
  icon,
  width,
  height,
  title,
}) {
  const href = "/user/profile/messages?notifications=1";
  const router = useRouter();
  const user = useSelector((state) => state.userLogin.value);

  const [isShowText, setIsShowText] = useState(false);

  const [unreadNotifications, setUnreadNotifications] = useState(null);

  useEffect(() => {
    (async () => {
      if(user) {
        const response = await api.get.notificationsUnreadCount(user);
        setUnreadNotifications(response?.count);
      }
    })();
  }, [user]);

  const hoverHandler = (event) => {
    if (event?.type === "mouseleave") {
      setIsShowText(false);
    } else {
      setIsShowText(true);
    }
  };

  return (
    <LinkWrap
      onMouseOver={hoverHandler}
      onMouseLeave={hoverHandler}
      href={href}
      className="flex items-center justify-center w-5 h-5 relative"
    >
      <Image
        src={icon.src}
        width={width ? width : icon.width}
        height={height ? height : icon.height}
      />
      {unreadNotifications > 0 && (
        <div className="absolute right-[-1px] top-[-1px] bg-red rounded-full w-2 h-2 text-white text-exs flex justify-center items-center"></div>
      )}
      <Tooltip
        text={title}
        className="bg-grey absolute left-[-23px] bottom-[-20px] text-exs text-white rounded px-1"
        isShow={isShowText}
      />
    </LinkWrap>
  );
}
