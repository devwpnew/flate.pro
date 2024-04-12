import { Dialog, Transition } from "@headlessui/react";

import DialogCloseIcon from "@modules/common/components/dialog/dialogCloseIcon";
import DialogWrapper from "@modules/common/components/dialog/dialogWrapper";

import RegistrationForm from "./registrationForm";

export default function RegistrationModal({ userId, state, onClose }) {
  return (
    <Transition
      show={state}
      enter="transition-opacity duration-75"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Dialog open={state} onClose={onClose} className="relative z-50">
        <DialogWrapper>
          <Dialog.Panel>
            <RegistrationForm userId={userId} />
          </Dialog.Panel>
        </DialogWrapper>
      </Dialog>
    </Transition>
  );
}
