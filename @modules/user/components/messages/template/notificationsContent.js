import { motion } from "framer-motion";

import Container from "@modules/common/components/container/container";

import NotificationItem from "../item/notificationItem";

import getLayout from "helpers/getLayout";
import BackButton from "@modules/common/components/button/backButton";
import ProductsEmpty from "@modules/posts/type/product/components/part/productsEmpty";
import { formateDate } from "helpers/formateDate";
import Button from "@modules/common/components/button/button";
import api from "pages/api/service/api";

export default function NotificationsContent({ items, userId, updateCallback }) {

  const removeAllReports = async function () {
    if(!userId){
      console.error('User ID отсутствует')
      return false;
    }
    const response = await api.remove.notification(false, {user_id: userId})
    if(response?.success){
      updateCallback()
    }else{
      console.error(response)
    }
  }

  return (
    <motion.div>
      {items && (
        <div className="flex justify-end mb-2">
          <Button
            className="w-auto px-7 py-2"
            type={"red"}
            onClick={() => removeAllReports(true)}
          >
            <span className="font-semibold">Очистить все уведомления</span>
          </Button>
        </div>
      )}
      {items ? (
        items.map((item, index) => (
          <NotificationItem
            key={item.product_id + index}
            title={item?.title ? item.title : "Уведомление"}
            text={item.text}
            id={item.id}
            prod_id={item.product_id}
            date={item.date_created && formateDate(item.date_created)}
            update={updateCallback}
          />
        ))
      ) : (
        <ProductsEmpty title={"Список уведомлений пуст"} hideButton={true} />
      )}
    </motion.div>
  );
}
