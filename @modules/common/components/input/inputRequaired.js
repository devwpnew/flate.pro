import { useEffect, useState } from "react";

import Input from "./input";

const numberFormat = new Intl.NumberFormat("ru");

export default function InputRequired({
  onChange,
  onlyNumbers = false,
  onlyNumbersBiggerThan = null,
  isCurrency = false,
  value,
  ...props
}) {
  const [isError, setIsError] = useState(null);
  const handleErrorsOnChange = (ev) => {
    setIsError(null);

    if (ev.target.value === "") {
      setIsError("Обязательно для заполнения");
    }

    if (onlyNumbers && onlyNumbersBiggerThan) {
      if (
        parseInt(ev.target.value.replace(/\s/g, "")) < onlyNumbersBiggerThan
      ) {
        const formatted = numberFormat.format(onlyNumbersBiggerThan);

        const currency = isCurrency ? " руб." : "";

        setIsError(`Значение должно быть больше ${formatted}${currency}`);
      }
    }
  };

  // if uncontrolled input
  const onChangeHandler = (ev) => {
    if (onChange) {
      onChange(ev);
    }
    handleErrorsOnChange(ev);
  };

  // if controlled input
  useEffect(() => {
    setIsError(null);
    if (value === "") {
      setIsError("Обязательно для заполнения");
    }
  }, [value]);

  return (
    <Input
      onChange={onChangeHandler}
      {...props}
      onlyNumbers={onlyNumbers}
      isError={typeof isError === "string"}
      errorMsg={isError}
      value={value}
    />
  );
}
