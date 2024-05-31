import { CheckIcon } from "@heroicons/react/solid";
import MotionContainer from "@modules/common/components/container/motionContainer";
import Container from "@modules/common/components/container/container";
import H1 from "@modules/common/components/heading/h1";
import Button from "@modules/common/components/button/button";

import getLayout from "helpers/getLayout";
import useUser from "hooks/useUser";
import { useSelector } from "react-redux";
import api from "./api/service/api";
import SEO from "@modules/common/components/seo/seo";

export default function Tariff({ data }) {
  const { DESKTOP, DESK_VARIANTS } = getLayout();

  const user = useUser(data.user, "/user/profile/auth");

  return (
    <>
      <SEO
        title={`Тарифы FLATE.PRO | Варианты подписки на услуги недвижимости`}
        description={`Ознакомьтесь с нашими тарифами и выберите оптимальный план подписки для ваших нужд в покупке, продаже или аренде недвижимости в Сочи.`}
      />
      <MotionContainer>
        <Container>
          <div className="mt-[30px] pb-2.5 mb-[30px]">
            <H1>Выберите тариф</H1>
          </div>

          <div className="flex flex-col md:flex-row gap-5">
            <div className="block p-5 shadow max-w-[387px] h-[475px]">
              <div className="text-2xl text-grey">Базовый</div>
              <div className="text-[32px] font-bold mb-[30px]">Бесплатно</div>
              <div className="flex flex-col gap-2 5">
                <div className="flex gap-2.5">
                  <div className="w-5">
                    <CheckIcon className="h-5 w-5 text-blue" />
                  </div>
                  <span className="text-base">
                    Какие возможности входят в бесплантый тариф
                  </span>
                </div>
                <div className="flex gap-2.5">
                  <div className="w-5">
                    <CheckIcon className="h-5 w-5 text-blue" />
                  </div>
                  <span className="text-base">Возможность 1</span>
                </div>
              </div>
            </div>
            <div
              className="flex flex-col justify-between p-5 shadow max-w-[387px] h-[475px]"
              style={{ background: "rgba(249, 216, 94, 0.15)" }}
            >
              <div className="block">
                <div className="text-2xl text-grey">PRO</div>
                <div className="text-[32px] font-bold mb-[30px]">
                  1000 руб./мес
                </div>
                <div className="flex flex-col gap-2 5">
                  <div className="flex gap-2.5">
                    <div className="w-5">
                      <CheckIcon className="h-5 w-5 text-blue" />
                    </div>{" "}
                    <span className="text-base">
                      Какие возможности входят в бесплантый тариф
                    </span>
                  </div>
                  <div className="flex gap-2.5">
                    <div className="w-5">
                      <CheckIcon className="h-5 w-5 text-blue" />
                    </div>{" "}
                    <span className="text-base">Возможность 1</span>
                  </div>
                </div>
              </div>
              <div className="h-12">
                <Button>Купить</Button>
              </div>
            </div>
            <div
              className="flex flex-col justify-between p-5 shadow max-w-[387px] h-[475px]"
              style={{ background: "rgba(249, 216, 94, 0.25)" }}
            >
              <div className="block">
                <div className="text-2xl text-grey">Продвижение объявления</div>
                <div className="text-[32px] font-bold mb-[30px]">
                  99 руб./мес
                </div>
                <div className="flex flex-col gap-2 5">
                  <div className="flex gap-2.5">
                    <div className="w-5">
                      <CheckIcon className="h-5 w-5 text-blue" />
                    </div>{" "}
                    <span className="text-base">
                      Какие возможности входят в бесплантый тариф
                    </span>
                  </div>
                  <div className="flex gap-2.5">
                    <div className="w-5">
                      <CheckIcon className="h-5 w-5 text-blue" />
                    </div>{" "}
                    <span className="text-base">Возможность 1</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <p className="text-center">
                  *продвижение доступно только при наличии действующей подписки
                  PRO
                </p>
                <div className="h-12">
                  <Button>Купить</Button>
                </div>
              </div>
            </div>
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
