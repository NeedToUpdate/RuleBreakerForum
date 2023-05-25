import { UserContext } from "@/utils/UserContext";
import Link from "next/link";
import React, { useContext } from "react";

export default function NavBar() {
  const { user, setUser } = useContext(UserContext);
  return (
    <nav className="w-full h-16 bg-primary-200 dark:bg-primary-700 border-highlight-500 border-b-2 flex flex-row items-center justify-start p-5">
      <Link href="/">
        <h3 className="text-black dark:text-white text-2xl font-bold">
          Rule<span className="font-black">Breaker</span>
        </h3>
      </Link>
      <div className="flex-1"></div>
      <Link href="/create-post" className="text-black dark:text-white cursor-pointer hover:translate-y-[-2px]">
        Create Post
      </Link>
      {user ? (
        <p>Welcome, {user.username}</p>
      ) : (
        <Link href="/login" className="text-black dark:text-white cursor-pointer hover:translate-y-[-2px]">
          Login
        </Link>
      )}
    </nav>
  );
}
