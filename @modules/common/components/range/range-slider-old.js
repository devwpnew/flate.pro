import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const RangeSlider = ({ min, max, name, style, callback }) => {
  const numberFormat = new Intl.NumberFormat("ru");

  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);
  
  
  useEffect(() => {
    if (callback) {
      callback(() => [maxValue, minValue]);
    }
  }, [maxValue, minValue]);
  
  return (
    <>
      <div className="w-full relative">
        <div className="flex px-2.5 border-greylight border rounded w-full h-12 relative w-full cursor-default bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 borde">
          <div className="flex items-center gap-1 absolute left-1 top-2">
            <div className="text-sm text-grey">от</div>
            <div className="text-sm">{numberFormat.format(minValue)}</div>
          </div>

          <Slider
            min={min}
            max={max}
            onChange={(value) => {
              let minValue = value[1];
              let maxValue = value[0];
              setMaxValue(() => minValue);
              setMinValue(() => maxValue);
            }}
            onAfterChange={(value) => {
              // Retun callback value
              let minValue = value[1];
              let maxValue = value[0];
              if(callback) {
                callback(() => [minValue, maxValue]);
              }
            }}
            // defaultValue={max}
            range={true}
            className="self-end"
            trackStyle={{ backgroundColor: "#2563EB", height: 3, marginTop: 1 }}
            handleStyle={{
              borderColor: "#2563EB",
              height: 16,
              width: 16,
              marginLeft: -0,
              marginTop: -6,
              backgroundColor: "#fff",
              opacity: 1,
            }}
          />

          <div className="flex items-center gap-1 absolute right-1 top-2">
            <div className="text-sm text-grey">до</div>
            <div className="text-sm">{numberFormat.format(maxValue)}</div>
          </div>
        </div>
        <input type="hidden" name={name} />
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
