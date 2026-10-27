import { Inter } from 'next/font/google';
import './globals.css';
import './page-transitions.css';
import Nav from '@/components/Nav';
import SmoothScroll from '@/components/SmoothScroll';
import ViewTransitionSetup from '@/components/ViewTransitionSetup';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Adroan — Technology built with communities, for communities',
  description: 'Technology built with communities, for communities.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Nav />
        <SmoothScroll />
        <main className="container page">{children}</main>
        <footer className="site-footer container">
          <p className="footer-note">© Adroan</p>
        </footer>
        <ViewTransitionSetup />
      </body>
    </html>
  );
}
