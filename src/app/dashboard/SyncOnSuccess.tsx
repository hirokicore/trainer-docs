'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SyncOnSuccess() {
  const router = useRouter();
  useEffect(() => {
    fetch('/api/stripe/sync')
      .then(() => router.replace('/dashboard'))
      .catch(console.error);
  }, [router]);
  return null;
}
