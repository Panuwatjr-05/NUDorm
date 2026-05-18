import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import SessionProvider from "@/components/layout/SessionProvider";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NUDorm — หาหอพักมหาวิทยาลัยนเรศวร",
  description: "ค้นหาและเปรียบเทียบหอพักรอบมหาวิทยาลัยนเรศวร พิษณุโลก",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" style={{ background: "#f8fafc" }}>
      <body className={`${geist.className} min-h-screen flex flex-col`} style={{ background: "#f8fafc", color: "#171717" }}>
        <SessionProvider>
          <Navbar />
          <main className="max-w-6xl mx-auto px-4 py-6 w-full flex-1">{children}</main>
          <footer className="py-6 text-center border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-400 tracking-widest mb-1">NUDorm</p>
            <p className="text-xs text-gray-400">หอพัก · ราคา · รีวิว — ครบในที่เดียว</p>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
