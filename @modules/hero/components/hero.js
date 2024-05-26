import API from "pages/api/service/api";
import { useSelector } from "react-redux";
import { useState, useEffect, useMemo } from "react";
import SearchForm from "@modules/search/components/searchForm";
import Container from "@modules/common/components/container/container";

import heroBackground from "public/backgrounds/home-hero.jpg";
import Preloader from "@modules/common/components/preloader/preloader";
import useProductsCount from "hooks/products/useProductsCount";

export default function Hero({ productsAmount }) {
  const activeCity = useSelector((state) => state.userCity.value);

  const productsCount = useProductsCount(
    useMemo(() => {
      return {
        published: 1,
        city_link: activeCity.id,
      };
    }, [activeCity])
  );

  // console.log(productsCount);

  return (
    <div
      style={{
        backgroundImage: `url(${heroBackground.src})`,
        width: "100%",
        height: "100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
      className="py-3 md:py-8 lg:pt-[65px] lg:pb-[82px]"
    >
      {/* <Container>
        <h1 className="text-white text-2xl md:text-3xl w-full font-bold mb-2.5 md:mb-5 inline-flex items-center">
          {productsCount.isLoading ? (
            <div className="inline-block h-[36px] md:h-[45px] w-2/3 lg:w-1/3 ">
              <Preloader />
            </div>
          ) : (
            <>
              Объектов в продаже – <>{productsCount.products.count}</>
            </>
          )}
        </h1>
        <span className="text-white text-base font-semibold block mb-2.5 md:mb-5">
          Найдите лучшее
        </span>
        <SearchForm />
      </Container> */}
    </div>
  );
}
