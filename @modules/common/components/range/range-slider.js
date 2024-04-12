import { useState, useEffect } from "react";
import { NumericFormat } from "react-number-format";

import PropTypes from "prop-types";
import "rc-slider/assets/index.css";
import TopTitle from "../formElement/topTitle";

const RangeSlider = ({
  min,
  max,
  valueMin,
  valueMax,
  name,
  style,
  callback,
  setFilter,
  filter,
  topTitle,
}) => {
  const numberFormat = new Intl.NumberFormat("ru");

  const [minValue, setMinValue] = useState(min ? min : "");
  const [maxValue, setMaxValue] = useState(max ? max : "");
  const [maxValueTest, setMaxValueTest] = useState(max);

  useEffect(() => {
    if (callback) {
      callback(() => [maxValue, minValue]);
    }

    if (setFilter) {
      const rangeFilterObj = { from: minValue ? minValue : 0 };

      if (maxValue) {
        rangeFilterObj["to"] = maxValue;
      }

      setFilter({
        ...filter,
        [name]: rangeFilterObj,
      });

      // console.log(rangeFilterObj);
    }
  }, [minValue, maxValue]);

  function escapeRegExp(string) {
    return string.replace(/[^0-9]/g, "");
  }

  const minChange = (input) => {
    input.target.value = escapeRegExp(input.target.value);
    input.target.value = input.target.value ? parseInt(input.target.value) : 0;

    setMinValue(parseInt(input.target.value));
    // input.target.value = `от ${input.target.value}`
  };

  const maxChange = (input) => {
    input.target.value = escapeRegExp(input.target.value);
    input.target.value = input.target.value ? parseInt(input.target.value) : null;

    setMaxValue(parseInt(input.target.value));
    // input.target.value = `до ${input.target.value}`
  };

  return (
    <>
      <div
        className={`${style && style} w-full flex flex-row items-center ${
          !topTitle && "gap-2.5"
        } relative h-full`}
      >
        <TopTitle text={topTitle} />

        <label
          className={`w-full lg:w-auto flex items-center ${
            topTitle
              ? "border-greyC4 bg-greylight rounded-r-none"
              : "border-greyborder bg-white"
          } border rounded h-full hover:border-blue hover:shadow-lg transition-all`}
        >
          <NumericFormat
            thousandSeparator=" "
            className={`w-full outline-none px-2.5 text-sm bg-transparent`}
            placeholder={`от ${min ? numberFormat.format(min) : ""}`}
            onChange={minChange}
            defaultValue={valueMin ? valueMin : ""}
          />
        </label>

        {!topTitle && (
          <div className="w-[11px] h-[2px]">
            <svg
              width="11"
              height="2"
              viewBox="0 0 11 2"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0.896 0.415H10.206V1.325H0.896V0.415Z" fill="#1F1F1F" />
            </svg>
          </div>
        )}

        <label
          className={`w-full lg:w-auto flex items-center ${
            topTitle
              ? "border-greyC4 bg-greylight rounded-l-none border-l-none"
              : "border-greyborder bg-white"
          } border rounded h-full hover:border-blue hover:shadow-lg transition-all`}
        >
          <NumericFormat
            thousandSeparator=" "
            className={`w-full outline-none px-2.5 text-sm bg-transparent`}
            placeholder={`до ${max ? numberFormat.format(max) : ""}`}
            onChange={maxChange}
            defaultValue={valueMax ? valueMax : ""}
          />
        </label>
      </div>
    </>
  );
};

RangeSlider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  name: PropTypes.string,
  style: PropTypes.string,
};

export default RangeSlider;
