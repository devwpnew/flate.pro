import { useEffect } from "react";

import Button from "../button/button";
import DialogCloseIcon from "./dialogCloseIcon";
import DialogTitle from "./dialogTitle";
import DialogAnimateWrapper from "./dialogAnimateWrapper";

export default function DialogMessage({
  title,
  subtitle,
  minititle,
  onClose,
  onCloseText,
  isShow,
  onAccept,
  onAcceptText,
  isOffTimeout,
  className,
  hideCloseIcon,
}) {
  useEffect(() => {
    if (!isOffTimeout) {
      const timeoutId = setTimeout(() => {
        onClose(false);
      }, [15000]);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, []);

  return (
    <DialogAnimateWrapper className={className} isShow={isShow}>
      {title && (
        <div className="mb-5">
          <DialogTitle className={"mb-0 text-center"}>{title}</DialogTitle>
        </div>
      )}

      {onClose && !hideCloseIcon ? (
        <DialogCloseIcon onClick={onClose} className="absolute top-5 right-5" />
      ) : (
        ""
      )}

      {subtitle && (
        <div className="mb-5">
          <p className="text-lg text-center">{subtitle}</p>
        </div>
      )}

      {minititle && (
        <div className="mb-5">
          <p className="text-sm text-center">{minititle}</p>
        </div>
      )}

      <div className="flex flex-row justify-center items-center gap-2.5">
        {onClose ? (
          <div className="flex justify-center">
            <Button className={"w-auto py-2.5 px-7"} onClick={onClose}>
              {onCloseText ? onCloseText : "ОК"}
            </Button>
          </div>
        ) : (
          ""
        )}

        {onAccept && (
          <div className="flex justify-center">
            <Button className={"w-auto py-2.5 px-7"} onClick={onAccept}>
              {onAcceptText ? onAcceptText : "Да"}
            </Button>
          </div>
        )}
      </div>
    </DialogAnimateWrapper>
  );
}
