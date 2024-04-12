import React, { useState } from "react";

export default function ColumnItem({ column, setSort}) {
  const [sortPos, setSortPos] = useState("DESC");
  
  const handleSort = (column) => {
    const colSortName = document.querySelector(`[data-col='${column}']`)?.id;

    if (sortPos === "DESC") {
      setSortPos("ASC");
    } else {
      setSortPos("DESC");
    }

    if (colSortName) {
      setSort({ [colSortName]: sortPos });
      // console.log(colSortName, sortPos);
    }
  };

  return (
    <th>
      <button className="inline-flex" onClick={() => handleSort(column)}>
        {column}

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          ariaHidden="true"
          className={`-mr-1 ml-2 h-4 w-4 ${sortPos === "ASC" && "rotate-180"}`}
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
    </th>
  );
}
