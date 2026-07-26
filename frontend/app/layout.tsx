import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'EcoTwin AI – Sustainability Intelligence Platform',
  description: 'Transform Sustainability Data into Intelligent Decisions using AI, Digital Twin, and Predictive Analytics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090d16] text-slate-100 min-h-screen antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
