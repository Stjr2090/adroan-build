import { Inter } from 'next/font/google';
import './globals.css';
import './page-transitions.css';
import SiteHeader from '@/components/SiteHeader';
import SmoothScroll from '@/components/SmoothScroll';
import ViewTransitionSetup from '@/components/ViewTransitionSetup';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Adroan – Technology built with communities, for communities',
  description: 'Technology built with communities, for communities.',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={inter.variable}
      data-scene="landing"
      data-theme="dark"
      data-strip="names"
      data-scrolled="0"
    >
      <body>
        <SiteHeader />
        <main className="page">{children}</main>
        <footer className="site-footer">
          <div className="footer-inner">
            <p className="footer-note">
              Adroan · email · socials · Photo: Robin Kutesa on Unsplash
            </p>
          </div>
        </footer>
        <SmoothScroll />
        <ViewTransitionSetup />
      </body>
    </html>
  );
}
