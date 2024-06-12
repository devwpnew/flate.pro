import Button from "@modules/common/components/button/button";
import Container from "@modules/common/components/container/container";
import FallbackDevelopment from "@modules/common/components/fallback/FallbackDevelopment";
import H1 from "@modules/common/components/heading/h1";
import { useRouter } from "next/router";

export default function SubscribeContent() {
  const router = useRouter();

  function openWaInBlank(e) {
    e.preventDefault();
    const href = `https://wa.me/79899966015`;

    const as = router.asPath;
    window.open(href, "_blank");
  }
  return (
    <Container>
      <div className="pt-3 pb-2.5 lg:border-b-[1px] lg:border-greyborder">
        {/* <H1>Платные услуги</H1> */}
      </div>
      <FallbackDevelopment
        text={
          <>
            Мы сами очень грустим, потому что не можем принимать платежи в
            автоматическом режиме из-за бюрократических проволочек. Надеемся,
            что в течении недель FLATE все-таки подключат. <br />
            <br />
            Если вы хотите сделать свое объявление премиум - напишите нам в
            WhatsApp.
            <br />
            <br />
            Стоимость: 990 руб за 30 дней. Благодарим за интерес.
            <br /> <br />
            <a
              target="_blank"
              className="text-blue hover:text-bluelight"
              href="https://flate.pro/help"
            >
              Узнать, что дает премиум
            </a><br /> <br />
            <Button
              type={"green"}
              className={"w-auto px-[15px] py-2 ml-1"}
              onClick={openWaInBlank}
            >
              Написать в WhatsApp
            </Button>
          </>
        }
      />
    </Container>
  );
}
