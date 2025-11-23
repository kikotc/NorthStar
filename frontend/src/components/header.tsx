'use client'

import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

const navLinks = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Scholarships", href: "/scholarships" },
  { label: "Prototype", href: "/prototype" },
]

function AuthButtons() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/profile"
          className="rounded-full border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Dashboard
        </Link>
        <button
          onClick={handleSignOut}
          className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="rounded-full border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
      >
        Log in
      </Link>
      <Link
        href="/signup"
        className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        Sign up
      </Link>
    </div>
  )
}

export default function Header() {
  return (
    <header className="flex flex-col gap-4 rounded-3xl border border-gray-200/60 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <Link href="/" className="flex items-center gap-3">
        <Image src="/logo.svg" alt="North Star AI logo" width={40} height={40} />
        <div>
          <p className="text-base font-semibold tracking-wide text-gray-900">
            North Star AI
          </p>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-gray-500">
            Scholarship Copilot
          </p>
        </div>
      </Link>
      <nav className="flex flex-wrap items-center gap-5 text-sm font-medium text-gray-600">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="transition hover:text-indigo-600"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <AuthButtons />
    </header>
  )
}

