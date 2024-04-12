import React from "react";
import TopTitle from "../formElement/topTitle";

export default function Textarea({
  type,
  name,
  value,
  placeholder,
  style,
  onChange,
  defaultValue,
  required,
  minLength,
  areaStyle,
  labelStyle,
  topTitle,
  isError,
  errorMsg,
  isResize,
  ...other
}) {
  const labelClass = topTitle
    ? "bg-greylight border-greyC4 pt-2.5"
    : "bg-white border-greyborder";
  const labelClassError = isError === true ? "border-red mb-6" : "";
  return (
    <label
      htmlFor={name}
      className={`${labelClass} ${labelClassError} flex items-center border rounded relative w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 hover:border-blue transition-all px-2.5 ${style} ${labelStyle}`}
    >
      <TopTitle text={topTitle} isRequired={required} />

      <textarea
        className={`w-full outline-none ${
          isResize ? "resize-y" : "resize-none"
        } bg-inherit ${areaStyle} text-sm`}
        required={required}
        minLength={minLength}
        type={type}
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        {...other}
      />

      {errorMsg && (
        <span className="text-red text-sm absolute -bottom-6 left-0 z-10 whitespace-nowrap">
          {errorMsg}
        </span>
      )}
    </label>
  );
}
