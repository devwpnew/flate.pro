import React from "react";
import Container from "@modules/common/components/container/container";
import MotionContainer from "@modules/common/components/container/motionContainer";

import AdminSidebar from "../sidebar/adminSidebar";
import AdminModerationContent from "./adminModerationContent";

export default function AdminModerationTemplate({ user, isModeration, isArchive }) {
  return (
    <MotionContainer>
      <Container>
        <div className="flex items-start gap-4">
          <AdminSidebar user={user} />

          <div className="flex flex-col w-full admin-content">
            <AdminModerationContent user={user} isModeration={isModeration} isArchive={isArchive} />
          </div>
        </div>
      </Container>
    </MotionContainer>
  );
}
