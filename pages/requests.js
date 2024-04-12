import MotionContainer from "@modules/common/components/container/motionContainer";
import Container from "@modules/common/components/container/container";
import H1 from "@modules/common/components/heading/h1";
import getLayout from "helpers/getLayout";
import SEO from "@modules/common/components/seo/seo";
import api from "./api/service/api";
import useUser from "hooks/useUser";
import { useSelector } from "react-redux";
import { ErrorFallback } from "./_app";
import SearchResultEmpty from "@modules/search/components/part/searchResultEmpty";
import FavoritesEmpty from "@modules/posts/type/product/components/part/favoritesEmpty";
import FallbackDevelopment from "@modules/common/components/fallback/FallbackDevelopment";
export default function Requests({ data }) {
  const { DESKTOP, DESK_VARIANTS } = getLayout();
  const user = useUser(data.user);

  return (
    <>
      <SEO
        title={`Подборки на сайте – база объявлений FLATE.PRO`}
        description={`Подборки сайта объявлений FLATE.PRO – площадки объявлений о продаже квартир, домов, земельных участков, коммерций и паркингов в городе Сочи.`}
      />
      <MotionContainer>
        <Container>
          {/* <div className="pt-3 pb-2.5 lg:border-b-[1px] lg:border-greyborder">
            <H1>Подборки</H1>
          </div> */}
          <FallbackDevelopment
            text={
              <>
                Подборки уже доступны в{" "}
                <a target="_blank" className="text-blue" href="https://app.flate.pro">
                  приложении
                </a>
                <br />
                <br />
                Для сайта — раздел в разработке, планируем закончить за месяц.
                Мы обязательно вас известим. <br />
                <br />
                <a target="_blank" className="text-blue" href="https://app.flate.pro">
                  Скачать приложение → 
                </a>
              </>
            }
          />
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
