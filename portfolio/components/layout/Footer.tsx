import { BackToTop } from "@/components/ui/BackToTop";

export function Footer({ name }: { name: string }) {
  return (
    <footer className="relative z-[1] border-t border-line">
      <div className="wrap flex flex-col items-start justify-between gap-6 py-10 sm:flex-row sm:items-center">
        <p className="t-label">
          © {new Date().getFullYear()} {name}
        </p>
        <BackToTop />
      </div>
    </footer>
  );
}
