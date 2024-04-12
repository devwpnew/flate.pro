import API from "pages/api/service/api";
import { useState, useEffect } from "react";

export default function useSections(callback) {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setSections] = useState(null);

  async function getSections(params) {
    const requestParams = {
      ...params,
    };

    const response = await API.get.sections({ ...requestParams });
    return response;
  }

  useEffect(() => {
    (async function () {
      try {
        setError(null);
        setLoading(true);
        const response = await getSections({
          window_host: window.location.origin,
          ...callback,
        });
        setSections(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [callback]);

  return { data, error, isLoading };
}