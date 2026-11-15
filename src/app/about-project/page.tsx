'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, QrCode, Grid, Users, ShieldCheck, Heart } from 'lucide-react';

export default function AboutProjectPage() {
  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 py-10 space-y-12">
      {/* Header Banner */}
      <div className="bg-stone-900 text-white p-8 sm:p-12 rounded-xl border border-amber-900/40 relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-950 text-amber-300 text-xs font-bold px-3.5 py-1 rounded-md border border-amber-800/40 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sứ Mệnh Bảo Tồn & Kết Nối Di Sản</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-amber-100 leading-tight">
            Về Dự Án DỆT NÊN TƯƠNG LAI
          </h1>
          <p className="text-stone-300 text-base leading-relaxed">
            Hệ thống Ngân hàng số hoa văn Jrai ra đời nhằm số hóa, lưu giữ và giới thiệu tri thức văn hóa dệt thổ cẩm. Kết nối các sản phẩm thổ cẩm vật thể với câu chuyện hoa văn, nghệ nhân, địa phương và quá trình dệt thông qua công nghệ mã QR.
          </p>
        </div>
      </div>

      {/* CORE OBJECTIVES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-800 text-white font-bold flex items-center justify-center">
            <Grid className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-2xl text-slate-900">
            Ngân Hàng Số Hoa Văn Trung Tâm
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Xây dựng một kho dữ liệu trung tâm lưu trữ toàn bộ mã hoa văn Jrai cổ và ứng dụng (VD: JRAI-001, JRAI-002...). Mỗi hoa văn được lập hồ sơ minh bạch bao gồm mã, tên gọi, màu sắc, ý nghĩa văn hóa, nguồn gốc và danh sách sản phẩm ứng dụng.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-800 text-white font-bold flex items-center justify-center">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-2xl text-slate-900">
            Định Danh Mã QR Động
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Mỗi sản phẩm thổ cẩm được cấp một URL định danh duy nhất. Mã QR in kèm sản phẩm dẫn trực tiếp về trang thông tin trên website. Admin có thể cập nhật thông tin dệt hay câu chuyện nghệ nhân mà mã QR in trên sản phẩm không bao giờ bị hỏng.
          </p>
        </div>
      </div>

      {/* TWO DISTINCT USER GROUPS EXPLANATION */}
      <div className="bg-amber-950 text-white p-8 sm:p-10 rounded-xl border border-amber-800/40 space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Kiến Trúc Phân Quyền Bảo Mật
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
            Hai Nhóm Người Dùng Tách Biệt Hoàn Toàn
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="bg-stone-900 p-6 rounded-2xl border border-amber-900/50 space-y-3">
            <h4 className="font-bold text-lg text-amber-300">1. Người Dùng Thông Thường (Public)</h4>
            <ul className="text-xs text-stone-300 space-y-2 leading-relaxed">
              <li>• Quét QR hoặc truy cập trực tiếp website để xem thông tin.</li>
              <li>• <strong>KHÔNG CẦN ĐĂNG NHẬP</strong>, không mật khẩu, không tài khoản.</li>
              <li>• Tuyệt đối không nhìn thấy nút Edit / Delete / Admin dashboard.</li>
            </ul>
          </div>

          <div className="bg-stone-900 p-6 rounded-2xl border border-amber-900/50 space-y-3">
            <h4 className="font-bold text-lg text-amber-300">2. Quản Trị Viên (Admin CMS)</h4>
            <ul className="text-xs text-stone-300 space-y-2 leading-relaxed">
              <li>• Truy cập riêng biệt tại khu vực <code>/admin</code>.</li>
              <li>• Yêu cầu xác thực tài khoản và mật khẩu bảo mật (Supabase Auth).</li>
              <li>• Được quyền Thêm/Sửa/Xóa sản phẩm, hoa văn, nghệ nhân và xuất bản QR.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
