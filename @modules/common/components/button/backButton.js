import { useRouter } from "next/router";
import Image from "next/image";

import slideArrowBack from "public/icons/slide-arrow-left.svg";
import { useEffect } from "react";

export default function BackButton({ href, onClick, className = "" }) {
  const router = useRouter();

  const backHandler = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button onClick={onClick ? onClick : backHandler} className={className}>
      <Image
        src={slideArrowBack.src}
        width={slideArrowBack.width}
        height={slideArrowBack.height}
      />
    </button>
  );
}
