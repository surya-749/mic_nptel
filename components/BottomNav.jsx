'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UiIcon from '@/components/UiIcon';

export default function BottomNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const widgetRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (widgetRef.current && !widgetRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Home', icon: 'home' },
    { href: '/materials', label: 'Materials', icon: 'book' },
    { href: '/quizzes', label: 'Quizzes', icon: 'pen' },
    { href: '/mock-tests', label: 'Mock Tests', icon: 'test' }
  ];

  return (
    <div className="bottom-nav-widget" id="bottomNavWidget" ref={widgetRef}>
      <button
        className={`bottom-nav-toggle ${open ? 'open' : ''}`}
        id="bottomNavToggle"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation menu"
        aria-expanded={open}
      >
        <span className="nav-stripe"></span>
        <span className="nav-stripe"></span>
        <span className="nav-stripe"></span>
      </button>

      <nav className={`bottom-nav-menu ${open ? 'open' : ''}`} id="bottomNavMenu" aria-label="Navigation menu">
        {navLinks.map(link => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`bottom-nav-link ${isActive ? 'active' : ''}`}
            >
              <UiIcon name={link.icon} /> {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
