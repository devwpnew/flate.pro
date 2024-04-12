import React from "react";
import Container from "@modules/common/components/container/container";
import MotionContainer from "@modules/common/components/container/motionContainer";

import AdminSidebar from "../sidebar/adminSidebar";
import AdminTasksContent from "./adminTasksContent";
import AdminTasksArchive from "./adminTasksArchive";

export default function AdminTasksTemplate({ user, isArchive }) {
  return (
    <MotionContainer>
      <Container>
        <div className="flex items-start gap-4">
          <AdminSidebar user={user} />

          <div className="flex flex-col w-full admin-content">
            {isArchive ? (
              <AdminTasksArchive user={user} />
            ) : (
              <AdminTasksContent user={user} />
            )}
          </div>
        </div>
      </Container>
    </MotionContainer>
  );
}
