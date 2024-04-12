import API from "pages/api/service/api";
import { useState, useEffect } from "react";

import Preloader from "@modules/common/components/preloader/preloader";
import DatePicker from "@modules/common/components/select/datePicker";
export default function AdminUsersList() {
  const [isLoading, setIsLoading] = useState(true);
  const [usersList, setUsersList] = useState(null);
  const [usersListActive, setUsersListActive] = useState(null);
  const [usersListBanned, setUsersListBanned] = useState(null);
  const [usersListPayed, setUsersListPayed] = useState(null);

  const [addedProducts, setAddedProducts] = useState(null);
  const [usersAddedProds, setUsersAddedProds] = useState(null);
  const [premProducts, setPremProducts] = useState(null);
  
  const [date, setDate] = useState("");


  useEffect(() => {
    (async function fetchData() {
      setIsLoading(true);
      setUsersList(
        await API.statistics.registered({
          window_host: window.location.origin,
          sort: {
            id: "asc",
          },
        })
      );
      setUsersListActive(await API.statistics.activeUsers());
      setUsersListBanned(await API.statistics.blocked());
      setUsersListPayed(await API.statistics.usersSubscribed());
      setAddedProducts(await API.statistics.productsAdded());
      setUsersAddedProds(await API.statistics.usersAddedProds());
      setPremProducts(await API.statistics.paidProds());
      setIsLoading(false);
    })();
  }, [date]);

  return (
    <div className="flex gap-[25px]">
      <div className="bg-greylight rounded p-5 w-1/2 shadow-md h-[484px]">
        {!isLoading ? (
          <>
            <div className="flex flex-row justify-between mb-5">
              <div className="font-bold text-base">Пользователи</div>
            </div>

            <div className="text-sm">Всего</div>
            <div className="font-bold text-lg mb-10">
              {usersList ? (
                usersList.count
              ) : (
                <div className="inline w-[50px] h-[10px]">
                  <Preloader />
                </div>
              )}
            </div>

            <div className="text-sm">Забаненные</div>
            <div className="font-bold text-lg mb-10">
              {usersListBanned ? (
                usersListBanned.count
              ) : (
                <div className="inline w-[50px] h-[10px]">
                  <Preloader />
                </div>
              )}
            </div>

            <div className="text-sm"> Активных</div>
            <div className="font-bold text-lg mb-10">
              {usersListActive ? (
                usersListActive.count
              ) : (
                <div className="inline w-[50px] h-[10px]">
                  <Preloader />
                </div>
              )}
            </div>

            <div className="text-sm">Добавили минимум 1 объявление</div>
            <div className="font-bold text-lg mb-10">
              {usersAddedProds ? (
                usersAddedProds.count
              ) : (
                <div className="inline w-[50px] h-[10px]">
                  <Preloader />
                </div>
              )}
            </div>

            <div className="text-sm">Оплативших подписку</div>
            <div className="font-bold text-lg">
              {usersListPayed ? (
                usersListPayed.count
              ) : (
                <div className="inline w-[50px] h-[10px]">
                  <Preloader />
                </div>
              )}
            </div>
          </>
        ) : (
          <Preloader />
        )}
      </div>
      <div className="bg-greylight rounded p-5 w-1/2 shadow-md h-[484px]">
        {!isLoading ? (
          <>
            <div className="flex flex-row justify-between mb-5">
              <div className="font-bold text-base">Объявления</div>

              <DatePicker callback={setDate}/>
            </div>
            <div className="text-sm">Количество</div>
            <div className="font-bold text-lg mb-10">
              {addedProducts ? (
                addedProducts.count
              ) : (
                <div className="inline w-[50px] h-[10px]">
                  <Preloader />
                </div>
              )}
            </div>
            <div className="text-sm">Премиум</div>
            <div className="font-bold text-lg">
              {premProducts ? (
                premProducts.count
              ) : (
                <div className="inline w-[50px] h-[10px]">
                  <Preloader />
                </div>
              )}
            </div>
          </>
        ) : (
          <Preloader />
        )}
      </div>
    </div>
  );
}
