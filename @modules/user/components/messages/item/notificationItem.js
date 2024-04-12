import api from "pages/api/service/api";
import { useState } from "react";

import DialogCloseIcon from "@modules/common/components/dialog/dialogCloseIcon";

export default function NotificationItem({ id, title, text, date, update }) {
  const [clearNotification, setClearNotification] = useState(false);

  const rmHandler = async () => {
    const respose = await await api.remove.notification(id);

    if(respose?.success) {
      setClearNotification(true)
      update()
    } else {
      console.log(respose)
    }
  } 

  return (
    !clearNotification && <>
      <div className="bg-greylight p-[15px] border-b-greyborder border-b-[1px] rounded">
        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="flex flex-col w-full">
              <div className="flex justify-between pr-4">
                <div className="text-sm">{title}</div>

                <div className="text-sm">{date}</div>
              </div>
              <div className="text-sm text-grey">{text}</div>
            </div>
            <DialogCloseIcon onClick={rmHandler} />
          </div>
        </div>
      </div>
    </>
  );
}
