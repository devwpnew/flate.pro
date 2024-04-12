import React from "react";
import Container from "@modules/common/components/container/container";
import MotionContainer from "@modules/common/components/container/motionContainer";

import AdminSidebar from "../sidebar/adminSidebar";
import AdminDistrictsContent from "./adminDistrictsContent";

export default function AdminDistrictsTemplate({ user, type }) {
  return (
    <MotionContainer>
      <Container>
        <div className="flex items-start gap-4">
          <AdminSidebar user={user} />

          <div className="flex flex-col w-full admin-content">
            <AdminDistrictsContent user={user} type={type} />
          </div>
        </div>
      </Container>
    </MotionContainer>
  );
}
