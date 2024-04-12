import API from "pages/api/service/api";
import { useEffect, useState } from "react";

import Link from "next/link";
import Image from "next/image";
import UserAvatar from "../../profile/common/userAvatar";

import thumb from "public/662.jpg";
import emptyThumb from "public/thumb-not-found.jpg";
import Preloader from "@modules/common/components/preloader/preloader";
import getProductPrice from "helpers/formatters/product/getProductPrice";
import getProductUrl from "helpers/formatters/product/getProductUrl";
import api from "pages/api/service/api";
import { formateDate } from "helpers/formateDate";

export default function MessageItem({
  dialogue,
  title,
  name,
  isAdmin,
  user,
  isLastChild,
}) {
  const [product, setProduct] = useState(false);
  const [productGallery, setProductGallery] = useState(false);

  const [lastMessage, setLastMessage] = useState(null);
  const [countUnread, setUnread] = useState(null);

  useEffect(() => {
    (async () => {
      if (!dialogue?.product) {
        return;
      }

      const p = await API.get.product.list({
        window_host: window.location.origin,
        filter: {
          id: dialogue.product.id,
        },
      });

      if (p) {
        setProduct(p[0]);
      }
    })();
  }, [dialogue]);

  useEffect(() => {
    if (dialogue) {
      (async function fetchMessages() {
        const messages = await API.get.messages({
          filter: { dialogue: dialogue.id },
          sort: { date_created: "desc" },
        });
        if (messages?.length) {
          setLastMessage(messages[0]);
        }

        const unread = await API.get.messages({
          filter: {
            dialogue: dialogue.id,
            read_by_opposite: "false",
            from_user: `!=${user.id}`,
          },
        });
        if (unread) {
          if (unread.length) {
            setUnread(unread.length);
          }
        } else {
          setUnread(false);
        }
        if (!dialogue.product) {
          // const properties = await API.get.product.propertyValue(
          //   dialogue.product,
          //   "product_galery",
          //   1
          // );
          const properties = dialogue.product.gallery_v2
          setProductGallery(properties);
        }
      })();
    }
  }, []);

  const getImage = () => {
    if (productGallery?.prop_value) {
      return JSON.parse(productGallery?.prop_value)[0];
    }
    // if (dialogue.product?.image_v2) {
    //   return dialogue.product.image_v2;
    // }
    if (dialogue?.from_user.user_avatar) {
      return dialogue?.from_user.user_avatar;
    }
  };

  const getName = () => {
    if (name) {
      return name;
    }

    let nameStr = "";

    if (dialogue?.from_user.id == user?.id) {
      nameStr += dialogue?.to_user?.user_name;
    } else {
      nameStr += dialogue?.from_user?.user_name;
    }

    return nameStr;
  };

  return (
    <Link href={dialogue ? `messages/${dialogue.id}` : "messages/help"}>
      <div
        className={`flex items-center gap-2.5 cursor-pointer ${
          !isLastChild && "md:border-b-greyborder md:border-b-[1px] pb-[15px]"
        } md:gap-[20px]`}
      >
        {/* <div className="hidden md:block">
          <CheckboxCheck square={true} />
        </div> */}

        {!isAdmin ? (
          <div className="relative max-w-[50px] w-full h-[50px] md:max-w-[73px] md:h-[73px] cursor-pointer">
            {dialogue ? (
              <>
                <div className="block max-w-full w-full h-full rounded-full overflow-hidden">
                  <img
                    src={`https://flate.pro/${getImage()}`}
                    className="w-full h-[100%] object-cover"
                  ></img>
                </div>
                {/* <div className="w-[24px] h-[24px] absolute bottom-0 right-0 text-[12px] lg:text-[30px]">
                    <UserAvatar 
                      userOwner={dialogue.from_user.id == user.id ? dialogue.to_user : dialogue.from_user}
                      userName={dialogue.from_user.id == user.id ? dialogue.to_user.user_name : dialogue.from_user.user_name} />
                  </div> */}
              </>
            ) : (
              <>
                <Preloader />
              </>
            )}
          </div>
        ) : (
          <div className="relative max-w-[50px] w-full h-[50px] md:max-w-[73px] md:h-[73px]">
            <div className="block max-w-full w-full h-full rounded-full overflow-hidden text-[30px]">
              <div
                className={`flex items-center justify-center w-full h-full rounded-full overflow-hidden cursor-pointer bg-bluelight2`}
              >
                <div className={`text-white`}>
                  <svg
                    width="34"
                    height="34"
                    viewBox="0 0 34 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_3167_4575)">
                      <path
                        d="M29.0209 21.9791C27.1693 20.1276 24.9654 18.7569 22.5608 17.9272C25.1362 16.1534 26.8281 13.1848 26.8281 9.82812C26.8281 4.40891 22.4192 0 17 0C11.5808 0 7.17188 4.40891 7.17188 9.82812C7.17188 13.1848 8.86384 16.1534 11.4393 17.9272C9.0347 18.7569 6.83081 20.1276 4.97921 21.9791C1.76833 25.1901 0 29.4591 0 34H2.65625C2.65625 26.0908 9.09082 19.6562 17 19.6562C24.9092 19.6562 31.3438 26.0908 31.3438 34H34C34 29.4591 32.2317 25.1901 29.0209 21.9791ZM17 17C13.0454 17 9.82812 13.7828 9.82812 9.82812C9.82812 5.8735 13.0454 2.65625 17 2.65625C20.9546 2.65625 24.1719 5.8735 24.1719 9.82812C24.1719 13.7828 20.9546 17 17 17Z"
                        fill="#4BA5F8"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_3167_4575">
                        <rect width="34" height="34" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col relative w-full">
          <div className="block mb-1 text-sm md:text-base leading-4 md:mb-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold cursor-pointer hover:text-blue transition-all">
                {getName()}
              </span>

              <div className=" text-grey text-exs md:text-sm top-0 right-0">
                {lastMessage && formateDate(lastMessage.date_created)}{" "}
                {lastMessage &&
                  new Date(lastMessage.date_created).toLocaleTimeString(
                    process.env.Timezone,
                    { hour: "2-digit", minute: "2-digit" }
                  )}
              </div>
            </div>
          </div>

          {!dialogue && (
            <div className="text-xs mb-2 md:text-sm md:mb-2.5">{title}</div>
          )}

          {product && (
            <div
              className="cursor-pointer hover:text-bluelight transition-all text-xs mb-2 md:text-sm md:mb-2.5 ellipsis"
              style={{ minHeight: "20px", maxHeight: "20px", height: "20px" }}
            >
              <span>
                {product.name} — {getProductPrice(product)} руб.
              </span>
            </div>
          )}

          {lastMessage ? (
            <div className="flex items-center justify-between">
              <div
                className="ellipsis ellipsis-clamp-2"
                style={{ height: "30px" }}
              >
                <div className="text-xs md:text-sm leading-4 text-grey">
                  {lastMessage.text}
                </div>
              </div>
              {countUnread && (
                <div className=" text-white text-exs bottom-0 right-0">
                  <div className="bg-blue rounded-full px-1 md:px-[6px] md:text-sm">
                    {countUnread}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-3"></div>
          )}
        </div>
      </div>
    </Link>
  );
}
