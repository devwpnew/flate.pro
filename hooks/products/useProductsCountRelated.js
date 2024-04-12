import API from "pages/api/service/api";
import { useState, useEffect } from "react";

export default function useProductsCount(callback) {
  const [isOther, setIsOther] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState(null);

  async function getProducts(params) {
    const requestParams = {
      ...params,
    };

    const response = await API.get.product.count({ ...requestParams });
    return response;
  }

  useEffect(() => {
    (async function () {
      try {
        setError(null);
        setLoading(true);
        const response = await getProducts({
          window_host: window.location.origin,
          ...callback,
        });

        setProducts(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [callback]);

  useEffect(() => {
    if (products?.count == 1) {
      (async function () {
        try {
          setError(null);
          setLoading(true);
          const response = await getProducts({
            window_host: window.location.origin,
            published: "1",
          });

          setProducts(response);
          setIsOther(true)
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [error]);

  return { products, error, isLoading, isOther };
}

// const activeCity = useSelector((state) => state.userCity.value);

// const products = useProductsCount(
//   useMemo(() => {
//     return {
//       filter: {
//         published: 1,
//         city_link: activeCity.id,
//       },
//     };
//   }, [activeCity])
// );
