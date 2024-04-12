import API from "pages/api/service/api";
import { useState, useEffect } from "react";

import formattedFilterProps from "helpers/filter/formattedFilterProps";
import { useRouter } from "next/router";

export default function useFilterProps(arrayFields) {
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setProps] = useState(null);

  async function getProps(arrayFields) {
    const resObj = {}
    
    for(let i = 0; i < arrayFields.length; i++) {
      const field = arrayFields[i];
      const req = await API.get.fieldInfo("product", field);

      resObj[field] = req
    }

    for (const property in resObj) {
      resObj[property] = formattedFilterProps(resObj[property].descObj.result_options);
    }

    return resObj;
  }

  useEffect(() => {
    (async function () {
      try {
        setError(null);
        setLoading(true);
        const response = await getProps(arrayFields);
        setProps(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  return { data, error, isLoading };
}
