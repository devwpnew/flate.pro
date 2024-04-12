export default function DialogWrapper({ children }) {
  return (
    <>
      <div className="fixed inset-0 bg-backdrop z-50">
        <div className="h-screen flex justify-center items-center">
          {children}
        </div>
      </div>
    </>
  );
}
