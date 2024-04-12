import { useState, useEffect } from "react";

import { Dialog } from "@headlessui/react";

import Button from "@modules/common/components/button/button";

export default function WelcomeModal({ isShow }) {
  const [showModal, setShowModal] = useState(isShow);


  useEffect(() => {
    if(showModal === true) {
      setTimeout(() => {
        setShowModal(false)
      }, 2000)
    }
  }, [showModal])


  return (
    <Dialog
      open={showModal}
      onClose={() => setShowModal(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" />
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ background: "rgba(0, 0, 0, 0.5)" }}
      >
        <Dialog.Panel
          className={
            "bg-white p-5 rounded-[10px] relative max-w-[460px] w-full"
          }
        >
          <Dialog.Title
            className={"text-3xl font-extrabold text-center mb-5 block"}
          >
            Добро пожаловать в сообщество!
          </Dialog.Title>

          <div className="text-center text-md">
            <p>
              Большая и актуальная база недвижимости вашего города, у вас в
              кармане.
            </p>
          </div>

          <div
            className="flex justify-center h-10 mt-5"
            onClick={() => setShowModal(false)}
          >
            <Button className="w-1/3">Продолжить</Button>
          </div>

          <button
            onClick={() => setShowModal(false)}
            className="absolute top-5 right-5"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.6337 0.365637C11.1461 -0.121879 10.3556 -0.121879 9.86894 0.365637L5.99946 4.23535L2.13052 0.365637C1.64301 -0.121879 0.85332 -0.121879 0.365804 0.365637C-0.121712 0.853153 -0.121712 1.64284 0.365804 2.13035L4.23501 5.9999L0.365637 9.8696C-0.121879 10.3571 -0.121879 11.1468 0.365637 11.6343C0.609311 11.878 0.928695 12 1.24808 12C1.56746 12 1.88718 11.8782 2.13052 11.6343L5.99946 7.76478L9.86894 11.6343C10.1126 11.878 10.432 12 10.7514 12C11.0708 12 11.39 11.8782 11.6338 11.6343C12.1213 11.1468 12.1213 10.3571 11.6338 9.8696L7.76444 6.00006L11.6337 2.13052C12.1212 1.643 12.1212 0.853153 11.6337 0.365637Z"
                fill="#ABABAB"
              />
            </svg>
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
