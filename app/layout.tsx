import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://xai.work'),
  title: 'Xai — Intelligence Workspace',
  description:
    'Xai ingests raw data, structures intelligence, and surfaces actionable insight — automatically.',
  openGraph: {
    title: 'Xai — Intelligence Workspace',
    description:
      'From raw data to decisions. A high-fidelity interactive product prototype.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#08080B',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} dark`}
    >
      <body className="grain bg-bg-base text-fg antialiased">{children}</body>
    </html>
  );
}