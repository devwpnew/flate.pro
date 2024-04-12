import API from "pages/api/service/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Image from "next/image";
import Button from "@modules/common/components/button/button";
import Preloader from "@modules/common/components/preloader/preloader";
import CitySelect from "@modules/location/components/button/select";
import RangeSlider from "@modules/common/components/range/range-slider";
import SelectNoAutocomplete from "@modules/common/components/select/listBox/selectNoAutocomplete";
import closeBlue from "public/icons/close-blue.svg";

export default function FilterSidebar({
  products,
  sectionId,
  priceCallback,
  squaresCallback,
  areasCallback,
}) {
  const [isLoading, setLoading] = useState(true);
  const [sections, setSections] = useState(null);
  const [areas, setAreas] = useState(null);


  const [isSquaresLoading, setSquaresLoading] = useState(true);
  const [squares, setSquares] = useState({ min: null, max: null });

  const [isPriceLoading, setPriceLoading] = useState(true);
  const [price, setPrice] = useState({ min: null, max: null });

  const router = useRouter();
  const curSectionSlug = router.query.section_slug;

  // SECTIONS AND AREAS
  useEffect(() => {
    (async function fetchData() {
      setSections(
        await API.get.sections({
          window_host: window.location.origin,
          sort: {
            id: "asc",
          },
          filter: {
            active: true,
          },
        })
      );
      setAreas(
        await API.get.areas({
          window_host: window.location.origin,
          select: ["id", "name"],
        })
      );
      setLoading(false);
    })();
  }, []);

  // MIN MAX SQUARES
  useEffect(() => {
    (async function fetchSquares() {
      setSquares(getMaxMin("product_squares"));
      setSquaresLoading(false);
    })();
  }, []);

  // MIN MAX PRICE
  useEffect(() => {
    (async function fetchSquares() {
      setPrice(getMaxMin("product_price"));
      setPriceLoading(false);
    })();
  }, []);

  function getMaxMin(prop) {
    let min = null;
    let max = null;
    const arr = [];

    if(products) {
      products.map((item) => {
        const price = item.product_price ? parseInt(item.product_price) : null;
        const squares = item.living_squares
          ? parseInt(item.living_squares)
          : parseInt(item.land_squares);
        if (prop == "product_squares" && squares !== null) {
          arr.push(squares);
        }
  
        if (prop == "product_price") {
          arr.push(price);
        }
      });
    }

    arr.sort((a, b) => b - a);
    min = arr[arr.length - 1];
    max = arr[0];

    return { min, max };
  }

  return (
    <div className="flex flex-col gap-5 mt-5">
      <div className="flex flex-col">
        <span className="block text-grey text-sm">Площадь, м²</span>
        {squares.min && squares.max ? (
          <RangeSlider
            callback={squaresCallback}
            key={squares}
            min={0}
            max={squares.max}
            name="Площадь, м²"
          />
        ) : (
          <Preloader />
        )}
      </div>
      <div className="flex flex-col">
        <span className="block text-grey text-sm">Цена, руб</span>
        {price && price.min && price.max ? (
          <RangeSlider
            callback={priceCallback}
            key={price}
            min={0}
            max={price.max}
            name="Цена, руб"
          />
        ) : (
          <Preloader />
        )}
      </div>
      {isLoading ? (
        <Preloader />
      ) : (
        <div className="flex flex-col ">
          <span className="block text-grey text-sm">Район</span>
          <SelectNoAutocomplete
            style={"w-full h-11"}
            name={"areas"}
            options={[
              {
                id: 0,
                name: "Все",
              },
            ].concat(areas)}
            callback={areasCallback}
          />
        </div>
      )}

      <div className="flex flex-col">
        <span className="block text-grey text-sm">Город</span>
        <CitySelect style={"w-full h-11"} />
      </div>
      <div className="block">
        {/* <div className="h-9 w-full mb-1.5">
          <Button
            textColor={"primary"}
            color={"white"}
            className="border border-greyborder"
          >
            Показать 99 999 объявлений
          </Button>
        </div> */}
        {/* <div className="h-9 w-full">
          <Button
            textColor={"primary"}
            color={"white"}
            className="border border-greyborder"
          >
            <div className="flex items-center justify-center">
              <div className="mr-2">Очистить фильтр</div>
              <div>
                <Image
                  src={closeBlue.src}
                  width={closeBlue.width}
                  height={closeBlue.height}
                />
              </div>
            </div>
          </Button>
        </div> */}
      </div>
    </div>
  );
}
