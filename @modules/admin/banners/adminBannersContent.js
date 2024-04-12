import H1 from "@modules/common/components/heading/h1";
import MotionContainer from "@modules/common/components/container/motionContainer";
import AdminBannerForm from "./adminBannerForm";

export default function AdminBannersContent({ id }) {
  let name = "";

  if (id == 3) {
    name = "Баннер в теле";
  }

  if (id == 4) {
    name = "Баннер в шапке";
  }

  if (id == 5) {
    name = "Баннер при входе";
  }

  return (
    <MotionContainer>
      <div className="pt-3 pb-2.5 lg:border-b-[1px] lg:border-greyborder">
        <H1>Баннеры и реклама</H1>
      </div>
      <div className="md:p-4 md:bg-greylight md:rounded md:shadow w-full mb-10 mt-2.5">
        <div className="flex flex-wrap">
          <AdminBannerForm id={id} name={name} />
        </div>
      </div>
    </MotionContainer>
  );
}
