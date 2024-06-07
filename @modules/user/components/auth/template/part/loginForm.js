import axios from "axios";
import api from "pages/api/service/api";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import LoginFormText from "./loginFormText";
import LoginFormHelp from "./loginFormHelp";
import LoginFormStepTwo from "./loginFormStepTwo";
import LoginFormStep from "./loginFormStep";

import PreloaderWithBackdrop from "@modules/common/components/preloader/preloaderWithBackdrop";
import { setLogedIn } from "store/global/user/userLogin";
import { useDispatch } from "react-redux";

export default function LoginForm({ data }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const [key, setKey] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [isCanSendForm, setIsCanSendForm] = useState(false);

  const [userId, setUserId] = useState(false);
  const [userCode, setUserCode] = useState(false);
  const [userPhone, setUserPhone] = useState(false);

  const [smsError, setErrors] = useState(false);

  const sendSmsStepHandler = async (type) => {
    setIsLoading(true);

    if (!userPhone) {
      setErrors("Введите номер телефона");
      setIsCanSendForm(false);
      setIsLoading(false);
      return;
    }

    setErrors(false);

    if (!smsError) {
      const smsAxios = await axios.post(
        `${window.location.origin}/api/user/sendSmsCode`,
        {
          phone: userPhone,
          ip: data.ip,
          window_host: window.location.origin,
          ...type, // Потом если менять бушь на 2 этапа смска без этого параметра отправляется, с ним - звонок
        }
      );

      if (smsAxios.data.userInfo) {
        setUserId(
          smsAxios.data.userInfo.itemId
            ? smsAxios.data.userInfo.itemId
            : smsAxios.data.userInfo.id
        );
      } else if (smsAxios.data && smsAxios.data.error) {
        if (
          smsAxios.data.error.status_text.indexOf("Подозрение на флуд") !== -1
        ) {
          setErrors("Превышено количесво попыток, повторите через 10 минут");
        } else {
          setErrors(smsAxios.data.error.status_text);
        }

        setIsCanSendForm(false);
      }
    }

    setIsLoading(false);
  };

  const smsCheckStepHandler = async () => {
    setIsLoading(true);

    if (!userPhone) {
      setErrors("Введите номер телефона");
      setIsCanSendForm(false);
      setIsLoading(false);
      return;
    }

    const userInputOtp = userCode;

    if (!userInputOtp || !userCode) {
      setIsLoading(false);
      return;
    }

    const smsAxios = await axios.post(
      `${window.location.origin}/api/user/checkSmsCode`,
      {
        userId: userId,
        userInputOtp: userInputOtp,
      }
    );

    // console.log(smsAxios);

    if (smsAxios.data.response == "correct") {
      const authorization = await api.auth.authorizeUser(
        userId,
        data.ip,
        data.userAgent,
        window.location.origin
      );

      if (authorization) {
        const updatedUser = await api.get.user({
          window_host: window.location.origin,
          filter: {
            id: userId,
          },
          sort: {
            id: "asc",
          },
          limit: "all",
        });

        dispatch(setLogedIn(updatedUser[0]));

        router.push({
          pathname: "/",
        });
      }
    } else if (smsAxios.data.error) {
      if (smsAxios.data?.error?.indexOf("Подозрение на флуд") !== -1) {
        setErrors("Превышено количесво попыток, повторите через 10 минут");
      } else {
        setErrors(smsAxios.data.error);
      }

      setIsCanSendForm(false);
    }
    setIsLoading(false);
  };

  const changePhoneHandler = (e) => {
    // if (e.target.value === "+7 (8" || e.target.value === "+7 ") {
    //   e.target.value = "+7 ";
    // }

    if (e.target.value === "+7 (8") {
      e.target.value = "+7 (";
    }

    if (e.target.value.length < 18) {
      setIsCanSendForm(false);
    } else {
      setIsCanSendForm(true);
    }

    setUserPhone(e.target.value);
  };

  const changeCodeHandler = (val) => {
    setUserCode(val);
  };

  useEffect(() => {
    function handleKeyDown(event) {
      // console.log();
      setKey(event.key);
    }
    document.addEventListener("keydown", handleKeyDown);

    return function () {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="order-2 p-7">
      <div className="md:w-[336px] md:mx-auto">
        <PreloaderWithBackdrop isShow={isLoading} />

        {userId ? (
          <LoginFormStepTwo
            smsCheckStepHandler={smsCheckStepHandler}
            sendSmsStepHandler={sendSmsStepHandler}
            userPhone={userPhone}
            changeCodeHandler={changeCodeHandler}
            setUserId={setUserId}
            smsError={smsError}
          />
        ) : (
          <LoginFormStep
            sendSmsStepHandler={sendSmsStepHandler}
            smsError={smsError}
            changePhoneHandler={changePhoneHandler}
            isCanSendForm={isCanSendForm}
          />
        )}

        {/* <LoginFormHelp /> */}
      </div>
      <LoginFormText />
    </div>
  );
}
