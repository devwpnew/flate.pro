import { useState, useEffect } from "react";
import { setCookie } from "cookies-next";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

import Close from "@modules/common/components/button/close";
import Container from "@modules/common/components/container/container";
import Preloader from "@modules/common/components/preloader/preloader";

// import bannerImg from "public/backgrounds/banner-header.jpg";

export default function BannerHeader({
  isClosed,
  setClosed,
  banner,
  isLoading,
  type,
}) {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (document.getElementById(type)) {
      setHeight(document.getElementById(type).offsetHeight);
    }
  }, []);

  const onCloseHandler = () => {
    setClosed(true);
    setCookie(`banner-${type}`, "closed", { maxAge: 86_400 });
  };
  
  return (
    !isClosed && (
      <motion.div>
        {isLoading ? (
          <div className="h-full w-full" style={{ height: `${height}px` }}>
            <Preloader />
          </div>
        ) : (
          banner?.image && (
            <div
              id={type}
              className="sticky top-0 left-0 w-full z-20"
              style={{ background: "#F0F6FE" }}
            >
              <Container>
                <div className="cursor-pointer">
                  {/* <Link href={banner?.url ? banner?.url : "#"}>
                  <div className="flex flex-col gap-1 cursor-pointer">
                    <span className="font-bold">{banner?.name}</span>
                    <span className="text-sm">{banner?.button_name}</span>
                  </div>
                </Link> */}
                  {/* <div className="max-w-[520px] w-full flex items-center justify-between flex-wrap">
                  <a target="_blank" href="https://app.flate.pro">
                    <div className="flex items-center justify-center gap-2.5 cursor-pointer">
                      <div className="w-[85px]">
                        <Image
                          src={appstore.src}
                          width={appstore.width}
                          height={appstore.height}
                          className="cursor-pointer"
                        />
                      </div>

                      <div className="w-[85px]">
                        <Image
                          src={googleplay.src}
                          width={googleplay.width}
                          height={googleplay.height}
                          className="cursor-pointer"
                        />
                      </div>
                    </div>
                  </a>

                  <Link href={banner?.url ? banner?.url : "#"}>
                    <img
                      className="cursor-pointer"
                      src={
                        banner?.image && banner?.image !== "undefined"
                          ? banner?.image
                          : bannerImg.src
                      }
                      width={bannerImg.width}
                      height={bannerImg.height}
                    />
                  </Link>
                </div> */}
                  <a target="_blank" href={banner?.url ? banner?.url : "#"}>
                    <img
                      src={"https://flate.pro/" + banner?.image}
                      loading="lazy"
                      className="min-h-[66px] w-full object-cover"
                    />
                  </a>

                  <div className="absolute right-2.5 top-2.5">
                    <Close onClick={onCloseHandler} />
                  </div>
                </div>
              </Container>
            </div>
          )
        )}
      </motion.div>
    )
  );
}
