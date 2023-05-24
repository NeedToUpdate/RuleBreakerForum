import { UserContext } from "@/utils/UserContext";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";

export default function LoginPage() {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  console.log(user);
  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user]);

  const handleLogin = async () => {
    window.location.href = `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URI}${process.env.NEXT_PUBLIC_AUTH_SERVICE_LOGIN_ROUTE}`;
  };

  return (
    <div>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
}
