import Link from "next/link";

export default function LoginFormText() {
  return (
    <div className="mt-[10px] mx-auto text-center text-grey hidden md:block text-xs text-white">
      <p>
        Нажимая продолжить Вы принимаете условия
        <br />
        <Link href="/rules/" className="underline underline-offset-1">
            Пользовательского соглашения
        </Link>{" "}
        и{" "}
        <Link href="/policy/" className="underline underline-offset-1">
          Политики конфиденциальности
        </Link>
      </p>
    </div>
  );
}
