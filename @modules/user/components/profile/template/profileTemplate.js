import Container from "@modules/common/components/container/container";
import ProfileContent from "./profileContent";
import ProfileSidebarTemplate from "./profileSidebarTemplate";
import { motion } from "framer-motion";
import SettingsContent from "../../settings/template/settingsContent";
import getLayout from "helpers/getLayout";
export default function ProfileTemplate({user}) {
  const { MOBILE, DESK_VARIANTS } = getLayout();

  return (
    <motion.div
      initial="init"
      animate="show"
      exit="hide"
      variants={DESK_VARIANTS}
    >
      {MOBILE ? (
        <ProfileSidebarTemplate user={user} />
      ) : (
        <Container>
          <div className="flex items-start gap-4 md:mt-4 lg:mt-5">
            <ProfileSidebarTemplate user={user} />

            <div className="flex flex-col w-full">
              <SettingsContent user={user} />
            </div>
          </div>
        </Container>
      )}
    </motion.div>
  );
}
