import { useState, useEffect } from "react";

import H2 from "@modules/common/components/heading/h2";
import ProductItem from "../item/productItem";
import randomInteger from "helpers/randomInteger";

import ProductPreloader from "@modules/common/components/preloader/productPreloader";
import ProductsSortSelect from "./part/productsSortSelect";
import Preloader from "@modules/common/components/preloader/preloader";

import sortProducts from "helpers/products/sortProducts";
import ButtonShare from "@modules/common/components/button/buttonShare";

export default function ProductContainer({
  title,
  products,
  hotDeals,
  isLoading,
  preloaderAmount,
  layout,
  containerClassName,
  isTitleLoading,
  fallbackComponent,
  hideUserInfo,
  callback,
  sortCallback,
  isShareButton,
  shareButtonLink,
  shareButtonText,
  isModeration,
}) {
  return (
    <div className="flex flex-col items-start w-full gap-2.5">

      <div className="w-full">
        <div className="pb-[4px] border-b border-greyborder flex flex-wrap items-end justify-between items-center">
          {title && (
            <>
              {!isTitleLoading && !isLoading ? (
                <>
                  <H2 className={"pb-[0px]"} style={{ marginBottom: 0 }}>
                    {title}
                  </H2>
                </>
              ) : (
                <div className="w-full h-11">
                  <Preloader />
                </div>
              )}
            </>
          )}

          {isShareButton && (
            <ButtonShare type="green" shareButtonLink={shareButtonLink}>
              {shareButtonText}
            </ButtonShare>
          )}

          <ProductsSortSelect callback={sortCallback} />
        </div>
      </div>

      {!products && !isLoading ? <>{fallbackComponent}</> : <></>}

      <div
        className={
          containerClassName
            ? containerClassName
            : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 gap-2.5 lg:gap-1 w-full"
        }
      >
        {!isLoading &&
          products &&
          products.length !== 0 &&
          products.map((product) => (
            <ProductItem
              key={`${randomInteger()}${product.id}`}
              product={product}
              hotDeal={hotDeals}
              layout={layout}
              hideUserInfo={hideUserInfo}
              isModeration={isModeration}
            />
          ))}

        {isLoading && (
          <>
            <ProductPreloader
              className={
                layout === "row" ||
                layout === "settings" ||
                (layout === "favorite" && "w-full h-[205px]")
              }
              amount={preloaderAmount}
            />
          </>
        )}
      </div>
    </div>
  );
}
