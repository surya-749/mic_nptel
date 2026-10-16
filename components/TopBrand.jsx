import Link from 'next/link';

export default function TopBrand() {
  return (
    <header className="top-brand">
      <Link href="/" className="top-brand-badge" title="MIC VIT Chennai — NPTEL Prep">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/mic-logo.webp" alt="MIC Logo" className="top-brand-logo" width="48" height="48" />
        <span className="top-brand-text">MIC VIT CHENNAI</span>
      </Link>
    </header>
  );
}
