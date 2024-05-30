import API from "pages/api/service/api";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import H1 from "@modules/common/components/heading/h1";
import MotionContainer from "@modules/common/components/container/motionContainer";
import Container from "@modules/common/components/container/container";
import Preloader from "@modules/common/components/preloader/preloader";
import BackButton from "@modules/common/components/button/backButton";
import SearchForm from "@modules/search/components/searchForm";
import CategoryOutput from "../part/categoryOutput";

import getLayout from "helpers/getLayout";
import ProductsSortSelect from "../../product/components/template/part/productsSortSelect";

export default function CategoryTemplate({
    userId,
    userLink,
    rcLink,
    buildingLink,
    sectionId,
    section,
    rcId,
    isRow,
}) {
    const { DESKTOP } = getLayout();

    const router = useRouter();
    const isRowTemplate = router.query?.row || isRow;

    const fetchState = useSelector((state) => state.fetchTrigger.value);
    const activeCity = useSelector((state) => state.userCity.value);

    const [cityInNameIsLoading, setCityInNameIsLoading] = useState(true);
    const [cityInName, setCityInName] = useState(null);

    const [productsAmount, setProductsAmount] = useState(null);
    const [productsAmountLoading, setProductsAmountLoading] = useState(false);

    useEffect(() => {
        (async function getInName() {
            setCityInNameIsLoading(true);
            const city = await API.get.cities({
                window_host: window.location.origin,
                filter: {
                    id: activeCity.id,
                },
            });
            setCityInName(city[0].in_name);
            setCityInNameIsLoading(false);
        })();
    }, [activeCity, fetchState]);

    const getTitle = () => {
        if (rcId) {
            return (
                <>
                    {cityInNameIsLoading ? (
                        <div className="min-w-[250px] h-12">
                            <Preloader />
                        </div>
                    ) : (
                        <>{rcLink.name}</>
                    )}
                </>
            );
        }

        if (userId) {
            return (
                <>
                    {cityInNameIsLoading ? (
                        <div className="min-w-[250px] h-12">
                            <Preloader />
                        </div>
                    ) : (
                        <>{userLink.user_name}</>
                    )}
                </>
            );
        }

        if (buildingLink) {
            return (
                <>
                    {cityInNameIsLoading ? (
                        <div className="min-w-[250px] h-12">
                            <Preloader />
                        </div>
                    ) : (
                        <>{buildingLink.name}</>
                    )}
                </>
            );
        }

        return (
            <>
                {cityInNameIsLoading ? (
                    <div className="min-w-[250px] h-12">
                        <Preloader />
                    </div>
                ) : (
                    <>
                        {getSectionName(section.name)} в {cityInName}
                    </>
                )}
            </>
        );
    };

    const [isStartFilter, setIsStartFilter] = useState(false);
    const [sort, setSort] = useState(false);
    // console.log(isStartFilter);
    return (
        <MotionContainer>
            <div className="relative">
                {/* <div className="bg-greylight p-4 border-b-[1px] border-greyborder flex w-full">
          {!DESKTOP && <BackButton href={"/"} />}
          <div className="w-full md:container md:mx-auto md:pr-[16px]">
            <SearchForm />
          </div>
        </div> */}

                <div className="container mx-auto relative">
                    {/* {!rcId && !userId && ( */}
                    <>
                        <Container>
                            <div className="flex justify-between flex-wrap gap-2.5 items-center py-5">
                                <H1 additionalClass="flex flex-row flex-nowrap items-center gap-2">
                                    {getTitle()}{" "}
                                    <span className="text-grey">
                                        {productsAmountLoading ? (
                                            <div className="inline">
                                                <div className="w-[30px] h-[48px]">
                                                    <Preloader />
                                                </div>
                                            </div>
                                        ) : (
                                            productsAmount
                                        )}
                                    </span>
                                </H1>

                                {isStartFilter && (
                                    <ProductsSortSelect callback={setSort} />
                                )}
                            </div>
                        </Container>
                    </>
                    {/* )} */}

                    <div className="lg:container lg:mx-auto lg:px-[15px]">
                        <div className="lg:flex lg:items-start lg:gap-5">
                            <CategoryOutput
                                isRow={isRowTemplate}
                                rcId={rcId}
                                buildingId={buildingLink?.id}
                                userId={userId}
                                sectionId={sectionId}
                                productsAmountLoading={productsAmountLoading}
                                setProductsAmountCallback={setProductsAmount}
                                setProductsAmountLoadingCallback={
                                    setProductsAmountLoading
                                }
                                setIsFilter={setIsStartFilter}
                                sort={sort}
                                setSort={setSort}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </MotionContainer>
    );
}

export const getSectionName = (name) => {
    if (name == "Квартиры") {
        return "Квартир";
    }

    if (name == "Дома") {
        return "Домов";
    }

    if (name == "Земля") {
        return "Участков";
    }

    if (name == "Коммерция") {
        return "Коммерции";
    }

    if (name == "Паркинги") {
        return "Паркинги";
    }

    if (name == "Поиск") {
        return "Поиск";
    }
};
