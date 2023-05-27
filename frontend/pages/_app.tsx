import { UserProvider } from "@/utils/UserContext";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import NavBar from "@/components/NavBar";
import { Kanit } from "next/font/google";
import Modal from 'react-modal'
import UsernameProvider from "@/utils/UserNameContext";
const kanit = Kanit({
  subsets: ["latin"],
  weight: ["500", "700", "900", "300"],
});
Modal.setAppElement('#__next');
export default function App({ Component, pageProps }: AppProps) {
  return (
    <UsernameProvider>
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
    </UsernameProvider>
  );
}
