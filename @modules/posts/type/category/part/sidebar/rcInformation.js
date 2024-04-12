import api from "pages/api/service/api";
import { useEffect, useState } from "react";

export default function RcInformation({ rcId }) {
  const [rc, setRc] = useState();

  useEffect(() => {
    (async function fetchRc() {
      const rcArr = await api.get.rcs({
        window_host: window.location.origin,
        filter: {
          id: rcId,
          published: "1",
        },
        sort: {
          id: "asc",
        },
        limit: "all",
      });

      setRc(rcArr[0]);
    })();
  }, []);

  return (
    <div className="p-2.5 lg:p-0 lg:pb-5 border-b border-greyborder">
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className="min-w-[40px] min-h-[40px] rounded-full bg-blue"></div>
        <div className="font-extrabold">{rc?.name}</div>
      </div>

      <div className="text-sm font-bold mb-2.5">{rc?.address}</div>
      {/* <div className="text-sm max-h-[300px] overflow-hidden">{rc?.description}</div>{rc?.description && <>...</>} */}
      <div className="text-sm">{rc?.description}</div>
    </div>
  );
}
