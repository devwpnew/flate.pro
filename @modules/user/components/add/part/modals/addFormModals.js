import api from "pages/api/service/api";
import { useState } from "react";

import { Dialog } from "@headlessui/react";

import DialogWrapper from "@modules/common/components/dialog/dialogWrapper";
import DialogMessage from "@modules/common/components/dialog/dialogMessage";
import DialogAnimateWrapper from "@modules/common/components/dialog/dialogAnimateWrapper";
import DialogTitle from "@modules/common/components/dialog/dialogTitle";
import TextareaRequired from "@modules/common/components/textarea/textareaRequired";
import DialogCloseIcon from "@modules/common/components/dialog/dialogCloseIcon";
import Button from "@modules/common/components/button/button";
import parseToJsx from "helpers/formatters/parseToJsx";

export default function AddFormModals({
  setIsSuccess,
  isSuccess,
  isError,
  errorText,
  setIsError,
  isReject,
  setIsReject,
  productId,
}) {
  const [isRejectSuccess, setIsRejectSuccess] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [rejectText, setRejectText] = useState("");

  const onSendReject = async (ev, id, text) => {
    setRejectLoading(true);

    if (!text) return;

    ev.preventDefault();

    const response = await api.set.sendEditProduct(id, text);

    if (response?.itemId) {
      setIsRejectSuccess(true);
    }

    setRejectLoading(false);
  };
  

  return (
    <>
      <Dialog open={isSuccess} onClose={() => setIsSuccess(false)}>
        <DialogWrapper>
          <Dialog.Panel className="bg-white p-5 max-w-[400px] rounded-[10px] mx-[16px]">
            <DialogMessage
              isShow={isSuccess}
              onClose={() => setIsSuccess(false)}
              title={productId ? "Сохранено!" : "Спасибо!"}
              subtitle="Ваше объявление отправлено на проверку, оно появится в поиске
      через несколько минут"
            />
          </Dialog.Panel>
        </DialogWrapper>
      </Dialog>

      <Dialog open={isError} onClose={() => setIsError(false)}>
        <DialogWrapper>
          <Dialog.Panel className="bg-white p-5 max-w-[550px] rounded-[10px]">
            <DialogMessage
              isShow={isError}
              onClose={() => setIsError(false)}
              title="Произошла ошибка."
              subtitle={`Проверьте правильность ввода и повторите попытку`}
              minititle={errorText && parseToJsx(errorText)}
            />
          </Dialog.Panel>
        </DialogWrapper>
      </Dialog>

      <Dialog open={isReject} onClose={() => setIsReject(false)}>
        <DialogWrapper>
          <Dialog.Panel className="bg-white p-5 max-w-[470px] w-full rounded-[10px]">
            {rejectLoading ? (
              <DialogMessage
                isShow={isRejectSuccess}
                onClose={() => setIsReject(false)}
                title="Успешно"
                subtitle="Объявление было отклонено"
              />
            ) : (
              <DialogAnimateWrapper isShow={isReject}>
                <DialogTitle>Отклонить объявление</DialogTitle>

                <TextareaRequired
                  className="py-2.5 w-full outline-none min-h-[200px]"
                  placeholder="Опишите причину..."
                  value={rejectText}
                  onChange={(ev) => setRejectText(ev.target.value)}
                />

                <DialogCloseIcon onClick={() => setIsReject(false)} />

                <Button
                  className={"py-2.5 mt-2.5"}
                  onClick={(ev) => onSendReject(ev, productId, rejectText)}
                >
                  Принять
                </Button>
              </DialogAnimateWrapper>
            )}
          </Dialog.Panel>
        </DialogWrapper>
      </Dialog>
    </>
  );
}
