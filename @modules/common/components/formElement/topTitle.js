export default function TopTitle({ className = "", text, isRequired }) {
  return (
    <div
      className={
        className
          ? className
          : "absolute top-[-10px] left-[9px] z-[9] bg-greylight text-xs text-grey px-[2px] whitespace-nowrap"
      }
    >
      {text}
      {isRequired && <span className="text-red">*</span>}
    </div>
  );
}
