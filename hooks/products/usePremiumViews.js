import api from "pages/api/service/api";
import { useState, useEffect, useCallback } from "react";

export default function usePremiumViews(product) {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const updateProductViewCountPreview = useCallback(async () => {
    try {
      if (product?.premium > 0) {
        const res = await api.update.productViewCountPreview(product);

        setResponse(res);
      }
    } catch (err) {
      setError(err);
    }
  }, [product]);

  useEffect(() => {
    updateProductViewCountPreview();
  }, [updateProductViewCountPreview]);

  return { response, error };
}
