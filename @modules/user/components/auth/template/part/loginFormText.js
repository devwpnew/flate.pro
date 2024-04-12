import Link from "next/link";

export default function LoginFormText() {
  return (
    <div className="text-xs mt-[10px] mx-auto text-center text-grey hidden md:block text-exs">
      <p>
        Нажимая продолжить Вы принимаете условия
        <br />
        <Link href="/rules/">
          <a className="underline underline-offset-1">
            Пользовательского соглашения
          </a>
        </Link>{" "}
        и{" "}
        <Link href="/policy/">
          <a className="underline underline-offset-1">
            Политики конфиденциальности
          </a>
        </Link>
      </p>
    </div>
  );
}
