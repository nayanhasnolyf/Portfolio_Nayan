import type { Metadata } from 'next';
import { SiteShell } from '@/components/layout/SiteShell';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nayan Pokhriyal | Full-Stack Developer',
  description:
    'Portfolio of Nayan Pokhriyal, a full-stack developer building React, Node.js, FastAPI, Spring Boot, PostgreSQL, Docker, and AI agent systems.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
