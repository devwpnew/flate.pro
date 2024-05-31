import Container from "@modules/common/components/container/container";
import Link from "next/link";

export default function FooterMini() {
  return (
    <Container>
      <div className="w-full flex flex-row flex-wrap gap-10 justify-center py-[22px]">
        <div className="text-center md:text-left">
          <Link href={"/oferta"}>
            <a
              className={`hover:text-blue cursor-pointer relative text-grey text-sm inline underline underline-offset-4`}
            >
              Оферта
            </a>
          </Link>
        </div>
        <div className="text-center md:text-center">
          <Link href={"/rules"}>
            <a
              className={`hover:text-blue cursor-pointer relative text-grey text-sm inline underline underline-offset-4`}
            >
              Правила использования
            </a>
          </Link>
        </div>
        <div className="text-center md:text-right">
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