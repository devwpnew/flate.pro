import Preloader from "@modules/common/components/preloader/preloader";
import UserAvatar from "@modules/user/components/profile/common/userAvatar";
import UserName from "@modules/user/components/profile/common/userName";
import declension from "helpers/formatters/declension";
import getLayout from "helpers/getLayout";
import useProductsCount from "hooks/products/useProductsCount";
import Link from "next/link";
import api from "pages/api/service/api";
import { useEffect, useMemo, useState } from "react";

export default function PostUserInfo({ product }) {
  const { MOBILE } = getLayout();

  const userProductsCount = useProductsCount(
    useMemo(() => {
      return {
        user_id: product.user_id.id,
        published: "1",
      };
    }, [])
  );

  return (
    <div className="flex flex-col gap-2.5 mb-4 py-4 border-greyborder border-t-[1px] border-b-[1px]">
      <span className="text-grey text-sm">Контактное лицо</span>
      <div className="flex items-center gap-2.5">
        <div className="w-[70px] h-[70px]">
          <UserAvatar
            className="text-4xl"
            userOwner={product.user_id}
            userName={product.user_id && product.user_id.user_name}
          />
        </div>
        <div className="flex flex-col">
          <span className="font-bold">
            <UserName name={product.user_id && product.user_id.user_name} />
          </span>
          {/* {product.user_id && (
            <span className="text-sm text-grey">
              {product.user_id.user_agency}
            </span>
          )} */}
          {userProductsCount.isLoading ? (
            <div className="w-full h-[20px]">
              <Preloader />
            </div>
          ) : (
            <Link
              href={`/users/${product.user_id.sef_code || product.user_id.id}`}
            >
              <a className="text-sm block cursor-pointer hover:text-bluelight leading-5">
                {userProductsCount.products.count &&
                  `${userProductsCount.products.count} ${declension(
                    userProductsCount.products.count,
                    ["объявление", "объявления", "объявлений"]
                  )}`}
              </a>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
