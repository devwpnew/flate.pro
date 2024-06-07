import React from "react";

import Image from "next/image";

import H2 from "@modules/common/components/heading/h2";

import regBanner from "public/reg-banner.jpg";
import appstore from "public/appstore.png";
import googleplay from "public/googleplay.png";
import appPreviewBanner from "public/iphone.png";

export default function LoginText() {
    return (
        <div className="hidden md:flex order-1 mt-8 ml-8">
            <Image
                src={appPreviewBanner.src}
                width={appPreviewBanner.width}
                height={appPreviewBanner.height}
                className=""
            />
        </div>
    );
}
