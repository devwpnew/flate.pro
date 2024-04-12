import declension from "helpers/formatters/declension";

export default function LineStatusBar({ num, max, md, min }) {
  const getColor = (num, max, md, min) => {
    if (num <= min) {
      return { color: "red", width: "1/3" };
    }

    if (num >= max) {
      return { color: "green", width: "full" };
    }

    if (num <= md) {
      return { color: "orange", width: "1/2" };
    }
  };

  const colorObj = getColor(num, max, md, min);

  return (
    <>
      <span className="text-exs md:text-xs block w-full">
        {num === 0 ? `В архиве ` : declension(num, ["Остался", "Осталось", "Осталось"])}{" "}
        {num} {declension(num, ["день", "дня", "дней"])}
      </span>

      <div className="w-[150px] h-[3px] bg-greylight my-2.5 relative">
        <div
          className={`w-${colorObj?.width} h-[3px] bg-${colorObj?.color} absolute left-0 top-0`}
        ></div>
      </div>
    </>
  );
}
