import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="wrap flex min-h-[100svh] flex-col items-start justify-center gap-6 outline-none">
      <p className="t-label text-crimson-text">404</p>
      <h1 className="t-display text-[length:var(--fs-h2)]">
        Page not <span className="t-em">found</span>
      </h1>
      <p className="t-lead prose-measure text-mute">That page does not exist, or it has moved.</p>
      <Link href="/" className="btn btn-primary">
        <span>Back home</span>
      </Link>
    </main>
  );
}
