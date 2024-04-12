import React from "react";
import Container from "@modules/common/components/container/container";
import MotionContainer from "@modules/common/components/container/motionContainer";
import AdminSidebar from "@modules/admin/sidebar/adminSidebar";
import EditCitiesTemplate from "./editCitiesTemplate";

export default function AdminCitiesEditTemplate({ user, cityId }) {
    return (
        <MotionContainer>
            <Container>
                <div className="flex items-start gap-4">
                    <AdminSidebar user={user} />
                    <div className="flex flex-col w-full admin-content">
                        <EditCitiesTemplate cityId={cityId} />
                    </div>
                </div>
            </Container>
        </MotionContainer>
    )
}