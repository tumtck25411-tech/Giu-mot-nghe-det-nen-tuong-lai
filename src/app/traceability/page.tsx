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
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanSuccessCode, setScanSuccessCode] = useState<string | null>(null);
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

  // Connect stream to video element when both are ready
  useEffect(() => {
    if (cameraActive && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((err) => {
        console.warn('Video auto-play warning:', err);
      });
    }
  }, [cameraActive, stream]);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // QR Barcode Auto-detection loop
  useEffect(() => {
    if (!cameraActive || !stream) return;

    let scanTimer: any = null;
    if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
      try {
        const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
        scanTimer = setInterval(async () => {
          if (videoRef.current && videoRef.current.readyState >= 2) {
            try {
              const barcodes = await detector.detect(videoRef.current);
              if (barcodes && barcodes.length > 0) {
                const raw = barcodes[0].rawValue;
                let parsed = raw;
                if (raw.includes('code=')) {
                  parsed = raw.split('code=')[1].split('&')[0];
                } else if (raw.includes('/product/')) {
                  parsed = raw.split('/product/')[1].split('?')[0];
                }
                setScanSuccessCode(parsed);
                setInputCode(parsed);
                handleLookup(parsed);
                if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
                  navigator.vibrate(100);
                }
                setTimeout(() => {
                  stopCamera();
                }, 800);
              }
            } catch (_) {}
          }
        }, 350);
      } catch (_) {}
    }

    return () => {
      if (scanTimer) clearInterval(scanTimer);
    };
  }, [cameraActive, stream]);

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

  // Robust Camera Scanner handler
  const startCamera = async () => {
    setCameraError(null);
    setScanSuccessCode(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Thiết bị hoặc trình duyệt không hỗ trợ mở camera trực tiếp.');
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      setStream(mediaStream);
      setCameraActive(true);
    } catch (err: any) {
      console.error('Camera start error:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Quyền truy cập Camera đã bị từ chối. Vui lòng cho phép quyền Camera trên trình duyệt để quét trực tiếp.'
          : 'Không thể mở Camera trên thiết bị này. Bạn có thể bấm chọn một mã mẫu bên dưới để xem kết quả ngay.'
      );
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const toggleCamera = () => {
    if (cameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const simulateScan = (code: string) => {
    setScanSuccessCode(code);
    setInputCode(code);
    handleLookup(code);
    setTimeout(() => {
      stopCamera();
    }, 600);
  };

  const productUrl = product
    ? `${getPublicDomain()}/traceability?code=${product.product_code}`
    : '';

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 py-10 space-y-10">
      {/* Hero Header - Centered Flex & Text */}
      <div className="bg-[#F2ECE1] p-8 sm:p-14 rounded-xl border border-[#E5DACB] border-b-2 border-b-[#EA8E23] relative overflow-hidden shadow-sm flex flex-col items-center justify-center text-center header-banner-box">
        <div className="max-w-3xl mx-auto space-y-4 relative z-10 flex flex-col items-center justify-center text-center w-full">
          <span className="section-tag gold inline-flex items-center justify-center mx-auto">
            <QrCode className="w-3.5 h-3.5 inline mr-1 text-[#EA8E23]" />
            <span>MINH BẠCH NGUỒN GỐC SỐ HÓA • DIGITAL PASSPORT</span>
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#1F1D1B] tracking-tight leading-tight text-center mx-auto">
            TRUY XUẤT NGUỒN GỐC SẢN PHẨM
          </h1>

          <div className="flex items-center justify-center gap-2 text-xs text-[#EA8E23] font-bold uppercase tracking-wider mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-[#EA8E23]" />
            <span>100% Sản Phẩm Mang Mã Định Danh Độc Bản SVTHM 2026</span>
            <Sparkles className="w-3.5 h-3.5 text-[#EA8E23]" />
          </div>

          <p className="text-[#5D554D] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto text-center">
            Mỗi sản phẩm thổ cẩm thủ công JRAI ƠI đều gắn liền với một nghệ nhân buôn làng. Quét mã QR bằng camera hoặc nhập mã trên tem để chứng thực giờ dệt, phôi sợi tự nhiên và thông điệp văn hóa mẫu hệ.
          </p>
        </div>
      </div>

      {/* SEARCH CARD */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E5DACB] shadow-sm space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-lg font-serif font-bold text-[#1F1D1B]">
            Nhập mã tem sản phẩm hoặc quét mã QR
          </h2>
          <p className="text-xs text-[#5D554D]">
            Mã in trên mác vải hoặc nhãn giấy sản phẩm (Định dạng: K001, B001, V001, hoặc JRAI-IMN-001...)
          </p>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8A7E72]" />
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Nhập mã: V001, K001, B001, C001, VI001..."
              className="w-full pl-10 pr-4 py-3 bg-[#FBF8F3] border border-[#E5DACB] rounded-xl text-sm text-[#1F1D1B] placeholder-[#8A7E72] focus:outline-none focus:border-[#C43B3D] focus:bg-white font-mono tracking-wider"
            />
          </div>

          <button
            type="submit"
            className="bg-[#C43B3D] hover:bg-[#8A2325] text-white text-xs font-bold px-7 py-3 rounded-xl shadow transition flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Search className="w-4 h-4" />
            <span>TRA CỨU NGAY</span>
          </button>

          <button
            type="button"
            onClick={toggleCamera}
            className="bg-[#F2ECE1] hover:bg-[#E5DACB] text-[#1F1D1B] text-xs font-bold px-4 py-3 rounded-xl border border-[#E5DACB] transition flex items-center justify-center gap-1.5"
            title="Quét bằng camera điện thoại"
          >
            <Camera className="w-4 h-4 text-[#C43B3D]" />
            <span className="hidden sm:inline">{cameraActive ? 'Tắt Camera' : 'Quét Camera'}</span>
          </button>
        </form>

        {/* Camera Live Stream Drawer with Laser Scanner */}
        {cameraActive && (
          <div className="max-w-md mx-auto p-5 bg-stone-950 rounded-2xl border-2 border-amber-500/60 text-center space-y-4 shadow-sm relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Camera Quét Live</span>
              </div>
              <button
                type="button"
                onClick={stopCamera}
                className="text-xs text-stone-400 hover:text-white bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800 transition"
              >
                Đóng &times;
              </button>
            </div>

            <div className="aspect-square rounded-2xl overflow-hidden bg-black relative border border-amber-900/40 shadow-inner">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder Target Overlay */}
              <div className="absolute inset-8 border-2 border-dashed border-amber-400/80 rounded-xl pointer-events-none flex items-center justify-center">
                <div className="w-8 h-8 border-t-2 border-l-2 border-amber-300 absolute -top-1 -left-1" />
                <div className="w-8 h-8 border-t-2 border-r-2 border-amber-300 absolute -top-1 -right-1" />
                <div className="w-8 h-8 border-b-2 border-l-2 border-amber-300 absolute -bottom-1 -left-1" />
                <div className="w-8 h-8 border-b-2 border-r-2 border-amber-300 absolute -bottom-1 -right-1" />
              </div>

              {/* Animated Laser Scanning Beam */}
              <div className="absolute inset-x-4 top-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_#EF4444] animate-laser-scan pointer-events-none" />

              {/* Scanning status pill */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-stone-900/90 backdrop-blur-sm text-amber-300 text-xs px-3.5 py-1 rounded-full border border-amber-500/40 pointer-events-none whitespace-nowrap shadow-lg">
                Đang quét mã QR... Hướng camera vào tem
              </div>
            </div>

            {/* Quick Testing Triggers for Smooth Demo */}
            <div className="space-y-1.5 pt-1 text-left bg-stone-900/60 p-3 rounded-xl border border-stone-800">
              <p className="text-xs text-stone-400 font-medium">Bấm nhanh để quét thử mẫu:</p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => simulateScan('V001')}
                  className="text-xs font-mono bg-[#8B2522] hover:bg-[#B9383A] text-amber-200 px-2.5 py-1 rounded-lg border border-amber-500/40 transition font-bold"
                >
                  ⚡ Quét V001 (Váy)
                </button>
                <button
                  type="button"
                  onClick={() => simulateScan('K001')}
                  className="text-xs font-mono bg-stone-800 hover:bg-stone-700 text-stone-200 px-2.5 py-1 rounded-lg border border-stone-700 transition font-bold"
                >
                  ⚡ Quét K001 (Khăn)
                </button>
                <button
                  type="button"
                  onClick={() => simulateScan('C001')}
                  className="text-xs font-mono bg-stone-800 hover:bg-stone-700 text-stone-200 px-2.5 py-1 rounded-lg border border-stone-700 transition font-bold"
                >
                  ⚡ Quét C001 (Túi)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Camera Error Message */}
        {cameraError && (
          <div className="max-w-md mx-auto p-4 bg-red-50 border border-red-200 rounded-2xl text-center space-y-2">
            <p className="text-xs text-red-600 font-bold">{cameraError}</p>
            <p className="text-xs text-[#5D554D]">Bạn có thể chọn nhanh các mã mẫu bên dưới để xem kết quả tức thì.</p>
          </div>
        )}

        {/* Scan Success Notice */}
        {scanSuccessCode && (
          <div className="max-w-md mx-auto p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-center text-xs text-emerald-700 font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Đã nhận diện mã QR thành công: {scanSuccessCode}</span>
          </div>
        )}

        {/* Sample Code Pills */}
        <div className="pt-2 border-t border-[#E5DACB] text-center space-y-2">
          <span className="text-xs font-bold text-[#EA8E23] uppercase tracking-wider block">
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
                    ? 'bg-[#C43B3D] text-white border-[#C43B3D] font-bold shadow-sm'
                    : 'bg-[#FBF8F3] text-[#5D554D] hover:text-[#1F1D1B] hover:bg-[#F2ECE1] border-[#E5DACB]'
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
        <div className="bg-white p-12 rounded-xl border border-red-200 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto text-red-600">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#1F1D1B]">
            Không tìm thấy dữ liệu cho mã &quot;{queriedCode}&quot;
          </h3>
          <p className="text-xs text-[#5D554D] max-w-md mx-auto">
            Vui lòng kiểm tra lại mã số in trên tem nhãn hoặc chọn một trong các mã mẫu thử nghiệm (K001, B001, VI001, C001...) ở phía trên.
          </p>
        </div>
      )}

      {!product && !notFound && (
        <div className="bg-white p-12 rounded-xl border border-[#E5DACB] text-center space-y-3 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#F2ECE1] border border-[#E5DACB] flex items-center justify-center mx-auto text-2xl shadow-inner">
            📱
          </div>
          <h3 className="text-lg font-serif font-bold text-[#1F1D1B]">Chưa có mã tra cứu nào được chọn</h3>
          <p className="text-xs text-[#5D554D] max-w-md mx-auto">
            Nhập mã tem sản phẩm vào ô tìm kiếm ở trên hoặc bấm vào các nút <strong>Mã mẫu thử nghiệm</strong> để mở ra bản tường trình nguồn gốc số hóa của tác phẩm.
          </p>
        </div>
      )}

      {product && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Passport Banner Card */}
          <div className="bg-white rounded-xl border border-[#E5DACB] p-6 sm:p-10 shadow-sm relative overflow-hidden">
            {/* Top Seal */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DACB] pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#C43B3D] text-white flex items-center justify-center font-serif font-black text-2xl shadow">
                  J
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#EA8E23]">
                      DIGITAL PRODUCT PASSPORT
                    </span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold border border-emerald-300">
                      ✓ ĐÃ XÁC THỰC NGUỒN GỐC
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-serif font-black text-[#1F1D1B] mt-0.5">
                    HỘ CHIẾU SỐ DI SẢN THỔ CẨM JRAI
                  </h2>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-[#8A7E72] block font-mono">MÃ ĐỊNH DANH ĐỘC BẢN:</span>
                <span className="text-lg font-black text-[#C43B3D] font-mono tracking-wider">
                  {product.product_code}
                </span>
              </div>
            </div>

            {/* Main Passport Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
              {/* Image & Quick QR (4 Cols) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#FBF8F3] border border-[#E5DACB] shadow-sm">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 bg-[#FBF8F3] rounded-2xl border border-[#E5DACB] text-center space-y-2">
                  <span className="text-xs text-[#EA8E23] uppercase font-bold tracking-wider block">
                    Định danh số cho mác sản phẩm:
                  </span>
                  <div className="flex justify-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                        productUrl
                      )}`}
                      alt="QR Traceability"
                      className="w-32 h-32 rounded-xl border border-[#E5DACB] bg-white p-2 shadow-sm"
                    />
                  </div>
                  <p className="text-xs text-[#5D554D] font-mono">{product.product_code}</p>
                </div>
              </div>

              {/* Data Specifications (8 Cols) */}
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <span className="text-xs text-[#EA8E23] font-bold uppercase tracking-wider block">
                    {product.category_name}
                  </span>
                  <h3 className="text-2xl font-serif font-black text-[#1F1D1B] mt-0.5">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#5D554D] mt-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* 4 Pillars of Traceability */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Pillar 1: Maker */}
                  <div className="p-4 bg-[#FBF8F3] rounded-2xl border border-[#E5DACB] space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#EA8E23] uppercase">
                      <User className="w-4 h-4" />
                      <span>1. Nghệ nhân thực hiện</span>
                    </div>
                    <p className="text-sm font-bold text-[#1F1D1B]">
                      {product.artisan_name || (artisan ? artisan.name : 'Nghệ nhân Làng Kép')}
                    </p>
                    <p className="text-xs text-[#5D554D]">
                      {artisan?.experience || 'Hơn 30 năm tuổi nghề dệt cửi hông'}
                    </p>
                    {artisan && (
                      <Link
                        href={`/artisan/${artisan.id}`}
                        className="text-xs text-[#C43B3D] hover:underline font-bold inline-block pt-1"
                      >
                        Xem hồ sơ nghệ nhân &rarr;
                      </Link>
                    )}
                  </div>

                  {/* Pillar 2: Village & Time */}
                  <div className="p-4 bg-[#FBF8F3] rounded-2xl border border-[#E5DACB] space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#EA8E23] uppercase">
                      <MapPin className="w-4 h-4" />
                      <span>2. Nguồn gốc địa bàn</span>
                    </div>
                    <p className="text-sm font-bold text-[#1F1D1B]">
                      {product.location || 'Làng Kép, Xã Ia Mơ Nông, Chư Păh, Gia Lai'}
                    </p>
                    <p className="text-xs text-[#5D554D] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#EA8E23]" />
                      <span>Thời gian hoàn thành: <strong>{product.production_time}</strong></span>
                    </p>
                  </div>

                  {/* Pillar 3: Materials & Weaving */}
                  <div className="p-4 bg-[#FBF8F3] rounded-2xl border border-[#E5DACB] space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#EA8E23] uppercase">
                      <Layers className="w-4 h-4" />
                      <span>3. Chất liệu & Kỹ thuật</span>
                    </div>
                    <p className="text-xs text-[#5D554D]">
                      <strong className="text-[#1F1D1B]">Chất liệu:</strong> {product.material}
                    </p>
                    <p className="text-xs text-[#5D554D]">
                      <strong className="text-[#1F1D1B]">Kỹ thuật:</strong> Dệt cửi hông (backstrap loom), cài sợi nổi 3D Kơnech.
                    </p>
                  </div>

                  {/* Pillar 4: Motif Symbolism */}
                  <div className="p-4 bg-[#FBF8F3] rounded-2xl border border-[#E5DACB] space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#EA8E23] uppercase">
                      <Sparkles className="w-4 h-4" />
                      <span>4. Ý nghĩa hoa văn</span>
                    </div>
                    <p className="text-xs text-[#1F1D1B] font-bold">
                      {product.motif_name || (motif ? motif.name : 'Hoa văn hình học cổ di sản')}
                    </p>
                    <p className="text-xs text-[#5D554D] line-clamp-2">
                      {motif?.meaning || 'Biểu trưng của sự hòa hợp cùng thiên nhiên và trật tự buôn làng.'}
                    </p>
                  </div>
                </div>

                {/* Cultural Narrative Summary */}
                <div className="p-5 bg-[#F2ECE1] rounded-2xl border border-[#E5DACB] space-y-2">
                  <h4 className="text-xs font-bold text-[#EA8E23] uppercase tracking-wider">
                    {product.story_title || 'Ý NGHĨA VĂN HÓA SẢN PHẨM'}
                  </h4>
                  <p className="text-xs text-[#5D554D] leading-relaxed italic">
                    {product.story_lead || product.story.slice(0, 300) + '...'}
                  </p>
                </div>

                {/* Direct Action Link */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <Link
                    href={`/product/${product.id}`}
                    className="inline-flex items-center gap-2 bg-[#C43B3D] hover:bg-[#8A2325] text-white text-xs font-bold px-6 py-3 rounded-xl shadow transition"
                  >
                    <span>Xem trang bán hàng sản phẩm này</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <div className="text-xs text-[#5D554D] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Dữ liệu số hóa chính thức bởi Ban điều phối JRAI ƠI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PRINT & DOWNLOAD QR TOOLS */}
          <div className="bg-white p-8 rounded-xl border border-[#E5DACB] shadow-sm space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#1F1D1B]">
              Công Cụ Tải & In Thẻ Tem Mã QR
            </h3>
            <p className="text-xs text-[#5D554D]">
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
    <React.Suspense fallback={<div className="min-h-screen bg-[#FBF8F3] py-20 text-center text-[#5D554D]">Đang tải hệ thống tra cứu nguồn gốc sản phẩm...</div>}>
      <TraceabilityContent />
    </React.Suspense>
  );
}
