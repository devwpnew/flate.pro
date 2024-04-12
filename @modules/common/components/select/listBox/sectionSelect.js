import { useRouter } from "next/router";
import {useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import SelectOptions from "./part/selectOptions";
import SelectButton from "./part/selectButton";

export default function SectionSelect({
  name,
  options,
  style,
  setState,
  type,
}) {
  const router = useRouter();
  const currentSlug = router.query.section_slug;
  const currentSlugSearchQuery = router.query.sections;

  const initialItemIndex = () => {
    let item = 0;
    if (type == "sections") {
      options.map((e, index) => {
        if (e.slug == currentSlug || e.id == currentSlugSearchQuery) {
          item = index;
        }
      });
    }
    return item;
  };
  const [selected, setSelected] = useState(options[initialItemIndex()]);

  useEffect(() => {
    setSelected(options[initialItemIndex()]);
  }, [currentSlug]);

  return (
    <>
      <Listbox value={selected} onChange={(value) => {setSelected(value); setState(() => value.id)}}>
        <div className="relative w-full h-full">
          <SelectButton selected={selected} name={name} style={style} />

          <Listbox.Options className="absolute mt-1 max-h-60 w-full z-10 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            <SelectOptions options={options} />
          </Listbox.Options>
        
        </div>
      </Listbox>
    </>
  );
}