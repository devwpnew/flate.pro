import API from "pages/api/service/api";
import product from "pages/api/service/get/product";
import { object } from "prop-types";
import { useState, useEffect } from "react";

export default function useProducts(callback) {
  const [isEmpty, setIsEmpty] = useState(false);
  const [isOther, setIsOther] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setProducts] = useState(null);

  async function getProducts(params) {
    try {
      const requestParams = {
        window_host: params.window_host,
        filter: { ...params.filter },
        limit: params.limit,
      };
      const response = await API.get.product.list({ ...requestParams });

      if (Object.keys(response).includes("Error")) {
        return null;
      } else {
        return response;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  useEffect(() => {
    if (!isEmpty) {
      (async function () {
        try {
          setError(null);
          setLoading(true);
          const response = await getProducts({
            window_host: window.location.origin,
            ...callback,
          });

          if (!response) {
            setIsEmpty(true);
          }

          setProducts(response);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [callback]);

  useEffect(() => {
    if (isEmpty) {
      (async function () {
        try {
          setError(null);
          setLoading(true);

          const response = await getProducts({
            window_host: window.location.origin,
            filter: {
              id: callback.filter_related.id,
              published: "1",
              area_link: callback.filter_related.area_link,
              product_price: {
                from: callback.filter_related.product_price - 1000000,
                to: callback.filter_related.product_price + 1000000,
              },
            },
            limit: callback.limit,
          });

          setProducts(response);

          setIsOther(true);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [isEmpty]);

  return { data, error, isLoading, isOther };
}

// const activeCity = useSelector((state) => state.userCity.value);

// const products = useProducts(
//   useMemo(() => {
//     return {
//       filter: {
//         published: 1,
//         city_link: activeCity.id,
//       },
//     };
//   }, [activeCity])
// );
