import Link from "next/link";
import Image from "next/image";
import blueEnvelope from "public/blue-envelope.png";
import Container from "@modules/common/components/container/container";

export default function LoginFormHelp() {
  return (
    <Container>
      <div className="text-center text-sm text-blue font-semibold hover:underline">
        <Link href="/help/">
          <a className="">Нужна помощь?</a>
        </Link>{" "}
      </div>

      <div className="text-[8px] text-center text-grey md:hidden">
        <p>
          Нажимая продолжить Вы принимаете условия
          <br />
          <Link href="/rules/">
            <a className="underline underline-offset-4">
              Пользовательского соглашения
            </a>
          </Link>{" "}
          и{" "}
          <Link href="/policy/">
            <a className="underline underline-offset-4" href="/">
              Политики конфиденциальности
            </a>
          </Link>
        </p>
      </div>

      <Link href="/message">
        <a>
          <div className="flex flex-col mt-[30px] items-center md:hidden">
            <Image
              src={blueEnvelope.src}
              width={blueEnvelope.width}
              height={blueEnvelope.height}
            />

            <p className="text-center text-sm font-semibold max-w-[220px] w-full">
              Прочтите открытое письмо основателя{" "}
              <span className="text-blue underline cursor-pointer">
                FLATE.PRO
              </span>
            </p>
          </div>
        </a>
      </Link>

      <Link href={"/"}>
        <a className="flex items-center justify-center gap-1 lg:hidden text-blue mt-[30px] cursor-pointer">
          <svg
            width="14"
            height="9"
            viewBox="0 0 14 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.755859 4.50603L4.74586 0.509033L5.17286 0.950033C5.26619 1.04337 5.30119 1.13903 5.27786 1.23703C5.25919 1.33037 5.21019 1.41903 5.13086 1.50303L3.12186 3.49803C2.90253 3.71737 2.70186 3.89703 2.51986 4.03703C2.75319 4.00903 2.99819 3.9857 3.25486 3.96703C3.51619 3.94837 3.78453 3.93903 4.05986 3.93903H13.1739V5.08003H4.05986C3.78453 5.08003 3.51619 5.0707 3.25486 5.05203C2.99819 5.03337 2.75319 5.01003 2.51986 4.98203C2.69253 5.1127 2.89319 5.29003 3.12186 5.51403L5.14486 7.53003C5.22886 7.61403 5.28019 7.7027 5.29886 7.79603C5.31753 7.88937 5.28253 7.9827 5.19386 8.07603L4.75986 8.52403L0.755859 4.50603Z"
              fill="#4BA5F8"
            />
          </svg>
          На главную
        </a>
      </Link>
    </Container>
  );
}
