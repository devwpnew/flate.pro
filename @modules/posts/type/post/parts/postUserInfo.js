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
    <div className="mt-5 flex flex-col gap-2.5 mb-4 py-">
      <div className="flex items-center gap-2.5">
        <div className="w-[70px] h-[70px]">
          <UserAvatar
            className=""
            userOwner={product.user_id}
            userName={product.user_id && product.user_id.user_name}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-grey text-xs mb-2">Контактное лицо</span>

          <div className="flex gap-3 items-center">
            <UserName className="font-bold" name={product.user_id && product.user_id.user_name} />

            {userProductsCount.isLoading ? (
              <div className="w-full h-[20px]">
                <Preloader />
              </div>
            ) : (
              <Link
                href={`/users/${product.user_id.sef_code || product.user_id.id}`}
              >
                <a className="text-sm block cursor-pointer text-[#1479F5] bg-[#ECF2F8] hover:bg-[#1479F5]/20 py-1 px-3  rounded-full">
                  {userProductsCount.products.count &&
                    `${userProductsCount.products.count} ${declension(
                      userProductsCount.products.count,
                      ["объявление", "объявления", "объявлений"]
                    )}`}
                </a>
              </Link>
            )}

          </div>
          {/* {product.user_id && (
            <span className="text-sm text-grey">
              {product.user_id.user_agency}
            </span>
          )} */}
          
        </div>
      </div>
    </div>
  );
}
