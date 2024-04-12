import { useMemo } from "react";

import Image from "next/image";
import Link from "next/link";
import Preloader from "@modules/common/components/preloader/preloader";

import declension from "helpers/formatters/declension";
import useProductsCount from "hooks/products/useProductsCount";
import emptyThumb from "public/thumb-not-found.jpg";

const getImage = (json) => {
  if (json) {
    const image = JSON.parse(json);
    // console.log(image);
    return "https://flate.pro/" + image[0];
  }
};

export default function PostJkInfo({ rc_link, building_link }) {
  const link = rc_link ? rc_link : building_link;
  const href = rc_link ? `/rcs/${rc_link.id}` : `/building/${building_link.id}`;
  const filter = { published: "1" };

  if (rc_link) {
    filter["rc_link"] = rc_link.id;
  }

  if (building_link) {
    filter["building_link"] = building_link.id;
  }

  const rcItemsCount = useProductsCount(
    useMemo(() => {
      return { ...filter };
    }, [])
  );
  // console.log(getImage(rc_link.images));

  // console.log(link, "link");

  const isShowLink = () => {
    if (rc_link) {
      if (rc_link?.published !== 0) {
        return true;
      } else {
        return false;
      }
    } else {
      if (building_link) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="flex flex-col gap-2.5 py-2.5 md:rounded bg-greylight shadow-md p-2.5 mb-5 md:mb-10">
      <div className="flex items-center gap-2.5">
        {rc_link && (
          <>
            {isShowLink() ? (
              <Link href={href}>
                <a>
                  <div className="w-[162px] h-[150px]">
                    <div className="flex items-center justify-center w-full h-full rounded  overflow-hidden">
                      {rc_link.images ? (
                        <Image
                          className="object-cover object-center"
                          src={getImage(rc_link.images)}
                          width={162}
                          height={150}
                          unoptimized={true}
                        />
                      ) : (
                        <Image
                          className="object-cover object-center"
                          src={emptyThumb}
                          width={162}
                          height={150}
                        />
                      )}
                    </div>
                  </div>
                </a>
              </Link>
            ) : (
              <span>
                <div className="w-[162px] h-[150px]">
                  <div className="flex items-center justify-center w-full h-full rounded  overflow-hidden">
                    {rc_link.images ? (
                      <Image
                        className="object-cover object-center"
                        src={getImage(rc_link.images)}
                        width={162}
                        height={150}
                        unoptimized={true}
                      />
                    ) : (
                      <Image
                        className="object-cover object-center"
                        src={emptyThumb}
                        width={162}
                        height={150}
                      />
                    )}
                  </div>
                </div>
              </span>
            )}
          </>
        )}

        <div className="flex flex-col gap-2">
          {isShowLink() ? (
            <Link href={href}>
              <a>
                <span className="font-bold">«{link.name}»</span>
              </a>
            </Link>
          ) : (
            <span className="font-bold">«{link.name}»</span>
          )}

          {rc_link && (
            <span className="text-sm">
              {link?.status === 1 ? "Сдан" : "Не сдан"}
            </span>
          )}

          {link?.build_year && (
            <span className="text-sm">Год постройки: {link?.build_year}</span>
          )}

          {link?.builder && (
            <span className="text-sm">Застройщик: {link?.builder}</span>
          )}

          {!rcItemsCount.isLoading && rcItemsCount?.products?.count ? (
            <>
              {isShowLink() ? (
                <Link href={href}>
                  <span className="text-sm text-blue cursor-pointer hover:underline">
                    {rcItemsCount?.products?.count &&
                    rcItemsCount.products.count == 1
                      ? "Нет предложений кроме текущего"
                      : rcItemsCount.products.count +
                        " " +
                        declension(rcItemsCount.products.count, [
                          "квартира",
                          "квартиры",
                          "квартир",
                        ]) +
                        " в продаже"}
                  </span>
                </Link>
              ) : (
                <span className="text-sm text-blue">
                  {rcItemsCount?.products?.count &&
                  rcItemsCount.products.count == 1
                    ? "Нет предложений кроме текущего"
                    : rcItemsCount.products.count +
                      " " +
                      declension(rcItemsCount.products.count, [
                        "квартира",
                        "квартиры",
                        "квартир",
                      ]) +
                      " в продаже"}
                </span>
              )}
            </>
          ) : (
            <div className="w-full h-[21px]">
              <Preloader />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
