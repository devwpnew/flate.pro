import Link from "next/link";
import Image from "next/image";

import ButtonFavorite from "@modules/common/components/button/buttonFavorite";
import AdminToolsButton from "../part/admitToolsButton";

import getProductDate from "helpers/formatters/product/getProductDate";
import getProductPriceSquares from "helpers/formatters/product/getProductPriceSquares";
import getProductUrl from "helpers/formatters/product/getProductUrl";
import getProductAddress from "helpers/formatters/product/getProductAddress";
import getProductImageSrc from "helpers/formatters/product/getProductImageSrc";
import getProductPrice from "helpers/formatters/product/getProductPrice";
import usePremiumViews from "hooks/products/usePremiumViews";

import getLayout from "helpers/getLayout";

export default function ProductItemGrid({ user, product }) {
  const { MOBILE } = getLayout();
  const usePremiumViewsResponse = usePremiumViews(product);
  
  const slug = product?.section_relation[0]?.slug;

  return (
    <>
      {product && (
        <div className="relative group hover:shadow-lg" id={product.id}>
          <div className="absolute top-1 right-1 md:top-2.5 md:right-2.5 lg:top-3 lg:right-3 z-[2]">
            {user && product.id && <ButtonFavorite productId={product.id} />}
          </div>

          <Link href={getProductUrl(product)}>
            <a
              // target={!MOBILE && "_blank"}
              target={"_blank"}
              className={`border border-greyborder rounded p-1 lg:p-2 lg:shadow-md flex flex-col gap-1 md:gap-2 cursor-pointer group h-full transition-all bg-greylight`}
              style={{
                background: product.premium > 0 && "rgba(175, 210, 117, 0.14)",
              }}
            >
              <div className="block">
                <div className="rounded overflow-hidden mb-2.5 lg:w-full lg:h-[160px]">
                  <Image
                    className="object-cover object-center h-full"
                    src={getProductImageSrc(product)}
                    width={220}
                    height={160}
                    layout="responsive"
                    quality={50}
                    onError={(e) => console.error(e.target.id)}
                  />
                </div>

                <div className="mb-[9px] text-primary text-base font-semibold block md:leading-5">
                  {getProductPrice(product)} руб.
                </div>

                <div
                  className="ellipsis ellipsis-clamp-2"
                  style={{
                    minHeight: "36px",
                    maxHeight: "36px",
                    height: "36px",
                  }}
                >
                  <span className="block text-blue text-xs md:text-sm font-semibold md:w-full md:leading-[18px] group-hover:text-bluelight">
                    {product.name}
                  </span>
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:flex-wrap cursor-pointer gap-0.5">
                <span
                  className="block text-xs text-grey ellipsis ellipsis-clamp-2"
                  style={{
                    minHeight: "34px",
                    maxHeight: "34px",
                    height: "34px",
                  }}
                >
                  {getProductAddress(product)}
                </span>

                <span className="text-grey flex items-center justify-between w-full">
                  <span className="block text-[0.70rem] sm:text-xs font-bold">
                    {getProductPriceSquares(product)} руб. за{" "}
                    {slug && slug === "land" ? "сотку" : "м2"}
                  </span>

                  <span className="block text-[0.70rem] sm:text-xs">
                    {getProductDate(product)}
                  </span>
                </span>
              </div>
            </a>
          </Link>

          <AdminToolsButton
            user={user}
            product={product}
            className="absolute top-[15px] left-[15px] cursor-pointer z-1"
          />
        </div>
      )}
    </>
  );
}
