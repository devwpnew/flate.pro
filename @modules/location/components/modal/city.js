import React from "react";
import PropTypes from "prop-types";
import { Dialog, Transition } from "@headlessui/react";

import SelectNoAutocomplete from "@modules/common/components/select/listBox/selectNoAutocomplete";
import DialogTitle from "@modules/common/components/dialog/dialogTitle";
import DialogWrapper from "@modules/common/components/dialog/dialogWrapper";
import DialogCloseIcon from "@modules/common/components/dialog/dialogCloseIcon";
import Button from "@modules/common/components/button/button";

function City({ state, onClose }) {
  return (
    <Transition
      show={state}
      enter="transition-opacity duration-75"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Dialog open={state} onClose={onClose} className="relative z-50">
        <DialogWrapper>
          <Dialog.Panel className="mx-auto rounded bg-white z-10 p-5 max-w-[485px] w-full">
            <div className="relative flex flex-col">
              <DialogTitle className="text-center">Выбор города</DialogTitle>
              <DialogCloseIcon onClick={onClose} />
              <div className="w-full">
                <label>
                  <span className="text-xs text-grey">
                    Введите название региона или города
                  </span>
                  <SelectNoAutocomplete
                    style={"w-full h-11 border-blue"}
                    name={"cities"}
                    options={[
                      {
                        name: "Сочи",
                        id: "city",
                      },
                    ]}
                  />
                </label>
              </div>
              <div className="flex flex-wrap flex-row gap-x-[30px] gap-y-[20px] mt-[20px]">
                {/* <div className="underline text-sm cursor-pointer">
                  Москва и МО
                </div>
                <div className="underline text-sm cursor-pointer">
                  Санкт-Петербург и ЛО
                </div>
                <div className="underline text-sm cursor-pointer">
                  Екатеринбург
                </div> */}
                <div className="underline text-sm cursor-pointer">
                  Сочи
                </div>
                {/* <div className="underline text-sm cursor-pointer">
                  Казань
                </div>
                <div className="underline text-sm cursor-pointer">
                  Нижний Новгород
                </div> */}
              </div>
              <div className="flex flex-row gap-2.5 self-end w-1/2 mt-[60px]">
                <Button className="h-9 w-full" onClick={onClose}>Сохранить</Button>
                <Button className="h-9 w-full bg-white text-blue border-blue border font-bold" onClick={onClose}>Отменить</Button>
              </div>
            </div>
          </Dialog.Panel>
        </DialogWrapper>
      </Dialog>
    </Transition>
  );
}

City.propTypes = {
  state: PropTypes.bool,
  onClose: PropTypes.func,
};

export default City;
