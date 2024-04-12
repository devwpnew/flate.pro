import { useState, useEffect } from "react";

import SelectCheckBoxItem from "./part/selectCheckBoxItem";

export default function SelectCheckBox({
  title,
  name,
  options,
  setFilter,
  filter,
  defaultValue,
}) {
  if (!options || (options && !options.length)) {
    return <></>;
  }

  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (defaultValue && options) {
      const defaultOption = options.slice().find((el) => el.id == defaultValue);
      setSelected(defaultOption);
    }
  }, []);

  useEffect(() => {
    if (setFilter && selected?.id) {
      setFilter({
        ...filter,
        [name]: selected.id,
      });
    }

    if (setFilter && selected && !selected?.id) {
      const filterObj = { ...filter };
      delete filterObj[name];
      setFilter(filterObj);
    }
  }, [selected]);

  const setSelectedHandler = (option) => {
    setSelected(option);
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="bg-greylight text-xs text-grey px-[2px] mb-[9px]">
          {title}
        </div>

        <div className="flex flex-col gap-[14px]">
          {options.map((option) => {
            return (
              <SelectCheckBoxItem
                key={option.id}
                option={option}
                name={name}
                defaultOption={defaultValue}
                selected={selected}
                setSelectedHandler={setSelectedHandler}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
