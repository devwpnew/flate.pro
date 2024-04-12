import LinkWrap from "@modules/common/components/link/linkWrap";

export default function RegisrationButton() {
  return (
    <LinkWrap href="/user/profile/auth" className="text-blue underline text-sm">
      Регистрация
    </LinkWrap>
  );
}
