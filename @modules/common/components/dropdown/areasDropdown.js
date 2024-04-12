import API from "pages/api/service/api";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/solid";

import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import OutsideAlerter from "hooks/useOutsideAlerter";
import Input from "@modules/common/components/input/input";
import AreasDropdownContent from "@modules/common/components/dropdown/AreasDropdownContent";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import DialogWrapper from "../dialog/dialogWrapper";
import getLayout from "helpers/getLayout";
import DialogCloseIcon from "../dialog/dialogCloseIcon";

export default function AreasDropdown({
  className,
  areaIds,
  buttonClassName = "",
  returnActiveAreas,
  topTitle,
  isRight,
}) {
  const { MOBILE } = getLayout();
  const filterGlobalFields = useSelector(
    (state) => state.filterGlobalFields.value
  );
  const router = useRouter();
  const [isShow, setIsShow] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);

  const activeCity = useSelector((state) => state.userCity.value);

  const [areasTmp, setAreasTmp] = useState(null);
  const [areas, setAreas] = useState(null);

  const [activeAreas, setActiveAreas] = useState([]);
  const [isAreasLoading, setIsAreasLoading] = useState(true);

  useEffect(() => {
    (async function () {
      setIsAreasLoading(true);
      setAreas(await API.get.areasList(activeCity.id));

      setAreasTmp(
        await API.get.areas({
          window_host: window.location.origin,
          sort: {
            id: "asc",
          },
          limit: "all",
        })
      );

      setIsAreasLoading(false);
    })();
  }, [activeCity]);

  useEffect(() => {
    (function onAreasChange() {
      if (!areaIds || areaIds.length === 0) {
        setActiveAreas("");
        return;
      }

      const inputValue = [];

      if (areasTmp) {
        areasTmp.map((area) => {
          areaIds.map((areaId) => {
            if (area.id === areaId) {
              inputValue.push(area.name);
            }
          });
        });
      }

      const newActiveAreas = inputValue.join(", ");
      setActiveAreas(newActiveAreas);
    })();
  }, [areaIds, areas, areasTmp, filterGlobalFields]);

  const clearAreas = () => {
    setActiveAreas([]);
    returnActiveAreas([]);
  };

  const onModalClose = () => {
    setIsShow(false);
    setIsShowModal(false);
    clearAreas();
  };

  return (
    <>
      <OutsideAlerter action={() => setIsShow(false)}>
        <div className="relative">
          <button
            type="button"
            className={buttonClassName}
            onClick={() => {
              setIsShow((val) => !val);
              setIsShowModal(true);
            }}
          >
            <div className={`flex items-center relative h-full`}>
              <Input
                style={"h-full"}
                placeholder={"Выберите район"}
                value={activeAreas}
                inputStyle={"cursor-pointer px-0 bg-transparent"}
                topTitle={topTitle}
                disabled
              />
              <div className="absolute right-2.5 top-[15px]">
                <ChevronDownIcon className="-mr-1 ml-2 h-4 w-4" />
              </div>
            </div>
          </button>

          {!MOBILE && (
            <AnimatePresence>
              {isShow && (
                <motion.div
                  className={`z-50 absolute ${
                    isRight ? "md:left-[85%]" : `md:right-0`
                  } md:top-[52px] mt-1`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  <AreasDropdownContent
                    returnActiveAreas={returnActiveAreas}
                    sortedAreas={areas}
                    selectedAreas={areaIds}
                    isLoading={isAreasLoading}
                    onSave={setIsShow}
                    isRight={isRight}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </OutsideAlerter>

      {MOBILE && (
        <Transition appear show={isShowModal} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={onModalClose}>
            <DialogWrapper>
              {/* <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              > */}
                <Dialog.Panel
                  className={`bg-white w-full max-w-[550px] rounded-[10px] overflow-hidden relative mx-[16px] areas-dialog`}
                >
                  <AreasDropdownContent
                    returnActiveAreas={returnActiveAreas}
                    sortedAreas={areas}
                    selectedAreas={areaIds}
                    isLoading={isAreasLoading}
                    onSave={setIsShowModal}
                    isRight={isRight}
                  />

                  <DialogCloseIcon
                    onClick={onModalClose}
                    className="absolute top-3 right-3 z-30"
                  />
                </Dialog.Panel>
              {/* </Transition.Child> */}
            </DialogWrapper>
          </Dialog>
        </Transition>
      )}
    </>
  );
}
