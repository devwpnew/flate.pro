import API from "pages/api/service/api";
import { useState, useEffect, useRef } from "react";
import SettingsForm from "@modules/user/components/settings/part/settingsForm";
import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";
import UserAvatar from "@modules/user/components/profile/common/userAvatar";
import H1 from "@modules/common/components/heading/h1";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import ButtonMessage from "@modules/common/components/button/buttonMessage";
import { Dialog } from "@headlessui/react";
import DialogWrapper from "@modules/common/components/dialog/dialogWrapper";
import DialogMessage from "@modules/common/components/dialog/dialogMessage";
import Button from "@modules/common/components/button/button";
import { formateDate } from "helpers/formateDate";

export default function UserEditTemplate({ userId }) {
  const router = useRouter();
  const userCurrent = useSelector((state) => state.userLogin.value);
  const [user, setUser] = useState(null);
  const [userProductsAmout, setUserProductsAmout] = useState(null);
  const [changingRole, setChangingRole] = useState(false);
  const [userGroupList, setUserGroupList] = useState(null);

  const [reloadUser, setReloadUser] = useState(true);

  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenBan, setIsOpenBan] = useState(false);

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isBanLoading, setIsBanLoading] = useState(false);

  const selectRoleRef = useRef();

  const currentUser = useSelector((state) => state.userLogin.value);

  useEffect(() => {
    (async function fetchUserGroups() {
      const getUGroups = await API.get.userGroups();
      let list = getUGroups;

      if (userCurrent.user_group.id !== 5) {
        list = list.filter((item) => item.id == 3);
      }

      setUserGroupList(list);
    })();
  }, []);

  useEffect(() => {
    (async function fetchUsers() {
      if (reloadUser == true) {
        setUser(
          await API.get.user({
            window_host: window.location.origin,
            filter: {
              id: userId,
            },
            sort: {
              id: "asc",
            },
            limit: 1,
          })
        );
      }
      setReloadUser(false);
    })();
  }, [reloadUser]);

  useEffect(() => {
    (async function fetchUsers() {
      setUserProductsAmout(
        await API.get.product.count({
          user_id: userId,
        })
      );
    })();
  }, []);

  const saveUserRole = async () => {
    const newGroup = selectRoleRef.current.value;
    const request = await API.set.userGroup(user.id, newGroup);
    await API.add.pushMessageByUser("Ваш аккаунт одобрен.", `Поздравляем! Теперь вам доступен весь функционал FLATE — вашего бизнес-ассистента.`, user.id);
    
    if (request && !request.Error) {
      setReloadUser(true);
      setChangingRole(false);
    } else {
      // console.log("request", request);
    }
  };

  const removeUser = async () => {
    setIsDeleteLoading(true);
    await API.remove.user({ id: userId });
    setIsDeleteLoading(false);
    router.back();
  };

  const banUser = async () => {
    setIsBanLoading(true);
    const ban = await API.set.banUser({ id: userId }, false, "Бан по причине");
    if (ban.Error) {
      // console.log("er", ban);
    } else {
    }
    setIsBanLoading(false);
  };

  return (
    <div>
      {user ? (
        <>
          <div className="pt-3 pb-2.5 lg:border-b-[1px] lg:border-greyborder mb-2.5">
            <H1>Редактировать пользователя</H1>
          </div>
          <div className="flex flex-row justify-between md:p-4 md:bg-greylight md:rounded md:shadow w-full mb-10">
            <div className="min-w-[250px] w-1/3 flex flex-col items-start border-r border-greyborder">
              <div className="flex flex-row items-center gap-2.5 border-b border-greyborder w-full pb-5 mb-5">
                <div className="w-[70px] h-[70px] text-[30px]">
                  <UserAvatar userOwner={user} />
                </div>
                <div className="flex flex-col gap-[3px]">
                  <span className="text-xs">{user.user_name}</span>
                  <span className="text-xs">ID {user.id}</span>
                </div>
              </div>
              <div className="flex flex-col gap-5 mb-[35px]">
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">Роль</span>
                  {currentUser && currentUser.user_group && (
                    <>
                      {changingRole ? (
                        <>
                          <select
                            ref={selectRoleRef}
                            className="py-2 bg-white px-2.5 border-greylight hover:border-blue border rounded focus:outline-none"
                          >
                            {userGroupList &&
                              userGroupList.map((group) => {
                                return (
                                  <option
                                    selected={group.id == user.user_group?.id}
                                    key={group.id}
                                    value={group.id}
                                  >
                                    {group.name}
                                  </option>
                                );
                              })}
                          </select>
                          <div className="flex gap-x-2">
                            <span
                              onClick={saveUserRole}
                              className="text-blue text-sm cursor-pointer underline hover:no-underline"
                            >
                              Сохранить
                            </span>
                            <span
                              onClick={(e) => setChangingRole(false)}
                              className="text-grey text-sm cursor-pointer underline hover:no-underline"
                            >
                              Отменить
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="text-grey text-sm">
                            {user.user_group && user.user_group.name}
                          </span>
                          {currentUser.user_group?.id === 5 && (
                            <span
                              onClick={(e) => setChangingRole(true)}
                              className="text-grey text-sm cursor-pointer underline hover:no-underline"
                            >
                              Сменить роль
                            </span>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="font-semibold text-sm">
                    Дата регистрации
                  </span>
                  <span className="text-grey text-sm">
                    {formateDate(user.date_registered)}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="font-semibold text-sm">
                    Последняя активность
                  </span>
                  <span className="text-grey text-sm">
                    {user.last_login_date
                      ? formateDate(user.last_login_date)
                      : "отсутствует"}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="font-semibold text-sm">
                    Количество объявлений
                  </span>
                  <span className="text-grey text-sm">
                    {userProductsAmout && userProductsAmout.count > 0 ? (
                      <>
                        <Link href={`/user/admin/items?user=${user.id}`}>
                          <a>{userProductsAmout.count}</a>
                        </Link>
                      </>
                    ) : (
                      0
                    )}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <Button
                  type={"red"}
                  className="px-2 py-2"
                  onClick={() => setIsOpenDelete(true)}
                >
                  Удалить аккаунт
                </Button>

                <Button
                  type={"red"}
                  className="px-2 py-2"
                  onClick={() => setIsOpenBan(true)}
                >
                  Заблокировать аккаунт
                </Button>

                {/* {user?.id !== currentUser?.id && (
                  <>
                    <span className="font-semibold text-sm cursor-pointer hover:underline">
                      Написать сообщение
                    </span>

                    <Link href={`/user/profile/messages/${user.id}`}>
                      <span className="font-semibold text-sm cursor-pointer hover:underline">
                        Открыть чат с пользователем
                      </span>
                    </Link>
                  </>
                )} */}
                {/* <span className="font-semibold text-sm cursor-pointer hover:underline">
                  Продлить срок пользования
                </span> */}
              </div>
            </div>
            <div className="w-full">
              <SettingsForm
                user={user}
                isAdmin={true}
                containerClassName={"lg:grid grid-cols-2"}
                blockClassName={"lg:max-w-full w-full"}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center h-full">
          <PreloaderSpinner />
        </div>
      )}

      <Dialog open={isOpenBan} onClose={() => setIsOpenBan(false)}>
        <DialogWrapper>
          <Dialog.Panel className="bg-white p-5 max-w-[400px] w-full rounded-[10px]">
            {isBanLoading ? (
              <DialogMessage
                isShow={isOpenBan}
                onClose={() => setIsOpenBan(false)}
                title={"Загрузка"}
                subtitle={"Еще 1 секунда..."}
              />
            ) : (
              <DialogMessage
                isShow={isOpenBan}
                onClose={() => setIsOpenBan(false)}
                title={"Вы уверены?"}
                subtitle={"Пользователь больше не сможет войти в свой аккаунт"}
                onCloseText={"Оставить"}
                onAccept={() => banUser()}
                onAcceptText={"Заблокировать"}
                isOffTimeout={true}
              />
            )}
          </Dialog.Panel>
        </DialogWrapper>
      </Dialog>
      <Dialog open={isOpenDelete} onClose={() => setIsOpenDelete(false)}>
        <DialogWrapper>
          <Dialog.Panel className="bg-white p-5 max-w-[400px] w-full rounded-[10px]">
            {isDeleteLoading ? (
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
                onAccept={() => removeUser()}
                onAcceptText={"Удалить"}
                isOffTimeout={true}
              />
            )}
          </Dialog.Panel>
        </DialogWrapper>
      </Dialog>
    </div>
  );
}
