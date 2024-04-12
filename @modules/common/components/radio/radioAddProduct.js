import { useEffect, useState } from "react";
import RadioAddProductItem from "./radioAddProductItem";

export default function RadioAddProduct({
  itemClassName = "",
  containerClassName = "",
  name,
  options,
  addCallback,
  callback,
  defaultValue,
}) {
  if (!options) {
    return <></>;
  }
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (addCallback) {
      addCallback(() => {
        return selected && { name: name, value: selected };
      });
    }
    if (callback) {
      callback(() => selected);
    }
  }, [selected]);

  const onChange = (event) => {
    setSelected(event.target.value);
  };

  useEffect(() => {
    setSelected(defaultValue);
  }, [defaultValue]);

  return (
    <>
      <div className={containerClassName} id={name && name}>
        {options.map((option, index) => {
          return (
            <div key={option.id} className={itemClassName}>
              <RadioAddProductItem
                selected={selected}
                option={option}
                onChange={onChange}
                name={name}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
