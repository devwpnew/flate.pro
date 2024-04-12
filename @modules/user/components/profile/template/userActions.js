import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import UserItemsButton from "../../items/button/itemsButton";
import UserFavoriteButton from "../../favorites/button/userFavoriteButton";
import UserMessagesButton from "../../messages/button/userMessagesButton";
import UserAuthButton from "../../auth/button/authButton";
import UserSettingsButton from "../../settings/button/settingsButton";
import UserHelpButton from "../../help/button/userHelpButton";
import UserSubscribeButton from "../../subscribe/button/userSubscribeButton";

import helpIcon from "public/icons/user-help-grey-solid.svg";
import itemsIcon from "public/icons/user-items-grey.svg";
import favoriteIcon from "public/icons/heart-grey-solid.svg";
import messagesIcon from "public/icons/messages-grey-solid.svg";
import subscribeIcon from "public/icons/user-subscribe-grey-solid.svg";
import settingsIcon from "public/icons/user-settings-grey-solid.svg";
import settingsActiveIcon from "public/icons/user-settings-blue-solid.svg";

import authIcon from "public/icons/auth-grey.svg";
import rightArrowIcon from "public/icons/arrow-icon-grey-right.svg";

import slideArrowClose from "public/icons/slide-arrow-left.svg";
import RightSlideWrapper from "@modules/common/components/rightSlide/rightSlideWrapper";
import SettingsContent from "../../settings/template/settingsContent";

