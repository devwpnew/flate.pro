import { useState, useEffect, useId } from "react";
import { useRouter } from "next/router";
import { Dialog } from "@headlessui/react";
import Image from "next/image";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/navigation";

import { Thumbs, Navigation } from "swiper";

import postImage from "public/post-image.jpg";
import cameraIcon from "public/icons/camera.svg";
import showGalleryImage from "public/icons/show-gallery-image.png";
import Preloader from "@modules/common/components/preloader/preloader";

import useIsPageLoaded from "hooks/useIsPageLoaded";

import "photoswipe/dist/photoswipe.css";
import { Gallery, Item } from "react-photoswipe-gallery";

export default function GalleryDesktop({ images, srcUrl }) {
  const [galleryImage, setGalleryImage] = useState(null);
  const [openLightbox, setLightboxOpen] = useState(false);

  const [thumbsSwiper, setThumbsSwiper] = useState("");
  const [curSlideNum, setCurSlideNum] = useState(1);

  const isLoading = useIsPageLoaded();

  const galleryContent = JSON.parse(images).map((src, index, arr) => {
    return (
      <SwiperSlide key={`${src}${index + 2}`}>
        <div className="hover:border-blue hover:border border border-transparent transition-all rounded-[4px] overflow-hidden h-[508px] relative">
          {!isLoading ? (
            <>
              <div
                className="blur w-full h-full absolute top-0 left-0 opacity-40 bg-no-repeat bg-center bg-cover"
                style={{
                  backgroundImage: `url(${srcUrl + src})`,
                }}
                width={postImage.width}
                height={postImage.height}
              ></div>
              <Gallery>
                <Item html={`<img src="${srcUrl + src}" />`}>
                  {({ open }) => (
                    <>
                      <div
                        className="flex flex-col justify-center items-center h-full relative"
                        onClick={open}
                      >
                        <img
                          className="object-contain object-center relative z-10"
                          src={srcUrl + src}
                          layout="responsive"
                        />
                      </div>
                    </>
                  )}
                </Item>
              </Gallery>
            </>
          ) : (
            <div className={`w-[${postImage.width}px] h-[812px] h-[487px]`}>
              <Preloader />
            </div>
          )}
          <button className="absolute top-2.5 right-[calc(11%)] z-10 flex flex-col items-center justify-center pointer-events-none">
            <Image
              src={showGalleryImage.src}
              width={showGalleryImage.width}
              height={showGalleryImage.height}
            />
          </button>
        </div>
      </SwiperSlide>
    );
  });

  const galleryThumbs = JSON.parse(images).map((src, index, arr) => {
    return (
      <SwiperSlide key={`${src}${index + 1}`}>
        <div className="hover:border-blue hover:border border border-transparent transition-all rounded-[4px] overflow-hidden">
          {!isLoading ? (
            <Image
              className="object-cover object-center"
              src={srcUrl + src}
              width={90}
              height={77}
              layout="responsive"
            />
          ) : (
            <div className={`w-[${90}px] h-[812px] h-[77px]`}>
              <Preloader />
            </div>
          )}
        </div>
      </SwiperSlide>
    );
  });

  return (
    <>
      <div className="relative cursor-pointer mb-2.5 rounded-[4px] overflow-hidden">
        <Swiper
          modules={[Thumbs, Navigation]}
          thumbs={{ swiper: thumbsSwiper }}
          navigation
          loop
          slidesPerView={1}
          onSlideChange={(swiper) => {
            setCurSlideNum(swiper.activeIndex + 1);
          }}
        >
          {galleryContent}
        </Swiper>
        <div className="absolute left-[0px] bottom-[0px] z-10 rounded-[4px]">
          <div className="flex items-center gap-2.5 px-2.5 py-1 rounded-tr	bg-white">
            <Image
              src={cameraIcon.src}
              width={cameraIcon.width}
              height={cameraIcon.height}
            />
            <div className="font-bold">{images.length} фото</div>
          </div>
        </div>
      </div>

      <Swiper
        modules={[Thumbs]}
        watchSlidesProgress
        onSwiper={setThumbsSwiper}
        slidesPerView={8}
        spaceBetween={10}
        className={"cursor-pointer"}
      >
        {galleryThumbs}
      </Swiper>
    </>
  );
}
