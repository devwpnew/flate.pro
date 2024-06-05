import { useEffect } from "react";

import MaskInput from "react-maskinput/lib";

import Button from "@modules/common/components/button/button";
import Container from "@modules/common/components/container/container";

export default function LoginFormStep({
  sendSmsStepHandler,
  smsError,
  changePhoneHandler,
  isCanSendForm,
}) {
  const onLoginFormSubmit = (e) => {
    isCanSendForm && sendSmsStepHandler({ type: "call" });
  };
  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        onLoginFormSubmit();
      }}
    >
      <div className="flex justify-center">
        <span className="text-2xl mb-5 font-semibold text-center">
          Вход или регистрация
        </span>
      </div>
      <div className="mb-5">
        <Container>
          <MaskInput
            onValueChange={(a, v) => console.log(a, v)}
            placeholder="+7"
            maskChar="_"
            className="w-full h-11 text-center outline-none px-2.5 border-greyborder rounded-lg bg-white py-2 border border-backdrop/20"
            mask={"+7 (000) 000-00-00"}
            name="user_phone"
            onPaste={(ev) => console.log(ev)}
            onChange={changePhoneHandler}
          />
          <div className="text-center text-red font-bold block mt-2.5">
            {smsError ? smsError : ""}
          </div>
        </Container>
      </div>
      <div className="mb-4 w-full">
        <Container className=" w-full">
            <Button isDisabled={!isCanSendForm}>
              <div className="py-2.5 font-bold">Получить код</div>
            </Button>
        </Container>
      </div>
    </form>
  );
}
