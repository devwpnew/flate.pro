import React from "react";
import Container from "@modules/common/components/container/container";
import MotionContainer from "@modules/common/components/container/motionContainer";

import AdminSidebar from "../sidebar/adminSidebar";

import AdminBannersContent from "./adminBannersContent";

export default function AdminBannersTemplate({ user, id }) {
  return (
    <MotionContainer>
      <Container>
        <div className="flex items-start gap-4">
          <AdminSidebar user={user} />

          <div className="flex flex-col w-full admin-content">
            <AdminBannersContent user={user} id={id}/>
          </div>
        </div>
      </Container>
    </MotionContainer>
  );
}
