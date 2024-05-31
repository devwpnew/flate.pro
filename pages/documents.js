import MotionContainer from "@modules/common/components/container/motionContainer";
import Container from "@modules/common/components/container/container";
import H1 from "@modules/common/components/heading/h1";
import getLayout from "helpers/getLayout";
import SEO from "@modules/common/components/seo/seo";
import api from "./api/service/api";

import useUser from "hooks/useUser";
import Link from "next/link";

export default function Documents({ data }) {
  const { DESKTOP, DESK_VARIANTS } = getLayout();

  const user = useUser(data.user);

  return (
    <>
      <SEO
        title={`Политика конфиденциальности и условия использования | FLATE.PRO`}
        description={`Ознакомьтесь с нашей Политикой Конфиденциальности, Пользовательским Соглашением и Офертой на FLATE.PRO, чтобы узнать о правилах и условиях использования нашего сервиса недвижимости в Сочи.`}
      />
      <MotionContainer>
        <Container>
          <div className="pt-3 pb-2.5 lg:border-b-[1px] lg:border-greyborder">
            <H1>Юридические документы</H1>
          </div>
          <ul className="mt-5 list-decimal pl-2.5">
            <li className="ml-2 mt-1 text-grey text-sm">
              <Link href={"/policy"}>
                <a
                  className={`hover:text-blue cursor-pointer relative`}
                >
                  Политика конфиденциальности
                </a>
              </Link>
            </li>

            <li className="ml-2 mt-1 text-grey text-sm">
              <Link href={"/agree"}>
                <a
                  className={`hover:text-blue cursor-pointer relative`}
                >
                  Пользовательское соглашение
                </a>
              </Link>
            </li>

            <li className="ml-2 mt-1 text-grey text-sm">
              <Link href={"/oferta"}>
                <a
                  className={`hover:text-blue cursor-pointer relative`}
                >
                  Оферта
                </a>
              </Link>
            </li>
          </ul>
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
