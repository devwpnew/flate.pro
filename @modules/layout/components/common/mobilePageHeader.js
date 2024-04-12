import BackButton from "@modules/common/components/button/backButton";
import Container from "@modules/common/components/container/container";

export default function MobilePageHeader({ href, title }) {
  return (
    <>
      <div className="border-greyborder border-y-[1px] border-solid bg-greylight py-4 text-center mb-7 relative">
        <Container>
          <div className="relative">
            <div className="absolute left-0">
              <BackButton href={href} />
            </div>
          </div>
          <div className="flex justify-center items-center">
            <span className="font-semibold text-base">{title}</span>
          </div>
        </Container>
      </div>
    </>
  );
}
