import api from "pages/api/service/api";

import { BsDoorOpen } from "react-icons/bs";

import { useSelector } from "react-redux";
import { useState } from "react";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/router";

import Image from "next/image";

import LinkWrap from "@modules/common/components/link/linkWrap";

import { Dialog } from "@headlessui/react";
import DialogMessage from "@modules/common/components/dialog/dialogMessage";
import DialogWrapper from "@modules/common/components/dialog/dialogWrapper";

export default function AuthButton({ icon, width, height }) {
  const router = useRouter();
  const user = useSelector((state) => state.userLogin.value);

  const [isShowDialog, setIsShowDialog] = useState(false);

  const exitAccount = async () => {
    const exit = await api.auth.exitAccount(window.location.origin);
    if(exit === true) {
      window.location.reload();
    }
  };

  return (
    <>
      {user ? (
        <button
          onClick={() => setIsShowDialog(true)}
          className="flex items-center justify-between gap-2.5 cursor-pointer opacity-50"
        >
          {/* <Image
            src={icon.src}
            width={width ? width : icon.width}
            height={height ? height : icon.height}
          /> */}
          <BsDoorOpen className="ml-[5px]" />
          
          <div className={`text-sm ${router.pathname.includes('admin') ? 'text-white' : "text-primary"}`}>Выйти</div>
        </button>
      ) : (
        <LinkWrap
          href={"/user/profile/auth"}
          className={`flex items-center justify-center rounded-[10px] h-10 w-[80px] bg-[#1479F5] hover:bg-blue active:bg-bluefocus transition-all`}
        >
          <span className={`text-sm ${router.pathname.includes('admin') ? 'text-white' : "text-white"}`}>Вход</span>
        </LinkWrap>
      )}

      <Dialog open={isShowDialog} onClose={() => setIsShowDialog(false)}>
        <DialogWrapper>
          <Dialog.Panel className="bg-white p-5 max-w-[400px] rounded-[10px] mx-[16px]">
            <DialogMessage
              isShow={isShowDialog}
              onClose={() => setIsShowDialog(false)}
              onCloseText={"Нет"}
              onAccept={exitAccount}
              onAcceptText={"Да"}
              title={"Внимание!"}
              subtitle={"Вы дейтвительно хотите выйти?"}
              isOffTimeout={true}
            />
          </Dialog.Panel>
        </DialogWrapper>
      </Dialog>
    </>
  );
}
