"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  async function handleSignOut() {
    await signOut({ redirect: false });
    window.location.href = "/";
  }

  const navLink = (href: string, label: string) => {
    const active = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        href={href}
        className={`relative text-sm font-medium transition-colors pb-0.5 ${
          active ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
        }`}
      >
        {label}
        {active && (
          <span className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
        )}
      </Link>
    );
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md shadow-blue-200 group-hover:shadow-blue-300 transition-shadow">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[11px] font-semibold text-blue-500 tracking-widest uppercase">Naresuan</span>
            <span className="text-lg font-extrabold text-gray-900 tracking-tight leading-none">NU<span className="text-blue-600">Dorm</span></span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {navLink("/dorms", "ค้นหาหอพัก")}
          {session?.user.role === "STUDENT" && navLink("/compare", "เปรียบเทียบ")}
          {session?.user.role === "STUDENT" && navLink("/wishlist", "บันทึกไว้")}
          {session?.user.role === "OWNER" && navLink("/dashboard", "Dashboard")}
          {session?.user.role === "OWNER" && navLink("/feedback", "Feedback")}
          {session?.user.role === "ADMIN" && navLink("/admin", "Admin Panel")}
        </div>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <>
              <Link href="/profile" className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1.5 transition-colors">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">
                    {session.user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">{session.user.name}</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-400 hover:text-red-500 transition-colors font-medium"
              >
                ออกจากระบบ
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                เข้าสู่ระบบ
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
              >
                สมัครสมาชิก
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className={`w-5 h-0.5 bg-gray-600 transition-all mb-1.5 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <div className={`w-5 h-0.5 bg-gray-600 transition-all mb-1.5 ${menuOpen ? "opacity-0" : ""}`} />
          <div className={`w-5 h-0.5 bg-gray-600 transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-1 text-sm shadow-lg">
          {[
            { href: "/dorms", label: "ค้นหาหอพัก" },
            ...(session?.user.role === "STUDENT" ? [{ href: "/compare", label: "เปรียบเทียบ" }] : []),
            ...(session?.user.role === "STUDENT" ? [{ href: "/wishlist", label: "บันทึกไว้" }] : []),
            ...(session?.user.role === "OWNER" ? [{ href: "/dashboard", label: "Dashboard" }] : []),
            ...(session?.user.role === "OWNER" ? [{ href: "/feedback", label: "Feedback" }] : []),
            ...(session?.user.role === "ADMIN" ? [{ href: "/admin", label: "Admin Panel" }] : []),
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              {label}
            </Link>
          ))}
          <div className="border-t border-gray-100 mt-2 pt-2">
            {session ? (
              <>
                <Link href="/profile" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                  โปรไฟล์ ({session.user.name})
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-red-500 font-medium hover:bg-red-50 transition-colors"
                >
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-xl text-gray-700 font-medium hover:bg-gray-50">เข้าสู่ระบบ</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="block mt-1 px-3 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-center hover:bg-blue-700">สมัครสมาชิก</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
