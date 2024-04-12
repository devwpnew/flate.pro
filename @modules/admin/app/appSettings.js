import MotionContainer from "@modules/common/components/container/motionContainer";
import H1 from "@modules/common/components/heading/h1";
import FormAppPushes from "./form/formAppPushes";
import FormAppAppBlock from "./form/formAppBlock";

export default function AppSettings() {
  return (
    <MotionContainer>
      <div className="pt-3 pb-2.5 lg:border-b-[1px] lg:border-greyborder">
        <H1 additionalClass="inline-flex items-center gap-2">Приложение</H1>
      </div>

      <div className="flex flex-row gap-5 mb-10 mt-2.5">
        <div className="md:p-4 md:bg-greylight md:rounded md:shadow w-full">
          <FormAppPushes />
        </div>
        <div className="md:p-4 md:bg-greylight md:rounded md:shadow w-full">
          <FormAppAppBlock />
        </div>
      </div>
    </MotionContainer>
  );
}
