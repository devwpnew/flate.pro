import API from "pages/api/service/api";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import Input from "@modules/common/components/input/input";
import Preloader from "@modules/common/components/preloader/preloader";
import GalleryOutput from "@modules/common/components/input/part/galleryOutput";
import InputFile from "@modules/common/components/input/inputFile";
import Message from "./part/message";
import BackButton from "@modules/common/components/button/backButton";
import { Dialog } from "@headlessui/react";
import DialogWrapper from "@modules/common/components/dialog/dialogWrapper";
import DialogMessage from "@modules/common/components/dialog/dialogMessage";
import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";
import { formateDate } from "helpers/formateDate";

export default function MessagesChat({ dialogue }) {
  const router = useRouter();

  const [message, setMessage] = useState(false);

  const [oppositeUser, setOppositeUser] = useState(null);
  const [currentDialogue, setCurrentDialogue] = useState(null);
  const [currentDialogueMessages, setCurrentDialogueMessages] = useState(null);

  const [previewImages, setPreviewImages] = useState(null);

  const [helpRequests, setHelpRequests] = useState(null);

  const changePreviewImages = (event) => {
    const files = event.target.files;
    const filesResult = [];
    for (let i in files) {
      const file = files[i];
      if (typeof file == "object") {
        filesResult.push(file);
      }
    }
    setPreviewImages(filesResult);
  };

  const requestReInit = async (request) => {
    const response = await API.set.taskStatus(request.id, 1);
    if (response && response.data.itemId) {
      setMessagesUpdate(true);
    } else {
      console.log("error", response);
    }
  };

  const [messagesUpdate, setMessagesUpdate] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = useSelector((state) => state.userLogin.value);

  const scrollBlock = useRef(null);

  const sendMessage = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    if (!formData.get("text").trim()) {
      setMessage(true);
      return;
    }

    if (dialogue == "help") {
      // Если помощь то работаем с тасками
      const lastRequest = helpRequests[helpRequests.length - 1];
      if (lastRequest && lastRequest.status != 5) {
        // Если не закрыт последний таск то пушим сообщения туда
        formData.append("task", lastRequest.id);
      } else {
        // Если нет последнего таска или он закрыт создаём новый таск
        const newTask = await API.add.task({
          user_id: currentUser.id,
          status: 1,
        }); // 1 - красный
        formData.append("task", newTask.itemId);
      }
      await API.add.taskMessage(formData);
    } else {
      // Иначе обычное сообщение пользователю отправляем
      await API.add.message(formData);
    }

    event.target.reset();
    setPreviewImages(null);
    setMessagesUpdate(true);
  };

  useEffect(() => {
    if (messagesUpdate == true) {
      (async function fetchUser() {
        setIsLoading(true);
        if (dialogue == "help") {
          const getHelpRequests = await API.get.tasks(
            {filter: { user_id: currentUser.id } },
            true
          );
          setHelpRequests(getHelpRequests);
        } else {
          const getDialogue = await API.get.dialogue({
            filter: { id: router.query.id },
            limit: 1,
          });
          setCurrentDialogue(getDialogue);
          await API.set.messagesRead({
            filter: {
              dialogue: getDialogue.id,
              read_by_opposite: "false",
              from_user: `!=${currentUser.id}`,
            },
          });
          setCurrentDialogueMessages(
            await API.get.messages({
              filter: { dialogue: getDialogue.id },
              sort: { date_created: "asc" },
            })
          );
          setOppositeUser(
            await API.get.user({
              window_host: window.location.origin,
              filter: {
                id:
                  getDialogue.from_user.id == currentUser.id
                    ? getDialogue.to_user.id
                    : getDialogue.from_user.id,
              },
              sort: {
                id: "asc",
              },
              limit: 1,
            })
          );
        }
        setMessagesUpdate(false);
        if (scrollBlock.current) {
          scrollBlock.current.scrollTop = scrollBlock.current?.scrollHeight;
        }

        setTimeout(() => {
          scrollBlock.current.scrollTop = scrollBlock.current?.scrollHeight;
        }, 500);
        setIsLoading(false);
      })();
    }
  }, [router.query.id, currentUser, messagesUpdate]);

  const getUserName = (user) => {
    let name = "";

    if (user?.user_name) {
      name += user?.user_name;
    } else if (user?.user_last_name) {
      name += user?.user_last_name;
    }

    return name;
  };

  return (
    <>
      <div className="bg-greylight h-[70vh] w-full rounded-l rounded-r flex flex-col justify-between">
        <div className="mx-[20px] border-b-greyborder border-b py-[10px] relative cursor-pointer">
          <div className="absolute top-[15px] left-[0] z-10">
            <BackButton href={"/user/profile/messages"} />
          </div>

          <div
            className="relative px-[20px]"
            onClick={() => router.push("/user/profile/messages")}
          >
            <span className="text-sm font-bold inline-flex flex-row gap-2 relative items-center">
              {dialogue == "help" ? (
                <>Чат с поддержкой Flate.pro</>
              ) : (
                <>Чат с {getUserName(oppositeUser)}</>
              )}

              <span className="absolute bottom-[-11px] left-[0] h-[1px] w-full bg-blue"></span>
            </span>
          </div>

          <CloseIcon
            onClick={() => router.back()}
            className="absolute top-[15px] right-[0] cursor-pointer"
          />
        </div>

        <div
          className="flex-1 flex-col justify-end grow-[1] py-[20px] px-[30px] overflow-y-auto"
          ref={scrollBlock}
        >
          {isLoading ? (
            <div className="flex justify-center h-full">
              <PreloaderSpinner />
            </div>
          ) : (
            <div className="flex flex-col flex-reverse">
              <>
                {helpRequests &&
                  helpRequests.map((request, index) => {
                    return (
                      <>
                        <div
                          key={request.id}
                          className="flex mb-[10px] justify-center"
                        >
                          Обращение от{" "}
                          {request.date_created &&
                            formateDate(request.date_created)}
                        </div>
                        {request.messages &&
                          request.messages.map((msg) => {
                            return (
                              <div
                                key={msg.id}
                                className={`flex mb-[10px] ${
                                  msg.user_id.id == currentUser.id
                                    ? "justify-end"
                                    : "justify-start"
                                }`}
                              >
                                <div className={`w-[50%] relative`}>
                                  <div className="text-grey mb-[4px]">
                                    {msg.user_id.id == currentUser.id
                                      ? "Вы"
                                      : msg.user_id.user_name}
                                  </div>
                                  <div
                                    className={`py-[10px] px-[15px] border-color-greyborder bg-white border-greyborder border-[1px]`}
                                  >
                                    {msg.text}
                                    <div className="flex gap-[10px] w-[100%] flex-wrap	">
                                      {msg.include_files &&
                                        msg.include_files.map((src) => {
                                          return (
                                            <img
                                              className="max-w-[128px] max-h-[128px] h-[100%] w-[100%]"
                                              src={`https://flate.pro/${src}`}
                                            />
                                          );
                                        })}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        {request.status == 5 && (
                          <>
                            <div className="flex mb-[10px] justify-center">
                              Обращение от{" "}
                              {new Date(
                                request.date_created
                              ).toLocaleDateString(process.env.Timezone)}{" "}
                              отмечено как завершённое
                            </div>
                            {helpRequests.length == index + 1 && (
                              <div className="flex mb-[10px] text-blue hover-underline text-bold justify-center">
                                <button
                                  className="text-sm text-white px-5 py-2 h-full rounded md:text-black font-normal hover:border-bluelight transition-colors bg-blue hover:bg-bluelight"
                                  onClick={() => requestReInit(request)}
                                >
                                  Вопрос не решён
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </>
                    );
                  })}

                {currentDialogueMessages &&
                  currentDialogueMessages.length > 0 &&
                  currentDialogueMessages.map((message, index) => {
                    return (
                      <Message
                        key={message.id}
                        message={message}
                        currentUser={currentUser}
                      />
                    );
                  })}
              </>
            </div>
          )}
        </div>
        <form
          onSubmit={sendMessage}
          className="px-[10px] pb-[20px] relative cursor-pointer"
        >
          <Input
            placeholder="Сообщение"
            name="text"
            style={"h-[37px] w-full"}
          />

          {dialogue == "help" ? (
            <>
              <input
                type="hidden"
                name="user_id"
                value={currentUser && currentUser.id}
              />
            </>
          ) : (
            <>
              <input
                type="hidden"
                name="from_user"
                value={currentUser && currentUser.id}
              />
              <input
                type="hidden"
                name="to_user"
                value={oppositeUser && oppositeUser.id}
              />
              <input
                type="hidden"
                name="dialogue"
                value={currentDialogue && currentDialogue.id}
              />
              <input
                type="hidden"
                name="product"
                value={
                  currentDialogue &&
                  currentDialogue.product &&
                  currentDialogue.product.id
                }
              />
            </>
          )}
          <label htmlFor="include_files">
            <div className="absolute right-[60px] top-[11px] cursor-pointer">
              <FileIncludeIcon />
            </div>
            <input
              type="file"
              className="hidden"
              multiple={true}
              accept="image/*"
              onChange={changePreviewImages}
              id="include_files"
              name="include_files"
            />
          </label>

          <button className="absolute right-[20px] top-[11px] cursor-pointer">
            <SendIcon />
          </button>
        </form>

        {previewImages && previewImages.length > 0 && (
          <GalleryOutput
            gallery={previewImages}
            setGallery={setPreviewImages}
            isNotSortable={true}
          />
        )}
      </div>
      <Dialog open={message} onClose={() => setMessage(false)}>
        <DialogWrapper>
          <Dialog.Panel className="bg-white p-5 max-w-[400px] rounded-[10px] mx-[16px]">
            <DialogMessage
              title="Ошибка"
              subtitle={"Пожалуйста введите ваше сообщение"}
              isShow={message}
              onClose={() => setMessage(false)}
            />
          </Dialog.Panel>
        </DialogWrapper>
      </Dialog>
    </>
  );
}

export function FileIncludeIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.2946 4.60397C16.2968 3.60241 15.8987 2.6415 15.1888 1.93492L14.3594 1.10543C12.8855 -0.368453 10.4959 -0.368486 9.02202 1.10539L9.02199 1.10543L2.23176 7.89565C2.09108 8.03155 2.08716 8.25574 2.22306 8.39646C2.35897 8.53715 2.58316 8.54106 2.72387 8.40516C2.72683 8.40231 2.72972 8.39942 2.73257 8.39646L9.52207 1.60624C10.7195 0.409244 12.6604 0.409245 13.8578 1.60624L14.688 2.43643C15.885 3.63386 15.885 5.57478 14.688 6.7722L5.816 15.6442C4.95247 16.5073 3.5529 16.5073 2.68938 15.6442L2.06674 15.0216C1.23293 14.1461 1.23293 12.7704 2.06674 11.895L10.0228 3.9388C10.5523 3.4093 11.4107 3.40923 11.9402 3.93867C11.9402 3.9387 11.9403 3.93877 11.9403 3.9388L12.3554 4.35388C12.8602 4.89337 12.8602 5.73186 12.3554 6.27136L6.48111 12.1457C6.34042 12.2816 6.3365 12.5058 6.47241 12.6465C6.60831 12.7872 6.8325 12.791 6.97322 12.6552C6.97617 12.6523 6.97906 12.6494 6.98192 12.6465L12.8563 6.7722C13.6253 5.95114 13.6253 4.67416 12.8563 3.8531L12.4412 3.43802C11.6351 2.63193 10.3282 2.63193 9.52207 3.43802L1.56593 11.3942C0.425945 12.5341 0.425945 14.3824 1.5659 15.5224C1.5659 15.5224 1.5659 15.5224 1.56593 15.5224L2.18856 16.145C3.32855 17.285 5.1768 17.285 6.31678 16.1451C6.31678 16.1451 6.31678 16.1451 6.31682 16.145L15.1888 7.27302C15.8987 6.56644 16.2968 5.60553 16.2946 4.60397Z"
        fill="#1F1F1F"
      />
    </svg>
  );
}

export function SendIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.6479 7.94819L0.862529 0.662651C0.611178 0.548511 0.311256 0.616509 0.136404 0.832647C-0.0396635 1.04878 -0.0457348 1.35599 0.121832 1.5782L5.31278 8.49946L0.121832 15.4207C-0.0457348 15.6429 -0.0396635 15.9513 0.135189 16.1663C0.252972 16.3132 0.429039 16.3921 0.607535 16.3921C0.693747 16.3921 0.779959 16.3739 0.861314 16.3363L16.6466 9.05073C16.8628 8.95116 17 8.73624 17 8.49946C17 8.26268 16.8628 8.04776 16.6479 7.94819Z"
        fill="#2563EB"
      />
    </svg>
  );
}

export function CloseIcon({ className, onClick }) {
  return (
    <svg
      className={className}
      onClick={onClick}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.6337 0.365637C11.1461 -0.121879 10.3556 -0.121879 9.86894 0.365637L5.99973 4.23535L2.13052 0.365637C1.64301 -0.121879 0.85332 -0.121879 0.365804 0.365637C-0.121712 0.853153 -0.121712 1.64284 0.365804 2.13035L4.23501 5.9999L0.365637 9.8696C-0.121879 10.3571 -0.121879 11.1468 0.365637 11.6343C0.609311 11.878 0.928695 12 1.24808 12C1.56746 12 1.88718 11.8782 2.13052 11.6343L5.99973 7.76478L9.86894 11.6343C10.1126 11.878 10.432 12 10.7514 12C11.0708 12 11.39 11.8782 11.6338 11.6343C12.1213 11.1468 12.1213 10.3571 11.6338 9.8696L7.76444 6.00006L11.6337 2.13052C12.1212 1.643 12.1212 0.853153 11.6337 0.365637Z"
        fill="#ABABAB"
      />
    </svg>
  );
}
