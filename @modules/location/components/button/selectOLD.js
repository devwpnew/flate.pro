import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";

import ModalChangeCity from "../modal/city";

export default function citySelect({ style }) {
  let [openLocationModal, setLocationModal] = useState(false);
  const openModal = () => setLocationModal(true);
  const closeModal = () => setLocationModal(false);

  return (
    <>
      <div onClick={openModal}>
        <div className="relative w-full">
          <div className="w-full">
            <div
              className={`flex px-2.5 border-greylight hover:border-blue border rounded bg-white relative w-full overflow-hidden before:text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 cursor-pointer ${style} hover:shadow-lg`}
            >
              <div
                className={`w-full my-auto flex flex-row items-center justify-between`}
              >
                Сочи
                <ChevronDownIcon
                  className="-mr-1 ml-2 h-4 w-4"
                 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalChangeCity state={openLocationModal} onClose={closeModal} />
    </>
  );
}
