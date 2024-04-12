import H1 from "@modules/common/components/heading/h1";
import Container from "@modules/common/components/container/container";
import MotionContainer from "@modules/common/components/container/motionContainer";
import BackButton from "@modules/common/components/button/backButton";

import AdminNotifications from "./parts/adminNotifications";

import getLayout from "helpers/getLayout";
import AdminUsersList from "./parts/adminUsersList";
import Button from "@modules/common/components/button/button";
import AdminUsersContent from "../users/adminUsersContent";
import AdminUsersAddContent from "@modules/admin/users/add/adminUsersAddContent";
import AdminButtonNotification from "./parts/adminButtonNotification";

export default function AdminContent({ user }) {
  const { MOBILE, DESKTOP, VARIANTS } = getLayout();

  return (
    <MotionContainer>
      <div className="pt-3 pb-2.5 lg:border-b-[1px] lg:border-greyborder">
        <div className="flex flex-row items-center justify-between">
          <H1>Главная</H1>

          {/* <AdminButtonNotification /> */}
        </div>
      </div>
      <div className="mt-2.5 mb-2.5">
        <AdminUsersList />
      </div>
      {/* <AdminNotifications /> */}
      <AdminUsersContent onlyAdmins={true} title={'Администраторы'} />
      <AdminUsersAddContent />
    </MotionContainer>
  );
}
