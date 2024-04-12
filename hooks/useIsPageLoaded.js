import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function useIsPageLoaded() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    // Обработка начала загрузки
    router.events.on("routeChangeStart", () => {
      setIsLoading(true);
    });
    // Обработка окончания загрузки
    router.events.on("routeChangeComplete", () => {
      setIsLoading(false);
    });
  }, []);


  return (
    isLoading
  )
}
