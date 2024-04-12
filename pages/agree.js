import MotionContainer from "@modules/common/components/container/motionContainer";
import Container from "@modules/common/components/container/container";
import H1 from "@modules/common/components/heading/h1";
import getLayout from "helpers/getLayout";
import SEO from "@modules/common/components/seo/seo";
import useUser from "hooks/useUser";
import { useSelector } from "react-redux";
import api from "./api/service/api";
export default function Agree({ data }) {
  const { DESKTOP, DESK_VARIANTS } = getLayout();

  const user = useUser(data.user);

  return (
    <>
      <SEO
        title={`Пользовательское соглашение – база объявлений FLATE.PRO`}
        description={`Пользовательское соглашение на обработку персональных данных площадки объявлений FLATE.PRO – доски объявлений о продаже квартир, домов, земельных участков, коммерций и паркингов в городе Сочи.`}
      />
      <MotionContainer>
        <Container>
          <div className="pt-3 pb-2.5 lg:border-b-[1px] lg:border-greyborder">
            <H1>Пользовательское соглашение</H1>
          </div>
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
