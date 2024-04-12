import { useEffect, useState } from "react";

import { CheckboxCheck } from "@modules/common/components/checkbox/checkboxCheck";
import H2 from "@modules/common/components/heading/h2";
import RadioAddProduct from "@modules/common/components/radio/radioAddProduct";
import Preloader from "@modules/common/components/preloader/preloader";

import useFilterProps from "hooks/filter/useFilterProps";
import SelectCheckBox from "@modules/common/components/select/checkBox/selectCheckBox";
import SelectMultiSelect from "@modules/common/components/select/listBox/selectMultiSelect";
import InputRequired from "@modules/common/components/input/inputRequaired";
import Input from "@modules/common/components/input/input";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const getInputSquaresName = (sectionId) => {
  if (sectionId === 3) {
    return "living_squares";
  }

  if (sectionId === 4) {
    return "land_squares";
  }

  if (sectionId === 5) {
    return "land_squares";
  }

  if (sectionId === 6) {
    return "object_squares";
  }

  if (sectionId === 7) {
    return "object_squares";
  }
};

export default function FieldAbout({ sectionId, product, form, setForm }) {
  const [selectedCommunication, setSelectedCommunication] = useState(false);

  useEffect(() => {
    setForm({ ...form, house_communication: selectedCommunication });
  }, [selectedCommunication]);
  const [inputSquaresName, setInputSquaresName] = useState(
    getInputSquaresName(sectionId)
  );

  useEffect(() => {
    setInputSquaresName(getInputSquaresName(sectionId));
  }, [sectionId]);

  const props = useFilterProps([
    "product_room_count",
    "repairment",
    "house_floors",
    "house_communication",
    "house_construction",
    "handed_over",
  ]);

  const onChangeHandler = (ev) => {
    ev.target.value = ev.target.value
      .replace(/[^0-9]/g, "")
      .replace(/(\..*)\./g, "$1");
  };

  const onChangeSquaresHandler = (ev) => {
    ev.target.value = ev.target.value.replace(/[^\d,.]/, "");
    ev.target.value = ev.target.value.replace(/[,]/, ".");
  };

  return (
    <>
      <H2>
        Об объекте <span className="text-red">*</span>
      </H2>
      <div className="flex flex-wrap gap-2.5 mb-5">
        {sectionId === 3 ? (
          <div className="w-[300px]">
            <div className="text-sm font-bold mb-2 flex justify-between">
              <span>Если хотите указать этаж</span>
            </div>

            <Input
              onlyNumbers={true}
              name={"flat_floors"}
              style={"flex-grow h-10"}
              placeholder={"Этаж"}
              onChange={onChangeHandler}
              defaultValue={product?.properties.product_floor}
            />
          </div>
        ) : (
          ""
        )}

        <div className="w-[300px]">
          {sectionId === 3 && (
            <>
              <>
                <div className="text-sm font-bold mb-2 inline-flex flex-row gap-2">
                  <span>Если знаете сколько этажей в доме</span>
                </div>

                <Input
                  onlyNumbers={true}
                  name={"flat_floors"}
                  style={"flex-grow h-10"}
                  placeholder={"Этажей в доме"}
                  onChange={onChangeHandler}
                  defaultValue={product?.flat_floors}
                />
              </>
            </>
          )}

          {sectionId === 4 && (
            <>
              <div className="text-sm font-bold mb-2">
                <span>
                  Этажей в доме <span className="text-red">*</span>
                </span>
              </div>
              {!props.isLoading ? (
                <RadioAddProduct
                  containerClassName="flex gap-5"
                  itemClassName="h-9 mb-1.5"
                  name="house_floors"
                  options={props.data.house_floors}
                  defaultValue={product?.house_floors}
                />
              ) : (
                <div className="h-10 w-full md:w-[300px]">
                  <Preloader />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {sectionId === 3 && (
        <div className="mb-5">
          <div className="text-sm font-bold mb-2">
            <span>
              Количество комнат
              <span className="text-red">*</span>
            </span>
          </div>

          {props.isLoading || props.error ? (
            <div className="h-10 w-full md:w-[300px]">
              <Preloader />
            </div>
          ) : (
            <RadioAddProduct
              containerClassName="flex flex-wrap gap-[10px]"
              itemClassName="h-9 mb-1.5"
              name="product_room_count"
              options={props.data.product_room_count}
              defaultValue={product?.product_room_count}
            />
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2.5">
        {sectionId === 4 && (
          <div className="w-auto mb-5">
            <div className="text-sm font-bold mb-2">
              Площадь дома<span className="text-red">*</span>
            </div>
            <div className="relative">
              <InputRequired
                onlyNumbers={true}
                name={"living_squares"}
                style={"flex-grow h-10"}
                placeholder={"Площадь"}
                onChange={onChangeSquaresHandler}
                defaultValue={product?.living_squares}
              />
              <div className="absolute right-[6px] top-2.5 text-sm pointer-events-none">
                м<sup className="text-[9px]">2</sup>
              </div>
            </div>
          </div>
        )}

        <div className="w-auto mb-5">
          <div className="text-sm font-bold mb-2">
            {sectionId === 4 ? "Площадь участка" : "Площадь"}
            <span className="text-red">*</span>
          </div>
          <div className="relative">
            <InputRequired
              onlyNumbers={true}
              name={inputSquaresName}
              style={"flex-grow h-10"}
              placeholder={
                product?.[inputSquaresName]
                  ? product?.[inputSquaresName]
                  : "Площадь"
              }
              onChange={onChangeSquaresHandler}
              defaultValue={product?.[inputSquaresName]}
            />

            {/* <InputRequired onlyNumbers={true} name={inputSquaresName} style={"flex-grow h-10"} onChange={onChangeSquaresHandler} defaultValue={product?.[inputSquaresName]}/> */}

            <div className="absolute right-[6px] top-2.5 text-sm pointer-events-none">
              {sectionId === 4 || sectionId === 5 ? (
                <>соток</>
              ) : (
                <>
                  м<sup className="text-[9px]">2</sup>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* <div className="mb-5">
        <div className="font-bold text-sm mb-2.5">Вид из окон</div>
        <Textarea
          name="window_view"
          style={"border-greyborder border rounded"}
          areaStyle={"rounded h-11"}
          placeholder={"Опишите что видно из вашего окна"}
        />
      </div> */}
      <div className="mb-5">
        {sectionId === 3 || sectionId === 4 ? (
          <>
            <div className="text-sm font-bold mb-2">
              Ремонт
              <span className="text-red">*</span>
            </div>
            <>
              <RadioAddProduct
                containerClassName="flex gap-5"
                itemClassName="h-9 mb-1.5"
                name="repairment"
                options={props?.data?.repairment && props.data.repairment}
                // options={props.data.repairment}
                defaultValue={product?.repairment}
              />

              {/* <div className="mb-2.5">
                <label
                  className="b-contain"
                  onChange={(ev) => {
                    setisRepairmentOn((val) => !val);
                  }}
                >
                  {isRepairmentOn ? (
                    <>
                      <span>Да</span>
                      <input
                        type={"checkbox"}
                        name="repairment"
                        value="0"
                        checked={true}
                        onChange={() => console.log("repairment-on")}
                      />
                    </>
                  ) : (
                    <>
                      <span>Нет</span>
                      <input
                        type={"checkbox"}
                        name="repairment"
                        value=""
                        checked={false}
                        onChange={() => console.log("repairment-off")}
                      />
                    </>
                  )}
                  <div className="b-input"></div>
                </label>
              </div> */}
            </>
          </>
        ) : (
          ""
        )}

        {sectionId == 4 && (
          <>
            <div className="mb-5">
              {props.isLoading || props.error ? (
                <div className="h-10 w-full md:w-[300px]">
                  <Preloader />
                </div>
              ) : (
                <>
                  <div className="text-sm font-bold mb-2">
                    Конструкция<span className="text-red">*</span>
                  </div>
                  <RadioAddProduct
                    containerClassName="flex gap-5"
                    itemClassName="h-9 mb-1.5"
                    name="house_construction"
                    options={props.data.house_construction}
                    defaultValue={product?.house_construction}
                  />
                </>
              )}
            </div>
          </>
        )}

        {sectionId === 4 || sectionId === 5 ? (
          <>
            <div className="text-sm font-bold mb-2">
              Коммуникация
              <span className="text-red">*</span>
            </div>
            <div className="h-10 w-full md:w-[300px]">
              {!props.isLoading ? (
                <SelectMultiSelect
                  name="house_communication"
                  defaultValue={product?.house_communication}
                  options={props.data.house_communication}
                  callback={setSelectedCommunication}
                />
              ) : (
                <Preloader />
              )}
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
