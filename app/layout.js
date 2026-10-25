import { Inter } from 'next/font/google';
import './globals.css';
import './page-transitions.css';
import Nav from '@/components/Nav';
import ViewTransitionSetup from '@/components/ViewTransitionSetup';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Adroan — Technology built with communities, for communities',
  description: '[Placeholder — pending content]',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Nav />
        <main className="container page">{children}</main>
        <footer className="site-footer container">
          <p className="footer-note">© Adroan</p>
        </footer>
        <ViewTransitionSetup />
      </body>
    </html>
  );
}
