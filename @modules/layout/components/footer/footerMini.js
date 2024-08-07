import Container from "@modules/common/components/container/container";
import Link from "next/link";

export default function FooterMini() {
  return (
    <Container>
      <div className="w-full flex flex-row flex-wrap gap-10 justify-center py-[22px]">
        <div className="text-center md:text-left">
          <Link href={"/oferta"} className={`hover:text-blue cursor-pointer relative text-grey text-sm inline underline underline-offset-4`}>
              Оферта
          </Link>
        </div>
        <div className="text-center md:text-center">
          <Link href={"/rules"} className={`hover:text-blue cursor-pointer relative text-grey text-sm inline underline underline-offset-4`}>
            Правила использования
          </Link>
        </div>
        <div className="text-center md:text-right">
          <Link href={"/policy"} className={`hover:text-blue cursor-pointer relative text-grey text-sm inline underline underline-offset-4`}>
            Политика конфиденциальности
          </Link>
        </div>
      </div>
    </Container>
  );
}