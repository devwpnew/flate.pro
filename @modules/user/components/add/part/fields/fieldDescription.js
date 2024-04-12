import { useRef, useEffect, useState } from "react";

import H2 from "@modules/common/components/heading/h2";
import Editablearea from "@modules/common/components/textarea/editablearea";
import parseToJsx from "helpers/formatters/parseToJsx";
import TextareaRequired from "@modules/common/components/textarea/textareaRequired";

export default function FieldDescription({ form, setForm, product }) {
  const [isPlaceholder, setIsPlaceholder] = useState(true);
  const [resHtml, setResHtml] = useState(null);
  const [error, setError] = useState(null);

  const [descr, setDescr] = useState(
    product?.product_description ? product?.product_description : ""
  );

  // const setDesc = () => {
  //   const html = document.querySelector("#product_description").innerHTML;

  //   setForm({ ...form, product_description: html });

  //   setResHtml(html);
  // };

  // useEffect(() => {
  //   setError("");
  //   if (!resHtml || resHtml.length === 0) {
  //     setError("Это поле обязательно");
  //   } else {
  //   }
  // }, [resHtml]);

  // console.log(error);
  return (
    <>
      <H2>
        Описание <span className="text-red">*</span>
      </H2>
      <div className="w-full mb-5">
        {/* {error && <span className="text-red">{error}</span>} */}

        <TextareaRequired
          id={"product_description"}
          name={"product_description"}
          areaStyle="h-[170px]"
          style="pt-2.5 h-full"
          onChange={(ev) => {
            setDescr(ev.target.value);
            setForm({ ...form, product_description: ev.target.value });
          }}
          value={descr}
          placeholder={`Расскажите, что есть в квартире и рядом с домом, в каком состоянии жильё. Покупателям интересно, сколько идти до магазинов и остановок транспорта, есть ли рядом торговые центры, парки и другая инфраструктура.
           
Не дублируйте номер телефона в описании.`}
        />

        {/* <Editablearea
          id={"product_description"}
          onInput={setDesc}
          onClick={() => !product?.product_description && setIsPlaceholder(false)}
        >
          {isPlaceholder && (
            <Placeholder
              content={ product?.product_description && parseToJsx(product?.product_description)
              }
            />
          )}
        </Editablearea> */}
      </div>
    </>
  );
}

export function Placeholder({ content }) {
  if (content) {
    return content;
  } else {
    return (
      <div className="relative">
        <div className="absolute left-0 top-0">
          Расскажите, что есть в квартире и рядом с домом, в каком состоянии
          жильё. Покупателям интересно, сколько идти до магазинов и остановок
          транспорта, есть ли рядом торговые центры, парки и другая
          инфраструктура. <br />
          <br />
          <span className="font-bold">Внимание!</span> Не дублируйте номер
          телефона в описании
        </div>
      </div>
    );
  }
}
