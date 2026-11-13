'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  QrCode,
  Search,
  ShieldCheck,
  MapPin,
  Clock,
  User,
  Layers,
  Sparkles,
  Download,
  Printer,
  Copy,
  Check,
  ArrowRight,
  Camera,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { getProductById, getArtisanById, getMotifById, getProducts, getPublicDomain, syncWithServer } from '@/lib/data-store';
import { Product, Artisan, Motif } from '@/types';
import QRCodeGenerator from '@/components/QRCodeGenerator';

const SAMPLE_CODES = [
  { code: 'K001', label: 'K001 (Khăn Quàng Cổ)' },
  { code: 'B001', label: 'B001 (Bầu Nước)' },
  { code: 'VI001', label: 'VI001 (Ví Cầm Tay)' },
  { code: 'C001', label: 'C001 (Túi Đeo Chéo)' },
  { code: 'TT001', label: 'TT001 (Túi Tote)' },
  { code: 'TD001', label: 'TD001 (Tạp Dề)' },
  { code: 'V001', label: 'V001 (Váy Nữ)' },
  { code: 'A001', label: 'A001 (Áo Nam)' },
];

function TraceabilityContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code') || '';

  const [inputCode, setInputCode] = useState(initialCode);
  const [queriedCode, setQueriedCode] = useState(initialCode);
  const [product, setProduct] = useState<Product | null>(null);
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [motif, setMotif] = useState<Motif | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    syncWithServer();
  }, []);

  useEffect(() => {
    if (initialCode) {
      setInputCode(initialCode);
      handleLookup(initialCode);
    }
  }, [initialCode]);

  const handleLookup = (codeToSearch: string) => {
    const cleanCode = codeToSearch.trim();
    if (!cleanCode) return;

    setQueriedCode(cleanCode);
    const foundProduct = getProductById(cleanCode);

    if (foundProduct) {
      setProduct(foundProduct);
      setNotFound(false);

      if (foundProduct.artisan_id) {
        setArtisan(getArtisanById(foundProduct.artisan_id) || null);
      } else {
        setArtisan(null);
      }

      if (foundProduct.motif_id || (foundProduct.motif_ids && foundProduct.motif_ids.length > 0)) {
        const mId = foundProduct.motif_id || foundProduct.motif_ids[0];
        setMotif(getMotifById(mId) || null);
      } else {
        setMotif(null);
      }
    } else {
      setProduct(null);
      setArtisan(null);
      setMotif(null);
      setNotFound(true);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLookup(inputCode);
  };

  // Optional Camera Scanner Demo toggle
  const toggleCamera = async () => {
    if (cameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setCameraActive(true);
      } catch (err) {
        alert('Không thể mở camera trên thiết bị hoặc quyền truy cập bị từ chối.');
      }
    }
  };

  const productUrl = product
    ? `${getPublicDomain()}/traceability?code=${product.product_code}`
    : '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#231C18] via-[#1E1713] to-[#231C18] text-white p-8 sm:p-12 rounded-3xl border border-amber-900/40 relative overflow-hidden shadow-2xl text-center">
        <div className="max-w-3xl mx-auto space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#8B2522] text-amber-200 text-xs font-bold px-4 py-1.5 rounded-full border border-amber-500/40 uppercase tracking-wider">
            <QrCode className="w-4 h-4 text-amber-300" />
            <span>MINH BẠCH NGUỒN GỐC SỐ HÓA (DIGITAL PASSPORT)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#FFFDF9]">
            TRUY XUẤT NGUỒN GỐC SẢN PHẨM
          </h1>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Mỗi sản phẩm thổ cẩm thủ công JRAI ƠI đều mang một mã QR định danh độc bản. Quét mã hoặc nhập mã in trên tem để tra cứu nghệ nhân dệt, địa phương, số giờ công và ý nghĩa thiêng liêng sau nếp dệt.
          </p>
        </div>
      </div>

      {/* SEARCH CARD */}
      <div className="bg-[#1C1714] p-6 sm:p-8 rounded-3xl border border-amber-900/40 shadow-xl space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-lg font-serif font-bold text-white">
            Nhập mã tem sản phẩm hoặc quét mã QR
          </h2>
          <p className="text-xs text-stone-400">
            Mã in trên mác vải hoặc nhãn giấy sản phẩm (Định dạng: K001, B001, hoặc JRAI-IMN-001...)
          </p>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-500" />
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Nhập mã: K001, B001, C001, VI001..."
              className="w-full pl-10 pr-4 py-3 bg-[#120F0D] border border-amber-700/60 rounded-xl text-sm text-white placeholder-stone-600 focus:outline-none focus:border-amber-400 font-mono tracking-wider"
            />
          </div>

          <button
            type="submit"
            className="bg-[#B9383A] hover:bg-[#A83232] text-white text-xs font-bold px-7 py-3 rounded-xl shadow border border-amber-400/40 transition flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Search className="w-4 h-4" />
            <span>TRA CỨU NGAY</span>
          </button>

          <button
            type="button"
            onClick={toggleCamera}
            className="bg-[#231C18] hover:bg-[#32261E] text-amber-300 text-xs font-bold px-4 py-3 rounded-xl border border-amber-900/50 transition flex items-center justify-center gap-1.5"
            title="Quét bằng camera điện thoại"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">{cameraActive ? 'Tắt Camera' : 'Quét Camera'}</span>
          </button>
        </form>

        {/* Camera Live Stream Drawer */}
        {cameraActive && (
          <div className="max-w-md mx-auto p-4 bg-stone-950 rounded-2xl border border-amber-900/50 text-center space-y-3">
            <p className="text-xs text-amber-300 font-bold">Hướng camera vào mã QR in trên sản phẩm:</p>
            <div className="aspect-square rounded-xl overflow-hidden bg-black relative">
              <video ref={videoRef} className="w-full h-full object-cover" />
              <div className="absolute inset-8 border-2 border-dashed border-amber-400 rounded-lg pointer-events-none animate-pulse" />
            </div>
            <button
              onClick={toggleCamera}
              className="text-xs text-stone-400 hover:text-white underline"
            >
              Đóng camera
            </button>
          </div>
        )}

        {/* Sample Code Pills */}
        <div className="pt-2 border-t border-stone-800 text-center space-y-2">
          <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider block">
            Mã mẫu thử nghiệm:
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {SAMPLE_CODES.map((s) => (
              <button
                key={s.code}
                type="button"
                onClick={() => {
                  setInputCode(s.code);
                  handleLookup(s.code);
                }}
                className={`text-xs px-3.5 py-1.5 rounded-full border transition font-mono ${
                  queriedCode.toUpperCase() === s.code
                    ? 'bg-[#B9383A] text-white border-amber-400 font-bold'
                    : 'bg-[#251E1A] text-stone-300 hover:text-white hover:bg-[#322722] border-amber-900/40'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RESULT SECTION: DIGITAL PRODUCT PASSPORT */}
      {notFound && (
        <div className="bg-[#1C1714] p-12 rounded-3xl border border-red-900/40 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-full bg-red-950/60 border border-red-800 flex items-center justify-center mx-auto text-red-400">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-serif font-bold text-white">
            Không tìm thấy dữ liệu cho mã &quot;{queriedCode}&quot;
          </h3>
          <p className="text-xs text-stone-400 max-w-md mx-auto">
            Vui lòng kiểm tra lại mã số in trên tem nhãn hoặc chọn một trong các mã mẫu thử nghiệm (K001, B001, VI001, C001...) ở phía trên.
          </p>
        </div>
      )}

      {!product && !notFound && (
        <div className="bg-[#1C1714] p-12 rounded-3xl border border-amber-900/30 text-center space-y-3 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-[#231C18] border border-amber-900/40 flex items-center justify-center mx-auto text-amber-400 text-2xl shadow-inner">
            📱
          </div>
          <h3 className="text-lg font-serif font-bold text-white">Chưa có mã tra cứu nào được chọn</h3>
          <p className="text-xs text-stone-400 max-w-md mx-auto">
            Nhập mã tem sản phẩm vào ô tìm kiếm ở trên hoặc bấm vào các nút <strong>Mã mẫu thử nghiệm</strong> để mở ra bản tường trình nguồn gốc số hóa của tác phẩm.
          </p>
        </div>
      )}

      {product && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Passport Banner Card */}
          <div className="bg-[#1C1714] rounded-3xl border border-amber-500/50 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Top Seal */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B9383A] to-[#8B2522] text-white flex items-center justify-center font-serif font-black text-2xl border border-amber-400/50 shadow">
                  J
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      DIGITAL PRODUCT PASSPORT
                    </span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-800/40">
                      ✓ ĐÃ XÁC THỰC NGUỒN GỐC
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-serif font-black text-white mt-0.5">
                    HỘ CHIẾU SỐ DI SẢN THỔ CẨM JRAI
                  </h2>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[11px] text-stone-400 block font-mono">MÃ ĐỊNH DANH ĐỘC BẢN:</span>
                <span className="text-lg font-black text-amber-400 font-mono tracking-wider">
                  {product.product_code}
                </span>
              </div>
            </div>

            {/* Main Passport Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
              {/* Image & Quick QR (4 Cols) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 shadow-md">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 bg-[#231C18] rounded-2xl border border-amber-900/40 text-center space-y-2">
                  <span className="text-[10px] text-amber-500 uppercase font-bold tracking-wider block">
                    Định danh số cho mác sản phẩm:
                  </span>
                  <div className="flex justify-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                        productUrl
                      )}`}
                      alt="QR Traceability"
                      className="w-32 h-32 rounded-xl border border-stone-700 bg-white p-2 shadow-sm"
                    />
                  </div>
                  <p className="text-[11px] text-stone-400 font-mono">{product.product_code}</p>
                </div>
              </div>

              {/* Data Specifications (8 Cols) */}
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">
                    {product.category_name}
                  </span>
                  <h3 className="text-2xl font-serif font-black text-white mt-0.5">
                    {product.name}
                  </h3>
                  <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* 4 Pillars of Traceability */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Pillar 1: Maker */}
                  <div className="p-4 bg-[#231C18] rounded-2xl border border-amber-900/30 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase">
                      <User className="w-4 h-4" />
                      <span>1. Nghệ nhân thực hiện</span>
                    </div>
                    <p className="text-sm font-bold text-white">
                      {product.artisan_name || (artisan ? artisan.name : 'Nghệ nhân Làng Kép')}
                    </p>
                    <p className="text-xs text-stone-400">
                      {artisan?.experience || 'Hơn 30 năm tuổi nghề dệt cửi hông'}
                    </p>
                    {artisan && (
                      <Link
                        href={`/artisan/${artisan.id}`}
                        className="text-xs text-amber-400 hover:underline font-bold inline-block pt-1"
                      >
                        Xem hồ sơ nghệ nhân &rarr;
                      </Link>
                    )}
                  </div>

                  {/* Pillar 2: Village & Time */}
                  <div className="p-4 bg-[#231C18] rounded-2xl border border-amber-900/30 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase">
                      <MapPin className="w-4 h-4" />
                      <span>2. Nguồn gốc địa bàn</span>
                    </div>
                    <p className="text-sm font-bold text-white">
                      {product.location || 'Làng Kép, Xã Ia Mơ Nông, Chư Păh, Gia Lai'}
                    </p>
                    <p className="text-xs text-stone-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Thời gian hoàn thành: <strong>{product.production_time}</strong></span>
                    </p>
                  </div>

                  {/* Pillar 3: Materials & Weaving */}
                  <div className="p-4 bg-[#231C18] rounded-2xl border border-amber-900/30 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase">
                      <Layers className="w-4 h-4" />
                      <span>3. Chất liệu & Kỹ thuật</span>
                    </div>
                    <p className="text-xs text-stone-200">
                      <strong>Chất liệu:</strong> {product.material}
                    </p>
                    <p className="text-xs text-stone-200">
                      <strong>Kỹ thuật:</strong> Dệt cửi hông (backstrap loom), cài sợi nổi 3D Kơnech.
                    </p>
                  </div>

                  {/* Pillar 4: Motif Symbolism */}
                  <div className="p-4 bg-[#231C18] rounded-2xl border border-amber-900/30 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase">
                      <Sparkles className="w-4 h-4" />
                      <span>4. Ý nghĩa hoa văn</span>
                    </div>
                    <p className="text-xs text-stone-200 font-bold">
                      {product.motif_name || (motif ? motif.name : 'Hoa văn hình học cổ di sản')}
                    </p>
                    <p className="text-xs text-stone-400 line-clamp-2">
                      {motif?.meaning || 'Biểu trưng của sự hòa hợp cùng thiên nhiên và trật tự buôn làng.'}
                    </p>
                  </div>
                </div>

                {/* Cultural Narrative Summary */}
                <div className="p-5 bg-[#231C18] rounded-2xl border border-amber-900/40 space-y-2">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    {product.story_title || 'Ý NGHĨA VĂN HÓA SẢN PHẨM'}
                  </h4>
                  <p className="text-xs text-stone-300 leading-relaxed italic">
                    {product.story_lead || product.story.slice(0, 300) + '...'}
                  </p>
                </div>

                {/* Direct Action Link */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <Link
                    href={`/product/${product.id}`}
                    className="inline-flex items-center gap-2 bg-[#B9383A] hover:bg-[#A83232] text-white text-xs font-bold px-6 py-3 rounded-xl shadow transition"
                  >
                    <span>Xem trang bán hàng sản phẩm này</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <div className="text-xs text-stone-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Dữ liệu số hóa chính thức bởi Ban điều phối JRAI ƠI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PRINT & DOWNLOAD QR TOOLS */}
          <div className="bg-[#1C1714] p-8 rounded-3xl border border-amber-900/40 shadow-xl space-y-4">
            <h3 className="text-lg font-serif font-bold text-white">
              Công Cụ Tải & In Thẻ Tem Mã QR
            </h3>
            <p className="text-xs text-stone-400">
              Dành cho khách hàng hoặc Ban quản trị in tem nhãn gắn vào sản phẩm thực tế:
            </p>
            <QRCodeGenerator
              productUrl={productUrl}
              productName={product.name}
              productCode={product.product_code}
              category={product.category_name}
              location={product.location}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function TraceabilityPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#14110F] py-20 text-center text-stone-400">Đang tải hệ thống tra cứu nguồn gốc sản phẩm...</div>}>
      <TraceabilityContent />
    </React.Suspense>
  );
}
