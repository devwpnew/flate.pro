import { Listbox } from "@headlessui/react";
import { useRef, useEffect } from "react";
import TransitionWrapper from "../../../animation/transitionWrapper";

export default function SelectOptionsCheckboxes({
  options,
  optionsProps,
  isOpen,
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

  return (
    <TransitionWrapper>
      <Listbox.Options
        {...optionsProps}
        className="mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm px-[6px]"
        ref={isMounted}
      >
        {options &&
          options.map((option) => (
            <Listbox.Option
              key={option.id}
              value={option}
              as={"li"}
              className={({ active, selected }) =>
                `b-contain w-full relative select-none py-2 px-[6px] rounded-md cursor-pointer transition-all
                
                ${active ? "bg-greyF3 text-blue" : ""}
                ${selected ? "bg-bluelighter text-blue" : ""}`
              }
              style={{ marginBottom: "2px" }}
            >
              {({ active, selected }) => (
                <>
                  <input type="checkbox" value={option.id} />
                  <div
                    className={`b-input ${selected ? "active" : ""}`}
                    style={{ top: 11, left: 4 }}
                  ></div>
                  <span>{option.name}</span>
                </>
              )}
            </Listbox.Option>
          ))}
      </Listbox.Options>
    </TransitionWrapper>
  );
}
