import React from "react";
import Preloader from "./preloader";
import randomInteger from "helpers/randomInteger";

export default function TablePreloader({ cols, amount }) {
  const amountItems = [];
  for (let i = 0; i < amount; i++) {
    amountItems.push(
      <PreloaderBlock colsNum={cols} key={i+cols}/>
    );
  }
  return (
    <>
      {amountItems}
    </>
  );
}

export function PreloaderBlock({ colsNum }) {
  const columns = [];
  for (let i = 0; i < colsNum; i++) {
    columns.push(
      <td className="h-[26px]">
        <Preloader key={i+colsNum} />
      </td>
    );
  }
  return (
    <>
      <tr>{columns}</tr>
    </>
  );
}
