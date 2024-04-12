import ButtonShare from "@modules/common/components/button/buttonShare";
import ButtonReport from "./buttons/buttonReport";

export default function PostFooter({ product }) {
  return (
    <div className="mb-2 md:mb-5 pt-2 md:pt-5 border-t border-greyborder">
      <div className="flex flex-col md:flex-row md:justify-end gap-2.5">
        {/* <ButtonShare
          className="whitespace-nowrap py-1 px-2"
          type="green"
          iconW="20"
          iconH="20"
        >
          Поделиться
        </ButtonShare> */}

        <ButtonReport product={product} />
      </div>
    </div>
  );
}
