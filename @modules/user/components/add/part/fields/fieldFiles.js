import H2 from "@modules/common/components/heading/h2";
import Input from "@modules/common/components/input/input";

export default function FieldFiles({product}) {
  return (
    <>
      <H2>Файлы</H2>
      <div className="w-full md:w-[300px] mb-5">
        <Input
          onlyNumbers={true}
          name={"youtube_video_link"}
          style={"flex-grow h-10"}
          placeholder={"Ссылка на ютуб"}
          defaultValue={product?.youtube_video_link}
        />
      </div>

      <div className="w-full md:w-[300px]">
        <Input
          onlyNumbers={true}
          name={"cloud_links"}
          style={"flex-grow h-10"}
          placeholder={"Ссылка на облако"}
          defaultValue={product?.cloud_links}
        />
      </div>
    </>
  );
}
