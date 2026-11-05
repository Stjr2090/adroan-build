import localFont from 'next/font/local';
import BrandLockup from '@/components/BrandLockup';
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

const jakarta = localFont({ src: '../public/fonts/PlusJakartaSans.ttf', variable: '--font-jakarta', display: 'swap', weight: '200 800' });

export const metadata = {
  title: 'Adroan – Technology built with communities, for communities',
  description: 'Technology built with communities, for communities.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jakarta.variable}`}>
      <body>
        {/* Parse-time, pre-paint: align the route's scene/theme/strip before
            the header can paint, so sub-pages (e.g. /hinga) never flash the
            Home landing theme. Values match SiteHeader's own logic exactly. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var p=location.pathname.replace(/\\/+$/,'').replace(/^\\/+/,'')||'landing';" +
              "var r=document.documentElement;" +
              "r.setAttribute('data-scene',p);" +
              "r.setAttribute('data-theme',['about','team','contact','hinga'].indexOf(p)!==-1?'light':'dark');" +
              "r.setAttribute('data-strip',p==='landing'?'names':'dots');})();",
          }}
        />
        <SiteHeader />
        <main className="page">{children}</main>
        <footer className="site-footer">
          <div className="footer-inner">
            <a href="/" className="footer-brand" aria-label="Adroan home"><BrandLockup /></a>
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
