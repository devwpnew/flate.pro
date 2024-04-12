import Image from "next/image";

import Container from "@modules/common/components/container/container";
import H2 from "@modules/common/components/heading/h2";
import Filter from "@modules/posts/type/category/part/filter";

import imageEmpty from "public/very-sad-cat.png";

export default function SearchResultEmpty({ title, isCentered, ...other }) {
  return (
    <div {...other}>
      <div className="flex flex-col w-full">
        {/* <div className="w-full hidden lg:block">
        <H2>Найти недвижимость</H2>
        <div className="bg-greylight py-4 lg:shadow rounded">
          <Container>
            <Filter productsSum={0} />
          </Container>
        </div>
      </div> */}

        <Container>
          <div className="text-center mb-5">
            <H2 className={isCentered ? "text-center" : "text-left"}>
              {title ? title : "Ничего не найдено"}
            </H2>
          </div>
          <div
            className={isCentered ? "text-center text-lg" : "text-left text-lg"}
          >
            Мы не нашли объявлений по вашему запросу, попробуйте изменить
            параметры поиска.
          </div>
          <div className="text-center w-1/2 mx-auto">
            <Image
              src={imageEmpty.src}
              width={imageEmpty.width}
              height={imageEmpty.height}
            />
          </div>
        </Container>
      </div>
    </div>
  );
}
