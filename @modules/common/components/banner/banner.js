import { getCookie } from "cookies-next";
import api from "pages/api/service/api";
import { useEffect, useState } from "react";

export default function Banner({ Component, type, id, isStatic }) {
  const [isClosed, setClosed] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    if (isStatic) {
      setClosed(false);
      return;
    }

    setIsLoading(true);
    fetchBanner();
    setIsLoading(false);
  }, []);

  async function fetchBanner() {
    if (!window) return;

    const bannerArr = await api.get.banners({
      window_host: window.location.origin,
      filter: {
        id: id,
      },
      sort: {
        id: "asc",
      },
      limit: "all",
    });

    const bannerForm = bannerArr[0];

    const curDate = new Date();
    const bannerDateTo = new Date(bannerForm.date_active_to);

    const cookie = getCookie(`banner-${type}`);

    if (
      bannerForm?.active === false ||
      curDate > bannerDateTo ||
      cookie === "closed"
    ) {
      setClosed(true);
    } else {
      setBanner(bannerForm);
      setClosed(false);
    }
  }

  return (
    <div className={isStatic ? "" : "hidden lg:block"}>
      <Component
        isClosed={isClosed}
        setClosed={setClosed}
        banner={banner}
        isLoading={isLoading}
        type={type}
      />
    </div>
  );
}
