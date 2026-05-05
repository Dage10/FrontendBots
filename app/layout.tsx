import { AuthProvider } from "./context/AuthContext";
import "./globals.css";
import SSEListener from "../components/SSEListener";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Bots Management",
  description: "Bots management is a website for creating and managing bots for platforms,like Discord,Telegram,Reddit,Github Events,Youtube,etc.",
  icons: {
    icon: "/public/favicon.ico",
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      
      <body className="bg-[#121212] text-white font-mono justify-center items-center min-h-screen flex flex-col">
        <SSEListener />
        <Toaster position="bottom-right" />
          <AuthProvider>{children}</AuthProvider>
        </body>
    </html>
  );
}