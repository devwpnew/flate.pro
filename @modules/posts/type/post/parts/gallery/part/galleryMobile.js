import { useEffect, useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import Image from "next/image";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/thumbs";
import { Thumbs } from "swiper";

import postImage from "public/post-image.jpg";

import "photoswipe/dist/photoswipe.css";
import { Gallery, Item } from "react-photoswipe-gallery";
import getLayout from "helpers/getLayout";

export default function GalleryMobile({ images, srcUrl }) {
  const galleryContainer = useRef();

  const [galleryImage, setGalleryImage] = useState(null);
  const [openLightbox, setLightboxOpen] = useState(false);

  const [curSlideNum, setCurSlideNum] = useState(1);
  const [amountSlides, setAmountSlides] = useState(0);


  const galleryContent = JSON.parse(images).map((src, index, arr) => {
    return (
      <SwiperSlide key={`${index}${src}`}>
        <div className="relative overflow-hidden rounded-[10px]" style={{
          height: galleryContainer?.current ? (3/4) * galleryContainer.current.offsetWidth  -30 : ""
        }}>
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
              {({ ref, open }) => (
                <div className="flex flex-col justify-center items-center h-full">
                  <img
                    ref={ref}
                    onClick={open}
                    className="object-contain object-center relative z-10"
                    src={srcUrl + src}
                    loader="lazy"
                  />
                </div>
              )}
            </Item>
          </Gallery>
        </div>
      </SwiperSlide>
    );
  });

  return (
    <>
      <div className="relative cursor-pointer" ref={galleryContainer}>
        <Swiper
          slidesPerView={1}
          onSwiper={(swiper) => {
            setAmountSlides(swiper.slides.length);
          }}
          onSlideChange={(swiper) => {
            setCurSlideNum(swiper.activeIndex + 1);
          }}
        >
          {galleryContent}
        </Swiper>
        <div className="absolute left-[50%] mr-[-50%] -translate-x-2/4	 -translate-y-2/4	 bottom-1 z-50">
          <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-white">
            {curSlideNum}/{amountSlides}
          </div>
        </div>
      </div>
      <div className="mb-2.5"></div>
    </>
  );
} 