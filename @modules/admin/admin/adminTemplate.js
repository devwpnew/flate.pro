import React from "react";
import Container from "@modules/common/components/container/container";
import MotionContainer from "@modules/common/components/container/motionContainer";

import AdminSidebar from "../sidebar/adminSidebar";
import AdminContent from "./adminContent";
export default function AdminTemplate({ user }) {
  return (
    <MotionContainer>
      <Container>
        <div className="flex items-start gap-4 relative">
          <AdminSidebar user={user} />

          <div className="flex flex-col w-full admin-content">
            <AdminContent user={user} />
          </div>
        </div>
      </Container>
    </MotionContainer>
  );
}
