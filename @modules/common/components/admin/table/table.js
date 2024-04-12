import React, { useEffect, useState } from "react";
import Preloader from "../../preloader/preloader";

function getColumnHeaders(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }

  // Get the keys of the first object in the array as our columns
  const columns = Object.keys(data[0]);

  // Loop through the remaining objects and check for additional keys
  for (let i = 1; i < data.length; i++) {
    const objectKeys = Object.keys(data[i]);
    // Add any new keys to our columns array
    objectKeys.forEach((key) => {
      if (!columns.includes(key)) {
        columns.push(key);
      }
    });
  }

  return columns;
}

export default function Table({ data, isLoading, setSort }) {
  const [sortPos, setSortPos] = useState("DESC");

  const [columns, setColumns] = useState(null);
  const [rows, setRows] = useState(null);

  useEffect(() => {
    const colsTemplate = getColumnHeaders(data);
    setColumns(colsTemplate);
  }, [data]);

  useEffect(() => {
    if (!columns || columns.length === 0) return;

    const rowTemplate = data.map((item, index) => (
      <tr key={index}>
        {columns.map((column, columnIndex) => (
          <td key={columnIndex}>{item[column] || ""}</td>
        ))}
      </tr>
    ));

    setRows(rowTemplate);
  }, [columns]);

  const handleSort = (column) => {
    if (setSort) {
      const colSortName = document.querySelector(`[data-col='${column}']`)?.id;

      console.log({colSortName})

      if (sortPos === "DESC") {
        setSortPos("ASC");
      } else {
        setSortPos("DESC");
      }

      if (colSortName) {
        setSort({ [colSortName]: sortPos });
        // console.log(colSortName, sortPos);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <table>
          <table className="table">
            <thead>
              <tr>
                {[1, 2, 3, 4, 5, 6].map((column, index) => (
                  <th key={index}>
                    <div className="w-[112px] h-[12px]">
                      <Preloader />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6].map((item, index) => (
                <tr key={index}>
                  {[1, 2, 3, 4, 5, 6].map((column, columnIndex) => (
                    <td key={columnIndex}>
                      <div className="w-[112px] h-[14px]">
                        <Preloader />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </table>
      ) : data && data.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              {columns &&
                columns.map((column, index) => (
                  <th key={index}>
                    <button
                      className="inline-flex"
                      onClick={() => handleSort(column)}
                    >
                      {column}

                      {setSort && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                          className={`-mr-1 ml-2 h-4 w-4 ${
                            sortPos === "ASC" && "rotate-180"
                          }`}
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      )}
                    </button>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      ) : (
        <span className="text-blue text-center block mx-auto">
          Результаты не найдены
        </span>
      )}
    </>
  );
}
