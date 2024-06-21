import { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";

import { setFetchState } from "store/global/helpers/fetchTrigger";
import SelectOptions from "./part/selectOptions";
import SelectButton from "./part/selectButton";

export default function SelectNoAutocomplete({
  name,
  options,
  style,
  callback,
  addCallback,
  defaultOption,
  defaultValue,
  triggerFetchGlobalState,
  setFilter,
  filter,
  topTitle,
  deleteAction,
  isCanDelete,
  placeholder,
  required,
}) {
  if (!options || (options && !options.length)) {
    return <></>;
  }

  //   options.unshift({ id: null, name: "Не важно" });
  // }
  const [selected, setSelected] = useState(options[0]);

  const fetchState = useSelector((state) => state.fetchTrigger.value);
  const dispatch = useDispatch();

  const setSelectedCallback = (value) => {
    setSelected(value);

    if (triggerFetchGlobalState) dispatch(setFetchState(!fetchState));
  };

  useEffect(() => {
    (() => {
      if (addCallback) {
        addCallback(selected.id);
      }

      if (callback) {
        callback(() => selected);
      }

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
    })();
  }, [selected]);

  // Set default value
  useEffect(() => {
    if ((defaultValue && options) || (defaultValue == 0 && options)) {
    
      const defaultOption = options.slice().find((el) => {
        if (el.id == defaultValue && el.id !== '') {
          return el;
        }

        if (el.name == defaultValue) {
          return el;
        }
      });

      if (defaultOption) {
        setSelected(defaultOption);
      }
    } else {
      setSelected(options[0]);
    }
  }, [defaultValue]);

  return (
    <>
      <Listbox
        value={selected}
        onChange={(value) => setSelectedCallback(value)}
      >
        <div className="relative w-full h-full">
          <SelectButton
            required={required}
            selected={selected}
            name={name}
            style={style}
            topTitle={topTitle}
          />
          <SelectOptions
            options={options}
            deleteAction={deleteAction}
            isCanDelete={isCanDelete}
            closeButtonClassList={"right-0 top-1"}
          />
        </div>
      </Listbox>
    </>
  );
}
