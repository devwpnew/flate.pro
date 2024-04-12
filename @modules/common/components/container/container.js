export default function Container({children, className = ""}) {
  return (
    <div className={`container mx-auto px-[15px] ${className}`}>
        {children}
    </div>
  )
}