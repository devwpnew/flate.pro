import { useEffect, useState } from "react";

export default function AreaModalInputParent({
  area,
  activeAreas,
  onClick,
  onMouseEnter,
  isFirst,
  isLast,
}) {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (activeAreas.length === 0) setIsChecked(false);

    const check = activeAreas.find((id) => id === area.id);

    if (check) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  }, [activeAreas]);
  // console.log(!isFirst && !isChecked);
  return (
    <div
      className={`text-left border-transparent border-b border-t block cursor-pointer group p-2 md:py-6 md:px-5 w-full ${
        isChecked || (isFirst && activeAreas.length === 0)
          ? `bg-white border-r-transparent ${
              !isLast && "border-b border-b-greyborder"
            } ${!isFirst && !isChecked ? "border-t-greyborder border-t" : ""}`
          : "bg-greylight border-greyborder"
      } border-r  hover:bg-white hover:border-r-transparent ${
        !isLast && "hover:border-b hover:border-b-greyborder"
      } ${
        !isFirst && !isChecked
          ? "hover:border-t-greyborder hover:border-t"
          : "bg-white border-r-transparent border-b"
      }`}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <div className="b-contain">
        <div className={`input ${isChecked && "active"}`}></div>
        <span
          className={`${
            isChecked || isFirst
              ? "font-semibold text-primary"
              : "text-grey group-hover:font-semibold group-hover:text-primary"
          }`}
        >
          {area.name}
        </span>
      </div>
    </div>
  );
}
