import api from "pages/api/service/api";
import { useState, useEffect } from "react";

import Button from "@modules/common/components/button/button";
import DialogCloseIcon from "@modules/common/components/dialog/dialogCloseIcon";
import SettingsInputPhone from "@modules/user/components/settings/button/settingsInputPhone";
import Preloader from "@modules/common/components/preloader/preloader";
import SelectNoAutocomplete from "@modules/common/components/select/listBox/selectNoAutocomplete";
import { setFetchState } from "store/global/helpers/fetchTrigger";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export default function SettingsSelectNewPhone({ user, name, ...other }) {
  const fetchState = useSelector((state) => state.fetchTrigger.value);
  const dispatch = useDispatch();

  const [isUserLoading, setIsUserLoading] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const [newPhone, setNewPhone] = useState(false);
  const [isAddNewPhone, setIsAddNewPhone] = useState(false);

  const [options, setOptions] = useState(false);

  useEffect(() => {
    (async () => {
      setIsUserLoading(true);
      const userUpdated = await api.get.user({
        window_host: window.location.origin,
        filter: { id: user.id },
        sort: {
          id: "asc",
        },
        limit: "all",
      });

      const userFirst = userUpdated[0];

      if (userFirst) {
        const phone = userFirst.phone;
        const additionalPhones = userFirst?.additional_phones;

        const optionsTmp = [];
        optionsTmp.push({ name: phone, id: phone });

        if (additionalPhones) {
          additionalPhones.map((phone) => {
            if (phone) {
              optionsTmp.push({ name: phone, id: phone });
            }
          });
        }

        setOptions(optionsTmp);
      }

      setIsUserLoading(false);
    })();
  }, [success, fetchState]);

  const onSendNewPhone = async () => {
    if (!newPhone) {
      setError("Вы не ввели телефон.");
      return;
    }

    if (newPhone.length < 11) {
      setError("Длина телефона не может быть ниже 11 символов.");
      return;
    }

    setIsLoading(true);

    const res = await api.add.userAdditionalPhone(newPhone, user);

    if (res?.error) {
      setError(res.error);
    }

    setIsLoading(false);
    // console.log(res, "res");
    if (res?.data) {
      setSuccess(true);
      dispatch(setFetchState(!fetchState));
    }
  };

  const deleteAction = async (phone) => {
    setIsLoading(true);
    const res = await api.remove.userAdditionalPhone(phone, user);
    // console.log(res, "res");
    setIsLoading(false);
    setSuccess("номер удален");
    dispatch(setFetchState(!fetchState));
  };

  return (
    <>
      <div className="h-10">
        {(isUserLoading && !options) || options.length === 0 ? (
          <Preloader />
        ) : (
          <SelectNoAutocomplete
            placeholder="Номер телефона"
            name={name}
            options={options}
            isCanDelete={true}
            deleteAction={deleteAction}
            {...other}
          />
        )}
      </div>

      <div className="mt-2.5">
        {isAddNewPhone && !success ? (
          <div className="relative h-[115px]">
            {isLoading ? (
              <Preloader />
            ) : (
              <>
                <SettingsInputPhone
                  name={name}
                  setPhone={setNewPhone}
                  className={
                    "w-full h-10 text-left text-sm outline-none px-2.5 border-greyborder border rounded bg-white py-2"
                  }
                />

                <span className="text-red text-sm">{error}</span>

                <Button
                  className={"w-full h-auto p-2.5 mt-2.5"}
                  type="button"
                  onClick={() => onSendNewPhone()}
                >
                  Принять
                </Button>

                <DialogCloseIcon
                  className={"right-[-16px] top-[14px]"}
                  onClick={() => setIsAddNewPhone(false)}
                />
              </>
            )}
          </div>
        ) : (
          <>
            {success ? (
              <span className="text-green text-sm">
                {success === "номер удален"
                  ? "Ваш номер успешно удален"
                  : "Ваш новый номер успешно добавлен"}
              </span>
            ) : (
              <Button
                className={"w-full h-auto p-2.5"}
                type="button"
                onClick={() => setIsAddNewPhone(true)}
              >
                Добавить ещё номер
              </Button>
            )}
          </>
        )}
      </div>
    </>
  );
}
