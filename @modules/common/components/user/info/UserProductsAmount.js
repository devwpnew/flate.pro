import API from "pages/api/service/api";
import { useState, useEffect } from "react";

import Preloader from "../../preloader/preloader";

export default function UserProductsAmount({ userId }) {
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState(null);

  useEffect(() => {
    (async function getAmount() {
      setLoading(true);
      const tmp = await API.get.product.count({
        user_id: userId,
      });
      setAmount(tmp.count);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      {amount && !loading ? (
        <>{amount}</>
      ) : (
        <div className="h-[15px]">
          <Preloader />
        </div>
      )}
    </>
  );
}
