import React, { useEffect, useState } from "react";

export default function RadioAddProductItem({
  selected,
  option,
  onChange,
  name,
}) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(selected == option.id);
  }, [selected]);
  return (
    <label
      className={`flex items-center justify-center text-sm cursor-pointer min-w-[47px] w-full h-full rounded font-normal hover:bg-bluelight hover:text-white transition-all underline-offset-2 ${
        typeof selected != "undefined" && checked
          ? "bg-blue text-white"
          : "text-black border border-greyborder"
      }`}
    >
      <span className="px-2.5">{option.name}</span>
      <input
        type="radio"
        className="hidden"
        value={option.id}
        checked={checked}
        onChange={onChange}
        name={name}
      ></input>
    </label>
  );
}
