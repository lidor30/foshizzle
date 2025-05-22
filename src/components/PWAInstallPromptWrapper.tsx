'use client';

import dynamic from 'next/dynamic';

// Dynamically import the PWA install prompt
const PWAInstallPrompt = dynamic(() => import('./PWAInstallPrompt'), {
  ssr: false
});

export default function PWAInstallPromptWrapper() {
  return <PWAInstallPrompt />;
}
