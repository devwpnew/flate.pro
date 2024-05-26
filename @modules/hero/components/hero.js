import API from "pages/api/service/api";
import { useSelector } from "react-redux";
import { useState, useEffect, useMemo } from "react";
import SearchForm from "@modules/search/components/searchForm";
import Container from "@modules/common/components/container/container";

import heroBackground from "public/backgrounds/home-hero.jpg";
import Preloader from "@modules/common/components/preloader/preloader";
import useProductsCount from "hooks/products/useProductsCount";


import MenuCard from "@modules/hero/components/heroMenuCard";
import StoryCard from "@modules/hero/components/heroStoryCard";
import { FaApple } from "react-icons/fa";
import { BsGooglePlay } from "react-icons/bs";

export default function Hero({ productsAmount, desktop = false }) {
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


	const menuCards = [
		{
			link: "/posts/flats",
			title: "Квартиры",
			backgroundImage: "/cards/flat.png",
		},
		{
			link: "/posts/houses",
			title: "Дома",
			backgroundImage: "/cards/house.png",
		},
		{
			link: "/posts/land",
			title: "Земля",
			backgroundImage: "/cards/land.png",
		},
		{
			link: "/posts/commertion",
			title: "Коммерция",
			backgroundImage: "/cards/commerce.png",
		},
		{
			link: "/posts/parking",
			title: "Паркинг",
			backgroundImage: "/cards/parking.png",
		},
	]

    return (
        <div>
            <Container className="bg-red-300">
        
                <h1
                    className="
						md:hidden
						mb-[20px]
						max-w-[1140px] 
						text-[36px] lg:text-[55px] 
						leading-[110%] tracking-tight font-extrabold
					"
                >
                    Обмен вторичными предложениями среди риелторов
                </h1>

                <div
                    className="
						md:max-h-[300px]
						bg-gradient-to-r from-[#1479F5] to-[#00CF8A] 
						rounded-[20px] text-white
						grid md:grid-cols-2 md:gap-5
					"
                >
                    <h1
                        className="
							hidden md:block
							pt-[20px] px-[30px] md:px-[50px] 
							mt-[20px] md:mt-[30px] mb-[30px] 
							max-w-[1140px] 
							text-[36px] lg:text-[55px] 
							leading-[110%] tracking-tight font-extrabold
						"
                    >
                        Обмен вторичными предложениями среди риелторов
                    </h1>

                    <div className="flex justify-end items-center gap-5 px-[20px] md:px-0">
                        <div className="md:max-w-[250px]">
                            <p className="text-[14px] md:text-[20px] mb-3 max-w-[300px] md:max-w-[200px]md:max-w-auto">
                                Больше функций в мобильном приложении
                            </p>

                            <div className="flex gap-3">
                                <a
                                    href={"https://app.flate.pro"}
                                    target={"_blank"}
                                >
                                    <button className="text-[14px] px-5 py-3 bg-white rounded-[10px] text-blue">
                                        Скачать
                                    </button>
                                </a>
                                <div className="hidden md:flex gap-2 text-backdrop items-center">
                                    <FaApple className="text-[30px]" />
                                    <BsGooglePlay className="text-[24px]" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-[20px] md:pt-0 md:mr-[50px] md:mt-[30px] mt-auto order-first md:order-last">
                            <img
                                src="/iphone.png"
                                className="ml-auto mt-auto"
                            />
                        </div>
                    </div>
                </div>

                <div className="h-[20px] md:h-[40px]"></div>

                {/* Меню карточек mobile */}
                {!desktop && (
                    <div>
                        <div className="grid grid-cols-2 gap-[10px] lg:gap-[10px] mb-[10px]">
                            {menuCards.slice(0, 2).map((card) => (
                                <MenuCard
                                    className={`h-[100px]`}
                                    key={card.link}
                                    link={card.link}
                                    title={card.title}
                                    backgroundImage={card.backgroundImage}
                                />
                            ))}
                        </div>

                        <div className="grid grid-cols-3 gap-[10px] lg:gap-[10px]">
                            {menuCards.slice(2, 5).map((card) => (
                                <MenuCard
                                    className={`h-[90px]`}
                                    key={card.link}
                                    link={card.link}
                                    title={card.title}
                                    backgroundImage={card.backgroundImage}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {/* Меню карточек mobile */}

                {/* Меню карточек desktop */}
                {desktop && (
                    <div className="grid md:grid-cols-5 gap-[10px] lg:gap-[10px]">
                        {menuCards.map((card) => (
                            <MenuCard
                                className={`h-[120px]`}
                                key={card.link}
                                link={card.link}
                                title={card.title}
                                backgroundImage={card.backgroundImage}
                            />
                        ))}
                    </div>
                )}
                {/* Меню карточек desktop */}
            </Container>
        </div>
    );
}
