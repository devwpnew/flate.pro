import Image from "next/image";

import TopTitle from "../formElement/topTitle";

import markGreen from "public/icons/mark-green.svg";
import markRed from "public/icons/mark-red.svg";

import getLayout from "helpers/getLayout";

export default function Input({
  type,
  name,
  value,
  required,
  minLength,
  placeholder,
  style = "",
  passed,
  inputStyle = "",
  onChange,
  defaultValue,
  labelStyle = "",
  disabled = false,
  step,
  min,
  topTitle,
  isError = false,
  errorMsg = "",
  onInput,
  textLeft,
  id,
  useRef,
}) {
  const labelClass = topTitle
    ? "bg-greylight border-greyC4"
    : "bg-white border-greyborder";
  const labelClassError = isError === true ? "border-red mb-6" : "";

  const labelClassSummary = `${labelClass} ${labelClassError} flex items-center border rounded relative w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 hover:border-blue transition-all px-2.5 ${style} ${labelStyle}`

  return (
    <label
      htmlFor={name}
      className={labelClassSummary}
    >
      <TopTitle text={topTitle} isRequired={required} />

      {textLeft && <span className="text-greyA0 text-sm">{textLeft}</span>}

      <input
        autoComplete="off"
        className={`w-full h-full outline-none text-sm bg-inherit ${inputStyle}`}
        ref={useRef}
        type={type}
        name={name}
        step={step}
        value={value}
        defaultValue={defaultValue}
        minLength={minLength}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        onChange={onChange}
        onInput={onInput}
        min={min}
        id={id}
      />

      {isError && <ErrorIcon />}

      <div className="absolute top-[-8px] right-[-10px]">
        {passed == false && <Passed check={false} />}
        {passed == true && <Passed check={true} />}
      </div>

      {errorMsg && (
        <span className="text-red text-sm absolute -bottom-6 left-0 z-10 whitespace-nowrap">
          {errorMsg}
        </span>
      )}
    </label>
  );
}

export function Passed({ check }) {
  const { MOBILE } = getLayout();
  return (
    <>
      {MOBILE ? (
        <Image
          src={check ? markGreen.src : markRed.src}
          width={check ? markGreen.width : markRed.width}
          height={check ? markGreen.height : markRed.height}
        />
      ) : (
        <div
          className={`${check ? "bg-green" : "bg-greyA0"} px-2.5 rounded`}
        >
          <span className="text-white text-xs whitespace-nowrap">
            {check ? "Подтверждён" : "Не подтверждён"}
          </span>
        </div>
      )}
    </>
  );
}

export function ErrorIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="stroke-red"
    >
      <g clipPath="url(#clip0_2822_4536)">
        <path
          d="M6.86001 2.57347L1.21335 12.0001C1.09693 12.2018 1.03533 12.4303 1.03467 12.6631C1.03402 12.896 1.09434 13.1249 1.20963 13.3272C1.32492 13.5294 1.49116 13.698 1.69182 13.816C1.89247 13.9341 2.12055 13.9976 2.35335 14.0001H13.6467C13.8795 13.9976 14.1076 13.9341 14.3082 13.816C14.5089 13.698 14.6751 13.5294 14.7904 13.3272C14.9057 13.1249 14.966 12.896 14.9654 12.6631C14.9647 12.4303 14.9031 12.2018 14.7867 12.0001L9.14001 2.57347C9.02117 2.37754 8.85383 2.21555 8.65414 2.10313C8.45446 1.9907 8.22917 1.93164 8.00001 1.93164C7.77086 1.93164 7.54557 1.9907 7.34588 2.10313C7.1462 2.21555 6.97886 2.37754 6.86001 2.57347V2.57347Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 11.3335H8.00667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M8 6V8.66667" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_2822_4536">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
