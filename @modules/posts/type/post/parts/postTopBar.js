import { useSelector } from "react-redux";

import Link from "next/link";

import Preloader from "@modules/common/components/preloader/preloader";

import ButtonFavorite from "@modules/common/components/button/buttonFavorite";
import ButtonWithIcon from "@modules/common/components/button/buttonWithIcon";
import ButtonShare from "@modules/common/components/button/buttonShare";

import useIsPageLoaded from "hooks/useIsPageLoaded";

export default function PostTopBar({ product_name, rcLink, product_id }) {
  const isLoading = useIsPageLoaded();
  const user = useSelector((state) => state.userLogin.value);

  return (
    <div className="flex justify-between items-center gap-2.5">
      <div className="w-full md:w-full overflow-hidden text-ellipsis">
        <span className="font-bold text-xs whitespace-nowrap">
          {product_name}
        </span>
      </div>

      <div className="md:hidden">
        {/* {user && <div className="w-[40px]"><ButtonFavorite width={14} height={14} /></div>} */}

        {/* {!related && !isLoading && (
          <a href="#related">
            <Image src={moreIcon.src} width={14} height={14} />
          </a>
        )} */}

        <div className="flex items-center justify-end gap-5 w-full">
          {!isLoading ? (
            <>
              <div className="w-[40px]">
                <ButtonFavorite
                  className="whitespace-nowrap py-1 px-2"
                  productId={product_id}
                  type="button"
                ></ButtonFavorite>
              </div>

              {rcLink && (
                <div className="w-[40px]">
                  <Link href={`/rcs/${rcLink.id}`}>
                    <ButtonWithIcon
                      type="white"
                      className="whitespace-nowrap py-1 px-2"
                      icon={MapIcon()}
                    ></ButtonWithIcon>
                  </Link>
                </div>
              )}

              <div className="w-[40px]">
                <ButtonShare
                  className="whitespace-nowrap py-1 px-2"
                  type="white"
                ></ButtonShare>
              </div>
            </>
          ) : (
            <div className="w-[100px] h-[40px]">
              <Preloader />
            </div>
          )}
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
