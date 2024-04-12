import { useEffect, useRef } from "react";

export default function SelectCheckBoxItem({
  name,
  option,
  selected,
  setSelectedHandler,
  defaultOption,
}) {
  const inputRef = useRef();

  useEffect(() => {
    if (
      defaultOption == inputRef.current.value ||
      selected?.id === inputRef.current.value
    ) {
      inputRef.current.checked = true;
    }

    if(option.id === "" && !defaultOption) {
      inputRef.current.checked = true;
    }
  }, [selected]);

  return (
    <label
      className="flex items-center w-auto cursor-pointer group b-contain"
      onClick={() => setSelectedHandler(option)}
    >
      <input type="radio" value={option.id} name={name} ref={inputRef} />
      <div className="b-input" style={{ top: 5 }}></div>
      <span className="text-black group-hover:text-blue text-sm">
        {option.name}
      </span>
    </label>
  );
}
