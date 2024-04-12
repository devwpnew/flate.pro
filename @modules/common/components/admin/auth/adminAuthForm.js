import API from "pages/api/service/api";
import { useRouter } from "next/router";
import { useState } from "react";
import MaskInput from "react-maskinput/lib";
import { CheckboxCheck } from "../../checkbox/checkboxCheck";

export default function AdminAuthForm({ data }) {
  const [enterTypeTel, setEnterTypeTel] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userLogin = formData.get("admin_email_or_phone");
    const userPass = formData.get("admin_password");

    if (!userPass) {
      alert("Пароль не введён");
      return false;
    }

    const getUserFilter =
      userLogin.indexOf("@") + 1 ? { email: userLogin } : { phone: userLogin };

    const checkUserPassword = await API.auth.userPasswordAuth(
      getUserFilter,
      data.ip,
      data.userAgent,
      userPass,
      window.location.origin
    );

    if (checkUserPassword === true) {
      alert("Успешная авторизация");
      window.location.reload();
    } else {
      alert(checkUserPassword?.error);
    }
  };

  const [userPhone, setUserPhone] = useState("");

  const changePhoneHandler = (e) => {
    if (e.target.value === "+7 (8") {
      e.target.value = "+7 (";
    }
    setUserPhone(e.target.value);
  };

  return (
    <>
      <div className="inline-flex items-center gap-2 my-4">
        <span>Вход по телефону:</span>
        <div className="cursor-pointer">
          <CheckboxCheck
            name="repairment"
            checked={enterTypeTel}
            callback={setEnterTypeTel}
            text={true}
            square={true}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {enterTypeTel ? (
          <MaskInput
            value={userPhone}
            onChange={changePhoneHandler}
            placeholder="+7"
            maskChar="_"
            className="w-full h-11 text-center outline-none px-2.5 border-greyborder border rounded bg-white py-2"
            mask={"+7 (000) 000-00-00"}
            name="admin_email_or_phone"
            // onPaste={(ev) => console.log(ev)}
          />
        ) : (
          <input
            type="text"
            className="py-4 border w-full border-greyborder mt-3.5 mb-3.5 text-center"
            name="admin_email_or_phone"
            placeholder="Email"
          />
        )}

        <input
          type="password"
          className="py-4 border w-full border-greyborder mt-3.5 mb-3.5 text-center"
          name="admin_password"
          placeholder="Пароль администратора"
        />
        <input
          type="submit"
          className="text-sm text-white w-full h-11 rounded md:text-black font-normal bg-blue  hover:underline underline-offset-2 cursor-pointer"
          value="Войти"
        />
      </form>
    </>
  );
}
