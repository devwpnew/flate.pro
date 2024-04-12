import React from "react";
import Container from "@modules/common/components/container/container";
import MotionContainer from "@modules/common/components/container/motionContainer";

import AdminSidebar from "../sidebar/adminSidebar";
import AdminItemsContent from "./adminItemsContent";
import EditItemTemplate from "@modules/user/components/items/template/editItemTemplate";
export default function AdminItemsTemplate({ user, editTemplate, productId }) {
  return (
    <MotionContainer>
      <Container>
        <div className="flex items-start gap-4">
          <AdminSidebar user={user} />

          <div className="flex flex-col w-full admin-content">
            {editTemplate ? (
              <EditItemTemplate productId={productId} />
            ) : (
              <AdminItemsContent user={user} />
            )}
          </div>
        </div>
      </Container>
    </MotionContainer>
  );
}
