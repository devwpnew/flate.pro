import { useEffect, useState } from "react";
import MaskInput from "react-maskinput/lib";

export default function SettingsInputPhone({
  className = "",
  name,
  setPhone,
  ...other
}) {
  const [val, setVal] = useState("+7");

  const changePhoneHandler = (e) => {
    if (e.target.value === "+7 (8" || e.target.value === "+7 ") {
      e.target.value = "+7 ";
    }

    const phoneTmp = e.target.value;
    setVal(phoneTmp);
  };

  useEffect(() => {
    setPhone(val);
  }, [val]);

  return (
    <MaskInput
      placeholder="+7"
      maskChar="_"
      className={className}
      mask={"+7 (000) 000-00-00"}
      name={name}
      onChange={(ev) => {
        changePhoneHandler(ev);
      }}
      {...other}
    />
  );
}
