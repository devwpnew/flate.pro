import React from "react";
import { motion } from "framer-motion";

export default function Button({
  children,
  className = "",
  onClick,
  isDisabled,
  type,
  as,
  ...other
}) {
  let buttonStyle = "";

  if (type === "green") {
    buttonStyle =
      "text-white hover:border-bluelight bg-green hover:bg-bluelight active:bg-bluedeep border border-transparent fill-white stroke-white hover:fill-white hover:stroke-white";
  } else if (type === "white") {
    buttonStyle =
      "text-primary hover:text-white active:text-white hover:border-bluelight bg-white hover:bg-bluelight active:bg-bluedeep border-greyborder border fill-blue stroke-blue hover:fill-white hover:stroke-white";
  } else if (type === "red") {
    buttonStyle =
      "text-primary hover:text-white active:text-white hover:border-bluelight bg-red bg-opacity-50 hover:bg-bluelight active:bg-bluedeep border-greyborder border fill-blue stroke-blue hover:fill-white hover:stroke-white";
  } else {
    buttonStyle =
      "text-white hover:border-bluelight bg-blue hover:bg-bluelight active:bg-bluedeep border border-transparent fill-white stroke-white hover:fill-white hover:stroke-white";
  }
  const button = React.createElement(as ? as : 'button', {
    onClick: onClick && onClick,
    className: `${className} ${buttonStyle} w-full h-full text-sm md:text-black rounded transition-all ${
      isDisabled && "opacity-50"
    }`,
    ...other,
  }, children);

  return button;
}
