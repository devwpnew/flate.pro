import API from "pages/api/service/api";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import ProfileSidebarTemplate from "@modules/user/components/profile/template/profileSidebarTemplate";
import Container from "@modules/common/components/container/container";

import ItemsContent from "./itemsContent";
import EditItemTemplate from "./editItemTemplate";

import getLayout from "helpers/getLayout";
import sortProducts from "helpers/products/sortProducts";

export default function ItemsTemplate({ editTemplate, productId }) {
  const fetchState = useSelector((state) => state.fetchTrigger.value);
  const user = useSelector((state) => state.userLogin.value);

  const { MOBILE } = getLayout();

  const [isLoading, setIsLoading] = useState(false);

  const [sort, setSort] = useState(null);
  const [products, setProducts] = useState(null);
  const [productsModerated, setProductsModerated] = useState(null);
  const [productsArchive, setProductsArchive] = useState(null);

  useEffect(() => {
    (async function fetchProducts() {
      const sortParam =
        sort?.sort && Object.keys(sort.sort).length > 0
          ? { ...sort.sort }
          : { date_sort: "DESC" };

      if (sortParam?.rc_link) {
        const rcLinkSortedProducts = sortProducts(sort, products);
        const rcLinkSortedModerated = sortProducts(sort, productsModerated);
        const rcLinkSortedArchive = sortProducts(sort, productsArchive);

        setProducts(rcLinkSortedProducts);
        setProductsModerated(rcLinkSortedModerated);
        setProductsArchive(rcLinkSortedArchive);

        return;
      }

      setIsLoading(true);

      const moderated = await API.get.product.list({
        window_host: window.location.origin,
        sort: { ...sortParam },
        filter: {
          user_id: user.id,
          published: "0",
        },
      });

      const canceled = await API.get.product.list({
        window_host: window.location.origin,
        sort: { ...sortParam },
        filter: {
          user_id: user.id,
          published: "3",
        },
      });

      const products = await API.get.product.list({
        window_host: window.location.origin,
        sort: { ...sortParam },
        filter: {
          published: 1,
          user_id: user.id,
        },
        limit: "all",
      });

      const archived = await API.get.product.list({
        window_host: window.location.origin,
        sort: { ...sortParam },
        filter: {
          user_id: user.id,
          published: "2",
        },
      });

      const tmpProducts = [];

      if (canceled && Array.isArray(canceled)) {
        tmpProducts.push(...canceled);
      }

      if (moderated && Array.isArray(moderated)) {
        tmpProducts.push(...moderated);
      }

      if (products && Array.isArray(products)) {
        setProducts(products);
      } else {
        setProducts(null);
      }

      if (archived && Array.isArray(archived)) {
        setProductsArchive(archived);
      } else {
        setProductsArchive(null);
      }

      setProductsModerated(tmpProducts?.length > 0 ? tmpProducts : null);

      setIsLoading(false);
    })();
  }, [fetchState, sort]);

  return (
    <>
      {MOBILE ? (
        editTemplate ? (
          <EditItemTemplate productId={productId} />
        ) : (
          <div className="flex flex-col w-full">
            <ItemsContent
              setSort={setSort}
              productsModerated={productsModerated}
              productsArchive={productsArchive}
              products={products}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setProducts={setProducts}
              setProductsArchive={setProductsArchive}
              setProductsModerated={setProductsModerated}
            />
          </div>
        )
      ) : (
        <Container>
          <div className="flex items-start gap-4 md:mt-4 lg:mt-5">
            <ProfileSidebarTemplate />
            {editTemplate ? (
              <EditItemTemplate productId={productId} />
            ) : (
              <div className="flex flex-col w-full">
                <ItemsContent
                  setSort={setSort}
                  productsModerated={productsModerated}
                  productsArchive={productsArchive}
                  products={products}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  setProducts={setProducts}
                  setProductsArchive={setProductsArchive}
                  setProductsModerated={setProductsModerated}
                />
              </div>
            )}
          </div>
        </Container>
      )}
    </>
  );
}
