import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Container from "@modules/common/components/container/container";
import ProfileSidebarTemplate from "../../profile/template/profileSidebarTemplate";
import SettingsContent from "./settingsContent";

import getLayout from "helpers/getLayout";
import WelcomeModal from "@modules/common/components/modals/welcomeModal";

export default function SettingsTemplate({customUser}) {
  const { MOBILE } = getLayout();
  const router = useRouter();
  const user = customUser ? customUser : useSelector((state) => state.userLogin.value);

  return (
    <>
      {MOBILE ? (
        <SettingsContent user={user} />
      ) : (
        <Container>
          <div className="flex items-start gap-4 md:mt-4 lg:mt-5">
            <ProfileSidebarTemplate />

            <div className="flex flex-col w-full">
              <SettingsContent user={user} />
            </div>
          </div>
        </Container>
      )}
      <WelcomeModal isShow={router.query.visit === true} />
    </>
  );
}
