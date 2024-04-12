import { useState } from "react";

import Image from "next/image";

import Tooltip from "@modules/common/components/tooltip/tooltip";

export default function ReviewVoteItem({
  icon,
  title,
  value,
  name,
  setIsItemActive,
  isActive,
}) {
  const [isShow, setShowTooltip] = useState(false);

  const hoverHandler = (event) => {
    if (event?.type === "mouseleave") {
      setShowTooltip(false);
    } else {
      setShowTooltip(true);
    }
  };

  const clickHandler = () => {
    setIsItemActive(value);
  };

  return (
    <label
      className="relative basis-full text-center"
      onClick={clickHandler}
      onMouseOver={hoverHandler}
      onMouseLeave={hoverHandler}
    >
      <div className={`cursor-pointer inline w-auto`}>
        <Tooltip
          text={title}
          className={`inline-table bg-greyA0 text-xs text-white rounded px-1 whitespace-nowrap absolute mx-auto top-[-21px] left-0 right-0 text-center`}
          isShow={isShow}
        />
        <Image
          className={`${!isActive ? "opacity-50" : "opacity-100"}`}
          src={icon.src}
          width={icon.width}
          height={icon.height}
          // layout="responsive"
        />
      </div>
      <input /*onChange={() => console.log(1)}*/ checked={isActive} type={"radio"} name={name} value={value} className="hidden" />
    </label>
  );
}