import getLayout from "helpers/getLayout";
export default function UserActions({ isAdmin }) {
  const [isOpen, setIsOpen] = useState(false);
  const { MOBILE } = getLayout();

  return (
    <div className="flex flex-col gap-2.5">
      <Link href="/user/profile/items">
        <a className="flex items-center justify-between gap-2.5 p-1 rounded hover:text-blue text-grey hover:bg-greylight">
          <div className="flex items-center gap-2.5">
            <UserItemsButton icon={itemsIcon} />
            <span className="text-sm cursor-pointer">Мои объявления</span>
          </div>

          {MOBILE && (
            <Image
              src={rightArrowIcon.src}
              width={rightArrowIcon.width}
              height={rightArrowIcon.height}
            />
          )}
        </a>
      </Link>

      <Link href="/user/profile/favorites">
        <a className="flex items-center justify-between gap-2.5 p-1 rounded hover:text-blue text-grey hover:bg-greylight">
          <div className="flex items-center gap-2.5">
            <UserFavoriteButton icon={favoriteIcon} />
            <span className="text-sm cursor-pointer">Избранное</span>
          </div>
          {MOBILE && (
            <Image
              src={rightArrowIcon.src}
              width={rightArrowIcon.width}
              height={rightArrowIcon.height}
            />
          )}
        </a>
      </Link>

      <Link href="/user/profile/messages">
        <a className="flex items-center justify-between gap-2.5 p-1 rounded hover:text-blue text-grey hover:bg-greylight">
          <div className="flex items-center gap-2.5">
            <UserMessagesButton icon={messagesIcon} />
            <span className="text-sm cursor-pointer">Сообщения</span>
          </div>
          {MOBILE && (
            <Image
              src={rightArrowIcon.src}
              width={rightArrowIcon.width}
              height={rightArrowIcon.height}
            />
          )}
        </a>
      </Link>

      <div className="flex items-center justify-between gap-2.5 p-1 rounded hover:text-blue text-grey hover:bg-greylight">
        <div className="flex items-center gap-2.5">
          <UserHelpButton icon={helpIcon} />
          <Link href="/help">
            <a className="text-sm cursor-pointer">Помощь</a>
          </Link>
        </div>
        {MOBILE && (
          <Image
            src={rightArrowIcon.src}
            width={rightArrowIcon.width}
            height={rightArrowIcon.height}
          />
        )}
      </div>

      <Link href="/user/profile/selections">
        <div className="flex items-center justify-between gap-2.5 p-1 rounded hover:text-blue text-grey hover:bg-greylight">
          <div className="flex items-center gap-2.5">
            <svg
              className="fill-greyA0 group-hover:fill-blue"
              width="19"
              height="19"
              viewBox="0 0 19 19"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_3737_5189)">
                <path d="M14.2841 6.40341H11.5329C11.1285 6.40432 10.7699 6.14367 10.6459 5.75884L9.79563 3.14197C9.75358 3.01445 9.63456 2.92822 9.50021 2.92822C9.36586 2.92822 9.24684 3.01445 9.20479 3.14197L8.35452 5.75853C8.23049 6.14382 7.87161 6.40448 7.46689 6.40341H4.71568C4.58087 6.40326 4.46125 6.48994 4.4195 6.61822C4.3779 6.7465 4.4236 6.88707 4.5329 6.96617L6.75871 8.58277C7.08631 8.81989 7.22324 9.24131 7.09755 9.62554L6.24757 12.2421C6.20567 12.3702 6.25106 12.5108 6.36006 12.59C6.46906 12.6694 6.61662 12.6696 6.72577 12.5904L8.95143 10.9737C9.27827 10.7353 9.72155 10.7353 10.0484 10.9737L12.274 12.5904C12.383 12.6694 12.5306 12.6693 12.6396 12.59C12.7484 12.5108 12.794 12.3705 12.7522 12.2424L11.9023 9.62599C11.7766 9.24177 11.9137 8.82035 12.2411 8.58353L14.4669 6.96677C14.5767 6.88783 14.623 6.74695 14.5812 6.61837C14.5395 6.48979 14.4192 6.40281 14.2841 6.40341Z" />
                <path d="M19 2.54443C18.9985 1.23335 17.9361 0.170925 16.625 0.169434H2.375C1.06391 0.170925 0.001491 1.23335 0 2.54443V13.4016C0.001491 14.7127 1.06391 15.7751 2.375 15.7766H3.73214C3.8448 15.7766 3.95 15.8324 4.01311 15.9255C4.07623 16.0188 4.08916 16.1372 4.04741 16.2418L3.01216 18.8301L9.35405 15.8105C9.39961 15.7885 9.44947 15.7769 9.5 15.7766H16.625C17.9361 15.7751 18.9985 14.7127 19 13.4016V2.54443ZM15.3194 7.43923L12.8905 9.20358C12.7714 9.28989 12.7216 9.44313 12.767 9.58296L13.6949 12.4387C13.8362 12.858 13.6859 13.3204 13.3251 13.5767C12.9699 13.8408 12.4837 13.8408 12.1285 13.5767L9.69946 11.8123C9.58052 11.7259 9.41949 11.7259 9.30054 11.8123L6.87153 13.5767C6.51485 13.836 6.0316 13.836 5.67492 13.5769C5.31807 13.3176 5.16881 12.8582 5.30515 12.4387L6.23305 9.58329C6.27861 9.4433 6.22874 9.28989 6.10946 9.20358L3.68062 7.43923C3.32377 7.18012 3.17451 6.72056 3.31085 6.30126C3.4472 5.88179 3.838 5.59784 4.27901 5.598H7.28139C7.42834 5.598 7.55855 5.50357 7.60411 5.36392L8.53168 2.50815C8.66769 2.08835 9.05866 1.8039 9.5 1.8039C9.94134 1.8039 10.3323 2.08835 10.4683 2.50815L11.3959 5.36392C11.4415 5.50357 11.5717 5.598 11.7186 5.598H14.721C15.162 5.59784 15.5528 5.88179 15.6891 6.30126C15.8255 6.72056 15.6762 7.18012 15.3194 7.43923Z" />
              </g>
              <defs>
                <clipPath id="clip0_3737_5189">
                  <rect width="19" height="19" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <a className="text-sm cursor-pointer">Подборки</a>
          </div>
          {MOBILE && (
            <Image
              src={rightArrowIcon.src}
              width={rightArrowIcon.width}
              height={rightArrowIcon.height}
            />
          )}
        </div>
      </Link>

      {/* <Link href="/user/profile/subscribe">
        <a className="flex items-center justify-between gap-2.5 p-1 rounded hover:text-blue text-grey hover:bg-greylight">
          <div className="flex items-center gap-2.5">
            <UserSubscribeButton icon={subscribeIcon} />
            <span className="text-sm cursor-pointer">Платные услуги</span>
          </div>
          {MOBILE && (
            <Image
              src={rightArrowIcon.src}
              width={rightArrowIcon.width}
              height={rightArrowIcon.height}
            />
          )}
        </a>
      </Link> */}

      <Link href="/user/profile/settings">
        <a className="flex items-center justify-between gap-2.5 p-1 rounded hover:text-blue text-grey hover:bg-greylight cursor-pointer">
          <div className="flex items-center gap-2.5">
            <UserSettingsButton
              icon={settingsIcon}
              activeIcon={settingsActiveIcon}
              onClick={() => setIsOpen((isOpen) => !isOpen)}
            />
            <span className="text-sm cursor-pointer">Настройки</span>
          </div>
          {MOBILE && (
            <Image
              src={rightArrowIcon.src}
              width={rightArrowIcon.width}
              height={rightArrowIcon.height}
            />
          )}
        </a>
      </Link>

      <RightSlideWrapper state={isOpen}>
        <SettingsContent>
          <button onClick={() => setIsOpen((isOpen) => !isOpen)}>
            <Image
              src={slideArrowClose.src}
              width={slideArrowClose.width}
              height={slideArrowClose.height}
            />
          </button>
        </SettingsContent>
      </RightSlideWrapper>

      <div className="flex items-center gap-2.5 py-4 border-y border-greyborder">
        <UserAuthButton icon={authIcon} />
      </div>
    </div>
  );
}
