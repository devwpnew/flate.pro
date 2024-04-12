import { useState, useEffect } from "react";

import PostViewed from "./postViewed";
import ButtonCall from "../../../../common/components/button/buttonCall";
import ButtonMessage from "@modules/common/components/button/buttonMessage";
import PostUserInfo from "./postUserInfo";
import PostRelated from "./postRelated";

import getProductPrice from "helpers/formatters/product/getProductPrice";
import getProductPriceSquares from "helpers/formatters/product/getProductPriceSquares";
import getProductDate from "helpers/formatters/product/getProductDate";
import getProductPhone from "helpers/formatters/product/getProductPhone";

export default function PostSidebar({ product }) {
  let phone =
    product.properties &&
    product.properties.product_phone &&
    product.properties.product_phone;
  if (!phone) {
    phone = product.user_id && product.user_id.phone;
  }

  const [isStick, setIsStick] = useState(null);

  useEffect(() => {
    const stickOnScroll = () => {
      if (window.pageYOffset < 100) {
        setIsStick(false);
      } else {
        setIsStick(true);
      }
    };

    window.removeEventListener("scroll", stickOnScroll);
    window.addEventListener("scroll", stickOnScroll);
  }, []);

  const slug = product?.section_relation[0]?.slug;

  return (
    <>
      <div
        className={`flex flex-col w-full py-5 max-w-[380px] w-full transition-all ${
          isStick ? "sticky right-0 top-[100px] pt-0" : "mt-[36px]"
        }`}
      >
        <div className="block">
          <div className="flex flex-col gap-1 mb-4">
            <span className="text-primary text-3xl font-bold">
              {getProductPrice(product)} руб.
            </span>
            <span className="text-base">
              {getProductPriceSquares(product)} руб. за{" "}
              {slug && slug === "land" ? "сотку" : "м2"}
            </span>
          </div>

          <PostUserInfo product={product} />

          <div className="flex flex-col items-center justify-between gap-2.5 pb-4 mb-4 border-greyborder border-b-[1px]">
            {product?.messages_calls === "0" && (
              <>
                <ButtonCall
                  type="white"
                  className="flex justify-center items-center py-3 px-3"
                  phone={getProductPhone(product)}
                  showIcon={true}
                  iconW="20"
                  iconH="20"
                >
                  <span className="font-bold">Показать телефон</span>
                </ButtonCall>
                <ButtonMessage
                  type="green"
                  className="flex justify-center items-center py-3 px-3"
                  showIcon={true}
                  product={product}
                  iconW="20"
                  iconH="20"
                >
                  <span className="font-bold">Написать в WhatsApp</span>
                </ButtonMessage>
              </>
            )}

            {product?.messages_calls === "1" && (
              <>
                <ButtonCall
                  type="white"
                  className="flex justify-center items-center py-3"
                  phone={getProductPhone(product)}
                  showIcon={true}
                  iconW="20"
                  iconH="20"
                >
                  <span className="font-bold">Показать телефон</span>
                </ButtonCall>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-between gap-2 mb-[25px]">
          <div className="flex items-center gap-5">
            <div className="text-sm">№ {product.id}</div>
            <PostViewed product={product} />
          </div>

          <span className="text-sm">{getProductDate(product)}</span>
        </div>
        <PostRelated
          buildingLink={product.building_link}
          rcLink={product.rc_link}
          product_id={product.id}
          price={product.product_price}
          area={product.area_link}
        />
      </div>
    </>
  );
}
