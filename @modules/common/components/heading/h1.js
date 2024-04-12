import React from "react";

export default function H1({children, additionalClass}) {
  return (
    <h1 className={`text-primary text-2xl lg:text-[32px] font-bold leading-tight ${additionalClass ? additionalClass : ""}`}>
      {children}
    </h1>
  );
}
