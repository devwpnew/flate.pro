import DropdownMenu from "./dropdownMenu";

import UserFavoriteButton from "@modules/user/components/favorites/button/userFavoriteButton";
import UserMessagesButton from "@modules/user/components/messages/button/userMessagesButton";
import UserNotificationsButton from "@modules/user/components/notifications/button/userNotificationsButton";

import favoriteIcon from "public/icons/heart-blue-light.svg";
import messagesIcon from "public/icons/messages-blue-light.svg";
import notificationIcon from "public/icons/notification-blue-light.svg";


export default function Entered() {
  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-4">
        <UserFavoriteButton icon={favoriteIcon} width={22} height={20} title="Избранное"/>
        <UserMessagesButton icon={messagesIcon} width={20} height={20} title="Сообщения"/>
        <UserNotificationsButton icon={notificationIcon} width={20} height={20} title="Уведомления"/>
      </div>
      <div className="relative">
        <DropdownMenu />
      </div>
    </div>
  );
}
