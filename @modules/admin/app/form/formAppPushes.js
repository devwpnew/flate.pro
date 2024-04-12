import { useState } from "react";
import Button from "@modules/common/components/button/button";
import H2 from "@modules/common/components/heading/h2";
import Input from "@modules/common/components/input/input";
import api from "pages/api/service/api";
import PreloaderWithBackdrop from "@modules/common/components/preloader/preloaderWithBackdrop";
import { Dialog } from "@headlessui/react";
import DialogWrapper from "@modules/common/components/dialog/dialogWrapper";
import DialogMessage from "@modules/common/components/dialog/dialogMessage";

const names = {
  title: "Заголовок",
  text: "Сообщение",
};

export default function FormAppPushes() {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const sendPush = async (data) => {
    setStatus("loading");

    let status = "error";

    try {
      await api.add.pushMessageAll(data.get("title"), data.get("text"));
      status = "success";
    
    } catch (e) {
      console.log(e);
      setStatus(status);
      setError('Произошла непредвиденная ошибка')
    }

    setStatus(status);
  };

  const onFormPushesSubmit = (ev) => {
    ev.preventDefault();

    let error = "";
    setError("");

    setStatus("processing");
    const data = {};
    const formData = new FormData(ev.target);

    if (formData.size > 0) {
      error = `Вы не заполнили поля`;
      setError(error);
      return;
    }

    formData.forEach((value, key) => {
      if (!value) {
        error = `Вы не заполнили поле "${names[key]}"`;
        setError(error);
        return;
      }

      if (value.length < 5) {
        error = `Поле "${names[key]}" слишком короткое`;
        setError(error);
        return;
      }

      data[key] = value;
    });

    if (error) {
      setStatus("error");
      return;
    }

    sendPush(formData);
  };

  return (
    <>
      <form className="relative" onSubmit={onFormPushesSubmit}>
        <H2 additionalClass="inline-flex items-center gap-2 mb-5">
          Пуш сообщение
        </H2>

        <PreloaderWithBackdrop isShow={status === "loading"} />

        <Input
          required={true}
          topTitle={names.title}
          style={"py-2.5 mb-5"}
          placeholder={names.title}
          name={"title"}
        />

        <Input
          required={true}
          topTitle={names.text}
          style={"py-2.5 mb-5"}
          placeholder={names.text}
          name={"text"}
        />

        <Button className={"py-2.5"} type={"submit"}>
          Отправить
        </Button>
      </form>
      <Dialog open={status === "error"} onClose={() => setStatus("idle")}>
        <DialogWrapper>
          <Dialog.Panel className="bg-white p-5 max-w-[400px] rounded-[10px] mx-[16px]">
            <DialogMessage
              title={"Ошибка"}
              subtitle={error}
              isShow={status === "error"}
              onClose={() => setStatus("idle")}
            />
          </Dialog.Panel>
        </DialogWrapper>
      </Dialog>

      <Dialog open={status === "success"} onClose={() => setStatus("idle")}>
        <DialogWrapper>
          <Dialog.Panel className="bg-white p-5 max-w-[400px] rounded-[10px] mx-[16px]">
            <DialogMessage
              title={"Успех"}
              subtitle={"Пуш уведомление успешно отправлено"}
              isShow={status === "success"}
              onClose={() => setStatus("idle")}
            />
          </Dialog.Panel>
        </DialogWrapper>
      </Dialog>
    </>
  );
}
