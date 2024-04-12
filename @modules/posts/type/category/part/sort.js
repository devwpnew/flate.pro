import { useState } from "react";

import Image from "next/image";

import OutsideAlerter from "hooks/useOutsideAlerter";
import SelectNoAutocomplete from "@modules/common/components/select/listBox/selectNoAutocomplete";
import sortIcon from "public/icons/sort-icon.svg";

import getLayout from "helpers/getLayout";
export default function Sort({ addCallback }) {
  const { MOBILE } = getLayout();

  const [isShow, setIsShow] = useState(false);

  return (
    <>
      {MOBILE ? (
        <OutsideAlerter action={() => setIsShow(false)}>
          <div className="relative">
            <Image
              src={sortIcon.src}
              width={sortIcon.width}
              height={sortIcon.height}
              onClick={() => setIsShow(!isShow)}
            />
            {isShow && (
              <div className="min-w-[235px] w-full h-11 absolute top-[23px] right-0">
                <SelectNoAutocomplete
                  style={"w-full h-11"}
                  name={"sort"}
                  addCallback={addCallback}
                  triggerFetchGlobalState={true}
                  options={[
                    {
                      name: "По дате ↓",
                      id: "date_created-asc",
                    },
                    {
                      name: "По дате ↑",
                      id: "date_created-desc",
                    },
                    {
                      name: "По алфавиту ↓",
                      id: "name-asc",
                    },
                    {
                      name: "По алфавиту ↑",
                      id: "name-desc",
                    },
                  ]}
                />
              </div>
            )}
          </div>
        </OutsideAlerter>
      ) : (
        <div className="max-w-[235px] w-full h-11">
          <SelectNoAutocomplete
            style={"w-full h-11"}
            name={"sort"}
            addCallback={addCallback}
            triggerFetchGlobalState={true}
            options={[
              {
                name: "По дате ↓",
                id: "date_created-asc",
              },
              {
                name: "По дате ↑",
                id: "date_created-desc",
              },
              {
                name: "По алфавиту ↓",
                id: "name-asc",
              },
              {
                name: "По алфавиту ↑",
                id: "name-desc",
              },
            ]}
          />
        </div>
      )}
    </>
  );
}
