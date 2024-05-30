import API from "pages/api/service/api";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

export default function PostProperties({ product }) {


    const [displayProperties, setDisplayProperties] = useState(false);
    const user = useSelector((state) => state.userLogin.value);
    const router = useRouter();
    const slug = router.query.section_slug;

    const props = getCurrentDisplayProperties(slug);
    // console.log(props);
    useEffect(() => {
        (async () => {
            if (props && props.length > 0) {
                setDisplayProperties(
                    await API.get.product.displayProperties(props, product)
                );
            }
        })();
    }, []);

    const title = () => {
        if (slug == "houses") {
            return "О доме";
        }

        if (slug == "flats") {
            return "О квартире";
        }

        if (slug == "place") {
            return "Об участке";
        }

        if (slug == "commertion") {
            return "О коммерции";
        }

        if (slug == "parkings") {
            return "О паркинге";
        }
    };

    return (
        <>
            <div className="block">
                <hr className="border-[#E5E5E5] my-3" />

                {/* <span className="block text-xl font-bold mb-2 md:mb-5">{title()}</span> */}
                <div className="flex justify-center text-center md:text-left md:flex gap-[20px]">
                    {currentDisplayPropertiesMain(product, slug)}
                </div>

                <hr className="border-[#E5E5E5] my-3" />
                
                <div className="grid grid-cols-2 md:flex gap-x-[20px] flex-wrap text-sm leading-6 w-full">
                    {displayProperties && displayProperties.map((prop) => {
                            if (prop && prop?.display_value) {
                                if (
                                    !user &&
                                    prop?.code === "comission_sum_terms"
                                )
                                    return;
                                return (
                                    <div
                                        key={prop.code}
                                        className="flex basis-[45%] gap-2 relative"
                                    >
                                        <span className="bg-white text-grey whitespace-nowrap">
                                            {prop.display_name}
                                        </span>
                                        {/* <div className="dashed absolute left-0 bottom-[7px] w-full h-[1px] -z-10"></div> */}
                                        <span className="bg-white whitespace-nowrap font-bold truncate">
                                            {prop.display_value}
                                        </span>
                                    </div>
                                );
                            }
                        })}

                    {product?.cloud_links && (
                        <div className="flex basis-[45%] gap-2 relative overflow-hidden">
                            <span className="bg-white text-grey whitespace-nowrap">
                                Ссылка на облако
                            </span>
                            {/* <div className="dashed absolute left-0 bottom-[7px] w-full h-[1px] -z-10"></div> */}
                            <a
                                target="_blank"
                                href={product?.cloud_links}
                                className="bg-white whitespace-nowrap text-underline text-blue"
                            >
                                Перейти
                            </a>
                        </div>
                    )}

                    {product?.youtube_video_link && (
                        <div className="flex basis-[45%] gap-2 relative overflow-hidden">
                            <span className="bg-white text-grey whitespace-nowrap">
                                Ссылка на ютуб
                            </span>
                            {/* <div className="dashed absolute left-0 bottom-[7px] w-full h-[1px] -z-10"></div> */}
                            <a
                                target="_blank"
                                href={product?.youtube_video_link}
                                className="bg-white whitespace-nowrap text-underline text-blue"
                            >
                                Перейти
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

const getCurrentDisplayProperties = (slug) => {
    
	if (slug == "houses") {
        return [
            // { code: "comission", display_name: "Комиссия" },
            { code: "house_types", display_name: "Вид" },
            { code: "house_floors", display_name: "Этажей в доме" },
            { code: "house_construction", display_name: "Конструкция" },
            { code: "house_communication", display_name: "Коммуникации" },
            { code: "comission_sum_terms", display_name: "Комиссия" },
            { code: "off_comission_value", display_name: "Условия комиссии" },
            { code: "repairment", display_name: "Ремонт" },
            { code: "sum_contract", display_name: "Сумма в договоре" },
            { code: "mortgage", display_name: "Ипотека" },
        ];
    }

    if (slug == "flats") {
        return [
            { code: "status", display_name: "Статус" },
            { code: "handed_over", display_name: "Дом сдан" },
            // { code: "comission", display_name: "Комиссия" },
            { code: "comission_sum_terms", display_name: "Комиссия" },
            { code: "off_comission_value", display_name: "Условия комиссии" },
            { code: "repairment", display_name: "Ремонт" },
            { code: "sum_contract", display_name: "Сумма в договоре" },
            { code: "mortgage", display_name: "Ипотека" },
        ];
    }

    if (slug == "place") {
        return [
            { code: "sum_contract", display_name: "Сумма в договоре" },
            { code: "status_lands", display_name: "Статус" },
            { code: "house_communication", display_name: "Коммуникации" },
            // { code: "comission", display_name: "Комиссия" },
            { code: "comission_sum_terms", display_name: "Комиссия" },
            { code: "off_comission_value", display_name: "Условия комиссии" },
            { code: "repairment", display_name: "Ремонт" },
            { code: "sum_contract", display_name: "Сумма в договоре" },
            { code: "mortgage", display_name: "Ипотека" },
        ];
    }

    if (slug == "commertion") {
        return [
            { code: "commercial_types", display_name: "Вид" },
            // { code: "comission", display_name: "Комиссия" },
            { code: "comission_sum_terms", display_name: "Комиссия" },
            { code: "off_comission_value", display_name: "Условия комиссии" },
            { code: "repairment", display_name: "Ремонт" },
            { code: "sum_contract", display_name: "Сумма в договоре" },
            { code: "mortgage", display_name: "Ипотека" },
        ];
    }

    if (slug == "parkings") {
        return [
            { code: "parking_types", display_name: "Вид" },
            // { code: "comission", display_name: "Комиссия" },
            { code: "comission_sum_terms", display_name: "Комиссия" },
            { code: "off_comission_value", display_name: "Условия комиссии" },
            { code: "repairment", display_name: "Ремонт" },
            { code: "sum_contract", display_name: "Сумма в договоре" },
            { code: "mortgage", display_name: "Ипотека" },
        ];
    }

    if (slug == "land") {
        return [
            { code: "status_lands", display_name: "Статус" },
            // { code: "comission", display_name: "Комиссия" },
            { code: "comission_sum_terms", display_name: "Комиссия" },
            { code: "off_comission_value", display_name: "Условия комиссии" },
            { code: "repairment", display_name: "Ремонт" },
            { code: "sum_contract", display_name: "Сумма в договоре" },
            { code: "mortgage", display_name: "Ипотека" },
        ];
    }
};

const currentDisplayPropertiesMain = (product, slug) => {
    if (slug == "houses") {
        return (
            <>
                {product.living_squares && (
                    <div className="block w-1/3">
                        <div className="text-grey text-sm">Площадь дома</div>
                        <div className="text-[16px] font-bold">
                            {product.living_squares} м²
                        </div>
                    </div>
                )}

                {product.land_squares && (
                    <div className="block w-1/3">
                        <div className="text-grey text-sm">Площадь участка</div>
                        <div className="text-[16px] font-bold">
                            {product.land_squares} соток
                        </div>
                    </div>
                )}

            </>
        );
    } else if (slug == "flats") {
        return (
            <>
                {product.living_squares && (
                    <div className="block w-1/3">
                        <div className="text-grey text-sm">Площадь</div>
                        <div className="text-[16px] font-bold">
                            {product.living_squares} м²
                        </div>
                    </div>
                )}

                {product.properties && product.properties.product_floor && (
                    <div className="block w-1/3">
                        <div className="text-grey text-sm">Этаж</div>
                        <div className="text-[16px] font-bold">
                            {product.properties.product_floor}
                            {product?.flat_floors &&
                                ` из ${product.flat_floors}`}
                        </div>
                    </div>
                )}

                {product?.product_room_count ||
                product.product_room_count === 0 ? (
                    <div className="block w-1/3">
                        <div className="text-grey text-sm">
                            Комнат
                        </div>
                        <div className="text-[16px] font-bold">
                            {product.product_room_count === 0 ? "1" : ""}
                            {product.product_room_count === 1 ? "2" : ""}
                            {product.product_room_count === 2 ? "3" : ""}
                            {product.product_room_count === 3 ? "4" : ""}
                            {product.product_room_count === 4 ? "5" : ""}
                            {product.product_room_count === 5 ? "Студия" : ""}
                            {product.product_room_count === 6
                                ? "Свободная планировка"
                                : ""}
                        </div>
                    </div>
                ) : (
                    ""
                )}
            </>
        );
    } else if (slug == "place") {
        return (
            <>
                {product.land_squares && (
                    <div className="block w-1/3">
                        <div className="text-grey text-sm">Общая площадь</div>
                        <div className="text-xl font-bold">
                            {product.land_squares} га
                        </div>
                    </div>
                )}
            </>
        );
    } else if (slug == "commertion") {
        return (
            <>
                {product.object_squares && (
                    <div className="block w-1/3">
                        <div className="text-grey text-sm">Общая площадь</div>
                        <div className="text-xl font-bold">
                            {product.object_squares} м²
                        </div>
                    </div>
                )}
            </>
        );
    }

    if (slug == "parkings") {
        return (
            <>
                {product.object_squares && (
                    <div className="block">
                        <div className="text-grey text-sm">Общая площадь</div>
                        <div className="text-xl font-bold">
                            {product.object_squares} м²
                        </div>
                    </div>
                )}
            </>
        );
    }

    if (slug == "land") {
        return (
            <>
                {product.land_squares && (
                    <div className="block">
                        <div className="text-grey text-sm">Площадь участка</div>
                        <div className="text-xl font-bold">
                            {product.land_squares} соток
                        </div>
                    </div>
                )}
            </>
        );
    }
};
