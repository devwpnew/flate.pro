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
            "text-blue hover:text-white active:text-white hover:border-blue bg-white hover:bg-blue active:bg-blue border-blue border fill-blue stroke-blue hover:fill-white hover:stroke-white";
    } else if (type === "red") {
        buttonStyle =
            "text-[#D44D4D]/60 hover:text-[#D44D4D] active:text-[#D44D4D] bg-[#444444]/5 hover:bg-[#D44D4D]/5 active:bg-[#D44D4D]/10";
        // buttonStyle =
        //   "text-primary hover:text-white active:text-white hover:border-bluelight bg-red bg-opacity-50 hover:bg-bluelight active:bg-bluedeep border-greyborder border fill-blue stroke-blue hover:fill-white hover:stroke-white";
    } else if (type === "secondary") {
        buttonStyle = "bg-white text-blue border border-blue";
    } else if (type === "secondary-10") {
        buttonStyle = "bg-white text-blue border border-blue/10";
    } else {
        buttonStyle =
            "text-white hover:border-bluelight bg-blue hover:bg-bluelight active:bg-bluedeep border border-transparent fill-white stroke-white hover:fill-white hover:stroke-white";
    }
    const button = React.createElement(
        as ? as : "button",
        {
            onClick: onClick && onClick,
            className: `${className} ${buttonStyle} w-full text-sm md:text-black rounded-[10px] transition-all ${
                isDisabled && "opacity-50"
            }`,
            ...other,
        },
        children
    );

    return button;
}
