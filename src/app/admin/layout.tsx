'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

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
            <aside className="w-full md:w-64 bg-white shadow-md p-4 md:min-h-[calc(100vh-64px)]">
              <nav>
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

            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
