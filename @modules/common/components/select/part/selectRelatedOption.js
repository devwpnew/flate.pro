import api from "pages/api/service/api";
import { useEffect, useState } from "react";

import Link from "next/link";

import Preloader from "../../preloader/preloader";

export default function SelectRelatedOption({ option }) {
  // const [isLoading, setIsLoading] = useState(true);
  // const [count, setCount] = useState(null);

  // useEffect(() => {
  //   (async () => {
  //     setIsLoading(true);
  //     const res = await api.get.rcProdCount(option.id);
  //     setCount(res?.count ? res.count : null);
  //     setIsLoading(false);
  //   })();
  // }, []);

  return (
    <Link href={`/rcs/${option.id}`}>
      <div
        className={`relative flex items-center select-none py-2 px-[6px] mx-[6px] mb-[2px] rounded-md cursor-pointer transition-all text-blue hover:bg-greyF3 hover:text-primary focus:bg-bluelighter`}
        value={option}
      >
        <span>{option.name}</span>

        {/* {isLoading ? (
          <div className="flex ml-2.5 w-2.5 h-2.5">
            <Preloader />
          </div>
        ) : (
          <span className="inline-block ml-2.5">{count}</span>
        )} */}
      </div>
    </Link>
  );
}
