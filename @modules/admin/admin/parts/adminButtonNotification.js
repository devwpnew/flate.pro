import api from "pages/api/service/api";

import { useRef, useState } from "react";
import { Dialog } from "@headlessui/react";

import Button from "@modules/common/components/button/button";
import Input from "@modules/common/components/input/input";

import randomInteger from "helpers/randomInteger";

export default function AdminButtonNotification(
  buttonClassName,
  showIcon,
  productName,
  productPrice,
  productPreview,
  productId,
  owner
) {
  let [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const textarea = useRef();
  const title = useRef();
  
  const sendMessage = async () => {
    // console.log(title.current.value);
    // console.log(textarea.current.value);
    setIsSuccess(true)
  };



  return (
    <>
      <Button className={"w-[256px] h-11"} onClick={() => setIsOpen(!isOpen)}>
        Отправить уведомление всем
      </Button>

      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        textarea={textarea}
        sendMessage={sendMessage}
        isSuccess={isSuccess}
        title={title}
      />
    </>
  );
}

export function Success({isOpen,setIsOpen}) {
  return (
    <Dialog.Panel
      className={
        "mx-[16px] md:mx-auto bg-white p-5 rounded-[10px] relative max-w-[660px] w-full"
      }
    >
      <Dialog.Title
        className={"text-3xl font-extrabold text-center mb-5 block"}
      >
        Сообщение отправлено
      </Dialog.Title>

      <button
        onClick={() => setIsOpen(!isOpen)}
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
  );
}

export function Modal({
  isOpen,
  setIsOpen,
  textarea,
  sendMessage,
  isSuccess,
  title,
}) {
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <div className="fixed inset-0 bg-backdrop z-50">
        <div className="h-screen flex justify-center items-center">
          {isSuccess ? (
            <Success isOpen={isOpen} setIsOpen={setIsOpen} />
          ) : (
            <Dialog.Panel
              className={
                "mx-[16px] md:mx-auto bg-white p-5 rounded-[10px] relative max-w-[660px] w-full"
              }
            >
              <Dialog.Title
                className={"text-3xl font-extrabold text-center mb-5 block"}
              >
                Написать сообщение
              </Dialog.Title>

              <Form
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                textarea={textarea}
                sendMessage={sendMessage}
                title={title}
              />
            </Dialog.Panel>
          )}
        </div>
      </div>
    </Dialog>
  );
}

export function Form({ isOpen, setIsOpen, sendMessage, textarea, title }) {
  return (
    <>
      <div className="flex flex-col">
        <div
          className={`flex px-2.5 border-greyborder group-hover:border-blue border rounded bg-white relative w-full overflow-hidden bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 hover:shadow-lg transition-all h-full mb-2.5`}
        >
          <Input
            style="w-full border-none py-2 pr-1 pl-1 text-md leading-5 text-gray-900 focus:ring-0 outline-none bg-white"
            placeholder={"Заголовок"}
            inputStyle={"bg-white"}
            useRef={title}
          />
        </div>

        <div
          className={`flex px-2.5 border-greyborder group-hover:border-blue border rounded bg-white relative w-full overflow-hidden bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 hover:shadow-lg transition-all h-full mb-2.5`}
        >
          <textarea
            className="w-full border-none py-2 pl-3 pr-10 text-md leading-5 text-gray-900 focus:ring-0 outline-none bg-white"
            placeholder="Ваше сообщение..."
            ref={textarea}
          />
        </div>

        <div className="h-9 self-end w-full max-w-[136px]">
          <Button onClick={sendMessage}>Отправить</Button>
        </div>
      </div>

      <CloseButton isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}

export function CloseButton({ isOpen, setIsOpen }) {
  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
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
  );
}
