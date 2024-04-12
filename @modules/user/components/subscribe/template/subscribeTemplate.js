import Container from "@modules/common/components/container/container";
import ProfileSidebarTemplate from "@modules/user/components/profile/template/profileSidebarTemplate";
import SubscribeContent from "./subscribeContent";

import getLayout from "helpers/getLayout";
export default function SubscribeTemplate() {
  const { MOBILE, DESK_VARIANTS } = getLayout();

  return (
    <>
    {MOBILE ? (
      <SubscribeContent />
    ) : (
      <Container>
        <div className="flex items-start gap-4 md:mt-4 lg:mt-5">
          <ProfileSidebarTemplate />

          <div className="flex flex-col w-full">
            <SubscribeContent />
          </div>
        </div>
      </Container>
    )}
  </>
  )
}
