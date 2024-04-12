import { setCookie } from "cookies-next";

import Preloader from "@modules/common/components/preloader/preloader";
import Link from "next/link";
import Close from "@modules/common/components/button/close";

import bannerImg from "public/backgrounds/banner-sidebar.jpg";

export default function BannerSidebar({
  isClosed,
  setClosed,
  banner,
  isLoading,
  type,
}) {
  const onCloseHandler = () => {
    setClosed(true);
    setCookie(`banner-${type}`, "closed", { maxAge: 86_400 });
  };

  return (
    !isClosed && (
      <div>
        {isLoading ? (
          <div className="h-[300px] w-full">
            <Preloader />
          </div>
        ) : (
          <div className="flex items-center justify-between flex-wrap bg-greylight mt-7 relative">
            <a target="_blank" href={banner?.url ? banner?.url : "#"}>
              <img
                src={
                  banner?.image && banner?.image !== "undefined"
                    ? banner?.image
                    : bannerImg.src
                }
                loading="lazy"
                className="w-full object-cover"
              />
            </a>

            {/* <Link href={banner?.url ? banner?.url : "#"}>
                <div className="flex flex-col gap-1 cursor-pointer">
                  <span className="font-bold">{banner?.name}</span>
                  <span className="text-sm">{banner?.button_name}</span>
                </div>
              </Link>

              <Link href={banner?.url ? banner?.url : "#"}>
                <div className="max-w-[520px] w-full flex items-center justify-between flex-wrap mt-4 cursor-pointer">
                  <img
                    src={
                      banner?.image && banner?.image !== "undefined"
                        ? banner?.image
                        : bannerImg.src
                    }
                    width={bannerImg.width}
                    height={bannerImg.height}
                  />
                </div>
              </Link> */}

            <div className="absolute right-0 top-0 z-10">
              <Close
                onClick={onCloseHandler}
              />
            </div>
          </div>
        )}
      </div>
    )
  );
}
