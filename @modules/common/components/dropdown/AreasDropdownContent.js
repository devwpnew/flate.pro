import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Button from "@modules/common/components/button/button";
import randomInteger from "helpers/randomInteger";
import AreasOutput from "../../../location/components/modal/areasOutput";
import AreasParentsOutput from "../../../location/components/modal/areasParentsOutput";
import getLayout from "helpers/getLayout";

function AreasDropdownContent({
  areas,
  isLoading,
  selectedAreas,
  sortedAreas,
  returnActiveAreas,
  returnActiveAreasForInput,
  onSave,
  isRight,
}) {
  const { MOBILE } = getLayout();

  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [activeAreas, setActiveAreas] = useState(
    selectedAreas ? selectedAreas : []
  );
  const [childrenAreas, setChildrenAreas] = useState([]);
  const [activeParent, setActiveParent] = useState(null);

  function getAreaId(id) {
    const areaId = parseInt(id);

    // Проверяем, содержит ли массив activeAreas значение areaId
    if (activeAreas.includes(areaId)) {
      // Если значение areaId уже присутствует в activeAreas,
      // фильтруем его из массива и обновляем состояние activeAreas
      const filteredActiveAreas = activeAreas.filter(function (el) {
        return el !== areaId;
      });
      setActiveAreas(filteredActiveAreas);
      return;
    }

    // Если значение areaId отсутствует в activeAreas,
    // добавляем его в состояние activeAreas с помощью стрелочной функции
    setActiveAreas((current) => [...current, areaId]);
  }

  function getParentAreaId(id) {
    const parentArea = sortedAreas.find((area) => area.id == id);
    const parentAreaChildrenIds = parentArea?.children.map((child) => child.id);

    let selectedAreasIds = [parentArea.id];
    if (parentAreaChildrenIds && parentAreaChildrenIds.length !== 0) {
      selectedAreasIds = [parentArea.id, ...parentAreaChildrenIds];
    }

    const selectedIdsResult = selectedAreasIds.filter(
      (id) => !activeAreas.includes(id)
    );

    // Делаем районы активными
    if (selectedIdsResult && selectedIdsResult.length !== 0) {
      setActiveAreas((current) => [...current, ...selectedIdsResult]);
    } else {
      // Убираем активные районы
      const filteredAreasIds = activeAreas.filter(
        (id) => !selectedAreasIds.includes(id)
      );

      setActiveAreas(filteredAreasIds);
    }
  }

  function setActiveAllAreas() {
    if (!childrenAreas) return;
    const areasAllIds = [];

    childrenAreas.map((area) => {
      areasAllIds.push(area.id);
    });
    setActiveAreas((current) => [...current, ...areasAllIds]);

    // const inputs = document.querySelectorAll(".modalAreaInput");
    // inputs.forEach((el) => (el.checked = true));

    setIsCheckedAll(true);
  }

  function setInActiveAllAreas() {
    if (!childrenAreas) return;

    setActiveAreas([]);
    // activeAreas.filter(() => )

    // setActiveAreas([]);

    // const withoutChildren = activeAreas;

    // withoutChildren.map((id, index) => {
    //   childrenAreas.map((child) => {
    //     if (id === child.id) {
    //       withoutChildren[index] = undefined;
    //     }
    //   });
    // });

    // const filteredWithoutChildren = activeAreas.filter(function (el) {
    //   return el !== undefined;
    // });

    // const filteredWithoutParent = filteredWithoutChildren.filter(function (el) {
    //   return el !== activeParent;
    // });

    // setActiveAreas(filteredWithoutParent);

    // const inputs = document.querySelectorAll(".modalAreaInput");
    // inputs.forEach((el) => (el.checked = false));

    // setIsCheckedAll(false);
  }

  useEffect(() => {
    if (!isLoading && sortedAreas) {
      setChildrenAreas(sortedAreas[0]?.children);
    }
  }, [isLoading]);

  const saveHandler = (e) => {
    e.preventDefault();
    returnActiveAreas(activeAreas);

    if (returnActiveAreasForInput) {
      returnActiveAreasForInput(activeAreas);
    }

    onSave((val) => !val);
  };

  useEffect(() => {
    returnActiveAreas(activeAreas);
  }, [activeAreas]);

  // useEffect(() => {
  //   if (MOBILE) {
  //     if (activeParent) {
  //       getParentAreaId(activeParent);
  //     } else {
  //       setActiveAreas([]);
  //     }
  //   }
  // }, [activeParent]);

  // console.log(activeAreas);

  return (
    <div
      className="rounded-[10px] bg-white max-w-[750px] w-full lg:w-[750px]"
      style={{
        boxShadow: "0px 4px 6px 1px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        className="angle hidden md:block"
        style={{
          position: "absolute",
          top: -8,
          right: isRight ? "unset" : 11,
          left: isRight ? 11 : "unset",
          width: 0,
          height: 0,
          borderLeft: "11px solid transparent",
          borderRight: "11px solid transparent",
          borderBottom: "8px solid #fff",
          zIndex: 10,
        }}
      ></div>

      <div className="relative z-10 flex flex-col bg-white">
        <div className="flex items-center justify-center md:justify-between border-greyborder border-b pb-2 pl-2 md:p-5">
          <div
            className={`text-primary text-lg md:text-2xl lg:text-[32px] font-bold whitespace-nowrap`}
          >
            Выберите район
          </div>

          <AnimatePresence>
            {childrenAreas?.length > 0 && activeAreas?.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="text-blue text-sm cursor-pointer whitespace-nowrap hidden md:block"
                onClick={() => setActiveAreas([])}
              >
                Сбросить
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex justify-center bg-greylight w-full">
            <div className="w-full md:w-auto md:min-w-[265px]">
              <div className="flex flex-col items-start">
                <AreasParentsOutput
                  isLoading={isLoading}
                  activeAreas={activeAreas}
                  sortedAreas={sortedAreas}
                  getParentAreaId={getParentAreaId}
                  setChildrenAreas={setChildrenAreas}
                  setActiveParent={setActiveParent}
                />
              </div>
            </div>
            <div className="md:flex flex-col justify-between w-full pl-2 md:pl-[30px] py-2 md:py-[22px] bg-white">
              <div className="h-[258px] overflow-y-scroll md:h-auto md:overflow-auto flex flex-wrap gap-x-7 gap-y-3">
                {childrenAreas ? (
                  <AreasOutput
                    childrenAreas={childrenAreas}
                    childrenOnChange={getAreaId}
                    activeAreas={activeAreas}
                  />
                ) : (
                  <div className="h-full"></div>
                )}
              </div>
              <div
                className={`flex flex-row justify-end items-center gap-2.5 mt-2.5 md:mt-[60px] w-full pr-5`}
              >
                <AnimatePresence>
                  {childrenAreas?.length > 0 && activeAreas?.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                      className="text-blue text-sm cursor-pointer whitespace-nowrap mr-auto"
                      onClick={setInActiveAllAreas}
                    >
                      Снять всё
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* <Button
                  className="h-9 w-[139px] font-bold"
                  onClick={saveHandler}
                >
                  Сохранить
                </Button> */}
              </div>
            </div>
          </div>
          <div className="flex px-5 md:hidden pr-5 border-greyborder border-t py-2.5 w-full justify-center">
            <Button
              className="h-9 w-[130px] w-full font-bold"
              onClick={saveHandler}
            >
              Сохранить
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

AreasDropdownContent.propTypes = {
  state: PropTypes.bool,
  onClose: PropTypes.func,
};

export default AreasDropdownContent;
