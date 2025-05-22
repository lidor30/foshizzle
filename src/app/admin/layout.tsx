'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

import Image from 'next/image';
import './styles.css';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'TTS Cache', href: '/admin/tts-cache' }
    // Add more admin pages as needed
  ];

  return (
    <html>
      <body className="flex h-full flex-col">
        <div className="min-h-screen bg-gray-100">
          <div className="mx-auto flex flex-col md:flex-row">
            <aside className="fixed w-full md:w-[240px] bg-white shadow-md p-4 md:h-[100vh]">
              <nav>
                <div className="mb-6">
                  <Link href="/admin" className="flex items-center">
                    <Image
                      src="/images/logo.png"
                      alt="Logo"
                      width={48}
                      height={48}
                    />
                    <span className="ml-2 text-lg font-semibold">
                      Admin Panel
                    </span>
                  </Link>
                </div>
                <ul>
                  {menuItems.map((item) => (
                    <li key={item.href} className="my-2">
                      <Link
                        href={item.href}
                        className={`block p-2 rounded ${
                          pathname === item.href
                            ? 'bg-indigo-100 text-indigo-700 font-medium'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            <main className="flex-1 p-6 w-full mt-[80px] md:mt-0 md:w-[calc(100vw-240px)] md:ms-[240px]">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
