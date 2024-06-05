import { useState, useEffect } from "react";

import Button from "@modules/common/components/button/button";
import ReactCodeInput from "react-code-input";

export default function LoginFormStepTwo({
  smsCheckStepHandler,
  userPhone,
  changeCodeHandler,
  sendSmsStepHandler,
  setUserId,
  smsError
}) {
  const [retrySmsSended, setRetrySmsSended] = useState(false);
  const [isRetry, setIsRetry] = useState(false);
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((seconds) => seconds - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      setIsRetry(true);
    }
  }, [seconds]);

  return (
    <form onSubmit={(ev) => {ev.preventDefault(); smsCheckStepHandler();}}>
      <div className="text-2xl font-semibold mb-5 text-center">
        
        {retrySmsSended ? "Введите код из смс" : "Введите последние 4 цифры номера"}
        
      </div>

      <div className="text-sm mb-2 text-center">
        <span className="text-grey">{retrySmsSended ? "Отправили смс на " : "Звоним на "}</span>
        <span className="text-primary font-semibold">{userPhone}</span>
      </div>

      <div className="mb-[26px] text-center">
        <span
          className="text-grey hover:text-blue cursor-pointer text-xs"
          onClick={() => setUserId(false)}
        >
          Изменить номер
        </span>
      </div>

      <div className={`md:w-[230px] mx-auto flex justify-center ${retrySmsSended ? 'lg:justify-center': 'lg:justify-start'} flex-row items-center mb-[26px] gap-2`}>
      {retrySmsSended ? "" : <span className="text-[14px] text-grey whitespace-nowrap">+7(•••) •••</span>}

        <ReactCodeInput
          type="number"
          fields={4}
          name="smsInput"
          inputStyle={{
            width: 29,
            height: 35,
            background: "#FFFFFF",
            border: "1px solid #ссс",
            borderRadius: "4px",
            marginRight: 5,
            MozAppearance: "textfield",
            WebkitAppearance: "none",
            textAlign: "center",
            fontWeight: 600,
          }}
          onChange={changeCodeHandler}
        />
      </div>

      <div className="md:w-2/3 mx-auto">
        <Button>
          <div
            className="py-2.5 font-bold"
            onClick={() => {
              smsCheckStepHandler();
            }}
          >
            Продолжить
          </div>
        </Button>
      </div>

      <div className="text-red font-bold text-center mt-1">{smsError && smsError}</div>

      <div className="mb-[26px] mt-[20px] text-center">
        {isRetry ? (
          !retrySmsSended && (
            <span
              className="text-grey text-sm hover:text-blue cursor-pointer"
              onClick={() => {
                setRetrySmsSended(true);
                if(isRetry) {
                  sendSmsStepHandler({});
                }
              }}
            >
              Запросить смс
            </span>
          )
        ) : (
          <span className="text-grey text-sm hover:text-blue cursor-pointer">
            Мне не позвонили ({seconds} сек.)
          </span>
        )}
      </div>
    </form>
  );
}
