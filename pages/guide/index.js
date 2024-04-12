import Container from "@modules/common/components/container/container";
import MotionContainer from "@modules/common/components/container/motionContainer";
import H1 from "@modules/common/components/heading/h1";
import SEO from "@modules/common/components/seo/seo";

import Image from "next/image";
import iosimg1 from "public/guide/ios/1.jpeg";
import iosimg2 from "public/guide/ios/2.jpeg";
import iosimg3 from "public/guide/ios/3.jpeg";

export default function Guide() {
  return (
    <>
      <SEO
        title={`Инструкция на сайте – база объявлений FLATE.PRO`}
        description={`Инструкция сайта объявлений FLATE.PRO – площадки объявлений о продаже квартир, домов, земельных участков, коммерций и паркингов в городе Сочи.`}
      />
      <MotionContainer>
        <Container>
          <div className="pt-3 pb-2.5 lg:border-b-[1px] lg:border-greyborder">
            <H1>Инструкция IOS</H1>
          </div>
          <p>
            <br />
            1.Зайдите на FLATE.PRO и нажмите на иконку с книгой <br />
            <br />
            <Image
              src={iosimg1.src}
              width={iosimg1.width}
              height={iosimg1.height}
            />
            <br />
            2.Выберите “На экран “Домой” <br />
            <br />
            <Image
              src={iosimg2.src}
              width={iosimg2.width}
              height={iosimg2.height}
            />
            <br />
            3.Теперь мобильная версия сайта всегда под рукой <br />
            <br />
            <Image
              src={iosimg3.src}
              width={iosimg3.width}
              height={iosimg3.height}
            />
          </p>
        </Container>
      </MotionContainer>
    </>
  );
}
