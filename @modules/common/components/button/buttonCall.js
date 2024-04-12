import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { useSelector } from "react-redux";

import ButtonWithIcon from "./buttonWithIcon";

import DialogMessage from "../dialog/dialogMessage";
import DialogWrapper from "../dialog/dialogWrapper";

import getProductPhone from "helpers/formatters/product/getProductPhone";
import { useRouter } from "next/router";

export default function ButtonCall({ children, phone, showIcon, ...other }) {
  const router = useRouter();
  const user = useSelector((state) => state.userLogin.value);

  const [openCallModal, setCallModal] = useState(false);

  const showPhoneHandler = () => {
    if(user) {
      setCallModal(true)
    }else {
      router.push('/user/profile/auth')
    }
  }

  return (
    <>
      {/* <a href={`tel:${phone}`}> */}
      <ButtonWithIcon
        onClick={showPhoneHandler}
        icon={showIcon && <Icon />}
        {...other}
      >
        {children ? children : "Показать телефон"}
      </ButtonWithIcon>
      {/* </a> */}

      <Dialog open={openCallModal} onClose={() => setCallModal(false)}>
        <DialogWrapper>
          <Dialog.Panel
            className={`bg-white p-5 ${
              user.user_group?.id !== 6 ? "max-w-[400px]" : "max-w-[600px]"
            } rounded-[10px] relative mx-[16px]`}
          >
            <DialogMessage
              className={" "}
              isShow={openCallModal}
              onClose={() => setCallModal(false)}
              title={
                user.user_group?.id !== 6 ? (
                  <a href={`tel:${phone && phone.replace(/[^0-9]/g, "")}`}>
                    {getProductPhone(phone)}
                  </a>
                ) : (
                  "Ваш аккаунт на модерации"
                )
              }
              subtitle={
                user.user_group?.id !== 6
                  ? "Скажите продавцу, что нашли это объявление на FLATE.PRO."
                  : "После одобрения, вам будут доступны все возможности и функции. Обычно это занимает не более часа."
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
        d="M14.3328 15.2174L16.056 13.4943C16.2866 13.2635 16.5799 13.1056 16.8995 13.04C17.219 12.9743 17.5508 13.0039 17.8537 13.125L19.9523 13.965C20.2616 14.0888 20.5267 14.3024 20.7134 14.5783C20.9002 14.8541 21 15.1796 21 15.5128V19.3291C21.0005 19.5559 20.9548 19.7804 20.8655 19.989C20.7763 20.1975 20.6454 20.3856 20.4809 20.5418C20.3165 20.698 20.1218 20.819 19.909 20.8973C19.6961 20.9757 19.4695 21.0098 19.243 20.9976C4.53324 20.0822 1.56236 7.6233 1.0108 2.85237C0.984088 2.61913 1.00706 2.38288 1.0782 2.15915C1.14934 1.93542 1.26704 1.72929 1.42356 1.55431C1.58008 1.37934 1.77188 1.23948 1.98633 1.14394C2.20077 1.0484 2.43302 0.99935 2.66779 1.00001H6.41638C6.74953 0.999996 7.07503 1.0998 7.35091 1.28655C7.62678 1.4733 7.84038 1.73843 7.96413 2.04773L8.8034 4.14626C8.92451 4.44917 8.95408 4.78097 8.88845 5.10052C8.82281 5.42008 8.66486 5.71336 8.43415 5.94401L6.71101 7.66714C6.71101 7.66714 7.66643 14.3843 14.3328 15.2174Z"
        strokeWidth="1.6"
      />
    </svg>
  );
}
