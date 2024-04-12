import React from "react";

import Preloader from "./preloader";

import randomInteger from "helpers/randomInteger";

export default function ProductPreloader({ amount, className, isInvisible }) {
  const amountItems = [];
  for (let i = 0; i < amount; i++) {
    amountItems.push(
      <div className={`h-[250px] ${className ? className : "w-auto md:w-[236px]"}`} key={`${randomInteger()}`}>
        <Preloader isInvisible={isInvisible} />
      </div>
    );
  }
  return <>{amountItems}</>;
}
