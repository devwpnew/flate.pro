import { Listbox } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import SelectName from "../../part/selectName";
import TopTitle from "@modules/common/components/formElement/topTitle";

function truncateString(str, num) {
  if (str.length > num) {
    return str.slice(0, num) + "...";
  } else {
    return str;
  }
}

export default function SelectButton({
  name,
  selected,
  style,
  multiple,
  placeholder,
  topTitle,
  required
}) {
  const bgColor = topTitle
    ? "bg-greylight border-greyC4"
    : "bg-white border-greyborder";

  const classNames = `flex items-center border rounded ${bgColor} relative w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 hover:border-blue hover:shadow-lg transition-all h-full px-2.5 ${style}`;

  const selectedText = !multiple
    ? selected?.name
    : placeholder
    ? placeholder
    : selected.length === 0 && "Не важно";

  const displayText =
    multiple && selected.length !== 0
      ? truncateString(selected.map((value) => value.name).join(", "), 22)
      : "";

  const inputText = !multiple
    ? selected.id
    : selected.map((value) => value.name).join(", ");

  return (
    <Listbox.Button className="h-full w-full">
      <div className={classNames}>
        <TopTitle isRequired={required} text={topTitle} />
        <div
          className="h-full w-full my-auto flex flex-row items-center justify-between"
          id={name}
        >
          <SelectName>
            {selectedText}
            {displayText}
          </SelectName>
          <ChevronDownIcon className="-mr-1 ml-2 h-4 w-4" />
        </div>
      </div>
      <input type={"hidden"} name={name} value={inputText} />
    </Listbox.Button>
  );
}
