import API from "pages/api/service/api";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import AuthButton from "@modules/user/components/auth/button/authButton";
import AdminActionsItemParent from "./adminActionsItemParent";
import AdminActionsItem from "./adminActionsItem";

import walletIconWhite from "public/icons/wallet-icon-white.svg";

import settingsIcon from "public/icons/admin-sidebar/settings.svg";
import tasksIcon from "public/icons/admin-sidebar/tasks.svg";
import usersIcon from "public/icons/admin-sidebar/users.svg";
import rcsIcon from "public/icons/admin-sidebar/rcs.svg";
import newsIcon from "public/icons/admin-sidebar/news.svg";
import mainIcon from "public/icons/admin-sidebar/main.svg";
import itemsIcon from "public/icons/admin-sidebar/items.svg";
import exitIcon from "public/icons/admin-sidebar/exit.svg";
import citiesAreasIcon from "public/icons/admin-sidebar/cities-areas.svg";
import bannersIcon from "public/icons/admin-sidebar/banners.svg";

export default function AdminActions() {
  const router = useRouter();

  const user = useSelector((state) => state.userLogin.value);

  const mainPage = "/user/admin";
  const usersPage = "/user/admin/users";
  const usersPageAdd = "/user/admin/users/add";
  const usersPageBanned = "/user/admin/users/banned";
  const usersPageModeration = "/user/admin/users/moderation";
  const usersPageRejected = "/user/admin/users/rejected";

  const moderationPage = "/user/admin/moderation";
  const archivePage = "/user/admin/archive";

  const rcsPage = "/user/admin/rcs";
  const rcsPageRequests = "/user/admin/rcs/requests";
  const rcsPageAdd = "/user/admin/districts/rcs/add";

  const itemsPage = "/user/admin/items";

  const citiesPage = "/user/admin/cities";
  const citiesPageAdd = "/user/admin/cities/add";

  const areasPageAdd = "/user/admin/districts/areas/add";

  const newsPage = "/user/admin/news";
  const newsPageAdd = "/user/admin/news/add";
  const newsPageBannerAdd = "/user/admin/news/add?banner=1";

  const tasksPage = "/user/admin/tasks";
  const reportsPage = "/user/admin/reports";
  const tasksArchivePage = "/user/admin/tasks/archive";

  const bannersPage = "#";
  const bannersPage3 = "/user/admin/banners/3";
  const bannersPage4 = "/user/admin/banners/4";
  const bannersPage5 = "/user/admin/banners/5";

  const settingsPage = "/user/admin/settings";
  const appPage = "/user/admin/app";

  const fetchState = useSelector((state) => state.fetchTrigger.value);

  const [rcsMod, setRcsMod] = useState(false);
  const [pMod, setPmod] = useState(false);
  const [reports, setReports] = useState(null);

  const [moderationUsers, setModerationUsers] = useState(null);
  const [moderationRcs, setModerationRcs] = useState(null);
  const [moderationProducts, setModerationProducts] = useState(null);

  useEffect(() => {
    (async function checkIsSettingsActive() {
      setRcsMod(await API.get.setting("rcs_moderation"));
      setPmod(await API.get.setting("product_moderation"));
    })();
  }, [fetchState]);

  useEffect(() => {
    (async function fetchRcs() {
      if (rcsMod === "Y") {
        setModerationRcs(
          await API.get.rcs({
            window_host: window.location.origin,
            filter: { published: "0" },
            sort: {
              id: "asc",
            },
            limit: "all",
          })
        );
      }
    })();
  }, [rcsMod]);

  useEffect(() => {
    (async function fetchRcs() {
      setModerationProducts(
        await API.get.product.list({
          window_host: window.location.origin,
          filter: {
            published: "0",
          },
          sort: {
            id: "asc",
          },
          limit: "all",
        })
      );
    })();
  }, [pMod]);

  useEffect(() => {
    (async () => {
      const res = await API.get.reports();
      setReports(res);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const moderationUsersRes = await API.get.user({
        window_host: window.location.origin,
        filter: {
          user_group: 6,
          user_name: "!null",
        },
        sort: {
          id: "asc",
        },
        limit: "all",
      });
      if (moderationUsersRes) {
        setModerationUsers(moderationUsersRes);
      }
    })();
  }, []);

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2.5 rounded text-white px-[15px]">
        <span className="text-white opacity-60">Основные</span>
      </div>

      <AdminActionsItemParent
        link={mainPage}
        name={"Главная"}
        isActive={router.asPath === mainPage}
        icon={mainIcon}
        hideArrow={true}
      ></AdminActionsItemParent>

      <div className="relative">
        <AdminActionsItemParent
          icon={usersIcon}
          link={usersPage}
          name={"Пользователи"}
          isActive={
            router.asPath === usersPage ||
            router.asPath === usersPageAdd ||
            router.asPath === usersPageBanned ||
            router.asPath === usersPageModeration ||
            router.asPath === usersPageRejected
          }
        >
          <div className="flex flex-col gap-2.5">
            {user && user.user_group?.id === 5 && (
              <AdminActionsItem
                link={usersPageAdd}
                name={"Добавить"}
                isActive={router.asPath === usersPageAdd}
                isChild={true}
              />
            )}
            <AdminActionsItem
              link={usersPageBanned}
              name={"Заблокированные"}
              isActive={router.asPath === usersPageBanned}
              isChild={true}
            />
            <div className="relative">
              <AdminActionsItem
                link={usersPageModeration}
                name={"На модерации"}
                isActive={router.asPath === usersPageModeration}
                isChild={true}
              />
              {moderationUsers?.length > 0 && (
                <div className="absolute left-[0px] top-[0px] bg-red rounded-full w-3 h-3 text-white text-exs flex justify-center items-center">
                  {moderationUsers.length}
                </div>
              )}
            </div>

            <AdminActionsItem
              link={usersPageRejected}
              name={"Отклоненные"}
              isActive={router.asPath === usersPageRejected}
              isChild={true}
            />
          </div>
        </AdminActionsItemParent>

        {moderationUsers?.length > 0 && (
          <div className="absolute left-[12px] top-[10px] bg-red rounded-full w-3 h-3 text-white text-exs flex justify-center items-center">
            !
          </div>
        )}
      </div>

      <div className="relative">
        <AdminActionsItemParent
          icon={itemsIcon}
          link={itemsPage}
          name={"Объявления"}
          isActive={
            router.asPath === itemsPage || router.asPath === moderationPage
          }
        >
          <div className="flex flex-col gap-2.5">
            {pMod && (
              <div className="relative">
                <AdminActionsItem
                  link={moderationPage}
                  name={"Модерация объявлений"}
                  isActive={
                    router.asPath === moderationPage ||
                    router.asPath === archivePage
                  }
                  isChild={true}
                />

                {moderationProducts?.length > 0 && (
                  <div className="absolute left-[0px] top-[0px] bg-red rounded-full w-3 h-3 text-white text-exs flex justify-center items-center">
                    {moderationProducts.length}
                  </div>
                )}
              </div>
            )}
            <AdminActionsItem
              link={archivePage}
              name={"Архив"}
              isActive={router.asPath === archivePage}
              isChild={true}
            />
          </div>
        </AdminActionsItemParent>
        {moderationProducts?.length > 0 && (
          <div className="absolute left-[12px] top-[10px] bg-red rounded-full w-3 h-3 text-white text-exs flex justify-center items-center">
            !
          </div>
        )}
      </div>

      <div className="relative">
        <AdminActionsItemParent
          icon={rcsIcon}
          link={rcsPage}
          name={"Работа с ЖК"}
          isActive={
            router.asPath === rcsPage ||
            router.asPath === rcsPageAdd ||
            router.asPath === rcsPageRequests
          }
        >
          <div className="flex flex-col gap-2.5">
            <AdminActionsItem
              link={rcsPageAdd}
              name={"Добавить ЖК"}
              isActive={router.asPath === rcsPageAdd}
              isChild={true}
            />
            {rcsMod && (
              <div className="relative">
                <AdminActionsItem
                  link={rcsPageRequests}
                  name={"Заявки"}
                  isActive={router.asPath === rcsPageRequests}
                  isChild={true}
                />
                {moderationRcs?.length > 0 && (
                  <div className="absolute left-[-3px] top-[0px] bg-red rounded-full w-3 h-3 text-white text-exs flex justify-center items-center">
                    {moderationRcs.length}
                  </div>
                )}
              </div>
            )}
          </div>
        </AdminActionsItemParent>
        {moderationRcs?.length > 0 && (
          <div className="absolute left-[12px] top-[10px] bg-red rounded-full w-3 h-3 text-white text-exs flex justify-center items-center">
            !
          </div>
        )}
      </div>

      <AdminActionsItemParent
        icon={citiesAreasIcon}
        link={citiesPage}
        name={"Города и районы"}
        isActive={
          router.asPath === citiesPage ||
          router.asPath === citiesPageAdd ||
          router.asPath === areasPageAdd
        }
      >
        <div className="flex flex-col gap-2.5">
          <AdminActionsItem
            link={citiesPageAdd}
            name={"Добавить город"}
            isActive={router.asPath === citiesPageAdd}
            isChild={true}
          />
          <AdminActionsItem
            link={areasPageAdd}
            name={"Добавить район"}
            isActive={router.asPath === areasPageAdd}
            isChild={true}
          />
        </div>
      </AdminActionsItemParent>

      <AdminActionsItemParent
        icon={newsIcon}
        link={newsPage}
        name={"Новости"}
        isActive={router.asPath === newsPage || router.asPath === newsPageAdd}
      >
        <div className="flex flex-col gap-2.5">
          <AdminActionsItem
            link={newsPageAdd}
            name={"Добавить новость"}
            isActive={router.asPath === newsPageAdd}
            isChild={true}
          />
          <AdminActionsItem
            link={newsPageBannerAdd}
            name={"Добавить баннер"}
            isActive={router.asPath === newsPageBannerAdd}
            isChild={true}
          />
        </div>
      </AdminActionsItemParent>

      <div className="relative">
        <AdminActionsItemParent
          icon={tasksIcon}
          link={tasksPage}
          name={"Обратная связь"}
          isActive={
            router.asPath === tasksPage ||
            router.asPath === reportsPage ||
            router.asPath === tasksArchivePage
          }
        >
          <div className="flex flex-col gap-2.5">
            <div className="relative">
              <AdminActionsItem
                link={reportsPage}
                name={"Жалобы"}
                isActive={router.asPath === reportsPage}
                isChild={true}
              />
              {reports?.length > 0 && (
                <div className="absolute left-[-3px] top-[0px] bg-red rounded-full w-3 h-3 text-white text-exs flex justify-center items-center">
                  {reports.length}
                </div>
              )}
            </div>

            <AdminActionsItem
              link={tasksArchivePage}
              name={"Архив"}
              isActive={router.asPath === tasksArchivePage}
              isChild={true}
            />
          </div>
        </AdminActionsItemParent>

        {reports?.length > 0 && (
          <div className="absolute left-[12px] top-[10px] bg-red rounded-full w-3 h-3 text-white text-exs flex justify-center items-center">
            !
          </div>
        )}
      </div>

      <AdminActionsItemParent
        icon={bannersIcon}
        name={"Баннеры и реклама"}
        link={"#"}
      >
        <div className="flex flex-col gap-2.5">
          <AdminActionsItem
            link={bannersPage3}
            name={"Баннер в теле"}
            isActive={router.asPath === bannersPage3}
            isChild={true}
          />

          <AdminActionsItem
            link={bannersPage4}
            name={"Баннер в шапке"}
            isActive={router.asPath === bannersPage4}
            isChild={true}
          />

          <AdminActionsItem
            link={bannersPage5}
            name={"Баннер при входе"}
            isActive={router.asPath === bannersPage5}
            isChild={true}
          />
        </div>
      </AdminActionsItemParent>

      <AdminActionsItemParent
        link={settingsPage}
        name={"Настройки"}
        isActive={router.asPath === settingsPage}
        icon={settingsIcon}
        hideArrow={true}
      ></AdminActionsItemParent>

      <AdminActionsItemParent
        link={appPage}
        name={"Приложение"}
        isActive={router.asPath === appPage}
        icon={settingsIcon}
        hideArrow={true}
      ></AdminActionsItemParent>

      <div className="flex items-center justify-between gap-2.5 rounded hover:text-white text-white cursor-pointer px-[15px] pt-2.5">
        <AuthButton icon={exitIcon} />
      </div>
    </div>
  );
}
