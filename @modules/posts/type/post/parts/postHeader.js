import Link from "next/link";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import Image from "next/image";
import H1 from "@modules/common/components/heading/h1";
import PostViewed from "./postViewed";
import OutsideAlerter from "hooks/useOutsideAlerter";

import moreDotsIcon from "public/icons/more-dots-icon.svg";
import ButtonFavorite from "@modules/common/components/button/buttonFavorite";
import AdminTools from "../../product/components/item/part/adminTools";
import useIsPageLoaded from "hooks/useIsPageLoaded";
import Preloader from "@modules/common/components/preloader/preloader";
import ButtonShare from "@modules/common/components/button/buttonShare";
import ButtonWithIcon from "@modules/common/components/button/buttonWithIcon";

import getProductAddress from "helpers/formatters/product/getProductAddress";
import AdminToolsButton from "../../product/components/item/part/admitToolsButton";
import getLayout from "helpers/getLayout";

export default function PostHeaderButtons({ product }) {
  const { MOBILE } = getLayout();
  const router = useRouter();
  const user = useSelector((state) => state.userLogin.value);

  const isLoading = useIsPageLoaded();

  const [showAdminTools, setShowAdminTools] = useState(false);

  function openRcInBlank(e) {
    e.preventDefault();
    const href = product.rc_link
      ? `/rcs/${product.rc_link.id}`
      : `/building/${product.building_link.id}`;

    const as = router.asPath;
    // if (!MOBILE) {
    //   window.open(href, "_blank");
    // } else {
    //   window.open(href);
    // }
    
    router.push(href);
  }

  const isShowLink = () => {
    if (product.section_relation[0].slug !== "flats") return false;

    if (product?.rc_link) {
      if (product?.rc_link?.published !== 0) {
        return true;
      } else {
        return false;
      }
    } else {
      if (product.building_link) {
        return true;
      }
    }

    return false;
  };

  // console.log(product);

  return (
    <div className="">
      <div className="relative">
        <AdminToolsButton
          user={user}
          product={product}
          className="absolute top-[37px] md:top-0 right-0 cursor-pointer z-1 text-white p-2 rounded-full border-0 bg-[#C842DE]"
        />

        {/* <div className="text-sm text-[#000]/50 mb-4">{getProductAddress(product)}</div> */}

        {/* {!isLoading ? (
          <H1>{product.name}</H1>
        ) : (
          <div className="w-1/2 h-[40px]">
            <Preloader />
          </div>
        )} */}
      </div>

      <div className="hidden md:flex flex-nowrap justify-between	items-center gap-2.5">
        <div className="flex items-center gap-2.5 w-full max-w-[450px]">
          {!isLoading ? (
            <>
              <div className="max-w-[132px] w-full">
                <ButtonFavorite
                  className="whitespace-nowrap py-1 px-2"
                  productId={product.id}
                  type="button"
                  childrenAdded={<>В избранном</>}
                >
                  В избранное
                </ButtonFavorite>
              </div>

              {/* {isShowLink() ? (
                <ButtonWithIcon
                  onClick={openRcInBlank}
                  type="white"
                  className="whitespace-nowrap py-1 px-2"
                  icon={MapIcon()}
                >
                  Ещё в этом доме
                </ButtonWithIcon>
              ) : (
                ""
              )} */}

              {/* <div className="max-w-[132px] w-full">
                <ButtonShare
                  className="whitespace-nowrap py-1 px-2"
                  type="white"
                >
                  Поделиться
                </ButtonShare>
              </div> */}
            </>
          ) : (
            <div className="w-full h-[40px]">
              <Preloader />
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          {/* <div className="text-sm">{getProductDate(product)}</div> */}
          <div className="flex flex-row gap-2.5 lg:hidden">
            <div className="text-sm">№ {product.id}</div>
            <PostViewed />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MapIcon() {
  return (
    <svg
      width="14"
      height="17"
      viewBox="0 0 14 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_2906_4290)">
        <path
          d="M13 7.1665C13 11.8332 7 15.8332 7 15.8332C7 15.8332 1 11.8332 1 7.1665C1 5.5752 1.63214 4.04908 2.75736 2.92386C3.88258 1.79864 5.4087 1.1665 7 1.1665C8.5913 1.1665 10.1174 1.79864 11.2426 2.92386C12.3679 4.04908 13 5.5752 13 7.1665Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 9.1665C8.10457 9.1665 9 8.27107 9 7.1665C9 6.06193 8.10457 5.1665 7 5.1665C5.89543 5.1665 5 6.06193 5 7.1665C5 8.27107 5.89543 9.1665 7 9.1665Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_2906_4290">
          <rect width="14" height="16" transform="translate(0 0.5)" />
        </clipPath>
      </defs>
    </svg>
  );
}

{
  /* <OutsideAlerter action={() => setShowShare(false)}>
            <div className="relative">
              <Button
                color={"white"}
                textColor={"blue"}
                className={
                  "border-[1px] border-greyborder h-8 px-3 py-2 relative"
                }
                onClick={() => setShowShare(!showShare)}
              >
                <Image src={shareIcon.src} width={17} height={17} />
                Поделиться
              </Button>

              {showShare && (
                <div className="absolute bottom-[-47px] left-[20px] z-10 bg-greyF3 p-2 rounded-md">
                  <div className="flex flex-row gap-[5px]">
                    <PostShare />
                  </div>
                </div>
              )}
            </div>
          </OutsideAlerter> */
}
