import { useState } from "react";

import OutsideAlerter from "hooks/useOutsideAlerter";

export default function DatePicker({ callback, className }) {
  const getFullYear = (formated) => {
    const res = [];

    for (let i = 0; i < 12; i++) {
      const somedate = new Date();
      somedate.setMonth(somedate.getMonth() - i, 30);
      somedate.setDate(1);

      const date = somedate;
      const formatedDate = somedate.toISOString().slice(0, 10);

      if (formated) {
        res.push(formatedDate);
      } else {
        res.push(date);
      }
    }

    return res;
  };

  const [isOpen, setIsOpen] = useState(false);

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const year = getFullYear(true);
  const yearData = getFullYear(false);

  const itemClickHandler = (date, index) => {
    // Устанавливает отформатированую дату клиенту
    setDate(date);

    // Возвращает неотформатированую дату для фильтра
    if (callback) {
      callback(yearData[index]);
    }
  };

  return (
    <OutsideAlerter action={() => setIsOpen(false)}>
      <div
        className="flex items-center gap-2 cursor-pointer relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="text-xs text-grey hover:text-blue">{date}</div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="8"
          height="6"
          viewBox="0 0 8 6"
          fill="none"
        >
          <path
            d="M4.0014 3.68364L6.8889 0.796143L7.71373 1.62098L4.0014 5.33331L0.289062 1.62098L1.1139 0.796143L4.0014 3.68364Z"
            fill="#787486"
          />
        </svg>

        {isOpen && (
          <div
            className={
              className ? className : "absolute bottom-[-310px] right-[15px]"
            }
          >
            <div className="flex flex-col gap-2">
              {year.map((date, index) => (
                <div
                  key={date}
                  className="text-xs text-grey hover:text-blue"
                  onClick={() => itemClickHandler(date, index)}
                >
                  {date}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </OutsideAlerter>
  );
}
