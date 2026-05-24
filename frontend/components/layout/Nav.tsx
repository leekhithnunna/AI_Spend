"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/audit", label: "Audit" },
  { href: "/results", label: "Results" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          <span className="font-semibold text-white text-sm group-hover:text-violet-200 transition-colors">
            Spend Audit
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm transition-colors",
                pathname === link.href
                  ? "text-white bg-white/10"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/audit"
            className="ml-2 hidden sm:inline-flex h-8 items-center rounded-lg bg-violet-600 px-3 text-xs font-medium text-white hover:bg-violet-700 transition-colors"
          >
            Start Audit
          </Link>
        </div>
      </div>
    </nav>
  );
}
