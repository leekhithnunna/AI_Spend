import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/8 py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-violet-600">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-white">AI Spend Audit</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm text-white/40">
          <span>Built for Credex Internship 2026</span>
          <span className="hidden sm:block">·</span>
          <a
            href="https://credex.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/70 transition-colors"
          >
            credex.in
          </a>
        </div>

        {/* Copyright */}
        <p className="text-xs text-white/25">
          © 2026 · No data sold, ever.
        </p>
      </div>
    </footer>
  );
}
