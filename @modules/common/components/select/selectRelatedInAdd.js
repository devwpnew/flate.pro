import { useEffect } from "react";
import { useState } from "react";

import { Dialog } from "@headlessui/react";

import Input from "../input/input";

import DialogWrapper from "../dialog/dialogWrapper";
import DialogMessage from "../dialog/dialogMessage";

import OutsideAlerter from "hooks/useOutsideAlerter";
import AddRcModal from "../modals/addRcModal";

export default function SelectRelatedInAdd({
  name,
  options,
  style,
  placeholder,
  callback,
  addCallback,
  field,
  inputOnChangeCallback,
  required,
  rcAddedCallback,
  defaultInputValue,
}) {
  const [isOpenAddRc, setIsOpenAddRc] = useState(false);
  const [isOpenRcSuccess, setIsOpenRcSuccess] = useState(false);

  const [show, setShow] = useState(false);

  const [selectedItem, setSelectedItem] = useState("");
  const [query, setQuery] = useState("");

  const [inputValue, setInputValue] = useState(defaultInputValue);

  const filteredOptions =
    query === "" && query > 3
      ? 4
      : options &&
        options.filter((option) =>
          option[field]
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  useEffect(() => {
    if (addCallback) {
      addCallback({ name: name, value: selectedItem });
    }
  }, [selectedItem]);

  useEffect(() => {
    if (callback) {
      callback({ name: name, value: selectedItem });
    }
  }, [selectedItem]);

  const inputOnChange = (event, value = false) => {
    const val = value ? value : event.target.value;
    setQuery(val);
    setInputValue(val);
    if (inputOnChangeCallback) {
      inputOnChangeCallback(val);
    }

    if (!value) {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  const selectRelatedItem = (event) => {
    setSelectedItem(event.target.getAttribute("data-value"));
    inputOnChange(false, event.target.textContent);
  };

  return (
    <>
      <div className="relative w-full group test h-full">
        <Input
          style={`${style}`}
          name={name}
          required={required}
          placeholder={placeholder}
          value={inputValue}
          onChange={inputOnChange}
        />
        {query.length > 1 && show ? (
          <OutsideAlerter action={() => setShow(false)}>
            <div className="absolute mt-1 max-h-60 w-full z-10 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {(typeof filteredOptions == "undefined" ||
                filteredOptions.length === 0) &&
              query !== "" ? (
                <>
                  <div
                    className={`relative select-none py-2 px-[6px] mx-[6px] mb-[2px] rounded-md transition-all
                          text-blue`}
                  >
                    Ничего не найдено.
                  </div>
                  <div
                    className={`relative select-none py-2 px-[6px] mx-[6px] mb-[2px] rounded-md cursor-pointer transition-all
                    text-bluedeep font-semibold hover:bg-greyF3 hover:text-primary focus:bg-bluelighter`}
                    value={1}
                    onClick={() => setIsOpenAddRc(true)}
                  >
                    <span>+ Добавить новый ЖК</span>
                  </div>
                </>
              ) : query.length > 1 ? (
                <>
                  {filteredOptions.map((option) => {
                    if (option) {
                      return (
                        <div
                          onClick={selectRelatedItem}
                          data-value={option.id}
                          key={option.id}
                          className={`relative select-none py-2 px-[6px] mx-[6px] mb-[2px] rounded-md cursor-pointer transition-all
                          text-blue hover:bg-greyF3 hover:text-primary focus:bg-bluelighter`}
                          value={option}
                        >
                          {option.name}
                        </div>
                      );
                    }
                  })}
                  <div
                    className={`relative select-none py-2 px-[6px] mx-[6px] mb-[2px] rounded-md cursor-pointer transition-all
                    text-bluedeep font-semibold hover:bg-greyF3 hover:text-primary focus:bg-bluelighter`}
                    value={1}
                    onClick={() => setIsOpenAddRc(true)}
                  >
                    <span>+ Добавить новый ЖК</span>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          </OutsideAlerter>
        ) : (
          ""
        )}
      </div>

      <Dialog open={isOpenRcSuccess} onClose={() => setIsOpenRcSuccess(false)}>
        <DialogWrapper>
          <Dialog.Panel className="bg-white p-5 max-w-[400px] rounded-[10px] mx-[16px]">
            <DialogMessage
              isShow={isOpenRcSuccess}
              onClose={() => setIsOpenRcSuccess(false)}
              title={"Успешно!"}
              subtitle={"ЖК был отправлен на проверку"}
              minititle={"Вы можете выбрать ваш ЖК в соответствующем поле"}
            />
          </Dialog.Panel>
        </DialogWrapper>
      </Dialog>

      <Dialog open={isOpenAddRc} onClose={() => setIsOpenAddRc(false)}>
        <DialogWrapper>
          <Dialog.Panel className="bg-greylight p-5 max-w-[600px] rounded-[10px] w-full">
            <AddRcModal
              isOpenAddRc={isOpenAddRc}
              setIsOpenAddRc={setIsOpenAddRc}
              setIsOpenRcSuccess={setIsOpenRcSuccess}
              rcAddedCallback={rcAddedCallback}
            />
          </Dialog.Panel>
        </DialogWrapper>
      </Dialog>
    </>
  );
}
