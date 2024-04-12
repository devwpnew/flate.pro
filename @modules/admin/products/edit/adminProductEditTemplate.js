import React from "react";
import Container from "@modules/common/components/container/container";
import MotionContainer from "@modules/common/components/container/motionContainer";

import AdminSidebar from "@modules/admin/sidebar/adminSidebar";
// import AdminProductEditContent from "./adminProductEditContent";
import EditItemTemplate from "@modules/user/components/items/template/editItemTemplate";

export default function AdminProductEditTemplate({ user, productId }) {
    return (
        <MotionContainer>
            <Container>
                <div className="flex items-start gap-4">
                    <AdminSidebar user={user} />
                    <div className="flex flex-col w-full admin-content">
                        <EditItemTemplate productId={productId} />
                        {/* <AdminProductEditContent user={user} /> */}
                    </div>
                </div>
            </Container>
        </MotionContainer>
    )
}