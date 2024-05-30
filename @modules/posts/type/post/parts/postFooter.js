import ButtonShare from "@modules/common/components/button/buttonShare";
import ButtonReport from "./buttons/buttonReport";



import PostViewed from "./postViewed";
import getProductDate from "helpers/formatters/product/getProductDate";


export default function PostFooter({ product }) {
  return (
    <div className="">
      <div className="flex flex-col md:flex-row md:justify-between gap-[20px]">
        

        <div className="flex gap-3 items-center text-sm text-[#000]/40 justify-between md:justify-normal">
          <p>{getProductDate(product)}</p>
          <p>№ {product.id}</p>
          <PostViewed product={product} />
        </div>


        <div><ButtonReport product={product} /></div>
      </div>
    </div>
  );
}
