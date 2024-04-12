import { Fragment, useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import Link from "next/link";
import TransitionWrapper from "../../animation/transitionWrapper";
import SelectButton from "./part/selectButton";

export default function SelectLinks({
  name,
  options,
  style,
  callback,
  addCallback,
  defaultOption,
  setState,
  toCategory,
  topTitle,
}) {
  if (!options) {
    return <></>;
  }

  const router = useRouter();
  const currentSlug = router.query.section_slug;
  const currentSlugSearchQuery = router.query.sections;

  const initialItemIndex = () => {
    let item = 0;

    options.map((e, index) => {
      if (e.slug == currentSlug || e.slug == currentSlug + "?row=1") {
        item = index;
        return;
      }

      if (e.id == currentSlugSearchQuery) {
        item = index;
      }
    });
    return item;
  };

  const getSectionId = () => {
    let id;
    options.map((e, index) => {
      if (e.slug == currentSlug || e.slug == currentSlug + "?row=1") {
        id = e.id;
        return;
      }
    });
    return id;
  };

  const [selected, setSelected] = useState(options[initialItemIndex()]);

  useEffect(() => {
    setSelected(options[initialItemIndex()]);
  }, [router]);

  useEffect(() => {
    if (currentSlug && callback) {
      callback(() => getSectionId());
    }
  }, [router]);

  return (
    <>
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative w-full h-full">
          <SelectButton
            selected={selected}
            name={name}
            style={style}
            topTitle={topTitle}
          />
          <TransitionWrapper>
            <Listbox.Options className="absolute left-[-100%] top-[100%] lg:left-[initial] mt-1 max-h-60 z-10 overflow-auto rounded-md bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm w-auto flex flex-col">
              {options.map((option) => {
                const href =
                  currentSlug || toCategory
                    ? `/posts/${option.slug}`
                    : `/search?sections=${option.id}`;

                return (
                  <Listbox.Option
                    key={option.id}
                    value={option}
                    as={"li"}
                    className={({ active, selected }) =>
                      `relative select-none rounded-md cursor-pointer transition-all text-primary ${
                        active ? "bg-greyF3 text-blue" : ""
                      } ${
                        selected ? "bg-bluelighter text-blue" : ""
                      } focus:bg-bluelighter`
                    }
                  >
                    {({ active, selected }) => (
                      <span
                        className={`${active ? "text-blue" : ""}${
                          selected ? "text-blue" : ""
                        }`}
                      >
                        <div onClick={(ev) => router.push(href)}>
                          <a className="py-2 px-[6px] mx-[6px] mb-[2px] block">
                            {option.name}
                          </a>
                        </div>
                      </span>
                    )}
                  </Listbox.Option>
                );
              })}
            </Listbox.Options>
          </TransitionWrapper>
        </div>
      </Listbox>
    </>
  );
}
