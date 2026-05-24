import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/landing/Footer";

interface PageShellProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export function PageShell({ children, showFooter = true }: PageShellProps) {
  return (
    <>
      <Nav />
      <div className="pt-14 min-h-screen flex flex-col">{children}</div>
      {showFooter && <Footer />}
    </>
  );
}
