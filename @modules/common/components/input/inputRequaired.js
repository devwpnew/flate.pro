import { useEffect, useState } from "react";

import Input from "./input";

export default function InputRequired({ onChange, value, ...props }) {
  const [isError, setIsError] = useState(null);
  const handleErrorsOnChange = (ev) => {
    setIsError(null);

    if (ev.target.value === "") {
      setIsError("Обязательно для заполнения");
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
      isError={typeof isError === "string"}
      errorMsg={isError}
      value={value}
    />
  );
}
