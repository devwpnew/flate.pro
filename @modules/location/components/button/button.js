import API from "pages/api/service/api";

import { useDispatch, useSelector } from "react-redux";
import { setCity } from "store/global/user/userCity";
import { useState, useEffect, useRef } from "react";
import { Listbox } from "@headlessui/react";

import getLayout from "helpers/getLayout";
import Preloader from "@modules/common/components/preloader/preloader";
import SelectOptions from "@modules/common/components/select/listBox/part/selectOptions";
import TransitionWrapper from "@modules/common/components/animation/transitionWrapper";

export default function LocationButton({ icon, arrowIcon, width, height }) {
  const { DESKTOP } = getLayout();
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);

  const activeCity = useSelector((state) => state.userCity.value);
  const [selected, setSelected] = useState(activeCity);

  const [isLoading, setLoading] = useState(true);
  const [cities, setCities] = useState(null);

  useEffect(() => {
    (async function fetchData() {
      setLoading(true);

      setCities(
        await API.get.cities({
          window_host: window.location.origin,
          select: ["id", "name"],
        })
      );

      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async function setActiveSityGlobal() {
      dispatch(setCity(selected));
    })();
  }, [selected]);

  useEffect(() => {
    (async function setActiveSity() {
      setSelected(activeCity);
    })();
  }, [activeCity]);

  return (
    <>
      {isLoading ? (
        <div className="w-[75px] h-[33px]">
          <Preloader />
        </div>
      ) : (
        <Listbox value={selected} onChange={setSelected}>
          {({ open }) => {
            return (
              <div className="relative">
                <Listbox.Button>
                  <div
                    className={`flex items-center gap-2 cursor-pointer relative px-[10px] py-[6px] rounded-md group hover:bg-greyF3 active:bg-bluelighter ${
                      isOpen && "text-blue bg-bluelighter"
                    }`}
                  >
                    {icon && <Icon isDesktop={DESKTOP} />}

                    <span className={`transition-all text-sm font-bold`}>
                      {selected && selected.name}
                    </span>

                    {arrowIcon && <Arrow isDesktop={DESKTOP} isOpen={isOpen} />}
                  </div>
                </Listbox.Button>

                {open && <SelectOptions transitionWrapperClassName={'absolute top-[100%] -left-5 md:left-0 z-20'} options={cities} isOpen={setIsOpen} />}
              </div>
            );
          }}
        </Listbox>
      )}
    </>
  );
}

export function Icon({ isDesktop }) {
  return (
    <svg
      className={`group-hover:stroke-blue ${
        isDesktop ? "stroke-primary" : "stroke-blue"
      }`}
      width="14"
      height="16"
      viewBox="0 0 14 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13 6.66663C13 11.3333 7 15.3333 7 15.3333C7 15.3333 1 11.3333 1 6.66663C1 5.07533 1.63214 3.5492 2.75736 2.42399C3.88258 1.29877 5.4087 0.666626 7 0.666626C8.5913 0.666626 10.1174 1.29877 11.2426 2.42399C12.3679 3.5492 13 5.07533 13 6.66663Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 8.66663C8.10457 8.66663 9 7.7712 9 6.66663C9 5.56206 8.10457 4.66663 7 4.66663C5.89543 4.66663 5 5.56206 5 6.66663C5 7.7712 5.89543 8.66663 7 8.66663Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Arrow({ isDesktop, isOpen }) {
  return (
    <svg
      width="12"
      height="6"
      viewBox="0 0 12 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-all ${isOpen && "rotate-180"} 
      ${isDesktop && !isOpen ? "stroke-primary " : "stroke-blue "}`}
    >
      <path
        d="M11 1L7.14944 4.08045C6.648 4.4816 6.39728 4.68217 6.10775 4.71355C6.03613 4.72132 5.96387 4.72132 5.89225 4.71355C5.60272 4.68217 5.352 4.4816 4.85056 4.08045L1 1"
        stroke=""
        strokeLinecap="round"
      />
    </svg>
  );
}
