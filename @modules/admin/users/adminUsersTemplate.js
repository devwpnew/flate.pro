import { useRouter } from "next/router";
import Container from "@modules/common/components/container/container";
import MotionContainer from "@modules/common/components/container/motionContainer";

import AdminSidebar from "../sidebar/adminSidebar";
import AdminUsersContent from "./adminUsersContent";
import UserEditTemplate from "./user/UserEditTemplate";

export default function AdminUsersTemplate({ user, userTemplate }) {
  const router = useRouter();
  const userId = router.query.id;
  
  return (
    <MotionContainer>
      <Container>
        <div className="flex items-start gap-4">
          <AdminSidebar user={user} />

          <div className="flex flex-col w-full admin-content">
            {userTemplate ? (
              <UserEditTemplate userId={userId} />
            ) : (
              <AdminUsersContent user={user} />
            )}
          </div>
        </div>
      </Container>
    </MotionContainer>
  );
}
