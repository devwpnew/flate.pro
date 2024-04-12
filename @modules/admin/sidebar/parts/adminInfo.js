import { useSelector } from "react-redux";
import UserAvatar from "../../../user/components/profile/common/userAvatar";
import UserName from "../../../user/components/profile/common/userName";
import UserSubscribeExpiration from "@modules/user/components/subscribe/userSubscribeExpiration";
import AdminActions from "./adminActions";
export default function AdminInfo() {
  const user = useSelector((state) => state.userLogin.value);
 
  return (
    <>
      <div className="block py-[15px]">
        <div className="flex justufy-between items-center gap-2.5 mb-2.5 px-[15px]">
          <div className="w-[70px] min-w-[70px] min-h-[70px] h-[70px] text-3xl">
            <UserAvatar isAdmin={true} />
          </div>

          <div className="flex flex-col px-[15px]">
            <UserName isAdmin={true} name={user.user_name} />
            <UserSubscribeExpiration isAdmin={true} />
          </div>
        </div>
      </div>

      <div className="mb-5 pb-[15px]">
        <AdminActions />
      </div>
    </>
  );
}
