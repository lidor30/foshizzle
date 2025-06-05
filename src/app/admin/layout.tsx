'use client'

import AuthGuard from '@/components/AuthGuard'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { logout } from '@/utils/firebase'
import { LogOut, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import './styles.css'

interface AdminLayoutProps {
  children: ReactNode
}

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const { user } = useAuth()

  const menuItems = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'TTS Cache', href: '/admin/tts-cache' }
    // Add more admin pages as needed
  ]

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Logout failed')
    }
  }

  return (
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
                <span className="ml-2 text-lg font-semibold">Admin Panel</span>
              </Link>
            </div>

            {/* User info and logout */}
            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <User className="w-4 h-4 mr-2 text-gray-600" />
                <span className="text-sm text-gray-600 truncate">
                  {user?.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-sm text-red-600 hover:text-red-800"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
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

        <main className="flex-1 p-6 w-full mt-[140px] md:mt-0 md:w-[calc(100vw-240px)] md:ms-[240px]">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AuthProvider>
      <html>
        <body className="flex h-full flex-col">
          <AuthGuard>
            <AdminLayoutContent>{children}</AdminLayoutContent>
          </AuthGuard>
          <Toaster position="bottom-center" reverseOrder={false} />
        </body>
      </html>
    </AuthProvider>
  )
}
