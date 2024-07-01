import { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import SelectButton from "./part/selectButton";
import SelectOptionsCheckboxes from "./part/selectOptionsCheckboxes";

export default function SelectMultiSelect({
    style,
    options,
    callback,
    autoformat,
    name,
    addCallback,
    placeholder,
    defaultValue,
    setFilter,
    filter,
    topTitle,
}) {
    const [optionsArr, setOptionsArr] = useState(options);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedOptionsIds, setSelectedOptionsIds] = useState([]);

    useEffect(() => {


        if (callback) {
            callback(selectedOptionsIds);
        }
        if (addCallback) {
            addCallback(function () {
                return { name: name, value: selectedOptionsIds };
            });
        }

        if (setFilter && selectedOptionsIds && selectedOptionsIds.length > 0) {
            setFilter({
                ...filter,
                [name]: selectedOptionsIds,
            });
        }

        if (setFilter && selectedOptionsIds.length === 0) {
            const filterObj = { ...filter };
            delete filterObj[name];
            setFilter(filterObj);
        }
    }, [selectedOptionsIds]);

    if (autoformat) {
        
        useEffect(() => {
            const optionsNew = [];
            options.map((el, index) => {
                optionsNew.push({ name: el, id: `${index}` });
            });
            setOptionsArr(optionsNew);
        }, []);
    }

    const setSelectedIds = async (value) => {
        const selectedIds = [];

        await Promise.all(
            value.map(async (e) => {
                selectedIds.push(e.id ? e.id : e);
            })
        );
        setSelectedOptionsIds(selectedIds);
    };

    // Set default value
    useEffect(() => {
        if (defaultValue && options) {
            const defaultSelectedOptions = [];
            defaultValue.map((value) => {
                const filtered = options.slice().find((el) => el.id == value);
                defaultSelectedOptions.push(filtered);
            });

            setSelectedOptions(defaultSelectedOptions);
            setSelectedIds(defaultValue);
        }
    }, []);

    // useEffect(() => {
    //   if (typeof defaultValue != "undefined" && defaultValue) {
    //     if (defaultValue.length && !selectedOptionsIds.length) {
    //       setSelectedIds(defaultValue);
    //       const defaultSelected = [];
    //       optionsArr.map((option) => {
    //         for (let i = 0; i < defaultValue.length; i++) {
    //           if (option.id == defaultValue[i]) {
    //             defaultSelected.push(option);
    //           }
    //         }
    //       });
    //       setSelectedOptions(defaultSelected);
    //     }
    //   }
    // }, [defaultValue, optionsArr]);

    // console.log(selectedOptions);

    return (
        <Listbox
            value={selectedOptions}
            onChange={(value) => {
                setSelectedOptions(value);
                setSelectedIds(value);
            }}
            multiple
        >
            <div className="relative w-full h-full">
                <SelectButton
                    name={name}
                    multiple={true}
                    selected={selectedOptions}
                    placeholder={placeholder}
                    style={style}
                    topTitle={topTitle}
                />
                <SelectOptionsCheckboxes options={options} />
            </div>
        </Listbox>
    );
}
