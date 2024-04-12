import api from "pages/api/service/api";
import { useState, useEffect } from "react";

import Image from "next/image";

import H2 from "@modules/common/components/heading/h2";
import Preloader from "@modules/common/components/preloader/preloader";

import houses from "public/navbar/houses.svg";
import flats from "public/navbar/flats.svg";
import parking from "public/navbar/parking.svg";
import commertion from "public/navbar/commertion.svg";
import earth from "public/navbar/earth.svg";

export default function FieldSection({
  sectionId,
  setSectionId,
  form,
  setForm,
}) {
  const [activeValue, setActiveValue] = useState(null);

  const [isLoading, setLoading] = useState(true);
  const [sections, setSections] = useState(null);

  useEffect(() => {
    (async function fetchData() {
      setLoading(true);

      const response = await api.get.sections({
        window_host: window.location.origin,
        sort: {
          id: "asc",
        },
        filter: {
          active: true,
        },
      });

      const result = response.map((item) => {
        if (item.name === "Квартиры") {
          item.image = flats;
          return item;
        }
        if (item.name === "Дома") {
          item.image = houses;
          return item;
        }
        if (item.name === "Земля") {
          item.image = earth;
          return item;
        }
        if (item.name === "Коммерция") {
          item.image = commertion;
          return item;
        }

        if (item.name === "Паркинги") {
          item.image = parking;
          return item;
        }
      });

      setSections(result);

      setLoading(false);
    })();
  }, []);

  const clickHandler = (id) => {
    setActiveValue(id);
    setSectionId(id);
    setForm({ ...form, section_relation: id });
  };

  return (
    <div className="mb-2.5">
      <H2>Выберите категорию</H2>
      {isLoading ? (
        <div className="w-[300px] h-[100px]">
          <Preloader />
        </div>
      ) : (
        <div className="flex gap-2.5 flex-wrap">
          {sections.map(({ name, id, image }, index) => (
            <label
              key={id}
              onClick={() => clickHandler(id)}
              className={`py-2.5 px-4 cursor-pointer transition-all border rounded-md ${
                activeValue && activeValue === id
                  ? "border-blue bg-bluelighter"
                  : "border-greyborder"
              } hover:border-blue hover:bg-bluelighter`}
            >
              <div className="flex flex-col justify-center items-center gap-2.5">
                <Image src={image.src} width={40} height={40} />
                <div className="text-xs text-center text-primary w-[70px]">
                  {name}
                </div>
              </div>
              <input
                type={"radio"}
                name={"section_relation"}
                value={id}
                className="hidden"
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
