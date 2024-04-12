import { useState } from "react";

import Textarea from "./textarea";

export default function TextareaRequired({ onChange, ...props }) {
  const [isError, setIsError] = useState(null);

  const handleErrorsOnChange = (ev) => {
    setIsError(null);

    if (ev.target.value === "") {
      setIsError("Обязательно для заполнения");
    }
  };

  const onChangeHandler = (ev) => {
    if (onChange) {
      onChange(ev);
    }
    handleErrorsOnChange(ev);
  };

  return (
    <Textarea
      onChange={onChangeHandler}
      {...props}
      isError={typeof isError === "string"}
      errorMsg={isError}
    />
  );
}
