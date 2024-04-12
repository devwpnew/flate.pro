import API from "pages/api/service/api";

import { useEffect, useState } from "react";

import Link from "next/link";
import H1 from "@modules/common/components/heading/h1";
import MotionContainer from "@modules/common/components/container/motionContainer";

import UserProductsAmount from "@modules/common/components/user/info/UserProductsAmount";
import AdminButtonNotification from "../admin/parts/adminButtonNotification";
import Table from "@modules/common/components/admin/table/table";
import { formateDate } from "helpers/formateDate";
import usersModel from "models/users";

export default function AdminUsersContent({ onlyAdmins, title }) {
  const [data, setData] = useState(null);
  const [isUsersListLoading, setIsUsersListLoading] = useState(true);
  const [sort, setSort] = useState({ date_registered: "desc" });
  const [userGroupInfo, setUserGroupInfo] = useState(false);

  function getUserGroupName(id) {
    const userGroup = userGroupInfo.find(function (elem, ind, array) {
      if(elem.id == id) {
        return elem;
      }
    })

    return userGroup ? userGroup.name : 'Нет группы'
  }

  useEffect(() => {
    (async function fetchUsers() {
      setIsUsersListLoading(true);

      // const queryProps = {
      //   window_host: window.location.origin,
      //   filter: {},
      //   sort: {
      //     ...sort
      //   },
      //   limit: "all",
      // };

      console.log('sortBefore', sort)

      let filter = {};
      const sortQ = {...sort}
      const limit = "all"

      if (onlyAdmins) {
        filter["user_group"] = [1, 5];
      }

      const usersList = await usersModel.getAdminList(filter, sortQ, limit, false, window.location.origin);

      const data = [];

      usersList.map((user) => {
        const userObject = {
          "ID": (
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
          "Агентство": (
            <div id="user_agency" data-col="Агентство">{`${
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
          "Телефон": (
            <div id="phone" data-col="Телефон">
              {user.phone}
            </div>
          ),
          "Статус": <div id="user_group" data-col="Статус">{userGroupInfo && getUserGroupName(user.user_group)}</div>,
          "Количество объявлений": (
            <div id="count_product" data-col="Количество объявлений">
              <Link href={`/user/admin/items?user=${user.id}`}>
                <a>
                  {user.count_product ? user.count_product : 0}
                  {/* <UserProductsAmount userId={user.id} /> */}
                </a>
              </Link>
            </div>
          ),
        };

        data.push(userObject);
      });

      setData(data);
      setIsUsersListLoading(false);
    })();
  }, [sort]);

  useEffect(() => {
    (async function fetchUserGroups() {
      const getUserGroups = await API.get.userGroups();
      setUserGroupInfo(getUserGroups)
    })();
  }, [])

  return (
    <MotionContainer>
      <div className="pt-3 pb-2.5 lg:border-b-[1px] lg:border-greyborder">
        <div className="flex flex-row items-center justify-between">
          <H1>{title ? title : "Пользователи"}</H1>

          {/* {!title && <AdminButtonNotification />} */}
        </div>
      </div>
      <div className="table-container">
        <Table data={data} isLoading={isUsersListLoading} setSort={setSort}/>
      </div>
    </MotionContainer>
  );
}
