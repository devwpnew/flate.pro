import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "store/global/user/userType";
import { setLogedIn } from "store/global/user/userLogin";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

export default function useUser(user, redirectBefore, redirectAfter) {
  const router = useRouter();
  const dispatch = useDispatch();
  const userSettled = useSelector((state) => state.userLogin.value);

  useEffect(() => {
    const noUser = !user || Object.entries(user).length === 0;

    if (noUser) {
      if (redirectBefore) {
        router.push(redirectBefore);
      }
    }

    if (user?.Error) {
      if (redirectBefore) {
        router.push(redirectBefore);
      }
    }
  }, [user]);

  useEffect(() => {
    if (userSettled && redirectAfter) {
      router.push(redirectAfter);
      return;
    }

    if (!userSettled) {
      if (user) {
        if (!user.Error) {
          dispatch(setLogedIn(user));
        } else {
          dispatch(setLogedIn(false));
        }
      } else {
        dispatch(setLogedIn(false));
      }
    }

    if (userSettled && !userSettled.id) {
      if (redirectBefore) {
        router.push(redirectBefore);
      }
    }
  }, [user]);

  return userSettled;
}
