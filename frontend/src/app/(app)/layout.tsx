'use client'

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

const appLinks = [
  { label: "Profile", href: "/profile" },
  { label: "Scholarships", href: "/scholarships" },
  { label: "Landing", href: "/" },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <div className="mx-auto min-h-screen px-6 py-10 sm:px-12">
      <header className="mb-8 flex flex-wrap items-center gap-4 rounded-3xl border border-gray-200 bg-white px-6 py-4 shadow-sm">
        {/* Left: logo */}
        <div className="flex flex-1 items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.svg" alt="North Star AI logo" width={40} height={40} />
            <div>
              <p className="text-base font-semibold text-gray-900">North Star AI</p>
              <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500">
                Student portal
              </p>
            </div>
          </Link>
        </div>

        {/* Center: nav pills */}
        <nav className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-700">
          {appLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-full border border-gray-200 px-4 py-1.5 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: user info + sign out */}
        <div className="flex flex-1 items-center justify-end gap-3">
          {user && (
            <>
              <div className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-1.5 text-xs text-gray-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {user.email}
              </div>
              <button
                onClick={handleSignOut}
                className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-gray-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </header>
      <main className="space-y-8">{children}</main>
    </div>
  );
}
