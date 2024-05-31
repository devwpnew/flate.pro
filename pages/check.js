import api from "./api/service/api";
import { useState } from "react";

import MotionContainer from "@modules/common/components/container/motionContainer";
import Container from "@modules/common/components/container/container";
import H1 from "@modules/common/components/heading/h1";
import getLayout from "helpers/getLayout";
import SEO from "@modules/common/components/seo/seo";
import useUser from "hooks/useUser";

import MaskInput from "react-maskinput";
import Button from "@modules/common/components/button/button";
import PreloaderWithBackdrop from "@modules/common/components/preloader/preloaderWithBackdrop";

export default function Agree({ data }) {
  const { DESKTOP, DESK_VARIANTS } = getLayout();
  const [status, setStatus] = useState("idle");
  const [userLastLoginDate, setUserLastLoginDate] = useState("");
  const user = useUser(data.user, "/user/profile/auth");

  const handleFormSubmit = async (e) => {
    setStatus("loading");
    e.preventDefault();
    const formData = new FormData(e.target);
    const tel = formData.get("tel");

    const user = await api.get.userByPhone(tel);
    if (user?.last_login_date) {
      const date = new Date(user.last_login_date);

      var options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      };

      const formattedDate = date.toLocaleString("ru", options);

      setUserLastLoginDate(formattedDate);

      setStatus("success");
    } else {
      setUserLastLoginDate(user?.error);
      setStatus("error");
    }
  };

  const [userPhone, setUserPhone] = useState("");

  const changePhoneHandler = (e) => {
    if (e.target.value === "+7 (8") {
      e.target.value = "+7 (";
    }
    setUserPhone(e.target.value);
  };

  return (
    <>
      <SEO
        title={`Найти пользователя – база объявлений FLATE.PRO`}
        description={`Найти пользователя`}
      />
      <MotionContainer>
        <Container>
          <div className="pt-3 pb-2.5 lg:border-b-[1px] lg:border-greyborder">
            <H1>Найти пользователя</H1>
          </div>

          <form onSubmit={handleFormSubmit} className="relative my-5">
            <PreloaderWithBackdrop isShow={status === "loading"} />
            <MaskInput
              value={userPhone}
              onChange={changePhoneHandler}
              placeholder="+7"
              maskChar="_"
              className="w-full h-11 outline-none px-2.5 border-greyborder border rounded bg-white py-2"
              mask={"+7 (000) 000-00-00"}
              name="tel"
            />

            <input
              type="submit"
              className="mt-2.5 text-sm text-white w-full h-11 rounded md:text-black font-normal bg-blue  hover:underline underline-offset-2 cursor-pointer"
              value="Найти"
            />

            {userLastLoginDate && (
              <div className="font-bold mt-2.5">
                Дата последнего входа в аккаунт: {userLastLoginDate}
              </div>
            )}
          </form>
        </Container>
      </MotionContainer>
    </>
  );
}

export async function getServerSideProps(context) {
  require("dotenv").config();
  const { section_slug } = context.query;

  let data = {};

  const { req, res } = context;
  const window_host = process.env.DOMEN;

  const user = await api.auth.isUserAuthorized(req, res);

  if (user) {
    data["user"] = user;
  }

  return { props: { data } };
}
