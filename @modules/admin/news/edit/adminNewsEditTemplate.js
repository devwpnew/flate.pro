import React from "react";
import Container from "@modules/common/components/container/container";
import MotionContainer from "@modules/common/components/container/motionContainer";

import AdminSidebar from "@modules/admin/sidebar/adminSidebar";
// import AdminNewsEditContent from "./adminNewsEditContent";
import EditNewsTemplate from "@modules/admin/news/edit/editNewsTemplate";

export default function AdminNewsEditTemplate({ user, newsId }) {
    return (
        <MotionContainer>
            <Container>
                <div className="flex items-start gap-4">
                    <AdminSidebar user={user} />
                    <div className="flex flex-col w-full admin-content">
                        <EditNewsTemplate newsId={newsId} />
                        {/* <AdminNewsEditContent user={user} /> */}
                    </div>
                </div>
            </Container>
        </MotionContainer>
    )
}