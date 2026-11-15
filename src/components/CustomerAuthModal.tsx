'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Phone, ArrowRight, Sparkles, CheckCircle2, User } from 'lucide-react';
import { loginSocialCustomer, loginCustomer } from '@/lib/data-store';
import { CustomerUser } from '@/types';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: CustomerUser) => void;
  title?: string;
  subtitle?: string;
}

export default function CustomerAuthModal({
  isOpen,
  onClose,
  onSuccess,
  title = 'Đăng Nhập Để Tiếp Tục Đặt Hàng',
  subtitle = 'Vui lòng đăng nhập qua Google hoặc Facebook để bảo lưu đơn hàng, nhận điểm thưởng di sản và cập nhật tiến độ dệt thổ cẩm.',
}: CustomerAuthModalProps) {
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [showManual, setShowManual] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    setIsLoading('google');
    setTimeout(() => {
      const user = loginSocialCustomer('google', {
        name: 'Mai Thị Cẩm Tú',
        email: 'camtu.jrai@gmail.com',
        phone: '0383451929',
        avatar: '/images/team/MaiThiCamTu_user.png',
      });
      setIsLoading(null);
      onSuccess(user);
    }, 600);
  };

  const handleFacebookLogin = () => {
    setIsLoading('facebook');
    setTimeout(() => {
      const user = loginSocialCustomer('facebook', {
        name: 'Cẩm Tú (Jrai Craft)',
        email: 'camtu.facebook@social.jraioi.vn',
        phone: '0383451929',
        avatar: '/images/team/MaiThiCamTu_user.png',
      });
      setIsLoading(null);
      onSuccess(user);
    }, 600);
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail.trim()) return;
    setIsLoading('manual');
    setTimeout(() => {
      const user = loginCustomer(phoneOrEmail.trim());
      if (nameInput.trim()) {
        user.name = nameInput.trim();
      }
      setIsLoading(null);
      onSuccess(user);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1C1714] border border-amber-900/60 rounded-xl max-w-md w-full p-6 sm:p-8 space-y-6 relative animate-in fade-in zoom-in-95 duration-200 shadow-sm text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B9383A] to-[#8B2522] text-amber-300 font-serif font-black text-2xl shadow-lg border border-amber-500/40 mb-1">
            J
          </div>
          <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#FFFDF9]">
            {title}
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed max-w-xs mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading !== null}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-stone-100 text-stone-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-lg border border-stone-200 transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.64-5.2 3.64-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.09-6.68-4.9H1.26v3.15C3.25 21.36 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.32 14.3c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3V6.55H1.26C.46 8.14 0 9.97 0 12s.46 3.86 1.26 5.45l4.06-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.25 2.64 1.26 6.55l4.06 3.15c.94-2.81 3.58-4.9 6.68-4.9z"
              />
            </svg>
            <span>
              {isLoading === 'google' ? 'Đang kết nối Google...' : 'Tiếp tục với Google'}
            </span>
          </button>

          {/* Facebook Button */}
          <button
            onClick={handleFacebookLogin}
            disabled={isLoading !== null}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-lg transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>
              {isLoading === 'facebook' ? 'Đang kết nối Facebook...' : 'Tiếp tục với Facebook'}
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-stone-800 w-full" />
          <span className="bg-[#1C1714] px-3 text-xs font-bold text-stone-400 uppercase tracking-wider shrink-0">
            HOẶC ĐĂNG NHẬP NHANH
          </span>
          <div className="border-t border-stone-800 w-full" />
        </div>

        {/* Phone / Email Toggle Form */}
        {!showManual ? (
          <button
            onClick={() => setShowManual(true)}
            className="w-full py-3 rounded-xl bg-[#231C18] hover:bg-[#32261E] border border-stone-800 text-stone-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <Phone className="w-4 h-4 text-amber-400" />
            <span>Đăng nhập bằng Số Điện Thoại / Email</span>
          </button>
        ) : (
          <form onSubmit={handleManualLogin} className="space-y-3 animate-in fade-in">
            <div>
              <label className="text-xs font-bold text-stone-300 uppercase block mb-1">
                Số Điện Thoại Hoặc Email
              </label>
              <input
                type="text"
                required
                placeholder="VD: 0987654321 hoặc name@gmail.com"
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                className="w-full bg-[#14110F] border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-300 uppercase block mb-1">
                Họ và Tên Khách Hàng (Tùy chọn)
              </label>
              <input
                type="text"
                placeholder="VD: Mai Thị Cẩm Tú"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-[#14110F] border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading !== null}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#B9383A] to-[#8B2522] text-white font-bold text-xs shadow-md transition hover:-translate-y-0.5"
            >
              Xác Nhận & Tiến Hành Đặt Hàng
            </button>
          </form>
        )}

        {/* Heritage Trust Badge */}
        <div className="pt-2 border-t border-stone-800/80 flex items-center justify-center gap-2 text-xs text-stone-400">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Bảo mật 100% • Cam kết minh bạch nguồn gốc thổ cẩm Jrai</span>
        </div>
      </div>
    </div>
  );
}
