import Container from "@modules/common/components/container/container";
import MotionContainer from "@modules/common/components/container/motionContainer";
import H1 from "@modules/common/components/heading/h1";
import SEO from "@modules/common/components/seo/seo";

import Image from "next/image";
import andrimg1 from "public/guide/andr/1.jpeg";
import andrimg2 from "public/guide/andr/2.jpeg";
import andrimg3 from "public/guide/andr/3.jpeg";
import andrimg4 from "public/guide/andr/4.jpeg";


export default function Android() {
  return (
    <>
      <SEO
        title={`Инструкция на сайте – база объявлений FLATE.PRO`}
        description={`Инструкция сайта объявлений FLATE.PRO – площадки объявлений о продаже квартир, домов, земельных участков, коммерций и паркингов в городе Сочи.`}
      />
      <MotionContainer>
        <Container>
          <div className="pt-3 pb-2.5 lg:border-b-[1px] lg:border-greyborder">
            <H1>Инструкция Android</H1>
          </div>
          <p>
            <br />
            1.Зайдите на FLATE.PRO и откройте меню настроек <br />
            <br />
            <Image
              src={andrimg1.src}
              width={andrimg1.width}
              height={andrimg1.height}
            />
            <br />
            2.Выберите пункт “Добавить на главный экран” <br />
            <br />
            <Image
              src={andrimg2.src}
              width={andrimg2.width}
              height={andrimg2.height}
            />
            <br />
            3.Нажмите “Добавить” <br />
            <br />
            <Image
              src={andrimg3.src}
              width={andrimg3.width}
              height={andrimg3.height}
            />
            <br />
            4.Поздравляем! Теперь мобильная версия у вас всегда под рукой.
            <br />
            <br />
            <Image
              src={andrimg4.src}
              width={andrimg4.width}
              height={andrimg4.height}
            />
          </p>
        </Container>
      </MotionContainer>
    </>
  );
}
