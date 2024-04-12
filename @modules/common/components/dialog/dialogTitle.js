export default function DialogTitle({ children, className = "" }) {
  return (
    <div
      className={`${className} text-primary text-2xl lg:text-[32px] font-bold mb-8 whitespace-nowrap`}
    >
      {children}
    </div>
  );
}
