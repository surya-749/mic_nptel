'use client';
import { useEffect, useState } from 'react';

const cloudSVGs = [
  // Type 0: Large Fluffy Cloud
  `<svg width="150" height="60" viewBox="0 0 75 30" shape-rendering="crispEdges">
    <path fill="#ffffff" d="M16 11h42v15H8v-9h8z M27 5h20v6H27z M6 15h63v9H6z M2 19h71v6H2z"/>
    <path fill="#aee2fb" d="M2 25h71v3H2z M10 28h55v2H10z"/>
  </svg>`,
  // Type 1: Medium Rounded Cloud
  `<svg width="110" height="48" viewBox="0 0 55 24" shape-rendering="crispEdges">
    <path fill="#ffffff" d="M13 8h29v12H7v-7h6z M20 3h16v5H20z M5 11h45v8H5z M2 14h51v5H2z"/>
    <path fill="#aee2fb" d="M2 19h51v3H2z M9 22h37v2H9z"/>
  </svg>`,
  // Type 2: Small Cute Cloud
  `<svg width="80" height="36" viewBox="0 0 40 18" shape-rendering="crispEdges">
    <path fill="#ffffff" d="M9 6h22v9H5v-6h4z M15 2h10v4h-10z M3 9h34v6H3z"/>
    <path fill="#aee2fb" d="M3 15h34v2H3z M7 17h26v1H7z"/>
  </svg>`,
  // Type 3: Wide Panoramic Cloud
  `<svg width="175" height="54" viewBox="0 0 88 27" shape-rendering="crispEdges">
    <path fill="#ffffff" d="M15 9h58v13H7v-8h8z M26 4h36v5H26z M38 2h12v2H38z M5 13h78v8H5z M2 16h84v5H2z"/>
    <path fill="#aee2fb" d="M2 21h84v3H2z M11 24h66v3H11z"/>
  </svg>`
];

const cloudsConfig = [
  { top: '3%',  svgIdx: 0, speed: 75,  delay: -18, bobDur: 7.2, opacity: 0.95, scale: 1.05 },
  { top: '12%', svgIdx: 1, speed: 105, delay: -64, bobDur: 8.5, opacity: 0.85, scale: 0.90 },
  { top: '22%', svgIdx: 2, speed: 60,  delay: -32, bobDur: 6.2, opacity: 0.92, scale: 0.95 },
  { top: '33%', svgIdx: 3, speed: 90,  delay: -75, bobDur: 9.0, opacity: 0.90, scale: 1.10 },
  { top: '44%', svgIdx: 1, speed: 115, delay: -22, bobDur: 7.8, opacity: 0.82, scale: 0.85 },
  { top: '55%', svgIdx: 0, speed: 70,  delay: -52, bobDur: 6.8, opacity: 0.95, scale: 1.00 },
  { top: '66%', svgIdx: 2, speed: 85,  delay: -15, bobDur: 8.0, opacity: 0.88, scale: 0.92 },
  { top: '76%', svgIdx: 3, speed: 120, delay: -92, bobDur: 9.2, opacity: 0.85, scale: 1.05 },
  { top: '86%', svgIdx: 1, speed: 65,  delay: -40, bobDur: 6.5, opacity: 0.92, scale: 0.95 },
  { top: '93%', svgIdx: 2, speed: 98,  delay: -72, bobDur: 7.5, opacity: 0.80, scale: 0.88 }
];

export default function PixelClouds() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="pixel-clouds-layer" aria-hidden="true">
      {cloudsConfig.map((c, i) => (
        <div
          key={i}
          className="floating-cloud"
          style={{
            top: c.top,
            animationDuration: `${c.speed}s`,
            animationDelay: `${c.delay}s`,
            opacity: c.opacity
          }}
        >
          <div
            className="cloud-bob"
            style={{
              animationDuration: `${c.bobDur}s`,
              transform: `scale(${c.scale})`
            }}
            dangerouslySetInnerHTML={{ __html: cloudSVGs[c.svgIdx] }}
          />
        </div>
      ))}
    </div>
  );
}
