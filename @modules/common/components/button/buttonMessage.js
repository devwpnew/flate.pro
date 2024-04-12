import api from "pages/api/service/api";

import { useEffect, useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import Image from "next/image";
import Button from "./button";

import UserName from "@modules/user/components/profile/common/userName";
import UserAvatar from "@modules/user/components/profile/common/userAvatar";

import ButtonWithIcon from "./buttonWithIcon";
import TextareaRequired from "../textarea/textareaRequired";

import DialogWrapper from "../dialog/dialogWrapper";
import DialogMessage from "../dialog/dialogMessage";
import DialogCloseIcon from "../dialog/dialogCloseIcon";

import getProductImageSrc from "helpers/formatters/product/getProductImageSrc";
import getProductPrice from "helpers/formatters/product/getProductPrice";
import DialogTitle from "../dialog/dialogTitle";
import getProductPhone from "helpers/formatters/product/getProductPhone";
import getProductUrl from "helpers/formatters/product/getProductUrl";

export default function ButtonMessage({
  children,
  buttonClassName,
  showIcon,
  product,
  ...other
}) {
  const router = useRouter();
  const [openUserModerationModal, setOpenUserModerationModal] = useState(false);

  const user = useSelector((state) => state.userLogin.value);

  const [message, setMessage] = useState("");

  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const sendMessage = async () => {
    const testRes = await api.add.message({
      from_user: user,
      to_user: product.user_id,
      product: product.id,
      text: message,
    });

    if (testRes.itemId) {
      setIsSuccess(true);
    } else {
      setError(testRes.error);
    }
  };

  function openWaInBlank(e) {
    e.preventDefault();

    if (user) {
      if (user.user_group?.id === 6) {
        setOpenUserModerationModal(true);
      } else {
        // const text = `?text=Здравствуйте, нужна дополнительная информация по вашему объявлению:\n\n https://flate.pro/${getProductUrl(
        //   product
        // )}\n\n`;

        // const msg = encodeURIComponent(text).replace(/%20/g, "+");

        // const href =
        //   `https://wa.me/` +
        //   getProductPhone(product).replace(/[^0-9]/g, "") +
        //   msg;

        // console.log(href);

        const productHref = `https://flate.pro/${getProductUrl(product)}`;

        const phone = getProductPhone(product).replace(/[^0-9]/g, "");
        const message = `Здравствуйте, нужна дополнительная информация по вашему объявлению:\n\n${productHref}\n\n`;
        const encodedMessage = encodeURIComponent(message).replace(/%20/g, "+");
        const link = `https://wa.me/${phone}/?text=${encodedMessage}`;

        window.open(link, "_blank");
      }
    } else {
      router.push("/user/profile/auth");
    }
  }

  return (
    <>
      <ButtonWithIcon
        onClick={openWaInBlank}
        // onClick={() => setIsOpen(!isOpen)}
        icon={showIcon && <Icon />}
        {...other}
      >
        {children ? children : "Написать в WhatsApp"}
      </ButtonWithIcon>

      <Dialog
        open={openUserModerationModal}
        onClose={() => setOpenUserModerationModal(false)}
      >
        <DialogWrapper>
          <Dialog.Panel
            className={`bg-white p-5 max-w-[550px] rounded-[10px] relative mx-[16px]`}
          >
            <DialogMessage
              className={" "}
              isShow={openUserModerationModal}
              onClose={() => setOpenUserModerationModal(false)}
              title={"Ваш аккаунт на модерации"}
              subtitle={
                "После одобрения, вам будут доступны все возможности и функции. Обычно это занимает не более часа."
              }
              isOffTimeout={true}
            />
          </Dialog.Panel>
        </DialogWrapper>
      </Dialog>
    </>
  );
}

export function Icon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 10.4445C21.0038 11.911 20.6612 13.3577 20 14.6667C19.216 16.2353 18.0108 17.5546 16.5194 18.477C15.0279 19.3993 13.3091 19.8882 11.5555 19.8889C10.089 19.8927 8.64234 19.5501 7.33332 18.8889L1 21L3.11111 14.6667C2.44992 13.3577 2.10729 11.911 2.11111 10.4445C2.11179 8.69086 2.60068 6.97208 3.52302 5.48064C4.44536 3.98919 5.76472 2.78399 7.33332 2.00003C8.64234 1.33884 10.089 0.996208 11.5555 1.00003H12.1111C14.427 1.1278 16.6145 2.10532 18.2546 3.74543C19.8947 5.38553 20.8722 7.57297 21 9.88891V10.4445Z"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
