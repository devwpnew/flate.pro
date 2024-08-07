import Link from "next/link";
import TextDownloadMobileApp from "./textDownloadMobileApp";
export default function TextAbout() {
  const curYear = new Date().getFullYear()
  return (
    <>
      <div className="mb-8 text-sm">
        <p className="text-grey">
          © 2011—{curYear} flate.pro — сделано в России. Жильё с гарантией.
        </p>
      </div>
      <div className="mb-8 text-sm">
        <Link href="/agree/" className="text-grey underline mb-1 block">
          Пользовательское соглашение
        </Link>
        <Link href="/rules/" className="text-grey underline mb-1 block">
          Правила пользования
        </Link>

        <p className="text-grey">
          Оплачивая услуги на сайте, вы принимаете{" "}
          <Link href="/oferta/" className="text-grey">
            оферту
          </Link>
        </p>
      </div>
      <div className="mb-8 text-sm flex flex-col gap-1">
        <Link href="/marketing/">
          Реклама на сайте
        </Link>
        <Link href="/help">
          Помощь
        </Link>
      </div>
      <TextDownloadMobileApp />
    </>
  );
}
