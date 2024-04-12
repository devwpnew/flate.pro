import { useState, useEffect } from "react";

import { CheckboxCheck } from "@modules/common/components/checkbox/checkboxCheck";
import Sidebar from "@modules/sidebar/components/sidebar";
import H2 from "@modules/common/components/heading/h2";
import { useSelector } from "react-redux";

export default function AddFormSidebar({ formData, sectionId }) {
  const [form, setForm] = useState({});
  const [isStick, setIsStick] = useState(null);

  useEffect(() => {
    const stickOnScroll = () => {
      if (window.pageYOffset < 100) {
        setIsStick(false);
      } else {
        setIsStick(true);
      }
    };

    window.removeEventListener("scroll", stickOnScroll);
    window.addEventListener("scroll", stickOnScroll);
  }, []);

  useEffect(() => {
    if (!formData) return;

    const formObj = {};

    formData.forEach((value, key) => {
      formObj[key] = value;
    });

    // console.log(formObj, "formObj");

    setForm(formObj);
  }, [formData]);

  return (
    <div
      className={`min-w-[250px] w-[250px] ${
        isStick && "sticky right-0 top-[100px]"
      } hidden lg:block`}
    >
      <div className="w-full">
        <H2>Обязательно для заполнения</H2>
        <Sidebar containerClassName="min-w-full max-w-full">
          <div className="flex flex-col gap-[14px]">
            {sectionId === 7 || sectionId === 6 ? (
              <a href="#name" className="flex items-center gap-2.5">
                <CheckboxCheck disabled={true} checked={form?.name} />
                <div className="text-sm">Название</div>
              </a>
            ) : (
              ""
            )}

            <a href="#address" className="flex items-center gap-2.5">
              <CheckboxCheck
                disabled={true}
                checked={form?.property_product_address}
              />
              <div className="text-sm">Адрес</div>
            </a>

            <a href="#address" className="flex items-center gap-2.5">
              <CheckboxCheck disabled={true} checked={form?.area_link} />
              <div className="text-sm">Район</div>
            </a>

            {sectionId === 4 && (
              <>
                <a href="#section" className="flex items-center gap-2.5">
                  <CheckboxCheck disabled={true} checked={form?.house_types} />
                  <div className="text-sm">Вид</div>
                </a>
                <a href="#about" className="flex items-center gap-2.5">
                  <CheckboxCheck disabled={true} checked={form?.house_floors} />
                  <div className="text-sm">Этажей в доме</div>
                </a>
                <a href="#about" className="flex items-center gap-2.5">
                  <CheckboxCheck
                    disabled={true}
                    checked={form?.house_construction}
                  />
                  <div className="text-sm">Конструкция</div>
                </a>
                <a href="#about" className="flex items-center gap-2.5">
                  <CheckboxCheck
                    disabled={true}
                    checked={form?.house_communication}
                  />
                  <div className="text-sm">Коммуникация</div>
                </a>
              </>
            )}

            {sectionId === 5 && (
              <>
                <a href="#section" className="flex items-center gap-2.5">
                  <CheckboxCheck disabled={true} checked={form?.status_lands} />
                  <div className="text-sm">Статус</div>
                </a>
                <a href="#about" className="flex items-center gap-2.5">
                  <CheckboxCheck
                    disabled={true}
                    checked={form?.house_communication}
                  />
                  <div className="text-sm">Коммуникация</div>
                </a>
              </>
            )}

            {sectionId === 6 && (
              <a href="#section" className="flex items-center gap-2.5">
                <CheckboxCheck
                  disabled={true}
                  checked={form?.commercial_types}
                />
                <div className="text-sm">Статус</div>
              </a>
            )}

            {sectionId === 7 && (
              <a href="#section" className="flex items-center gap-2.5">
                <CheckboxCheck disabled={true} checked={form?.parking_types} />
                <div className="text-sm">Вид</div>
              </a>
            )}

            {sectionId === 3 && (
              <>
                <a href="#section" className="flex items-center gap-2.5">
                  <CheckboxCheck disabled={true} checked={form?.status} />
                  <div className="text-sm">Статус</div>
                </a>
                <a href="#address" className="flex items-center gap-2.5">
                  <CheckboxCheck disabled={true} checked={form?.handed_over} />
                  <div className="text-sm">Дом сдан</div>
                </a>
                {/* 
                  <a href="#about" className="flex items-center gap-2.5">
                    <CheckboxCheck
                      disabled={true}
                      checked={form?.property_product_floor}
                    />
                    <div className="text-sm">Этаж</div>
                  </a>

                  <a href="#about" className="flex items-center gap-2.5">
                    <CheckboxCheck
                      disabled={true}
                      checked={form?.flat_floors}
                    />
                    <div className="text-sm">Этажей в доме</div>
                  </a>
                 */}

                <a href="#about" className="flex items-center gap-2.5">
                  <CheckboxCheck
                    disabled={true}
                    checked={form.product_room_count}
                  />
                  <div className="text-sm">Количество комнат</div>
                </a>
              </>
            )}

            {sectionId === 3 || sectionId === 4 ? (
              <a href="#about" className="flex items-center gap-2.5">
                <CheckboxCheck disabled={true} checked={form.repairment} />
                <div className="text-sm">Ремонт</div>
              </a>
            ) : (
              ""
            )}

            <a href="#about" className="flex items-center gap-2.5">
              <CheckboxCheck
                disabled={true}
                checked={
                  form?.land_squares ||
                  form?.living_squares ||
                  form?.object_squares
                }
              />
              <div className="text-sm">Площадь</div>
            </a>

            {sectionId !== 5 && sectionId !== 7 && (
              <a href="#gallery" className="flex items-center gap-2.5">
                <CheckboxCheck
                  disabled={true}
                  checked={form?.property_product_galery}
                />
                <div className="text-sm">Фотографии</div>
              </a>
            )}

            <a href="#descr" className="flex items-center gap-2.5">
              <CheckboxCheck
                disabled={true}
                checked={form?.product_description}
              />
              <div className="text-sm">Описание</div>
            </a>

            <a href="#price" className="flex items-center gap-2.5">
              <CheckboxCheck disabled={true} checked={form?.product_price} />
              <div className="text-sm">Цена</div>
            </a>

            {/* {sectionId === 3 && ( */}
            <a href="#price" className="flex items-center gap-2.5">
              <CheckboxCheck
                disabled={true}
                checked={form?.comission_sum_terms || form.off_comission_value}
              />
              <div className="text-sm">Комиссия</div>
            </a>
            {/* )} */}

            {/* {sectionId !== 6 && sectionId !== 7 && ( */}
            <a href="#price" className="flex items-center gap-2.5">
              <CheckboxCheck disabled={true} checked={form.mortgage} />
              <div className="text-sm">Ипотека</div>
            </a>
            {/* )} */}

            {/* {sectionId !== 6 && sectionId !== 7 && ( */}
            <a href="#price" className="flex items-center gap-2.5">
              <CheckboxCheck disabled={true} checked={form.sum_contract} />
              <div className="text-sm">Сумма в договоре</div>
            </a>
            {/* )} */}
          </div>
        </Sidebar>
      </div>
    </div>
  );
}
