import API from "pages/api/service/api";
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { useSelector } from "react-redux";

import Link from "next/link";
import Button from "@modules/common/components/button/button";
import DialogMessage from "@modules/common/components/dialog/dialogMessage";
import DialogWrapper from "@modules/common/components/dialog/dialogWrapper";

import { setFetchState } from "store/global/helpers/fetchTrigger";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

export default function AdminTools({
  className,
  editLink,
  editLinkId,
  publishedStatus,
}) {
  const router = useRouter();

  const dispatch = useDispatch();
  const fetchState = useSelector((state) => state.fetchTrigger.value);
  const user = useSelector((state) => state.userLogin.value);

  const isAdmin = user.user_group?.id === 1 || user.user_group?.id === 5;

  const [isLoading, setLoading] = useState(false);

  const [isOpenBan, setIsOpenBan] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenToArchive, setIsOpenToArchive] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);

  const toItemsPage = () => {
    if (!isAdmin) {
      router.push("/user/profile/items");
    } else {
      if (router.route === "/posts/[section_slug]/[product_slug]") {
        router.push("/");
      }
    }
  };

  const deleteProductCallback = async () => {
    setLoading(true);

    if (editLinkId) {
      const res = await API.remove.product(editLinkId);
      // console.log(res);
    }

    setLoading(false);

    dispatch(setFetchState(!fetchState));
    toItemsPage();
  };

  const sendToArchiveCallback = async () => {
    setLoading(true);

    if (editLinkId) {
      if(publishedStatus === 2) {
        const toArchiveReq = await API.set.publishProduct(editLinkId)
      } else {
        const res = await API.update.productsByFilter(
          { id: editLinkId },
          {
            published: 2,
            window_host: window.location.origin,
          }
        );
      }
      // console.log(res);
    }

    setLoading(false);
    setIsOpenToArchive(false);

    dispatch(setFetchState(!fetchState));
    toItemsPage();
  };

  return (
    <>
      <div
        className={`absolute top-[-10px] right-[8px] z-10 bg-greylight shadow-sm p-2 rounded-md py-2.5 px-[18px] w-auto border-greyC4 border ${
          className ? className : ""
        }`}
      >
        <div className="flex flex-col items-start">
          {editLink && (
            <Link href={`items/${editLinkId}`}>
              <a className="inline-block text-blue hover:text-bluedeep text-sm cursor-pointer whitespace-nowrap group mb-[15px]">
                <span className="relative">Редактировать</span>
              </a>
            </Link>
          )}

          {user &&
            user.user_group &&
            (user.user_group?.id === 1 || user.user_group?.id === 5) && (
              <span
                className="inline-block text-blue hover:text-bluedeep text-sm cursor-pointer whitespace-nowrap group mb-[15px]"
                onClick={() => setIsOpenBan(!isOpenBan)}
              >
                <span className="relative">Забанить</span>
              </span>
            )}

          <span
            className="inline-block text-blue hover:text-bluedeep text-sm cursor-pointer whitespace-nowrap group mb-[15px]"
            onClick={() => setIsOpenDelete(!isOpenDelete)}
          >
            <span className="relative">Удалить</span>
          </span>

          {publishedStatus !== 2 ? (
            <span
              className="inline-block text-blue hover:text-bluedeep text-sm cursor-pointer whitespace-nowrap group mb-[15px]"
              onClick={() => setIsOpenToArchive(!isOpenToArchive)}
            >
              <span className="relative">Снять с публикации</span>
            </span>
          ) : (
            <span
              className="inline-block text-blue hover:text-bluedeep text-sm cursor-pointer whitespace-nowrap group mb-[15px]"
              onClick={() => {
                setIsOpenToArchive(!isOpenToArchive);
              }}
            >
              <span className="relative">Опубликовать</span>
            </span>
          )}

          {user &&
            user.user_group &&
            (user.user_group?.id === 1 || user.user_group?.id === 5) && (
              <span
                className="inline-block text-blue hover:text-bluedeep text-sm cursor-pointer whitespace-nowrap group"
                onClick={() => setIsOpenEdit(!isOpenEdit)}
              >
                <span className="relative">Отправить на редактирование</span>
              </span>
            )}
        </div>
      </div>

      <Dialog open={isOpenBan} onClose={() => setIsOpenBan(false)}>
        <div className="fixed inset-0 bg-backdrop z-50">
          <div className="h-screen flex justify-center items-center">
            <Dialog.Panel
              className={
                "bg-white p-5 rounded-[10px] relative max-w-[435px] w-full"
              }
            >
              <Dialog.Title
                className={"text-3xl font-extrabold text-center mb-5 block"}
              >
                Бан объявления
              </Dialog.Title>

              <div className="flex flex-col">
                <div className="flex flex-row">
                  <div className="relative max-w-[50px] w-full h-[50px] md:max-w-[46px] md:h-[46px] mr-2.5 mb-5">
                    <div className="block max-w-full w-full h-full rounded-full overflow-hidden"></div>
                    <div className="w-[24px] h-[24px] absolute bottom-0 right-0"></div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold"></span>
                    <span className="font-medium text-sm"></span>
                  </div>
                </div>

                <textarea
                  className="font-xs border rounded border-grey mb-5 p-[10px] h-[140px]"
                  placeholder="Опишите причину бана..."
                />

                <div className="h-9 self-end w-full max-w-[136px]">
                  <Button onClick={() => setIsOpenBan(!isOpenBan)}>
                    Отправить
                  </Button>
                </div>
              </div>

              <button
                onClick={() => setIsOpenBan(!isOpenBan)}
                className="absolute top-5 right-5"
              >
                <CloseIcon />
              </button>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>

      <Dialog open={isOpenDelete} onClose={() => setIsOpenDelete(false)}>
        <DialogWrapper>
          <Dialog.Panel className="bg-white p-5 max-w-[400px] w-full rounded-[10px]">
            {isLoading ? (
              <DialogMessage
                isShow={isOpenDelete}
                onClose={() => setIsOpenDelete(false)}
                title={"Удаление"}
                subtitle={"Еще 1 секунда..."}
              />
            ) : (
              <DialogMessage
                isShow={isOpenDelete}
                onClose={() => setIsOpenDelete(false)}
                title={"Вы уверены?"}
                subtitle={"Это действие будет нельзя отменить"}
                onCloseText={"Оставить"}
                onAccept={deleteProductCallback}
                onAcceptText={"Удалить"}
                isOffTimeout={true}
              />
            )}
          </Dialog.Panel>
        </DialogWrapper>
      </Dialog>

      <Dialog open={isOpenToArchive} onClose={() => setIsOpenToArchive(false)}>
        <DialogWrapper>
          <Dialog.Panel className="bg-white p-5 max-w-[500px] w-full rounded-[10px]">
            {isLoading ? (
              <DialogMessage
                isShow={isOpenToArchive}
                onClose={() => setIsOpenToArchive(false)}
                title={"Загрузка"}
                subtitle={"Еще 1 секунда..."}
                isOffTimeout={false}
              />
            ) : (
              <DialogMessage
                isShow={isOpenToArchive}
                onClose={() => setIsOpenToArchive(false)}
                title={"Вы уверены?"}
                subtitle={
                  publishedStatus === 2
                    ? "Опубликовать объявление?"
                    : "Вы сможете найти это объявление во вкладке “Архив”"
                }
                onCloseText={publishedStatus === 2 ? "Нет" : "Оставить"}
                onAccept={() => sendToArchiveCallback()}
                onAcceptText={
                  publishedStatus === 2 ? "Да" : "Снять с публикации"
                }
                isOffTimeout={true}
              />
            )}
          </Dialog.Panel>
        </DialogWrapper>
      </Dialog>

      <Dialog open={isOpenEdit} onClose={() => setIsOpenEdit(false)}>
        <div className="fixed inset-0 bg-backdrop z-50">
          <div className="h-screen flex justify-center items-center">
            <Dialog.Panel
              className={
                "bg-white p-5 rounded-[10px] relative max-w-[570px] w-full"
              }
            >
              {isLoading ? (
                <DialogMessage
                  isShow={isOpenEdit}
                  onClose={() => setIsOpenToArchive(false)}
                  title={"Загрузка"}
                  subtitle={"Еще 1 секунда..."}
                  isOffTimeout={false}
                />
              ) : (
                <>
                  <Dialog.Title
                    className={"text-3xl font-extrabold text-center mb-5 block"}
                  >
                    Отправить на редактирование
                  </Dialog.Title>
                  <div className="flex flex-col">
                    <div className="flex flex-row">
                      <div className="relative max-w-[50px] w-full h-[50px] md:max-w-[46px] md:h-[46px] mr-2.5 mb-5">
                        <div className="block max-w-full w-full h-full rounded-full overflow-hidden"></div>
                        <div className="w-[24px] h-[24px] absolute bottom-0 right-0"></div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold"></span>
                        <span className="font-medium text-sm"></span>
                      </div>
                    </div>

                    <textarea
                      className="font-xs border rounded border-grey mb-5 p-[10px] h-[140px]"
                      placeholder="Опишите что нужно отредактировать..."
                    />

                    <div className="h-9 self-end w-full max-w-[136px]">
                      <Button onClick={() => sendToArchiveCallback()}>
                        Отправить
                      </Button>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpenEdit(!isOpenEdit)}
                    className="absolute top-5 right-5"
                  >
                    <CloseIcon />
                  </button>
                </>
              )}
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export function CloseIcon() {
  return (
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
  );
}
