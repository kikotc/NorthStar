import Link from "next/link";

export default function AuthCodeError() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <div className="rounded-[32px] border border-red-500/30 bg-red-500/10 p-10">
        <h1 className="text-3xl font-semibold text-white">Authentication Error</h1>
        <p className="mt-4 text-lg text-slate-200">
          There was an error authenticating your account. This could be due to an expired or invalid link.
        </p>
        <p className="mt-2 text-slate-300">
          Please try signing in again or contact support if the issue persists.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-block rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-900/40 transition hover:opacity-90"
        >
          Back to Sign In
        </Link>
      </div>
    </main>
  );
}
