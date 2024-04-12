import Link from "next/link";

export default function UserSubscribeExpiration({ isAdmin, isHeader, user }) {
  
  return (
    <span className={`text-xs ${isAdmin ? "text-white" : "text-primary"}`}>
      {isAdmin ? (
        <span className="font-semibold">Администратор</span>
      ) : (
        <>
          <Link href="/user/profile/subscribe">
            <span className={`cursor-pointer text-xs rounded ${isHeader ?'px-2.5 py-[6px] bg-greyF3 hover:bg-bluelighter block min-w-[129px]' : "hover:underline underline-offset-1"}`}>
              {user?.paid ? (
                <>
                  <span className="font-semibold">Осталось: </span>15 дней
                </>
              ) : (
                <>
                  <span className="font-semibold">Осталось: </span>∞ дней
                </>
              )}
            </span>
          </Link>
        </>
      )}
    </span>
  );
}
