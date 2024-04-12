import UserAuthButton from "@modules/user/components/auth/button/authButton";
import authIcon from "public/icons/auth-blue.svg";
import RegistrationButton from "@modules/user/components/registration/button/registrationButton";

export default function Enter() {
  return (
    <div className="flex items-center gap-2">
      <div className="text-blue underline-offset-2">
        <UserAuthButton icon={authIcon} />
      </div>
      {/* <span className="text-blue">/</span> */}
      {/* <RegistrationButton /> */}
    </div>
  );
}
