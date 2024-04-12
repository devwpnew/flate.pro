import { useEffect, useState } from "react";

export default function AreaModalInput({ activeAreas, area, onClick }) {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (activeAreas.length === 0) setIsChecked(false);

    const check = activeAreas.find((id) => id === area.id);

    if (check) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  }, [activeAreas]);

  return (
    <>
      <div
        className="flex items-center w-[150px] md:w-[200px] cursor-pointer group b-contain text-left"
        onClick={onClick}
      >
        <div className={`input ${isChecked && "active"}`}></div>
        <span className="text-black group-hover:text-blue">{area.name}</span>
      </div>
    </>
  );
}
