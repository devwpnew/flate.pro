import React from "react";

import Image from "next/image";

import H2 from "@modules/common/components/heading/h2";

import regBanner from "public/reg-banner.jpg";
import appstore from "public/appstore.png";
import googleplay from "public/googleplay.png";
import appPreviewBanner from "public/appPreviewBanner.png";

export default function LoginText() {
    return (
        <div className="hidden md:block order-1">
            

            {/* <Link href={'/app'}> */}
            {/* <div className="flex items-center justify-center gap-[18px] mb-[30px]">
        <a
          href="https://apps.apple.com/ru/app/flate/id6458738854"
          target="_blank"
        >
          <Image
            src={appstore.src}
            width={appstore.width}
            height={appstore.height}
            className="cursor-pointer"
          />
        </a>
        <a
          href="https://play.google.com/store/apps/details?id=flate.pro"
          target="_blank"
        >
          <Image
            src={googleplay.src}
            width={googleplay.width}
            height={googleplay.height}
            className="cursor-pointer"
          />
        </a>
      </div> */}
            {/* </Link> */}

            <div className="hidden lg:flex justify-center max-w-[340px]">
                <Image
                    src={appPreviewBanner.src}
                    width={appPreviewBanner.width}
                    height={appPreviewBanner.height}
                    className="mx-auto"
                />
            </div>
        </div>
    );
}
