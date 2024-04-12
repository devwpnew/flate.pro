import H2 from "@modules/common/components/heading/h2";

import SettingsSelectNewPhone from "@modules/user/components/settings/button/settingsSelectNewPhone";
import getProductPhone from "helpers/formatters/product/getProductPhone";
import { useEffect } from "react";

export default function FieldContacts({ user, product }) {
  return (
    <>
      <H2>Контакты</H2>

      <div className="w-[300px]">
        <div className="text-sm font-bold mb-2">Номер телефона</div>

        <SettingsSelectNewPhone defaultValue={getProductPhone(product)}  user={user} name={'property_product_phone'} />
      </div>
    </>
  );
}
