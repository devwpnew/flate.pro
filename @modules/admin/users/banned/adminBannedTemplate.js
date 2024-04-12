import { useRouter } from "next/router";
import Container from "@modules/common/components/container/container";
import MotionContainer from "@modules/common/components/container/motionContainer";

import AdminSidebar from "@modules/admin/sidebar/adminSidebar";
import AdminBannedContent from "./adminBannedContent";

export default function AdminBannedTemplate({ user, moderation, rejected }) {
  const router = useRouter();
  const userId = router.query.id;

  return (
    <MotionContainer>
      <Container>
        <div className="flex items-start gap-4">
          <AdminSidebar user={user} />

          <div className="flex flex-col w-full admin-content">
            <AdminBannedContent user={user} moderation={moderation} rejected={rejected} />
          </div>
        </div>
      </Container>
    </MotionContainer>
  );
}
