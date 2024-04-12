import Button from "./button";

export default function ButtonWithIcon({
  icon,
  iconW,
  iconH,
  children,
  ...other
}) {
  return (
    <>
      <Button {...other}>
        {icon ? (
          <span className="flex flex-row gap-2 md:gap-2.5 items-center justify-center">
            <span
              style={{
                width: iconW ? `${iconW}px` : "15px",
                height: iconH ? `${iconH}px` : "15px",
                minWidth: iconW ? `${iconW}px` : "15px",
                minHeight: iconH ? `${iconH}px` : "15px",
              }}
              className={`flex flex-col justify-center items-center`}
            >
              {icon}
            </span>

            {children}
          </span>
        ) : (
          children
        )}
      </Button>
    </>
  );
}
