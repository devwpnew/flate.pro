import { useState, useEffect } from "react";

import ButtonShare from "@modules/common/components/button/buttonShare";

import ProductsSortSelect from "./part/productsSortSelect";
import ProductItem from "@modules/posts/type/product/components/item/productItem";
import ProductsShowOnMap from "./part/ProductsShowOnMap";

import sortProducts from "helpers/products/sortProducts";
import declension from "helpers/formatters/declension";

export default function ProductsContainerRow({
  products,
  amount,
  callback,
  isSearchByUser,
}) {
  const [sort, setSort] = useState(null);

  useEffect(() => {
    updateSort();
  }, [sort]);

  const updateSort = () => {
    const result = sortProducts(sort, products);

    if (result) {
      callback(result);
    }
  };

  return (
    <>
      {products && products.length > 0 && (
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between w-full mb-2.5">
            <div className="font-bold">
              {amount && amount > 0 && (
                <span>
                  Найдено {amount}{" "}
                  {declension(amount, [
                    "объявление",
                    "объявления",
                    "объявлений",
                  ])}
                </span>
              )}
            </div>

            <div className="flex items-center justify-end flex-wrap lg:flex-nowrap gap-[5px] md:gap-[14px]">
              {isSearchByUser && <ButtonShare type="green">Поделиться профилем</ButtonShare>}

              <ProductsSortSelect callback={setSort} />
              <ProductsShowOnMap type="white" products={products} />
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {products.map((product) => (
              <ProductItem
                key={product.id}
                id={product.id}
                product={product}
                layout="row"
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
