import { useSelector } from "react-redux";
import UserInfo from "@modules/user/components/profile/template/userInfo";

import Container from "@modules/common/components/container/container";
import TextAbout from "@modules/user/components/profile/common/textAbout";

import getLayout from "helpers/getLayout";
import Sidebar from "@modules/sidebar/components/sidebar";
export default function ProfileSidebarTemplate() {
    const { MOBILE } = getLayout();
    const user = useSelector((state) => state.userLogin.value);
    return (
        <>
            {MOBILE ? (
                <>
                    <UserInfo user={user} />
                </>
            ) : (
                <>
                    <Sidebar className="max-w-[200px] min-w-[200px] w-[200px] lg:max-w-[230px] lg:min-w-[230px] lg:w-[230px]">
                        <UserInfo user={user} />
                    </Sidebar>
                </>
            )}
        </>
    );
}
