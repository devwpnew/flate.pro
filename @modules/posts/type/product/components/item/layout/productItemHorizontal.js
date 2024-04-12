import Link from "next/link";
import Image from "next/image";

import thumb from "public/post-image.jpg";
import ButtonFavorite from "@modules/common/components/button/buttonFavorite";

import getProductUrl from "helpers/formatters/product/getProductUrl";
import getProductImageSrc from "helpers/formatters/product/getProductImageSrc";
import getProductPrice from "helpers/formatters/product/getProductPrice";
import getLayout from "helpers/getLayout";

export default function ProductItemHorizontal({ product, user }) {
  const { MOBILE } = getLayout();

  return (
    <>
      <div
        className={`${
          product.premium === 3 ? "bg-premium" : "bg-greylight"
        } lg:p-2 rounded flex flex-row justify-between item gap-2.5 relative cursor-pointer max-h-[80px] lg:max-h-[130px] overflow-hidden group`}
      >
        <div className="relative">
          {user && product.id && (
            <div className="absolute top-1 right-0 z-10 cursor-pointer">
              {user && product.id && <ButtonFavorite productId={product.id} />}
            </div>
          )}

          <Link href={getProductUrl(product)}>
            <a
              // target={!MOBILE && "_blank"}
              target={"_blank"}
              className="w-[110px] lg:max-w-[130px] lg:w-[130px] rounded-[4px] overflow-hidden block"
            >
              <Image
                src={getProductImageSrc(product)}
                className="object-cover object-center"
                width={thumb.width}
                height={thumb.height}
                layout="responsive"
              />
            </a>
          </Link>
        </div>

        <Link href={getProductUrl(product)}>
          <a
            // target={!MOBILE && "_blank"}
            target={"_blank"}
            className="block w-full"
          >
            <div className="flex flex-col md:flex-row md:flex-wrap cursor-pointer">
              <div
                className="text-blue text-sm font-bold md:w-full block group-hover:text-bluelight underline-offset-2  ellipsis ellipsis-clamp-2"
                style={{
                  minHeight: "40px",
                  maxheight: "40px",
                  height: "40px",
                }}
              >
                <span>{product.name}</span>
              </div>
              <span className="text-primary text-base font-bold block">
                {getProductPrice(product)} руб.
              </span>
            </div>
          </a>
        </Link>
      </div>
    </>
  );
}
