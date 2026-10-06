'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminSession } from '@/lib/data-store';

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const session = getAdminSession();
    if (session) {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/admin/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center p-4">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-amber-300 uppercase tracking-widest">
          Đang chuyển hướng trang quản trị Admin...
        </p>
      </div>
    </div>
  );
}
