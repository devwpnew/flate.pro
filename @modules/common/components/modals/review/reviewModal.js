import { Dialog } from "@headlessui/react";

import ReviewForm from "./part/reviewForm";
import DialogWrapper from "../../dialog/dialogWrapper";

export default function ReviewModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogWrapper>
        <Dialog.Panel
          className={
            "mx-[16px] md:mx-auto bg-white px-5 pb-5 pt-5 rounded-[10px] relative max-w-[480px] w-full"
          }
        >
          <ReviewForm onClose={onClose} />
        </Dialog.Panel>
      </DialogWrapper>
    </Dialog>
  );
}
