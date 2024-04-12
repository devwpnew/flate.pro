import Image from "next/image";
import viewedIcon from "public/icons/viewed-icon.svg";

export default function PostViewed({ product }) {
  return (
    <div className="flex items-center gap-1 text-sm">
      <Image src={viewedIcon.src} width={12} height={15} />
      {product && product.stat_views ? product.stat_views : 0}
    </div>
  );
}
