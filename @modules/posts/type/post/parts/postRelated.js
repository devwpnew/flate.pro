import { useMemo } from "react";

import Link from "next/link";

import H2 from "@modules/common/components/heading/h2";
import Button from "@modules/common/components/button/button";
import ProductItem from "../../product/components/item/productItem";

import Preloader from "@modules/common/components/preloader/preloader";

import useProductsCountRelated from "hooks/products/useProductsCountRelated";
import useProductsRelated from "hooks/products/useProductsRelated";
import declension from "helpers/formatters/declension";
import getLayout from "helpers/getLayout";

export default function PostRelated({
  rcLink,
  buildingLink,
  product_id,
  price,
  area,
  wrapperClassName = "",
}) {
  const { DESKTOP } = getLayout();

  const href = rcLink ? `/rcs/${rcLink.id}` : `/building/${buildingLink.id}`;

  const filter = {
    published: "1",
  };

  if (rcLink) {
    filter["rc_link"] = rcLink.id;
  }

  if (buildingLink) {
    filter["building_link"] = buildingLink.id;
  }

  if (!buildingLink && !rcLink) {
    filter["rc_link"] = 99999;
  }

  const related = useProductsRelated(
    useMemo(() => {
      return {
        filter: {
          id: `!=${product_id}`,
          ...filter,
        },
        filter_related: {
          id: `!=${product_id}`,
          published: "1",
          area_link: area,
          product_price: price,
        },
        limit: 3,
      };
    }, [])
  );

  const relatedCount = useProductsCountRelated(
    useMemo(() => {
      return { ...filter };
    }, [])
  );

  return (
    <>
      {related?.isLoading ? (
        <div className="h-[425px] w-full">
          <Preloader />
        </div>
      ) : (
        <>
          {related?.data &&
            related?.data?.length &&
            relatedCount?.products?.count > 0 && (
              <div className={wrapperClassName}>
                <H2>
                  {related?.isOther ? "Другие предложения" : "Ещё в этом доме"}
                </H2>
                <div className="lg:shadow-md lg:rounded-[4px] bg-greylight">
                  <div className="bg-greylight">
                    <div className="flex flex-col gap-2.5 mb-2.5">
                      {related?.data.map((item) => {
                        return (
                          <ProductItem
                            key={item.id}
                            product={item}
                            layout={"horisontal"}
                          />
                        );
                      })}
                    </div>

                    {!related?.isOther && (
                      <Link href={href}>
                        <a className="block lg:mb-2.5 lg:pb-2.5 lg:mx-2">
                          <Button
                            type={"white"}
                            className={"mt-2.5 p-2.5 max-w-full w-full"}
                          >
                            <span className="font-bold">
                              Посмотреть {relatedCount.products.count}{" "}
                              {declension(relatedCount.products.count, [
                                "объявление",
                                "объявления",
                                "объявлений",
                              ])}
                            </span>
                          </Button>
                        </a>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
        </>
      )}
    </>
  );
}
