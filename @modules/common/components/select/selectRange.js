import { useState, useEffect } from "react";
import Input from "../input/input";
// callback={priceCallback}
// key={priceMax.product_price}
// min={0}
// max={priceMax.product_price / 1000000}
// name="Цена, млн. руб"

export default function SelectRange({ callback, key, min, max, name }) {
  const numberFormat = new Intl.NumberFormat("ru");

  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);
  
  useEffect(() => {
    if (callback) {
      callback(() => [maxValue, minValue]);
    }
  }, []);

  return (
    <div className="w-full relative pb-1">
      <div className="flex justify-between items-center h-full gap-2.5 border-greyborder border rounded w-full h-12 relative w-full cursor-default text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 borde">
        {/* <div className="flex items-center gap-1 absolute left-1 top-2">
          <div className="text-sm text-grey">от</div>
          <div className="text-sm">{numberFormat.format(minValue)}</div>
        </div> */}

        <Input style={'h-full'} placeholder={`от ${numberFormat.format(minValue)}`} />

        <span className="">
          <svg
            width="11"
            height="2"
            viewBox="0 0 11 2"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0.896 0.415H10.206V1.325H0.896V0.415Z" fill="#1F1F1F" />
          </svg>
        </span>

        <Input style={'h-full'} placeholder={`до ${numberFormat.format(maxValue)}`} />

        {/* <div className="flex items-center gap-1 absolute right-1 top-2">
          <div className="text-sm text-grey">до</div>
          <div className="text-sm">{numberFormat.format(maxValue)}</div>
        </div> */}
      </div>
      <input type="hidden" name={name} />
    </div>
  );
}
