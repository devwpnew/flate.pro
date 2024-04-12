import api from "pages/api/service/api";

import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

import Preloader from "@modules/common/components/preloader/preloader";
import SelectRelatedInAdd from "@modules/common/components/select/selectRelatedInAdd";

export default function FieldRc({ setRcId, defaultRc }) {
  const fetchState = useSelector((state) => state.fetchTrigger.value);

  const [rc, setRc] = useState(null);

  const [isLoading, seIsLoading] = useState(true);
  const [rcList, serRcList] = useState(false);

  useEffect(() => {
    (async function fetchRc() {
      seIsLoading(true);
      const rcList = [];

      const moderated = await api.get.rcs({
        filter: { published: "0" },
        limit: "all",
      });

      if (moderated && moderated.length) {
        rcList.push(...moderated);
      }

      const active = await api.get.rcs({
        filter: { published: "1" },
        limit: "all",
      });

      if (active && active.length) {
        rcList.push(...active);
      }

      if (rcList?.length > 0) {
        serRcList(rcList);
      } else {
        serRcList([{ name: "", id: null }]);
      }

      seIsLoading(false);
    })();
  }, [fetchState]);

  useEffect(() => {
    if (rc) {
      setRcId(rc.value);
    }
  }, [rc]);

  const newRcChoose = async (data) => {
    let getRcInfo = false;
    if (data && data.itemId) {
      getRcInfo = await api.get.rcs({ filter: { id: data.itemId }, limit: 1 });
    } else if(data.value) {
      getRcInfo = await api.get.rcs({ filter: { id: data.value }, limit: 1 });
    }
    if (getRcInfo) {
      setRc(getRcInfo.id);
    }
  };

  return (
    <div className="h-10 min-w-[300px] md:max-w-[300px]">
      {isLoading ? (
        <Preloader />
      ) : rcList ? (
        <>
          <SelectRelatedInAdd
            callback={setRc}
            rcAddedCallback={newRcChoose}
            addCallback={newRcChoose}
            style={"h-full w-full"}
            field="name"
            options={rcList}
            defaultInputValue={defaultRc?.name}
            placeholder={"Укажите ЖК (если есть)"}
          />
        </>
      ) : (
        ""
      )}
    </div>
  );
}
