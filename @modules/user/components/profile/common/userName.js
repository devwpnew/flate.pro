import { useSelector } from "react-redux";

export default function UserName({
  name,
  lastName,
  companyName,
  isAdmin,
  isFeatured,
  className,
}) {
  const user = useSelector((state) => state.userLogin.value);

  let username = "Пользователь";

  username = name;

  const lastNameVal = lastName;
  const companyNameVal = user ? user.user_agency : "";

  if (lastName) {
    username = lastNameVal;
  }

  if (companyName) {
    username = companyNameVal;
  }

  return (
    <span
      className={
        className
          ? className
          : `${isAdmin ? "text-white" : "text-primary"} ${
              isFeatured && "font-bold text-grey"
            }`
      }
    >
      {username}
    </span>
  );
}
