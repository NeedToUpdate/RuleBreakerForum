import { UserContext } from "@/utils/UserContext";
import { useOutsideClick } from "@/utils/useOutsideClick";
import Link from "next/link";
import React, { useContext, useRef, useState } from "react";

export default function NavBar() {
  const { user, logout } = useContext(UserContext);
  const [expanded, setExpanded] = useState(false);
  const navRef = useRef(null)
  useOutsideClick(navRef, ()=>setExpanded(false))
  return (
    <nav ref={navRef} className="bg-primary-200 border-highlight-700 dark:border-highlight-500 border-b-2 dark:bg-primary-700">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex gap-5 items-center">
          <img src="/brain-icon.svg" className="h-8 mr-3" alt="RuleBreaker Forums Logo" />
          <h3 className="text-secondary-900 dark:text-white text-2xl font-bold">
            Rule<span className="font-black">Breaker</span>
          </h3>
        </Link>
        <button
          onClick={() => setExpanded(!expanded)}
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 ml-3 text-sm text-secondary-100 rounded-lg md:hidden hover:bg-secondary-300 focus:outline-none focus:ring-2 focus:ring-secondary-200 dark:text-secondary-400 dark:hover:bg-secondary-700 dark:focus:ring-secondary-600"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
          </svg>
        </button>
        <div className={`${expanded ? "max-h-[1000px]" : "max-h-0"} md:max-h-none w-full md:block md:w-auto duration-200 overflow-hidden`} id="navbar-default">
          <ul className="font-medium flex flex-col items-center p-4 md:p-0 mt-4 border border-secondary-100 rounded-lg bg-secondary-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-primary-200 dark:bg-secondary-800 md:dark:bg-transparent dark:border-secondary-700">
            {user ? (
              <>
                <li>
                  <p className="text-sm pointer-events-none opacity-75 duration-150 block py-2 pl-3 pr-4 text-secondary-900 rounded hover:bg-secondary-100 md:hover:bg-transparent md:border-0 md:hover:text-primary-700 md:p-0 dark:text-white md:dark:hover:text-primary-500 dark:hover:bg-secondary-700 dark:hover:text-white md:dark:hover:bg-transparent">
                    User: {user.username}
                  </p>
                </li>
                <li onClick={()=>setExpanded(false)} >
                  <Link
                    href="/create-post"
                    className=" duration-150 block py-2 pl-3 pr-4 text-secondary-900 rounded hover:bg-secondary-100 md:hover:bg-transparent md:border-0 md:hover:text-primary-700 md:p-0 dark:text-white md:dark:hover:text-primary-500 dark:hover:bg-secondary-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  >
                    Create Post
                  </Link>
                </li>

                <li onClick={()=>setExpanded(false)} >
                  <p
                    onClick={() => logout()}
                    className="cursor-pointer select-none duration-150 block py-2 pl-3 pr-4 text-secondary-900 rounded hover:bg-secondary-100 md:hover:bg-transparent md:border-0 md:hover:text-primary-700 md:p-0 dark:text-white md:dark:hover:text-primary-500 dark:hover:bg-secondary-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  >
                    Logout
                  </p>
                </li>
              </>
            ) : (
              <li onClick={()=>setExpanded(false)} >
                <Link
                  href="/login"
                  className=" duration-150 block py-2 pl-3 pr-4 text-secondary-900 rounded hover:bg-secondary-100 md:hover:bg-transparent md:border-0 md:hover:text-primary-700 md:p-0 dark:text-white md:dark:hover:text-primary-500 dark:hover:bg-secondary-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
