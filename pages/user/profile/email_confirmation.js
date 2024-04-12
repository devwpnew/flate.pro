import Container from "@modules/common/components/container/container";
import MotionContainer from "@modules/common/components/container/motionContainer";
import H1 from "@modules/common/components/heading/h1";
import getLayout from "helpers/getLayout";
import useUser from "hooks/useUser";
import { useRouter } from "next/router";
import api from "pages/api/service/api";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function EmailConfirmation({ data }) {
  const { DESK_VARIANTS } = getLayout();
  
  const router = useRouter();

  const user = useUser(data.user, "/user/profile/auth");

  // useEffect(() => {
  //   if (user && user.user_group?.id !== 1 && user.user_group?.id !== 5) {
  //     router.push("/user/profile/auth");
  //   }
  // }, [router, user]);

  const isEmailConfirmed = data?.user?.email_confirmed;

  useEffect(() => {
    // if (isEmailConfirmed) {
    setTimeout(() => {
      router.push("/user/profile/settings/");
    }, 3000);
    // }
  }, []);

  return (
    <MotionContainer>
      <Container>
        <div className="pt-3 pb-2.5 lg:border-b-[1px] lg:border-greyborder">
          <H1>Успешно подтверждено</H1>
        </div>
        <div className="mt-5">
          Сейчас вы будете перенаправлены на страницу настроек
        </div>
      </Container>
    </MotionContainer>
  );
}
export async function getServerSideProps(context) {
  require("dotenv").config();
  const { req, res, query } = context;

  const window_host = process.env.DOMEN;

  const user = await api.auth.isUserAuthorized(req, res);

  let data = {};

  if (user) {
    data["user"] = user;

    if (query.code && typeof user != "undefined") {
      if (user && user.email_confirmation == query.code) {
        const resultConfirm = await api.set.emailConfirmed(
          user.id,
          window_host
        );
        if (!resultConfirm.error) {
          user.email_confirmed = true;
        }
      }
    }
  }

  return { props: { data: { user } } };
}
