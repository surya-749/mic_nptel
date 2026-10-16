import './globals.css';
import TopBrand from '@/components/TopBrand';
import BottomNav from '@/components/BottomNav';
import PixelClouds from '@/components/PixelClouds';
import Footer from '@/components/Footer';
import { ToastProvider } from '@/components/ToastContext';

export const metadata = {
  title: 'NPTEL Prep — Understanding Incubation & Entrepreneurship',
  description: 'Study smarter with topic-wise quizzes, timed mock tests, instant explanations, and curated study materials — all in one place.',
  icons: {
    icon: '/mic-logo.webp',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <PixelClouds />
          <TopBrand />
          {children}
          <Footer />
          <BottomNav />
        </ToastProvider>
      </body>
    </html>
  );
}
