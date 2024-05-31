import Image from "next/image";
import LinkWrap from "@modules/common/components/link/linkWrap";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setFilterVisibility } from "store/global/filter/filterVisibility";
import { useSelector } from "react-redux";

import { useEffect } from "react";

import { RiSearchFill } from "react-icons/ri";

export default function SearchButton({ icon, width, height, className }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const link = `/posts/flats`;
    const filterVisibility = useSelector(
        (state) => state.filterVisibility.value
    );



    return (
        <>
            {(router?.query?.section_slug !== "flats" &&
                router?.query?.section_slug !== "houses" &&
                router?.query?.section_slug !== "land" &&
                router?.query?.section_slug !== "commertion" &&
                router?.query?.section_slug !== "parkings") ||
            router?.query?.product_slug ? (
                <div
                    onClick={() => {
                        router.push({ pathname: link, query: { search: 1 } });
                    }}
                >
                    <RiSearchFill className={className} />
                    <p className="text-[.7rem]">Поиск</p>
                </div>
            ) : (
                <div
                    onClick={() =>
                        dispatch(setFilterVisibility(!filterVisibility))
                    }
                >
                    <RiSearchFill className={className} />
                    <p className="text-[.7rem]">Поиск</p>
                </div>
            )}
        </>
    );
}
