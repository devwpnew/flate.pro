import { useState } from "react";

import Image from "next/image";

import OutsideAlerter from "hooks/useOutsideAlerter";
import AdminTools from "../part/adminTools";
import { BsThreeDots } from "react-icons/bs";



import moreDotsIcon from "public/icons/more-dots-icon.svg";

export default function AdminToolsButton({
  user,
  product,
  className = "",
  setProductStatus,
}) {
  const [showAdminTools, setShowAdminTools] = useState(false);

  let isAdmin = false;

  if (
    user.user_group === 5 ||
    user.user_group === 1 ||
    user.user_group?.id === 1 ||
    user.user_group?.id === 5
  ) {
    isAdmin = true;
  }

  return (
    <>
      {product && user && isAdmin && (
        <OutsideAlerter action={() => setShowAdminTools(false)}>
          <div
            onClick={() => setShowAdminTools(!showAdminTools)}
            className={className}
          >
            <BsThreeDots />
            {/* <Image
              src={moreDotsIcon.src}
              width={moreDotsIcon.width}
              height={moreDotsIcon.height}
            /> */}
          </div>
          <div className={showAdminTools ? "block" : "hidden"}>
            <AdminTools
              user={user}
              editLinkId={product.id}
              setProductStatus={setProductStatus}
            />
          </div>
        </OutsideAlerter>
      )}
    </>
  );
}
