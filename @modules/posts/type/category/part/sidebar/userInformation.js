import api from "pages/api/service/api";
import { useMemo, useEffect, useState } from "react";

import Link from "next/link";

import ButtonCall from "@modules/common/components/button/buttonCall";
import ButtonMessage from "@modules/common/components/button/buttonMessage";
import UserAvatar from "@modules/user/components/profile/common/userAvatar";
import UserName from "@modules/user/components/profile/common/userName";
import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";
import Preloader from "@modules/common/components/preloader/preloader";

import useProductsCount from "hooks/products/useProductsCount";

import declension from "helpers/formatters/declension";
import Button from "@modules/common/components/button/button";
import getLayout from "helpers/getLayout";

export default function UserInformation({ userId }) {
  const { MOBILE } = getLayout();

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async function fetchUser() {
      setIsLoading(true);
      setUser(
        await api.get.user({
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
      setIsLoading(false);
    })();
  }, []);

  const userProductsCount = useProductsCount(
    useMemo(() => {
      return {
        user_id: userId,
        published: "1",
      };
    }, [])
  );

  return (
    <div className="p-2.5 lg:p-0 lg:pb-5 border-b border-greyborder">
      {isLoading ? (
        <div className="flex justify-center">
          <PreloaderSpinner />
        </div>
      ) : (
        <>
          <div className="pb-4 border-b border-greyborder">
            <div className="flex items-center">
              <div className="w-[40px] h-[40px] text-lg mr-2.5">
                <UserAvatar userOwner={user} userName={user.user_name} />
              </div>
              <div className="block">
                <span className="font-bold block leading-5">
                  <UserName name={user.user_name} />
                </span>

                {userProductsCount.isLoading ? (
                  <div className="w-full h-[20px]">
                    <Preloader />
                  </div>
                ) : (
                  <Link href={`/users/${(user && user.sef_code) || user.id}`}>
                    <a className="text-sm block cursor-pointer hover:underline leading-5">
                      {userProductsCount?.products?.count &&
                        `${userProductsCount?.products?.count} ${declension(
                          userProductsCount?.products?.count,
                          ["объявление", "объявления", "объявлений"]
                        )}`}
                    </a>
                  </Link>
                )}
              </div>
            </div>

            {user?.user_agency && (
              <div className="text-sm mt-5">
                <span className="font-semibold">Место работы: </span>
                {user?.user_agency}
              </div>
            )}
          </div>

          {user?.user_description && (
            <div className="text-sm mt-4 mb-4">
              <span className="font-semibold">О себе: </span>
              {user?.user_description}
            </div>
          )}

          <div className="h-9 w-full mb-1.5">
            <ButtonCall type={"white"} phone={user.phone}>
              <span className="block text-center w-full">Показать телефон</span>
            </ButtonCall>
          </div>

          {/* <div className="h-9 w-full"> */}
          {/* <ButtonMessage type="white" userLink={user}>
              <span className="block text-center w-full">Написать</span>
            </ButtonMessage> */}
          {/* <Link href={`/user/profile/messages/${user.id}`}>
              <Button type={"white"} phone={user.phone}>
                Написать
              </Button>
            </Link> */}
          {/* </div> */}
        </>
      )}
    </div>
  );
}
