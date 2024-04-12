import { useEffect, useState } from "react";

export const CheckboxCheck = ({
  checked = false,
  disabled,
  square,
  text,
  name,
  callback,
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  useEffect(() => {
    callback && callback(isChecked);
  }, [isChecked]);

  const handleOnChange = () => {
    if (!disabled) {
      setIsChecked(!isChecked);
    }
  };

  return (
    <div className="inline-flex gap-2 items-center" onClick={handleOnChange}>
      {square ? (
        <div
          className={`rounded-[4px] ${
            isChecked
              ? "bg-white border-greymiddle border"
              : "bg-white border-greymiddle border"
          } min-w-[14px] min-h-[14px] w-[14px] h-[14px] flex flex-row justify-center items-center cursor-pointer relative`}
        >
          {isChecked && (
            <svg
              className="absolute top-0 right-[-4px]"
              width="16"
              height="11"
              viewBox="0 0 16 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 1L5.375 10L1 5.90909"
                stroke="#2563EB"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      ) : (
        <div
          className={`rounded-full ${
            isChecked ? "bg-blue" : "bg-white border-greymiddle border"
          } min-w-[12px] min-h-[12px] w-[12px] h-[12px] flex flex-row justify-center items-center`}
        >
          {isChecked && (
            <svg
              width="8"
              height="6"
              viewBox="0 0 8 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 3.22222L2.92 5L7 1"
                stroke="white"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
      )}
      <input type="hidden" checked={isChecked} name={name} />
      {text && <>{isChecked ? <span>Да</span> : <span>Нет</span>}</>}
    </div>
  );
};
