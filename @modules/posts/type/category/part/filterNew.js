import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilterGlobalFields } from "store/global/filter/filterGlobalFields";

import Button from "@modules/common/components/button/button";
import Container from "@modules/common/components/container/container";
import FilterFields from "./filterFields";
import FilterDefaultFields from "./filterDefaultFields";
import FilterBottom from "./filterBottom";

import randomInteger from "helpers/randomInteger";
import FilterAreas from "./filterAreas";
import getLayout from "helpers/getLayout";

import motionParams from "helpers/static/animation/motionParams";
import { setFilterVisibility } from "store/global/filter/filterVisibility";
import { useRouter } from "next/router";

export default function FilterNew({
  isRow,
  isSidebar,
  setStartFilter,
  setIsTemplateRow,
  propsFields,
  rangeFields,
  productsAmount,
  productsAmountLoading,
}) {
  const router = useRouter();
  //const showFilter = useSelector((state) => state.filterVisibility.value);
  const showFilter = useSelector((state) => true);

  const dispatch = useDispatch();
  const { DESKTOP, MOBILE } = getLayout();

  const [filter, setFilter] = useState({});
  const [filterId, setFilterId] = useState(0);

  const startFilter = (filter) => {
    const urlWithoutParams = window.location.origin + window.location.pathname;
    
    dispatch(setFilterGlobalFields(filter));
    // setStartFilter(true);
    setStartFilter(randomInteger());

    if (!isRow) {
      setIsTemplateRow(true);
      // router.push(
      //   {
      //     pathname: urlWithoutParams,
      //     query: {},
      //   },
      //   undefined,
      //   {
      //     shallow: true,
      //   }
      // );
    } else {
      setIsTemplateRow(false);
      // router.push(
      //   {
      //     pathname: urlWithoutParams,
      //     query: {},
      //   },
      //   undefined,
      //   {
      //     shallow: true,
      //   }
      // );
    }
    // dispatch(setFilterGlobalFields({}))
  };

  const clearFilter = () => {
    const urlWithoutParams = window.location.origin + window.location.pathname;
    // console.log(urlWithoutParams);

    setFilter({});
    dispatch(setFilterGlobalFields({}));

    setStartFilter(randomInteger());

    if (isRow) {
      setIsTemplateRow(true);
      router.push(
        {
          pathname: urlWithoutParams,
          query: {},
        },
        undefined,
        {
          shallow: true,
        }
      );
    } else {
      setIsTemplateRow(false);
      router.push(
        {
          pathname: urlWithoutParams,
          query: {},
        },
        undefined,
        {
          shallow: true,
        }
      );
    }

    setFilterId(randomInteger());
  };

  const onFilterSubmit = (ev) => {
    ev.preventDefault();
    startFilter(filter);
  };


  
    
  useEffect(() => {
    dispatch(setFilterVisibility(DESKTOP));

    // if (isSidebar || isRow || router?.query?.search) {
    //   if (MOBILE) {
    //     dispatch(setFilterVisibility(true));
    //   }
    // }
  }, [DESKTOP, productsAmount]);

  
  return (
    <>
      <AnimatePresence>
        {showFilter && (
          <motion.form
            {...motionParams.dropdownParams}
            onSubmit={onFilterSubmit}
            key={filterId}
            className={`lg:shadow rounded ${
              isSidebar &&
              "lg:shadow-none rounded-none"
            }`}
          >
            <Container className={isSidebar ? "w-full border border-greyborder px-[20px] py-[25px] rounded-[20px]" : ""}>
              <div className={`flex flex-col gap-2 ${isSidebar && "mb-2"}`}>
                <div
                  className={`flex flex-col md:flex-row md:flex-wrap gap-y-[16px] gap-x-[12px] ${
                    isSidebar ? "flex-col" : "justify-between"
                  }`}
                >

					<FilterAreas
						isSidebar={isSidebar}
						setFilter={setFilter}
						filter={filter}
					/>

					<FilterDefaultFields
						setFilter={setFilter}
						filter={filter}
						isSidebar={false}
					/>

					<FilterFields
						props={propsFields}
						ranges={rangeFields}
						setFilter={setFilter}
						filter={filter}
						isSidebar={isSidebar}
					/>

                  

                  {!isSidebar && (
                    <div
                      href="#categoryOutput"
                      className={`md:w-[32%] lg:w-[24%] flex items-end cursor-pointer hover:underline ${
                        isSidebar ? "lg:w-[100%]" : "lg:ml-auto"
                      }`}
                    >
                      <div className="h-[42px] w-full">
                        <Button onClick={onFilterSubmit}>
                          <div className="flex flex-col items-center">
                            Найти
                          </div>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <FilterBottom
                  isSidebar={isSidebar}
                  productsAmountLoading={productsAmountLoading}
                  productsAmount={productsAmount}
                  clearFilter={clearFilter}
                  startFilter={onFilterSubmit}
                />
              </div>
              
            </Container>
          </motion.form>
        )}
      </AnimatePresence>
    </>
  );
}
