import emptyThumb from "public/thumb-not-found.jpg";
import isJson from "../isJson";

export default function getProductImageSrc(product) {
  const srcUrl = "https://flate.pro";
  let imageSrc = emptyThumb;

  // if(product?.image_v2)
  // {
  //   imageSrc = srcUrl + product?.image_v2.path
  // } else {
  //   imageSrc = emptyThumb;
  // }
  if (product?.image) {
    if (isJson(product.image)) {
      imageSrc = srcUrl + JSON.parse(product.image)[0];
    } else {

      if(product.image.length > 5) {
        imageSrc = srcUrl + product.image;
      }else {
        imageSrc = emptyThumb;
      }

    }
  }
  return imageSrc;
}
