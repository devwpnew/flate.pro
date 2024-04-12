import BackButton from "@modules/common/components/button/backButton";
import Container from "@modules/common/components/container/container";
import H1 from "@modules/common/components/heading/h1";
import MobilePageHeader from "@modules/layout/components/common/mobilePageHeader";
import getLayout from "helpers/getLayout";
export default function AddHeader() {
  const { MOBILE, DESKTOP, VARIANTS } = getLayout();

  return MOBILE ? (
    <MobilePageHeader href={"/"} title="Добавление нового объекта" />
  ) : (
    <Container>
      <div className="pt-3 pb-2.5 lg:border-b-[1px] lg:border-greyborder mb-5">
        <H1>Добавление нового объекта</H1>
      </div>
    </Container>
  );
}
