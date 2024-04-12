import React from "react";
import Container from "@modules/common/components/container/container";
import MotionContainer from "@modules/common/components/container/motionContainer";
import AdminSidebar from "@modules/admin/sidebar/adminSidebar";
import EditAreasTemplate from "./editAreasTemplate";

export default function AdminAreasEditTemplate({ user, areaId }) {
    return (
        <MotionContainer>
            <Container>
                <div className="flex items-start gap-4">
                    <AdminSidebar user={user} />
                    <div className="flex flex-col w-full admin-content">
                        <EditAreasTemplate areaId={areaId} />
                    </div>
                </div>
            </Container>
        </MotionContainer>
    )
}