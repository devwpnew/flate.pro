import { formateDate } from "helpers/formateDate";

export default function Message({ message, currentUser }) {
  return (
    <div
      className={`flex mb-[10px] ${
        message.from_user.id == currentUser.id ? "justify-end" : "justify-start"
      }`}
    >
      <div className={`w-full lg:w-[50%] relative`}>
        <div className="text-grey mb-[4px]">
          {message.from_user.id == currentUser.id
            ? "Вы"
            : message.from_user.user_name}
        </div>
        <div
          className={`py-[10px] px-[15px] border-color-greyborder bg-white border-greyborder border-[1px] rounded relative angle-png`}
        >
          <div className="flex justify-between items-center gap-3 w-full">
            <span className="pt-6">{message.text}</span>

            <span className="inline-flex items-center gap-2 absolute right-2 top-2">
              <span className="text-sm text-grey whitespace-nowrap">
                {message.date_created && formateDate(message.date_created)}{" "}
                {new Date(message.date_created).toLocaleTimeString(
                  process.env.Timezone,
                  { hour: "2-digit", minute: "2-digit" }
                )}
              </span>

              <span className="text-blue">
                {message.read_by_opposite ? "✔✔" : "✔"}
              </span>
            </span>
          </div>

          <div className="flex gap-[10px] w-[100%] flex-wrap">
            {message.include_files &&
              message.include_files.map((src) => {
                return (
                  <img
                    className="max-w-[128px] max-h-[128px] h-[100%] w-[100%]"
                    src={`https://flate.pro/${src}`}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
