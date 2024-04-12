import { Transition } from "@headlessui/react";

export default function TransitionWrapper({ children, show, className = "" }) {
  return (
    <Transition
      show={show}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
      className={`${className ? className : "absolute top-[100%] left-0 z-20"}`}
    >
      {children}
    </Transition>
  );
}
