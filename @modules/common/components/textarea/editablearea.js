import React from "react";
import TopTitle from "../formElement/topTitle";

export default function Editablearea({
  name,
  style,
  required,
  labelStyle,
  topTitle,
  children,
  id,
  onInput,
  ref,
  onClick,
}) {
  return (
    <label
      onClick={onClick}
      htmlFor={name}
      className={`${style} ${labelStyle} flex items-start border rounded ${
        topTitle
          ? "bg-greylight border-greyC4 pt-[13px]"
          : "bg-white border-greyborder py-2.5"
      } px-2.5 relative w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 hover:border-blue hover:shadow-lg transition-all`}
    >
      <TopTitle text={topTitle} isRequired={required} />

      <div className=" text-grey text-sm cursor-text h-[170px] w-full overflow-y-scroll editable">
        <div contenteditable="true" id={id} onInput={onInput} ref={ref}>
          {children}
        </div>
      </div>

      <style>
        {`
        .editable > * {
          height: 100%;
          outline:none;
        }
        `}
      </style>
    </label>
  );
}
