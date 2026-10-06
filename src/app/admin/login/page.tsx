'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, AlertCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { loginAdmin } from '@/lib/data-store';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const user = loginAdmin(username, password);

    if (user) {
      router.push('/admin/dashboard');
    } else {
      setError('Thông tin đăng nhập không chính xác.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-stone-900 border border-amber-900/40 rounded-3xl p-8 shadow-2xl space-y-6 text-white">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-800 text-white font-serif font-black text-2xl shadow-lg border border-amber-500/40 mb-2">
          J
        </div>
        <h1 className="font-serif font-bold text-2xl text-amber-100">ADMIN LOGIN</h1>
        <p className="text-xs text-stone-400">
          Hệ Thống Quản Trị CMS — Ngân Hàng Số Hoa Văn Jrai
        </p>
      </div>

      {/* Error Message Alert */}
      {error && (
        <div className="bg-rose-950/80 border border-rose-800 text-rose-200 px-4 py-3 rounded-2xl text-xs flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Demo Credentials Helper Box */}
      <div className="bg-amber-950/50 border border-amber-800/40 rounded-2xl p-3.5 text-xs text-amber-200/90 space-y-1">
        <div className="font-bold flex items-center gap-1.5 text-amber-300">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Tài khoản Quản trị Demo:</span>
        </div>
        <div>
          Tên đăng nhập: <code className="bg-stone-950 px-1.5 py-0.5 rounded text-amber-300">admin</code>
        </div>
        <div>
          Mật khẩu: <code className="bg-stone-950 px-1.5 py-0.5 rounded text-amber-300">admin123</code>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-300 uppercase tracking-wider">
            Tên Đăng Nhập
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
            <input
              type="text"
              required
              placeholder="Nhập tên đăng nhập..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-stone-950 border border-stone-800 rounded-xl text-sm focus:outline-none focus:border-amber-600 text-white"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-300 uppercase tracking-wider">
            Mật Khẩu
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
            <input
              type="password"
              required
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-stone-950 border border-stone-800 rounded-xl text-sm focus:outline-none focus:border-amber-600 text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-800 hover:bg-amber-700 text-white font-bold text-sm py-3.5 rounded-2xl shadow-lg transition duration-200 mt-2 flex items-center justify-center gap-2"
        >
          <span>{loading ? 'Đang xác thực...' : 'ĐĂNG NHẬP'}</span>
        </button>
      </form>

      <div className="text-center pt-2">
        <a href="/" className="text-xs text-stone-400 hover:text-amber-300 transition">
          ← Trở về Website Công Khai
        </a>
      </div>
    </div>
  );
}
