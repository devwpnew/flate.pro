import { useEffect, useState } from "react";
import Button from "@modules/common/components/button/button";
import H2 from "@modules/common/components/heading/h2";
import Input from "@modules/common/components/input/input";
import api from "pages/api/service/api";
import PreloaderWithBackdrop from "@modules/common/components/preloader/preloaderWithBackdrop";
import { Dialog } from "@headlessui/react";
import DialogWrapper from "@modules/common/components/dialog/dialogWrapper";
import DialogMessage from "@modules/common/components/dialog/dialogMessage";

const names = {
  need_update_title: "Заголовок",
  need_update_desc: "Текст",
  android_version: "Версия Android",
  ios_version: "Версия IOS",
};

export default function FormAppAppBlock() {
  const [form, setForm] = useState({
    need_update_title: null,
    need_update_desc: null,
    android_version: null,
    ios_version: null,
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const saveFormAppBlock = async (formData) => {
    setStatus("loading");

    let status = "error";

    try {
      const result = await api.update.settings(formData);
      console.log(result, "result");
      status = "success";
    } catch (e) {
      console.log(e);
      setStatus(status);
      setError("Произошла непредвиденная ошибка");
    }

    setStatus(status);
  };

  const onFormAppBlockSubmit = (ev) => {
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

      data[key] = value;
    });

    if (error) {
      setStatus("error");
      return;
    }

    saveFormAppBlock(formData);
  };

  useEffect(() => {
    (async () => {
      setStatus("loading");
      for (const key in names) {
        const result = await api.get.setting(key, true);
        setForm((prevState) => ({
          ...prevState,
          [key]: result,
        }));
      }
      setStatus("idle");
    })();
  }, []);

  const inputs = [];

  for (const key in names) {
    inputs.push(
      <Input
        onChange={(e) => {
          setForm((prevState) => ({
            ...prevState,
            [key]: e.target.value,
          }));
        }}
        value={form[key]}
        required={true}
        topTitle={names[key]}
        style={"py-2.5 mb-5"}
        placeholder={names[key]}
        name={key}
      />
    );
  }

  return (
    <>
      <form className="relative" onSubmit={onFormAppBlockSubmit}>
        <H2 additionalClass="inline-flex items-center gap-2 mb-5">
          Блокирующее уведомление
        </H2>
        <PreloaderWithBackdrop isShow={status === "loading"} />

        {inputs.map((input) => input)}

        <Button className={"py-2.5"} type={"submit"}>
          Сохранить
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
