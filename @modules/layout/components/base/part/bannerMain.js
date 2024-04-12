import Link from "next/link";
import Image from "next/image";
import { setCookie } from "cookies-next";

import { Fragment } from "react";

import { Dialog, Transition } from "@headlessui/react";
import DialogCloseIcon from "@modules/common/components/dialog/dialogCloseIcon";

import bannerImg from "public/backgrounds/banner-main.jpg";

export default function BannerMain({
  isClosed,
  setClosed,
  banner,
  isLoading,
  type,
}) {
  const onCloseHandler = (isClosed) => {
    setClosed(true);
    setCookie(`banner-${type}`, "closed", { maxAge: 86_400 });
  };

  return (
    <Transition appear show={!isClosed} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => onCloseHandler(isClosed)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-backdrop bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white px-7 py-2.5 max-w-[640px] w-full rounded-[10px] relative mx-[16px]">
                <DialogCloseIcon
                  onClick={() => onCloseHandler(isClosed)}
                  className={"absolute right-0 top-0 m-2.5"}
                />
                <div className="flex flex-col max-w-[560px] cursor-pointer">
                  <Link href={banner?.url ? banner?.url : "#"}>
                    <img
                      onClick={() => onCloseHandler(isClosed)}
                      src={
                        banner?.image && banner?.image !== "undefined"
                          ? banner?.image
                          : bannerImg.src
                      }
                      width={bannerImg.width}
                      height={bannerImg.height}
                      loading="lazy"
                      className="lg:min-h-[300px] w-full object-cover"
                    />
                  </Link>
                  {/* <div className="mb-5">
                <span className="text-3xl font-semibold inline leading-snug">
                  {banner?.name}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <div className="text-2xl gap-7 max-w-[289px] mb-[30px] leading-snug">
                    {banner?.button_name}
                  </div>

                  <a target="_blank" href="https://app.flate.pro">
                    <div className="flex flex-col gap-2.5">
                      <div className="w-[120px]">
                        <Image
                          src={appstore.src}
                          width={appstore.width}
                          height={appstore.height}
                          className="cursor-pointer"
                        />
                      </div>

                      <div className="w-[120px]">
                        <Image
                          src={googleplay.src}
                          width={googleplay.width}
                          height={googleplay.height}
                          className="cursor-pointer"
                        />
                      </div>
                    </div>
                  </a>
                </div>
                <div className="w-[253px] relative -right-4 flex items-start">
                  <img
                    className="cursor-pointer"
                    src={
                      banner?.image && banner?.image !== "undefined"
                        ? banner?.image
                        : mobileImage.src
                    }
                    width={mobileImage.width}
                    height={mobileImage.height}
                  />
                </div>
              </div> */}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
