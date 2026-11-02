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
    <html lang="en" className={inter.variable}>
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
              "r.setAttribute('data-theme',['about','team','contact'].indexOf(p)!==-1?'light':'dark');" +
              "r.setAttribute('data-strip',p==='landing'&&window.matchMedia('(min-width: 48rem)').matches?'names':'dots');})();",
          }}
        />
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
