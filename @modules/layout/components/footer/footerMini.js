import Container from "@modules/common/components/container/container";
import Link from "next/link";

export default function FooterMini() {
  return (
    <Container>
      <div className="w-full flex flex-row flex-wrap gap-y-1 justify-between py-[22px]">
        <div className="w-full text-center md:w-1/3 md:text-left">
          <Link href={"/oferta"}>
            <a
              className={`hover:text-blue cursor-pointer relative text-grey text-sm inline underline underline-offset-4`}
            >
              Оферта
            </a>
          </Link>
        </div>
        <div className="w-full text-center md:w-1/3 md:text-center">
          <Link href={"/rules"}>
            <a
              className={`hover:text-blue cursor-pointer relative text-grey text-sm inline underline underline-offset-4`}
            >
              Правила использования
            </a>
          </Link>
        </div>
        <div className="w-full text-center md:w-1/3 md:text-right">
          <Link href={"/policy"}>
            <a
              className={`hover:text-blue cursor-pointer relative text-grey text-sm inline underline underline-offset-4`}
            >
              Политика конфиденциальности
            </a>
          </Link>
        </div>
      </div>
    </Container>
  );
}
