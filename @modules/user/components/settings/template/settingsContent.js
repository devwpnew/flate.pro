import api from "pages/api/service/api";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

import Image from "next/image";

import cameraIcon from "public/icons/camera-icon-2.svg";

import Container from "@modules/common/components/container/container";
import UserAvatar from "../../profile/common/userAvatar";
import UserName from "../../profile/common/userName";

import SettingsOptions from "./settingsOptions";
import BackButton from "@modules/common/components/button/backButton";
import SettingsForm from "../part/settingsForm";

import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";

import getLayout from "helpers/getLayout";
import { useDispatch } from "react-redux";
import { setLogedIn } from "store/global/user/userLogin";
import MobilePageHeader from "@modules/layout/components/common/mobilePageHeader";
import MotionContainer from "@modules/common/components/container/motionContainer";

export default function SettingsContent({ user }) {
  const dispatch = useDispatch();

  const { MOBILE, DESKTOP, VARIANTS } = getLayout();
  const [isLoadingUserAvatar, setIsLoadingUserAvatar] = useState(false);

  const formRef = useRef();
  const fileInputRef = useRef();

  const changeUserAvatar = async (e) => {
    setIsLoadingUserAvatar(true);
    const formData = new FormData();
    formData.append("user_avatar", e.target.files[0]);
    formData.append("id", user.id);
    formData.append("window_host", window.location.origin);
    const test = await api.set.userAvatar(formData);

    if (test.itemId) {
      const updatedUser = await api.get.user({
        window_host: window.location.origin,
        filter: {
          id: test.itemId,
        },
        sort: {
          id: "asc",
        },
        limit: "all",
      });

      dispatch(setLogedIn(updatedUser[0]));

      setIsLoadingUserAvatar(false);

      return;
    }
    console.log("ERROR : Avatar not changed");
    setIsLoadingUserAvatar(false);
  };

  const loadPhotoHandler = (ev) => {
    ev.preventDefault();
    fileInputRef.current.click();
  };

  return (
    <MotionContainer>
      <div className="md:p-4 md:bg-greylight md:rounded md:shadow w-full mb-10">
        {!MOBILE ? (
          <div className="flex items-center gap-2.5 pb-3 mb-5 border-b border-greyborder">
            <div className="w-[70px] h-[70px] text-3xl group">
              {isLoadingUserAvatar ? (
                <PreloaderSpinner />
              ) : (
                <div className="relative h-full w-full">
                  <div
                    onClick={(ev) => loadPhotoHandler(ev)}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 group-hover:opacity-60 opacity-0 cursor-pointer w-10 h-10 transition-all"
                  >
                    <Image src={cameraIcon.src} width={40} height={40} />
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple={false}
                    name="user_avatar"
                    accept="image/*"
                    className="hidden"
                    onChange={changeUserAvatar}
                  />

                  <UserAvatar
                    userOwner={user}
                    name={user.user_name}
                    onClick={(ev) => loadPhotoHandler(ev)}
                  />

                  {/* <div className="bg-red"><Image src={cameraIcon.src} width={cameraIcon.width} height={cameraIcon.height} /></div> */}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="block text-xl font-semibold">
                <UserName name={user.user_name} />
              </div>
              <div className="block text-xl font-semibold">
                <UserName lastName={user.user_last_name} />
              </div>
            </div>
          </div>
        ) : (
          <MobilePageHeader href={"/user/profile"} title="Настройки" />
        )}
        <SettingsForm user={user} formRef={formRef} />
      </div>
      {/* <div className="md:p-4 md:bg-greylight md:rounded md:shadow w-full">
        <SettingsOptions />
      </div> */}
    </MotionContainer>
  );
}
