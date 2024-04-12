import { motion } from "framer-motion";

import Link from "next/link";

import Container from "@modules/common/components/container/container";

import ProductsEmpty from "@modules/posts/type/product/components/part/productsEmpty";
import ProductContainer from "@modules/posts/type/product/components/template/productsContainer";

import BackButton from "@modules/common/components/button/backButton";
import PreloaderSpinner from "@modules/common/components/preloader/preloaderSpinner";

import ProductItem from "@modules/posts/type/product/components/item/productItem";

import getLayout from "helpers/getLayout";
import FavoritesEmpty from "@modules/posts/type/product/components/part/favoritesEmpty";
import MobilePageHeader from "@modules/layout/components/common/mobilePageHeader";
import MotionContainer from "@modules/common/components/container/motionContainer";

export default function favoritesContent({
  favorites,
  isLoading,
  setIsLoading,
  setProducts,
  setSort,
}) {
  const { MOBILE, DESKTOP, VARIANTS } = getLayout();
  return (
    <MotionContainer>
      {MOBILE && <MobilePageHeader href={"/user/profile"} title="Избранное" />}

      <div className="flex flex-col gap-1 sm:container mx-auto px-[15px] lg:px-0">
        <ProductContainer
          containerClassName="flex flex-col gap-1 w-full"
          products={favorites?.length ? favorites : null}
          hotDeals={false}
          isLoading={isLoading}
          preloaderAmount={10}
          callback={setProducts}
          layout="favorite"
          fallbackComponent={<FavoritesEmpty />}
          sortCallback={setSort}
        />
      </div>
    </MotionContainer>
  );
}
