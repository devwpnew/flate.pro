import React from "react";
import Container from "@modules/common/components/container/container";
import MotionContainer from "@modules/common/components/container/motionContainer";

import AdminSidebar from "../sidebar/adminSidebar";
import AdminCitiesContent from "./adminCitiesContent";

export default function AdminCitiesTemplate({ user }) {
  return (
    <MotionContainer>
      <Container>
        <div className="flex items-start gap-4">
          <AdminSidebar user={user} />

          <div className="flex flex-col w-full admin-content">
            <AdminCitiesContent user={user} />
          </div>
        </div>
      </Container>
    </MotionContainer>
  );
}
