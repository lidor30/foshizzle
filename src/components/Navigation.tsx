'use client';

import { Moon, Settings, Sun } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import KidsModeToggle from './KidsModeToggle';
import LocaleSwitcher from './LocaleSwitcher';
import Modal from './Modal';

export default function Navigation() {
  const t = useTranslations('Navigation');
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [showEndGameModal, setShowEndGameModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const menuRef = useRef<HTMLDivElement>(null);
  const isRTL = locale === 'he';

  const handleLogoClick = () => {
    if (pathname.endsWith('/session')) {
      setShowEndGameModal(true);
    } else {
      router.push('/');
    }
  };

  const handleEndGame = () => {
    setShowEndGameModal(false);
    router.push('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme);
  };

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } else if (prefersDark) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const rtlClass = isRTL ? 'rtl' : '';

  return (
    <header
      className={`fixed top-0 left-0 right-0 bg-white/40 dark:bg-gray-900 shadow-md py-3 px-4 z-10 ${rtlClass}`}
    >
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={handleLogoClick} className="flex items-center">
            <Image
              src={'/images/logo.png'}
              alt="Foshizzle Logo"
              width={256}
              height={60}
            />
          </button>
        </div>

        <div className="flex items-center gap-4 relative" ref={menuRef}>
          <button
            onClick={toggleMenu}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <Settings size={20} className="text-gray-900 dark:text-white" />
          </button>

          {isMenuOpen && (
            <div
              className={`absolute top-12 right-0 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-2xl rounded-md p-3 min-w-[180px] transition-all`}
            >
              <div className="flex flex-col gap-3">
                <div className="py-1">
                  <LocaleSwitcher />
                </div>
                <div className="flex items-center justify-between dark:border-gray-700">
                  <span className="text-sm text-slate-900 dark:text-white">
                    {theme === 'light' ? t('darkMode') : t('lightMode')}
                  </span>
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label={`Switch to ${
                      theme === 'light' ? 'dark' : 'light'
                    } mode`}
                  >
                    {theme === 'light' ? (
                      <Moon
                        size={18}
                        className="text-gray-900 dark:text-white"
                      />
                    ) : (
                      <Sun
                        size={18}
                        className="text-gray-900 dark:text-white"
                      />
                    )}
                  </button>
                </div>
                <div className=" dark:border-gray-700">
                  <KidsModeToggle />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showEndGameModal}
        onClose={() => setShowEndGameModal(false)}
        title={t('endGame.title')}
        actions={
          <div className="flex not-rtl:flex-row space-x-2 rtl:space-x-reverse">
            <button
              onClick={() => setShowEndGameModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
            >
              {t('endGame.cancel')}
            </button>
            <button
              onClick={handleEndGame}
              className="ml-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {t('endGame.confirm')}
            </button>
          </div>
        }
      >
        <p className="text-gray-700 dark:text-gray-300">
          {t('endGame.message')}
        </p>
      </Modal>
    </header>
  );
}
