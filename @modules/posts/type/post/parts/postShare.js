import { useState, useEffect } from "react";
import Image from "next/image";

import {
  WhatsappShareButton,
  VKShareButton,
  TelegramShareButton,
} from "next-share";

import Button from "@modules/common/components/button/button";
import vk from "public/icons/vk.svg";
import whatsapp from "public/icons/whatsapp.svg";
import telegram from "public/icons/telegram.svg";
import shareLink from "public/icons/share-link.svg";

export default function PostShare() {
  const [isPageLoading, setPageLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  // This is the function we wrote earlier
  async function copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }
  // onClick handler function for the copy button
  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(window.location)
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const onPageLoad = () => {
      setPageLoading(false);
    };

    // Check if the page has already loaded
    if (document.readyState === "complete") {
      onPageLoad();
    } else {
      window.addEventListener("load", onPageLoad);
      // Remove the event listener when component unmounts
      return () => window.removeEventListener("load", onPageLoad);
    }
  }, []);
  return (
    <>
      {isPageLoading ? (
        ""
      ) : (
        <div className="relative flex flex-row gap-[5px]">
          <VKShareButton url={`${window.location}`}>
            <div className="flex items-center justify-center w-[26px] cursor-pointer">
              <Image src={vk.src} width={vk.width} height={vk.height} />
            </div>
          </VKShareButton>
          <WhatsappShareButton url={`${String(window.location)}`}>
            <div className="flex items-center justify-center w-[26px] cursor-pointer">
              <Image
                src={whatsapp.src}
                width={whatsapp.width}
                height={whatsapp.height}
              />
            </div>
          </WhatsappShareButton>
          <TelegramShareButton url={`${String(window.location)}`}>
            <div className="flex items-center justify-center w-[26px] cursor-pointer">
              <Image
                src={telegram.src}
                width={telegram.width}
                height={telegram.height}
              />
            </div>
          </TelegramShareButton>
          <button className="bg-greyF3">
            <div
              className={`flex items-center justify-center w-[26px] cursor-pointer ${
                isCopied ? "border border-blue rounded" : ""
              }`}
              onClick={handleCopyClick}
            >
              <Image
                src={shareLink.src}
                width={shareLink.width}
                height={shareLink.height}
              />
              <div className="absolute right-[-110%] top-[-25px] text-blue">
                {isCopied ? "Ссылка скопирована!" : ""}
              </div>
            </div>
          </button>
        </div>
      )}
    </>
  );
}
