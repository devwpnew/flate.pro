import { Fragment, useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/solid";
import { useDispatch, useSelector } from "react-redux";

import { setFetchState } from "store/global/helpers/fetchTrigger";
import { setLogedIn } from "store/global/user/userLogin";
import SelectButton from "./part/selectButton";


export default function SelectNoAutocompleteWithLevels({ name, options, style, callback, addCallback, defaultOption }) {

  if(!options){
    return <></>
  }

  const [selected, setSelected] = useState(defaultOption ? defaultOption : options[0]);

  const fetchState = useSelector((state) => state.fetchTrigger.value);
  const dispatch = useDispatch();

  const setSelectedCallback = (value) => {
    setSelected(value)
    dispatch(setFetchState(!fetchState));
  }

  // if (inititalSection !== null) {
  //   useEffect(() => {
  //     options.map((e, index) => {
  //       if (inititalSection == e.slug) {
  //         setSelected(() => {
  //           options[index];
  //         });
  //       }
  //     });
  //   }, []);
  // }
  
  useEffect(() => {
    ( () => {
      if(addCallback){
        addCallback(
          function() {
            return selected ? {name: name, value: selected.id} : false
          }
        );
      }
      if (callback) {
        callback(() => selected);
      }
    })();
  }, [selected]);

  const printOptionsList = (options, level = 0) => {
    return options.map((option) => (
      printOption(option, level)
    ))
  }

  const printOption = (option, level) => {
    let optionRes = [<Listbox.Option
      key={option.id}
      value={option}
      as={Fragment}
      className={({ active }) => `relative select-none py-2 pl-10 pr-4 cursor-pointer ${active ? "text-blue" : "text-primary"}`}
    >
      {({ active, selected }) => (
        <li className={`${ active ? "bg-white text-primary" : "bg-white text-blue" }`} >
          {selected ? (
            <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${ active ? "text-blue" : "text-primary" }`} >
              <CheckIcon className="h-5 w-5" />
            </span>
          ) : null}
          {'--'.repeat(level)} {option.name}
        </li>
      )}
    </Listbox.Option>]
    if(option.children){
      optionRes.push(printOptionsList(option.children, level+1))
    }
    return optionRes
  }

  return (
    <>
      <Listbox value={selected} onChange={(value) => setSelectedCallback(value)}>
        <div className="relative w-full h-full">
          <SelectButton selected={selected} name={name} style={style} />
          <Listbox.Options className="absolute mt-1 max-h-60 w-full z-10 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {printOptionsList(options)}
          </Listbox.Options>
        </div>
      </Listbox>
    </>
  );
}
