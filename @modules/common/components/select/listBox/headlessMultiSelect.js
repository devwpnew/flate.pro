import { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";

function MyListbox({ options, selectedOptions, onChange }) {
    const [internalSelectedOptions, setInternalSelectedOptions] = useState(selectedOptions);

    useEffect(() => {
        setInternalSelectedOptions(selectedOptions);
    }, [selectedOptions]);

    const handleChange = (values) => {
        setInternalSelectedOptions(values);
        onChange(values);
    };

    return (
        <div className="w-72">
            <Listbox value={internalSelectedOptions} onChange={handleChange} multiple>
                <div className="z-10 relative mt-1">
                    <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-lg shadow-md cursor-default focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
                        <span className="block truncate">
                            {internalSelectedOptions.length > 0 ? "" : "Не выбрано"} {internalSelectedOptions.map((option) => options.find((el) => el.id == option).name).join(", ")}
                        </span>
                    </Listbox.Button>
                    <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {options.map((option) => (
                            <Listbox.Option
                                key={option.id}
                                value={option.id}
                                className={({ active }) =>
                                    `cursor-default select-none relative py-2 pl-10 pr-4 ${
                                        active ? "text-amber-900 bg-amber-100" : "text-gray-900"
                                    }`
                                }
                            >
                                {({ selected }) => (
                                    <>
                                        <span
                                            className={`block truncate ${
                                                selected ? "font-medium" : "font-normal"
                                            }`}
                                        >
                                            {option.name}
                                        </span>
                                        {selected ? (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                ✓
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </div>
            </Listbox>
        </div>
    );
}

export default MyListbox;
