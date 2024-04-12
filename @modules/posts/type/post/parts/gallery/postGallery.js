import React, { useState, useEffect  } from "react";
import { useRouter } from "next/router";
import GalleryDesktop from "./part/galleryDesktop";
import GalleryMobile from "./part/galleryMobile";

import getLayout from "helpers/getLayout";

export default function PostGallery({ previewImage, galleryImages }) {
  const srcUrl = "https://flate.pro/"
  
  let items = []
  if(typeof galleryImages == 'string'){
    galleryImages.split(",").map((e) => items.push(e));
  } else {
    items = galleryImages
  }
  
  const { MOBILE } = getLayout();

  return (
    <>
      {MOBILE ? (
        <GalleryMobile images={items} srcUrl={srcUrl}/>
      ) : (
        <GalleryDesktop images={items} srcUrl={srcUrl}/>
      )}
    </>
  );
}
