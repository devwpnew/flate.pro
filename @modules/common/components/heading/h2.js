import React from "react";

export default function H2({
  children,
  className = "",
  customClassName,
  style,
}) {
  return (
    <h2
      style={style ? style : {}}
      className={
        customClassName
          ? customClassName
          : `text-primary text-xl md:text-2xl font-semibold mb-3.5 mb:mb-5 ${className}`
      }
    >
      {children}
    </h2>
  );
}
