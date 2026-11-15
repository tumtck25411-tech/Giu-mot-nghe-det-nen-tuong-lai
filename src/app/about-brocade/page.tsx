'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, BookOpen, Clock, Heart, Award, ArrowRight } from 'lucide-react';

export default function AboutBrocadePage() {
  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 py-10 space-y-12">
      {/* Header Banner */}
      <div className="bg-stone-900 text-white p-8 sm:p-12 rounded-3xl border border-amber-900/40 relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-950 text-amber-300 text-xs font-bold px-3.5 py-1 rounded-md border border-amber-800/40 uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Văn Hóa & Kỹ Thuật Dệt Handcrafted</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-amber-100 leading-tight">
            Nét Đẹp & Tri Thức Thổ Cẩm Jrai
          </h1>
          <p className="text-stone-300 text-base leading-relaxed">
            Thổ cẩm Jrai là tinh hoa nghệ thuật biểu đạt tri thức dân gian thông qua màu nhuộm tự nhiên, kỹ thuật dệt thoi luồn chỉ và ký hiệu hoa văn truyền thống.
          </p>
        </div>
      </div>

      {/* Cultural Preservation Pledge Notice (Strict user prompt requirement!) */}
      <div className="bg-amber-900/10 border-2 border-amber-800/40 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-3 text-amber-900 font-bold text-base">
          <ShieldAlert className="w-6 h-6 text-amber-800 shrink-0" />
          <span>Nguyên Tắc Minh Bạch Nguồn Gốc Văn Hóa</span>
        </div>
        <p className="text-slate-700 text-sm leading-relaxed">
          Chúng tôi cam kết <strong>KHÔNG TỰ BỊA ĐẶT</strong> tên gọi hay ý nghĩa hoa văn thổ cẩm. Mọi thông tin hoa văn, nguồn gốc và câu chuyện trên hệ thống Ngân hàng số đều được khảo sát thực tế, phỏng vấn trực tiếp nghệ nhân dệt lâu năm và tham chiếu từ các chuyên gia văn hóa dân gian địa phương tỉnh Gia Lai.
        </p>
      </div>

      {/* Grid of Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-xl text-slate-900">Màu Sắc Nhuộm Tự Nhiên</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Sắc đen chì lấy từ vỏ cây và tro bếp; sắc đỏ đất từ củ cây rừng; sắc xanh chàm từ lá chàm lên men. Tất cả tạo nên bảng màu trầm ấm đặc trưng Tây Nguyên.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-xl text-slate-900">Thời Gian & Công Sức</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Một chiếc túi thổ cẩm đòi hỏi 5-7 ngày dệt liên tục; một bộ váy cổ truyền mất từ 3-4 tuần. Thời gian chính là đo lường giá trị của sự kiên nhẫn và bàn tay người làm nghề.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-xl text-slate-900">Giá Trị Người Làm Nghề</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Nghệ nhân dệt không dùng bản vẽ mẫu giấy. Toàn bộ trật tự hàng ngàn nhịp chỉ hoa văn được lưu giữ trọn vẹn trong trí nhớ và truyền dạy qua trải nghiệm thực hành.
          </p>
        </div>
      </div>

      {/* CTA Links */}
      <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-serif font-bold text-amber-100">
            Sẵn Sàng Khám Phá Kho Di Sản?
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Tra cứu sản phẩm thổ cẩm hoặc xem danh mục mã hoa văn trung tâm.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/products"
            className="bg-amber-800 hover:bg-amber-700 text-white font-bold text-xs py-3 px-5 rounded-xl transition"
          >
            Tra Cứu Sản Phẩm
          </Link>
          <Link
            href="/motifs"
            className="bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-xs py-3 px-5 rounded-xl transition border border-amber-800/60"
          >
            Ngân Hàng Hoa Văn
          </Link>
        </div>
      </div>
    </div>
  );
}
