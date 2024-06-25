import { useState, useEffect, useRef } from "react";

import H2 from "@modules/common/components/heading/h2";
import Input from "@modules/common/components/input/input";
import RadioAddProduct from "@modules/common/components/radio/radioAddProduct";

import useFilterProps from "hooks/filter/useFilterProps";
import Preloader from "@modules/common/components/preloader/preloader";
import InputRequired from "@modules/common/components/input/inputRequaired";

export default function FieldPrice({
  setForm,
  form,
  formData,
  sectionId,
  product,
}) {
  const [price, setPrice] = useState("");
  const [squaresPrice, setSquaresPrice] = useState("");

  const [isCommissionOn, setIsCommissionOn] = useState(true);

  const numberFormat = new Intl.NumberFormat("ru");

  const onChangeHandler = (ev) => {
    if (ev.target.name === "product_price") {
      setPrice(ev.target.value);
    }

    ev.target.value = ev.target.value
      .replace(/[^0-9]/g, "")
      .replace(/(\.*)\./g, "$1");

    if (ev.target.value) {
      ev.target.value = numberFormat.format(ev.target.value);
    }
  };

  const props = useFilterProps([
    "off_comission_value",
    "mortgage",
    "sum_contract",
  ]);

  useEffect(() => {
    if (!formData) return;

    const form = {};

    formData.forEach((value, key) => {
      form[key] = value;
    });

    const squares =
      form?.land_squares || form?.living_squares || form?.object_squares;

    if (squares && price) {
      const squaresInt = parseInt(squares.replace(/\s/g, ""));
      const priceInt = parseInt(price.replace(/\s/g, ""));
      const squaresValue = Math.ceil(priceInt / squaresInt);
      const squaresFormatted = numberFormat.format(squaresValue);

      setSquaresPrice(squaresFormatted);
    }
  }, [formData, price]);

  useEffect(() => {
    if (price) {
      const int = parseInt(price.replace(/\s/g, ""));

      setForm({
        ...form,
        product_price: int,
      });
    }
  }, [price]);
  // console.log(squaresPrice);
  return (
    <>
      <H2>Условия сделки</H2>
      <div className="w-full mb-5">
        <div className="mb-2.5">
          <div className="text-sm font-bold mb-2 flex justify-between">
            <label className="flex gap-2.5 items-center cursor-pointer hover:text-blue transition-all">
              <span>
                Цена
                <span className="text-red">*</span>
              </span>
            </label>
          </div>

          <div className="flex flex-wrap gap-2.5 w-full">
            <div className="relative w-full md:w-[300px]">
              <InputRequired
                onlyNumbers={true}
                onlyNumbersBiggerThan={300000}
                name={"product_price"}
                style={"flex-grow h-10"}
                placeholder={"Цена"}
                onChange={onChangeHandler}
                defaultValue={product?.product_price}
              />

              <div className="absolute right-[30px] top-2.5 text-sm pointer-events-none">
                ₽
              </div>
            </div>

            <div className="relative w-auto">
              <div className="flex gap-2 text-grey items-center relative w-full text-left px-2.5 h-10 text-sm">
                <span>{squaresPrice && squaresPrice}</span>

                <div className="text-sm pointer-events-none">
                  руб. за м<sup className="text-[9px]">2</sup>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* {sectionId !== 6 && sectionId !== 7 && ( */}
        <div className="mb-2.5">
          <div className="mb-2.5 text-sm font-bold">
            <span>
              Ипотека<span className="text-red">*</span>
            </span>
          </div>

          {props.isLoading ? (
            <div className="h-10 w-full md:w-[300px]">
              <Preloader />
            </div>
          ) : (
            <RadioAddProduct
              containerClassName="flex gap-5"
              itemClassName="h-10 mb-1.5"
              name="mortgage"
              options={props.data.mortgage}
              defaultValue={product?.mortgage}
            />
          )}
        </div>
        {/* )} */}

        {/* {sectionId === 3 && ( */}
        <div className="w-full mb-2.5">
          <div className="text-sm font-bold mb-2 flex justify-between">
            <label className="flex gap-2.5 items-center cursor-pointer hover:text-blue transition-all">
              <span>
                Комиссия
                <span className="text-red">*</span>
              </span>
            </label>
          </div>

          {isCommissionOn && (
            <>
              <div
                className="mb-2.5 hidden"
                onClick={() => setIsCommissionOn((val) => !val)}
              >
                <label className="b-contain">
                  <span>Включена</span>
                  <input
                    type={"checkbox"}
                    name="comission"
                    value="Включена"
                    checked={true}
                    onChange={() => console.log("commission-off")}
                  />
                  <div className="b-input"></div>
                </label>
              </div>

              <InputRequired
                onlyNumbers={true}
                name={"comission_sum_terms"}
                style={"flex-grow h-10"}
                placeholder={"Сумма и условия"}
                defaultValue={product?.comission_sum_terms}
              />
            </>
          )}

          {!isCommissionOn && (
            <>
              <div
                className="mb-2.5"
                onClick={() => setIsCommissionOn((val) => !val)}
              >
                <label className="b-contain">
                  <span>Не включена</span>
                  <input
                    type={"checkbox"}
                    name="comission"
                    value="Не включена"
                    checked={true}
                  />
                  <div className="b-input"></div>
                </label>
              </div>

              {props.isLoading ? (
                <div className="h-10 w-full md:w-[300px]">
                  <Preloader />
                </div>
              ) : (
                <RadioAddProduct
                  containerClassName="flex gap-5"
                  itemClassName="h-10 mb-1.5"
                  name="off_comission_value"
                  options={props.data.off_comission_value}
                  defaultValue={product?.off_comission_value}
                />
              )}
            </>
          )}
        </div>
        {/* )} */}

        {/* {sectionId !== 6 && sectionId !== 7 && ( */}
        <div className="">
          <div className="mb-2.5 text-sm font-bold">
            <span>
              Сумма в договоре<span className="text-red">*</span>
            </span>
          </div>

          {props.isLoading ? (
            <div className="h-10 w-full md:w-[300px]">
              <Preloader />
            </div>
          ) : (
            <RadioAddProduct
              containerClassName="flex gap-5"
              itemClassName="h-10 mb-1.5"
              name="sum_contract"
              options={props.data.sum_contract}
              defaultValue={product?.sum_contract}
            />
          )}
        </div>
        {/* )} */}
      </div>
    </>
  );
}
