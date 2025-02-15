import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from './context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Unchiul Steli',
  description: 'Proiect de licenta',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>
        <AuthProvider>
          <header className="bg-white shadow">
            {/* NavBar content */}
          </header>
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-white shadow mt-8">
            {/* Footer content */}
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}