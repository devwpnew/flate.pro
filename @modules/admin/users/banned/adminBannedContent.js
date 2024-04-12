import { useEffect, useState } from "react";
import API from "pages/api/service/api";

import H1 from "@modules/common/components/heading/h1";
import MotionContainer from "@modules/common/components/container/motionContainer";

import getLayout from "helpers/getLayout";
import Link from "next/link";
import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";
import TablePreloader from "@modules/common/components/preloader/tablePreloader";

import Table from "@modules/common/components/admin/table/table";
import UserProductsAmount from "@modules/common/components/user/info/UserProductsAmount";
import { formateDate } from "helpers/formateDate";

export default function AdminBannedContent({ user, moderation, rejected }) {
  const [data, setData] = useState(null);

  const [isUsersListLoading, setIsUsersListLoading] = useState(true);
  const [usersList, setUsersList] = useState(null);
  const [sort, setSort] = useState({ date_registered: "desc" });

  let title = "Заблокированные пользователи";

  if (moderation) {
    title = "Пользователи на модерации";
  }

  if (rejected) {
    title = "Отклоненные пользователи";
  }

  useEffect(() => {
    (async function fetchUsers() {
      setIsUsersListLoading(true);

      const queryFields = {
        window_host: window.location.origin,
        sort: {
          ...sort,
        },
        limit: "all",
      };

      if (moderation) {
        queryFields["filter"] = {
          user_group: 6,
          user_name: "!null"
        };
      } else if (rejected) {
        queryFields["filter"] = {
          user_group: 7,
          user_name: "!null"
        };
      } else {
        queryFields["filter"] = {
          date_banned_to: "!null",
          user_name: "!null"
        };
      }

      const getUsers = await API.get.user(queryFields);
      console.log(getUsers);
      if (getUsers) {
        setUsersList(getUsers);
      }
      setIsUsersListLoading(false);
    })();
  }, [sort]);

  useEffect(() => {
    (async function fetchUsersProducts() {
      setIsUsersListLoading(true);

      if (usersList) {
        const data = [];

        usersList.map((user) => {
          const userObject = {
            ID: (
              <div id="id" data-col="ID">
                <Link href={`/user/admin/users/${user.id}`}>
                  <a>{user.id}</a>
                </Link>
              </div>
            ),
            "Имя Фамилия": (
              <div id="user_name" data-col="Имя Фамилия">
                <Link href={`/user/admin/users/${user.id}`}>
                  <a>{`${user?.user_name ? user?.user_name : "Не указано"} ${
                    user?.user_last_name ? user?.user_last_name : ""
                  }`}</a>
                </Link>
              </div>
            ),
            Агенство: (
              <div id="user_agency" data-col="Агенство">{`${
                user?.user_agency ? user?.user_agency : "Не указано"
              }`}</div>
            ),
            "Дата регистрации": (
              <div id="date_registered" data-col="Дата регистрации">{`${
                user.date_registered && formateDate(user.date_registered)
              } г`}</div>
            ),
            // "Последняя активность": `${
            //   user.last_login_date
            //     ? formateDate(user.last_login_date)
            //     : "отсутствует"
            // }`,
            Телефон: (
              <div id="phone" data-col="Телефон">
                {user.phone}
              </div>
            ),
            Статус: (
              <div id="user_group" data-col="Статус">
                {user.user_group.name}
              </div>
            ),
            "Количество объявлений": (
              <div>
                <Link href={`/user/admin/items?user=${user.id}`}>
                  <a>
                    <UserProductsAmount userId={user.id} />
                  </a>
                </Link>
              </div>
            ),
          };

          data.push(userObject);
        });

        setData(data);
        setIsUsersListLoading(false);
      }
    })();
  }, [usersList]);

  return (
    <MotionContainer>
      <div className="pt-3 pb-2.5 lg:border-b-[1px] lg:border-greyborder">
        <H1>{title}</H1>
      </div>

      <div className="table-container">
        <Table data={data} isLoading={isUsersListLoading} setSort={setSort}/>
      </div>
    </MotionContainer>
  );
}
