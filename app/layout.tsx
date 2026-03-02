import type {Metadata} from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css'; // Global styles

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Device Footprint Comparator',
  description: 'Compare physical footprint of devices',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="font-mono bg-slate-50 text-slate-900" suppressHydrationWarning>{children}</body>
    </html>
  );
}
