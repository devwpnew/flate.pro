import Container from "@modules/common/components/container/container";
import ProfileSidebarTemplate from "@modules/user/components/profile/template/profileSidebarTemplate";

import getLayout from "helpers/getLayout";
import SelectionsContent from "./selectionsContent";
export default function SelectionsTemplate() {
  const { MOBILE, DESK_VARIANTS } = getLayout();

  return (
    <>
    {MOBILE ? (
      <SelectionsContent />
    ) : (
      <Container>
        <div className="flex items-start gap-4 md:mt-4 lg:mt-5">
          <ProfileSidebarTemplate />

          <div className="flex flex-col w-full">
            <SelectionsContent />
          </div>
        </div>
      </Container>
    )}
  </>
  )
}
