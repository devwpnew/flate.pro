const validateAddForm = (formData, sectionId, product) => {
  let emptyFields = {};
  let scrollToFields = {};
  let check = true;
  let tmpForm = {};

  formData.forEach((value, key) => {
    tmpForm[key] = value;
  });

  if (product?.properties?.product_address) {
    tmpForm["property_product_address"] = product?.properties?.product_address;
  }

  if (product?.area_link?.id) {
    tmpForm["area_link"] = product?.area_link?.id;
  }

  if (product?.product_room_count) {
    tmpForm["product_room_count"] = product?.product_room_count;
  }

  if (product?.repairment) {
    tmpForm["repairment"] = product?.repairment;
  }

  for (const key in tmpForm) {
    if (tmpForm[key] === "0") {
      tmpForm[key] = "1";
    }

    if (tmpForm[key] === true) {
      tmpForm[key] = "1";
    }
  }

  for (const key in tmpForm) {
    const value = tmpForm[key];

    // Check for default fields
    if (!tmpForm?.section_relation || (key === "section_relation" && !value)) {
      check = false;
      emptyFields.section_relation = `Поле "Категория"`;
      scrollToFields.section = 1;
    }

    if (
      !tmpForm?.property_product_address ||
      (key === "property_product_address" && !value)
    ) {
      check = false;
      emptyFields.property_product_address = `Поле "Адрес"`;
      scrollToFields.address = 1;
    }

    if (!tmpForm?.area_link || (key === "area_link" && !value)) {
      check = false;
      emptyFields.area_link = `Поле "Район"`;
      scrollToFields.about = 1;
    }

    if (
      !tmpForm?.product_description ||
      (key === "product_description" && !value)
    ) {
      check = false;
      emptyFields.product_description = `Поле "Описание"`;
      scrollToFields.descr = 1;
    }

    if (!tmpForm?.product_price || (key === "product_price" && !value)) {
      check = false;
      emptyFields.product_price = `Поле "Цена"`;
      scrollToFields.price = 1;
    }

    // if (
    //   !tmpForm?.property_product_phone ||
    //   (key === "property_product_phone" && !value)
    // ) {
    //   check = false;
    //   emptyFields.property_product_phone = "errorEmpty";
    // }

    // КВАРТИРЫ
    if (sectionId === 3) {
      if (!tmpForm?.living_squares || (key === "living_squares" && !value)) {
        check = false;
        emptyFields.living_squares = `Поле "Площадь"`;
        scrollToFields.about = 1;
      }

      if (!tmpForm?.status || (key === "status" && !value)) {
        check = false;
        emptyFields.status = `Поле "Статус"`;
        scrollToFields.section = 1;
      }

      // if (
      //   !tmpForm?.property_product_floor ||
      //   (key === "property_product_floor" && !value)
      // ) {
      //   check = false;
      //   emptyFields.property_product_floor = `Поле "Этаж"`;
      //   scrollToFields.about = 1;
      // }

      // if (!tmpForm?.flat_floors || (key === "flat_floors" && !value)) {
      //   check = false;
      //   emptyFields.flat_floors = `Поле "Этажей в доме"`;
      //   scrollToFields.about = 1;
      // }

      if (!tmpForm?.handed_over || (key === "handed_over" && !value)) {
        check = false;
        emptyFields.handed_over = `Поле "Дом сдан"`;
        scrollToFields.address = 1;
      }

      if (!product) {
        if (
          !tmpForm?.property_product_galery ||
          (key === "property_product_galery" && !value)
        ) {
          check = false;
          emptyFields.property_product_galery = `Поле "Фотографии"`;
          scrollToFields.gallery = 1;
        }
      }

      if (
        !tmpForm?.product_room_count ||
        (key === "product_room_count" && !value)
      ) {
        check = false;
        emptyFields.product_room_count = `Поле "Количество комнат"`;
        scrollToFields.price = 1;
      }

      if (!tmpForm?.repairment || (key === "repairment" && !value)) {
        check = false;
        emptyFields.repairment = `Поле "Ремонт"`;
        scrollToFields.about = 1;
      }

      if (!tmpForm?.mortgage || (key === "mortgage" && !value)) {
        check = false;
        emptyFields.mortgage = `Поле "Ипотека"`;
        scrollToFields.price = 1;
      }

      if (!tmpForm?.sum_contract || (key === "sum_contract" && !value)) {
        check = false;
        emptyFields.sum_contract = `Поле "Сумма в договоре"`;
        scrollToFields.price = 1;
      }
    }
    // ДОМА
    if (sectionId === 4) {
      if (!tmpForm?.house_floors || (key === "house_floors" && !value)) {
        check = false;
        emptyFields.house_floors = `Поле "Этажей в доме"`;
        scrollToFields.about = 1;
      }

      if (!tmpForm?.repairment || (key === "repairment" && !value)) {
        check = false;
        emptyFields.repairment = `Поле "Ремонт"`;
        scrollToFields.about = 1;
      }

      if (!tmpForm?.house_types || (key === "house_types" && !value)) {
        check = false;
        emptyFields.house_types = `Поле "Вид"`;
        scrollToFields.section = 1;
      }

      if (
        !tmpForm?.house_construction ||
        (key === "house_construction" && !value)
      ) {
        check = false;
        emptyFields.house_construction = `Поле "Конструкция"`;
        scrollToFields.about = 1;
      }

      if (!product) {
        if (
          !tmpForm?.property_product_galery ||
          (key === "property_product_galery" && !value)
        ) {
          check = false;
          emptyFields.property_product_galery = `Поле "Фотографии"`;
          scrollToFields.gallery = 1;
        }
      }

      if (!tmpForm?.mortgage || (key === "mortgage" && !value)) {
        check = false;
        emptyFields.mortgage = `Поле "Ипотека"`;
        scrollToFields.price = 1;
      }
      if (!tmpForm?.sum_contract || (key === "sum_contract" && !value)) {
        check = false;
        emptyFields.sum_contract = `Поле "Сумма в договоре"`;
        scrollToFields.price = 1;
      }

      if (
        !tmpForm?.house_communication ||
        (key === "house_communication" && !value)
      ) {
        check = false;
        emptyFields.house_communication = `Поле "Коммуникация"`;
        scrollToFields.about = 1;
      }

      if (!tmpForm?.living_squares || (key === "living_squares" && !value)) {
        check = false;
        emptyFields.living_squares = `Поле "Площадь дома"`;
        scrollToFields.about = 1;
      }

      if (!tmpForm?.land_squares || (key === "land_squares" && !value)) {
        check = false;
        emptyFields.land_squares = `Поле "Площадь участка"`;
        scrollToFields.about = 1;
      }

      if (!product) {
        if (
          !tmpForm?.property_product_galery ||
          (key === "property_product_galery" && !value)
        ) {
          check = false;
          emptyFields.property_product_galery = `Поле "Фотографии"`;
          scrollToFields.gallery = 1;
        }
      }
    }
    // ЗЕМЛЯ
    if (sectionId === 5) {
      if (!tmpForm?.status_lands || (key === "status_lands" && !value)) {
        check = false;
        emptyFields.status_lands = `Поле "Статус"`;
        scrollToFields.section = 1;
      }

      if (
        !tmpForm?.house_communication ||
        (key === "house_communication" && !value)
      ) {
        check = false;
        emptyFields.house_communication = `Поле "Коммуникация"`;
        scrollToFields.about = 1;
      }

      if (!tmpForm?.land_squares || (key === "land_squares" && !value)) {
        check = false;
        emptyFields.land_squares = `Поле "Площадь"`;
        scrollToFields.about = 1;
      }

      if (!tmpForm?.mortgage || (key === "mortgage" && !value)) {
        check = false;
        emptyFields.mortgage = `Поле "Ипотека"`;
        scrollToFields.price = 1;
      }
      if (!tmpForm?.sum_contract || (key === "sum_contract" && !value)) {
        check = false;
        emptyFields.sum_contract = `Поле "Сумма в договоре"`;
        scrollToFields.price = 1;
      }
    }
    // КОММЕРЦИЯ
    if (sectionId === 6) {
      if (
        !tmpForm?.commercial_types ||
        (key === "commercial_types" && !value)
      ) {
        check = false;
        emptyFields.commercial_types = `Поле "Вид"`;
        scrollToFields.section = 1;
      }

      if (!tmpForm?.name || (key === "name" && !value)) {
        check = false;
        emptyFields.name = `Поле "Название"`;
        scrollToFields.name = 1;
      }

      if (!product) {
        if (
          !tmpForm?.property_product_galery ||
          (key === "property_product_galery" && !value)
        ) {
          check = false;
          emptyFields.property_product_galery = `Поле "Фотографии"`;
          scrollToFields.gallery = 1;
        }
      }

      if (!tmpForm?.object_squares || (key === "object_squares" && !value)) {
        check = false;
        emptyFields.object_squares = `Поле "Площадь"`;
        scrollToFields.about = 1;
      }

      if (!product) {
        if (
          !tmpForm?.property_product_galery ||
          (key === "property_product_galery" && !value)
        ) {
          check = false;
          emptyFields.property_product_galery = `Поле "Фотографии"`;
          scrollToFields.gallery = 1;
        }
      }
    }
    // ПАРКИНГИ
    if (sectionId === 7) {
      if (!tmpForm?.parking_types || (key === "parking_types" && !value)) {
        check = false;
        emptyFields.parking_types = `Поле "Вид"`;
        scrollToFields.section = 1;
      }

      if (!tmpForm?.name || (key === "name" && !value)) {
        check = false;
        emptyFields.name = `Поле "Название"`;
        scrollToFields.name = 1;
      }
      if (!tmpForm?.object_squares || (key === "object_squares" && !value)) {
        check = false;
        emptyFields.object_squares = `Поле "Площадь"`;
        scrollToFields.about = 1;
      }
    }

    if (tmpForm?.comission === "Включена") {
      if (
        !tmpForm?.comission_sum_terms ||
        (key === "comission_sum_terms" && !value)
      ) {
        check = false;
        emptyFields.comission = `Поле "Комиссия"`;
        scrollToFields.price = 1;
      }
    }

    if (tmpForm?.comission === "Не включена") {
      if (
        !tmpForm?.off_comission_value ||
        (key === "off_comission_value" && !value)
      ) {
        check = false;
        emptyFields.comission = `Поле "Комиссия"`;
        scrollToFields.price = 1;
      }
    }
  }

  return {
    check: check,
    errorFields: emptyFields,
    scrollToFields: scrollToFields,
  };
};

export default validateAddForm;
