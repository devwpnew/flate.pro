import React from "react";

export default function Preloader({ isInvisible }) {
  return (
    <>
      <div className={isInvisible ? "preloader-invisible" : "preloader"}></div>
    </>
  );
}
