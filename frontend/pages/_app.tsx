import { UserProvider } from "@/utils/UserContext";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import NavBar from "@/components/NavBar";
import { Kanit } from "@next/font/google";
const kanit = Kanit({
  subsets: ["latin"],
  weight: ["500", "700", "900", "300"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <style jsx global>
        {`
          :root {
            --kanit-font: ${kanit.style.fontFamily};
          }
        `}
      </style>
      <NavBar />
      <Component {...pageProps} />
    </UserProvider>
  );
}
