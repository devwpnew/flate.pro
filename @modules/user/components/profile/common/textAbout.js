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
        <Link href="/agree/">
          <a className="text-grey underline mb-1 block">
            Пользовательское соглашение
          </a>
        </Link>
        <Link href="/rules/">
          <a className="text-grey underline mb-1 block">Правила пользования</a>
        </Link>

        <p className="text-grey">
          Оплачивая услуги на сайте, вы принимаете{" "}
          <Link href="/oferta/">
            <a className="text-grey">оферту</a>
          </Link>
        </p>
      </div>
      <div className="mb-8 text-sm flex flex-col gap-1">
        <Link href="/marketing/">
          <a>Реклама на сайте</a>
        </Link>
        <Link href="/help">
          <a>Помощь</a>
        </Link>
      </div>
      <TextDownloadMobileApp />
    </>
  );
}
