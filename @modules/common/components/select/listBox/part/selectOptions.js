import { Listbox } from "@headlessui/react";
import { useRef, useEffect } from "react";

import TransitionWrapper from "../../../animation/transitionWrapper";
import DialogCloseIcon from "@modules/common/components/dialog/dialogCloseIcon";

export default function SelectOptions({
  options,
  optionsProps,
  isOpen,
  isCanDelete,
  deleteAction,
  closeButtonClassList,
  transitionWrapperClassName,
}) {
  const isMounted = useRef(false);

  useEffect(() => {
    if (isOpen) {
      isOpen(true);

      return () => {
        isMounted.current = false;
        isOpen(false);
      };
    }
  }, []);

  const listClassName = ({ active, selected }, option) => {
    const className = `relative z-10 select-none py-2 px-[6px] mx-[6px] mb-[2px] rounded-md cursor-pointer transition-all
    text-primary text-sm md:text-base
    ${active ? "bg-greyF3 text-blue" : ""}
    ${selected ? "bg-bluelighter text-blue" : ""}
    ${option.name === "Не выбрано" ? "hidden" : ""}
    focus:bg-bluelighter md:pr-[30px]`;

    return className;
  };

  return (
    <TransitionWrapper className={transitionWrapperClassName}>
      <Listbox.Options
        {...optionsProps}
        className="mt-1 max-h-60 rounded-md bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm w-auto overflow-y-scroll"
        ref={isMounted}
      >
        {options &&
          options.map((option) => {
            return (
              <Listbox.Option
                key={option?.id}
                value={option}
                as={"li"}
                className={(value) => listClassName(value, option)}
              >
                {({ active, selected }) => (
                  <div className="relative">
                    <span
                      className={`${active ? "text-blue" : ""} ${selected ? "text-blue" : ""}`}
                    >
                      {option.name}
                    </span>
                    {isCanDelete && (
                      <>
                        <DialogCloseIcon
                          className={
                            closeButtonClassList
                              ? closeButtonClassList
                              : "top-[4px] z-50"
                          }
                          onClick={(ev) => {
                            ev.stopPropagation();
                            deleteAction(option.id);
                          }}
                        />
                      </>
                    )}
                  </div>
                )}
              </Listbox.Option>
            );
          })}
      </Listbox.Options>
    </TransitionWrapper>
  );
}
