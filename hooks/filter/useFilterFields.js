import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import SelectMultiSelect from "@modules/common/components/select/listBox/selectMultiSelect";
import SelectNoAutocomplete from "@modules/common/components/select/listBox/selectNoAutocomplete";
import SelectCheckBox from "@modules/common/components/select/checkBox/selectCheckBox";

export default function useFilterFields(isSidebar) {
  const router = useRouter();
  const slug = router?.query?.section_slug;
  const filterFields = useSelector((state) => state.filterGlobalFields.value);
  let propsFields = {};
  let rangeFields = {};

  if (router.pathname === "/rcs/[id]") {
    propsFields = {
      status: {
        isSidebar: false,
        isShow: true,
        Component: SelectMultiSelect,
        title: "Статус",
        style: "",
      },
      product_room_count: {
        isSidebar: false,
        isShow: true,
        Component: SelectMultiSelect,
        title: "Количество комнат",
        style: "",
      },
      mortgage: {
        isSidebar: false,
        isShow: true,
        Component: SelectNoAutocomplete,

        initialOption: { id: "", name: "Не важно" },
        title: "Ипотека",
        style: "",
      },
      repairment: {
        isSidebar: false,
        isShow: true,
        Component: SelectNoAutocomplete,
        initialOption: { id: "", name: "Не важно" },
        title: "Ремонт",
        style: "",
      },
      sum_contract: {
        isSidebar: false,
        isShow: true,
        Component: SelectNoAutocomplete,

        initialOption: { id: "", name: "Не важно" },
        title: "Сумма в договоре",
        style: "",
      },
      handed_over: {
        isSidebar: false,
        isShow: true,
        Component: SelectNoAutocomplete,
        initialOption: { id: "", name: "Не важно" },
        title: "Дом сдан",
        style: "",
      },
    };

    rangeFields = {
      living_squares: {
        isSidebar: false,
        isShow: true,
        title: "Площадь, м²",
        style: "w-full h-12",
      },
      product_price: {
        isSidebar: false,
        isShow: true,
        title: "Цена, руб",
        style: "w-full h-12",
      },
    };
  }

  if (slug === "flats") {
    propsFields = {
      status: {
        isSidebar: false,
        isShow: true,
        Component: SelectMultiSelect,
        title: "Статус",
        style: "w-full h-12",
      },
      product_room_count: {
        isSidebar: false,
        isShow: true,
        Component: SelectMultiSelect,
        title: "Количество комнат",
        style: "w-full h-12",
      },
      mortgage: {
        isSidebar: false,
        isShow: true,
        Component: SelectNoAutocomplete,

        initialOption: { id: "", name: "Не важно" },
        title: "Ипотека",
        style: isSidebar ? "" : "w-full h-12",
      },
      repairment: {
        isSidebar: false,
        isShow: true,
        Component: SelectNoAutocomplete,
        initialOption: { id: "", name: "Не важно" },
        title: "Ремонт",
        style: isSidebar ? "" : "w-full h-12",
      },
      sum_contract: {
        isSidebar: false,
        isShow: true,
        Component: SelectNoAutocomplete,

        initialOption: { id: "", name: "Не важно" },
        title: "Сумма в договоре",
        style: isSidebar ? "" : "w-full h-12",
      },
      handed_over: {
        isSidebar: false,
        isShow: true,
        Component: SelectNoAutocomplete,
        initialOption: { id: "", name: "Не важно" },
        title: "Дом сдан",
        style: isSidebar ? "" : "w-full h-12",
      },
    };

    rangeFields = {
      living_squares: {
        isSidebar: false,
        isShow: true,
        title: "Площадь, м²",
        style: "w-full h-12",
      },
      product_price: {
        isSidebar: false,
        isShow: true,
        title: "Цена, руб",
        style: "w-full h-12",
      },
    };
  }

  if (slug === "houses") {
    propsFields = {
      house_types: {
        isSidebar: false,
        isShow: true,
        isShow: true,
        Component: SelectMultiSelect,
        title: "Вид объекта",
        style: "w-full h-12",
      },
      house_floors: {
        isSidebar: false,
        isShow: true,
        isShow: true,
        Component: SelectMultiSelect,
        title: "Этажей в доме",
        style: "w-full h-12",
      },
      house_construction: {
        isSidebar: false,
        isShow: true,
        isShow: true,
        Component: SelectNoAutocomplete,
        initialOption: { id: "", name: "Не важно" },
        title: "Конструкция",
        style: "w-full h-12",
      },
      house_communication: {
        isSidebar: false,
        isShow: true,
        isShow: true,
        Component: SelectMultiSelect,
        title: "Коммуникации",
        style: "w-full h-12",
      },
      sum_contract: {
        isSidebar: false,
        isShow: true,
        Component: SelectNoAutocomplete,

        initialOption: { id: "", name: "Не важно" },
        title: "Сумма в договоре",
        style: "w-full h-12",
      },
      mortgage: {
        isSidebar: false,
        isShow: true,
        Component: SelectNoAutocomplete,

        initialOption: { id: "", name: "Не важно" },
        title: "Ипотека",
        style: "w-full h-12",
      },
    };

    rangeFields = {
      living_squares: {
        isSidebar: false,
        isShow: true,
        title: "Площадь дома, м²",
        style: "w-full h-12",
      },
      land_squares: {
        isSidebar: false,
        isShow: true,
        title: "Площадь участка (соток)",
        style: "w-full h-12",
      },
      product_price: {
        isSidebar: false,
        isShow: true,
        title: "Цена, руб",
        style: "w-full h-12",
      },
    };
  }

  if (slug === "commertion") {
    propsFields = {
      commercial_types: {
        isSidebar: false,
        isShow: true,
        isShow: true,
        Component: SelectMultiSelect,
        title: "Вид объекта",
        style: "w-full h-12",
      },
    };

    rangeFields = {
      living_squares: {
        isSidebar: false,
        isShow: true,
        title: "Площадь, м²",
        style: "w-full h-12",
      },
      product_price: {
        isSidebar: false,
        isShow: true,
        title: "Цена, руб",
        style: "w-full h-12",
      },
    };
  }

  if (slug === "land") {
    propsFields = {
      status_lands: {
        isSidebar: false,
        isShow: true,
        Component: SelectMultiSelect,
        title: "Статус",
        style: "w-full h-12",
      },
      house_communication: {
        isSidebar: false,
        isShow: true,
        isShow: true,
        Component: SelectMultiSelect,
        title: "Коммуникации",
        style: "w-full h-12",
      },
      mortgage: {
        isSidebar: false,
        isShow: true,
        Component: SelectNoAutocomplete,

        initialOption: { id: "", name: "Не важно" },
        title: "Ипотека",
        style: "w-full h-12",
      },
      sum_contract: {
        isSidebar: false,
        isShow: true,
        Component: SelectNoAutocomplete,

        initialOption: { id: "", name: "Не важно" },
        title: "Сумма в договоре",
        style: "w-full h-12",
      },
    };

    rangeFields = {
      land_squares: {
        isSidebar: false,
        isShow: true,
        title: "Площадь, сотки",
        style: "w-full h-12",
      },
      product_price: {
        isSidebar: false,
        isShow: true,
        title: "Цена, руб",
        style: "w-full h-12",
      },
    };
  }

  if (slug === "parkings") {
    propsFields = {
      parking_types: {
        isSidebar: false,
        isShow: true,
        Component: SelectMultiSelect,
        title: "Вид объекта",
        style: isSidebar ? "" : "w-full h-12",
      },
    };

    rangeFields = {
      land_squares: {
        isSidebar: false,
        isShow: true,
        title: "Площадь, м²",
        style: "w-full h-12",
      },
      product_price: {
        isSidebar: false,
        isShow: true,
        title: "Цена, руб",
        style: "w-full h-12",
      },
    };
  }

  if (filterFields) {
    for (const property in filterFields) {
      if (propsFields[property]) {
        propsFields[property].value = filterFields[property];
      }

      if (rangeFields[property]) {
        rangeFields[property].value = filterFields[property];
      }
    }
  }

  return {
    propsFields,
    rangeFields,
  };
}
