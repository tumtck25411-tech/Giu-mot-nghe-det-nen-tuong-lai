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
  ArrowRight,
  Camera,
  CheckCircle2,
  AlertCircle,
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

  useEffect(() => {
    if (cameraActive && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((err) => {
        console.warn('Video auto-play warning:', err);
      });
    }
  }, [cameraActive, stream]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

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
                let parsedCode = raw;
                if (raw.includes('code=')) {
                  parsedCode = raw.split('code=')[1].split('&')[0];
                }
                simulateScan(parsedCode);
                clearInterval(scanTimer);
              }
            } catch (_) {}
          }
        }, 500);
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
    setNotFound(false);

    const allProds = getProducts(true);
    let found = allProds.find(
      (p) => p.product_code?.toLowerCase() === cleanCode.toLowerCase()
    );

    if (!found) {
      found = allProds.find((p) => p.id?.toLowerCase() === cleanCode.toLowerCase());
    }

    if (found) {
      setProduct(found);
      if (found.artisan_id) {
        const a = getArtisanById(found.artisan_id);
        setArtisan(a || null);
      } else {
        setArtisan(null);
      }

      if (found.motif_ids && found.motif_ids.length > 0) {
        const m = getMotifById(found.motif_ids[0]);
        setMotif(m || null);
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
    <div
      className="w-full min-h-screen py-10 lg:py-14 relative overflow-hidden"
      style={{
        backgroundColor: '#FAF7F2',
        backgroundImage: "url('/images/custom/texture_paper_cotton.jpg')",
        backgroundRepeat: 'repeat',
      }}
    >
      {/* Decorative Brocade Diamond Watermarks on Top Corners */}
      <div
        className="absolute top-0 left-0 w-64 sm:w-80 h-32 pointer-events-none opacity-20 bg-contain bg-no-repeat bg-top-left"
        style={{ backgroundImage: "url('/images/custom/brocade_corner_left.png')" }}
        aria-hidden="true"
      />
      <div
        className="absolute top-0 right-0 w-64 sm:w-80 h-32 pointer-events-none opacity-20 bg-contain bg-no-repeat bg-top-right"
        style={{ backgroundImage: "url('/images/custom/brocade_corner_right.png')" }}
        aria-hidden="true"
      />

      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8 relative z-10">
        
        {/* Header - Modern Ethnic Boutique */}
        <div className="bg-[#FFFDF9] p-8 sm:p-12 rounded-2xl border border-[#E8DFC8] shadow-xs text-center max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF5EC] border border-[#E8DFC8] text-xs font-medium text-[#C99A45]">
            <span>◇</span>
            <span>Minh Bạch Nguồn Gốc Số Hóa</span>
            <span>◇</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#174C38] tracking-tight">
            Tra cứu nguồn gốc sản phẩm
          </h1>
          <p className="text-[#59524C] text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-normal">
            Mỗi sản phẩm thổ cẩm thủ công JRAI ƠI đều gắn liền với một nghệ nhân buôn làng. Quét mã QR hoặc nhập mã tem để chứng thực giờ dệt, phôi sợi tự nhiên và hoa văn bản địa.
          </p>
        </div>

        {/* 3 STEPS INSTRUCTION GUIDE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="bg-[#FFFDF9] p-5 rounded-2xl border border-[#E8DFC8] space-y-1.5 shadow-xs">
            <span className="text-xs font-medium text-[#C99A45] uppercase tracking-wider block">Bước 01</span>
            <h3 className="font-semibold text-sm text-[#174C38]">Tìm mã trên tem sản phẩm</h3>
            <p className="text-xs text-[#59524C] leading-relaxed">
              Kiểm tra thẻ giấy hoặc mác vải đính kèm để lấy mã định danh (như K001, B001...).
            </p>
          </div>
          <div className="bg-[#FFFDF9] p-5 rounded-2xl border border-[#E8DFC8] space-y-1.5 shadow-xs">
            <span className="text-xs font-medium text-[#C99A45] uppercase tracking-wider block">Bước 02</span>
            <h3 className="font-semibold text-sm text-[#174C38]">Quét QR hoặc nhập mã số</h3>
            <p className="text-xs text-[#59524C] leading-relaxed">
              Mở camera quét mã QR trực tiếp hoặc điền mã vào khung tìm kiếm bên dưới.
            </p>
          </div>
          <div className="bg-[#FFFDF9] p-5 rounded-2xl border border-[#E8DFC8] space-y-1.5 shadow-xs">
            <span className="text-xs font-medium text-[#C99A45] uppercase tracking-wider block">Bước 03</span>
            <h3 className="font-semibold text-sm text-[#174C38]">Nhận hộ chiếu số di sản</h3>
            <p className="text-xs text-[#59524C] leading-relaxed">
              Xem hồ sơ nghệ nhân, thời gian dệt cửi hông, xuất xứ buôn làng và ý nghĩa hoa văn.
            </p>
          </div>
        </div>

        {/* SEARCH CARD */}
        <div className="bg-[#FFFDF9] p-6 sm:p-8 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-5 max-w-4xl mx-auto">
          <div className="text-center space-y-1">
            <h2 className="text-base sm:text-lg font-semibold text-[#174C38]">
              Nhập mã tem sản phẩm hoặc quét mã QR
            </h2>
            <p className="text-xs text-[#59524C]">
              Định dạng: K001, B001, V001, C001, VI001...
            </p>
          </div>

          {/* Search Input Bar */}
          <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8A7E72]" />
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Nhập mã: V001, K001, B001, C001, VI001..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF5EC] border border-[#E8DFC8] rounded-xl text-xs sm:text-sm text-[#2D2926] placeholder-[#8A7E72] focus:outline-none focus:border-[#174C38] focus:bg-[#FFFDF9] font-mono"
              />
            </div>

            <button
              type="submit"
              className="bg-[#174C38] hover:bg-[#0E3626] text-[#FFFDF9] text-xs sm:text-sm font-medium px-6 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#C99A45]" />
              <span>Tra cứu ngay</span>
            </button>

            <button
              type="button"
              onClick={toggleCamera}
              className="bg-[#FAF5EC] hover:bg-[#E8DFC8] text-[#174C38] text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl border border-[#E8DFC8] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              title="Quét bằng camera"
            >
              <Camera className="w-4 h-4 text-[#174C38]" />
              <span>{cameraActive ? 'Tắt camera' : 'Quét camera'}</span>
            </button>
          </form>

          {/* Camera Live Stream Drawer */}
          {cameraActive && (
            <div className="max-w-md mx-auto p-4 bg-[#174C38] rounded-2xl border border-[#C99A45] text-center space-y-3 shadow-md relative">
              <div className="flex items-center justify-between text-xs text-[#FFFDF9]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A94335] animate-ping" />
                  <span className="font-medium text-[#C99A45]">Camera đang mở</span>
                </div>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="text-xs text-[#E8DFC8] hover:text-[#FFFDF9] cursor-pointer"
                >
                  Đóng &times;
                </button>
              </div>

              <div className="aspect-square rounded-xl overflow-hidden bg-black relative border border-[#C99A45]/40">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-8 border border-dashed border-[#C99A45]/80 rounded-xl pointer-events-none flex items-center justify-center">
                  <div className="w-6 h-6 border-t-2 border-l-2 border-[#C99A45] absolute -top-1 -left-1" />
                  <div className="w-6 h-6 border-t-2 border-r-2 border-[#C99A45] absolute -top-1 -right-1" />
                  <div className="w-6 h-6 border-b-2 border-l-2 border-[#C99A45] absolute -bottom-1 -left-1" />
                  <div className="w-6 h-6 border-b-2 border-r-2 border-[#C99A45] absolute -bottom-1 -right-1" />
                </div>
              </div>

              <div className="space-y-1 text-left bg-[#0E3626] p-2.5 rounded-xl border border-[#C99A45]/30">
                <p className="text-[11px] text-[#E8DFC8]">Bấm nhanh để quét thử mẫu:</p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => simulateScan('V001')}
                    className="text-[11px] font-mono bg-[#174C38] text-[#FFFDF9] px-2 py-0.5 rounded border border-[#C99A45]/40"
                  >
                    V001 (Váy)
                  </button>
                  <button
                    type="button"
                    onClick={() => simulateScan('K001')}
                    className="text-[11px] font-mono bg-[#174C38] text-[#FFFDF9] px-2 py-0.5 rounded border border-[#C99A45]/40"
                  >
                    K001 (Khăn)
                  </button>
                  <button
                    type="button"
                    onClick={() => simulateScan('C001')}
                    className="text-[11px] font-mono bg-[#174C38] text-[#FFFDF9] px-2 py-0.5 rounded border border-[#C99A45]/40"
                  >
                    C001 (Túi)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Camera Error Message */}
          {cameraError && (
            <div className="p-3 bg-[#FAF5EC] border border-[#E8DFC8] rounded-xl text-center space-y-1">
              <p className="text-xs text-[#A94335] font-medium">{cameraError}</p>
            </div>
          )}

          {/* Scan Success Notice */}
          {scanSuccessCode && (
            <div className="p-2.5 bg-[#FAF5EC] border border-[#174C38]/40 rounded-xl text-center text-xs text-[#174C38] font-medium flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#174C38]" />
              <span>Đã nhận diện mã QR: {scanSuccessCode}</span>
            </div>
          )}

          {/* Sample Code Pills */}
          <div className="pt-2 border-t border-[#E8DFC8] text-center space-y-2">
            <span className="text-[11px] font-medium text-[#C99A45] uppercase tracking-wider block">
              Mã mẫu thử nghiệm:
            </span>
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
              {SAMPLE_CODES.map((s) => (
                <button
                  key={s.code}
                  type="button"
                  onClick={() => {
                    setInputCode(s.code);
                    handleLookup(s.code);
                  }}
                  className={`text-xs px-3 py-1 rounded-full border transition-all font-mono cursor-pointer ${
                    queriedCode.toUpperCase() === s.code
                      ? 'bg-[#174C38] text-[#FFFDF9] border-[#174C38] font-medium shadow-xs'
                      : 'bg-[#FAF5EC] text-[#59524C] hover:text-[#174C38] border-[#E8DFC8]'
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
          <div className="bg-[#FFFDF9] p-8 sm:p-12 rounded-2xl border border-[#E8DFC8] text-center space-y-3 shadow-xs max-w-4xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#FAF5EC] border border-[#E8DFC8] flex items-center justify-center mx-auto text-[#A94335]">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-[#174C38]">
              Không tìm thấy dữ liệu cho mã &quot;{queriedCode}&quot;
            </h3>
            <p className="text-xs text-[#59524C] max-w-md mx-auto">
              Vui lòng kiểm tra lại mã in trên tem nhãn hoặc chọn một trong các mã mẫu thử nghiệm (K001, B001, VI001, C001...) ở phía trên.
            </p>
          </div>
        )}

        {!product && !notFound && (
          <div className="bg-[#FFFDF9] p-8 sm:p-12 rounded-2xl border border-[#E8DFC8] text-center space-y-3 shadow-xs max-w-4xl mx-auto">
            <div className="w-14 h-14 rounded-full bg-[#FAF5EC] border border-[#E8DFC8] flex items-center justify-center mx-auto text-xl">
              📱
            </div>
            <h3 className="text-base font-semibold text-[#174C38]">Chưa có mã tra cứu nào được chọn</h3>
            <p className="text-xs text-[#59524C] max-w-md mx-auto">
              Nhập mã tem sản phẩm vào ô tìm kiếm hoặc bấm vào các nút mã mẫu thử nghiệm để mở ra hộ chiếu số di sản của tác phẩm.
            </p>
          </div>
        )}

        {product && (
          <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
            {/* Passport Banner Card */}
            <div className="bg-[#FFFDF9] rounded-2xl border border-[#E8DFC8] p-6 sm:p-8 shadow-xs relative overflow-hidden space-y-6">
              {/* Top Seal */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8DFC8] pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#174C38] text-[#FFFDF9] flex items-center justify-center font-semibold text-lg shadow-xs">
                    J
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-[#C99A45] uppercase tracking-wider">
                        HỘ CHIẾU SỐ DI SẢN THỔ CẨM
                      </span>
                      <span className="text-[10px] bg-[#FAF5EC] text-[#174C38] px-2 py-0.2 rounded-full font-medium border border-[#E8DFC8]">
                        ✓ ĐÃ XÁC THỰC
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-[#174C38]">
                      {product.name}
                    </h2>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-[#8A7E72] block font-mono">MÃ ĐỊNH DANH SỐ:</span>
                  <span className="text-base sm:text-lg font-semibold text-[#174C38] font-mono tracking-wider">
                    {product.product_code}
                  </span>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Image & QR Column */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF5EC] border border-[#E8DFC8] shadow-xs">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4 bg-[#FAF5EC] rounded-2xl border border-[#E8DFC8] text-center space-y-2">
                    <span className="text-[11px] text-[#C99A45] uppercase font-medium tracking-wider block">
                      Mã QR định danh tem nhãn:
                    </span>
                    <div className="flex justify-center">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                          productUrl
                        )}`}
                        alt="QR Traceability"
                        className="w-28 h-28 rounded-xl border border-[#E8DFC8] bg-white p-2 shadow-xs"
                      />
                    </div>
                    <p className="text-xs text-[#59524C] font-mono">{product.product_code}</p>
                  </div>
                </div>

                {/* 4 Pillars of Traceability */}
                <div className="lg:col-span-8 space-y-5">
                  <p className="text-xs sm:text-sm text-[#59524C] leading-relaxed font-normal">
                    {product.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Pillar 1: Maker */}
                    <div className="p-4 bg-[#FAF5EC] rounded-xl border border-[#E8DFC8] space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-[#C99A45] uppercase">
                        <User className="w-3.5 h-3.5" />
                        <span>1. Nghệ nhân thực hiện</span>
                      </div>
                      <p className="text-sm font-semibold text-[#174C38]">
                        {product.artisan_name || (artisan ? artisan.name : 'Nghệ nhân Làng Kép')}
                      </p>
                      <p className="text-xs text-[#59524C]">
                        {artisan?.experience || 'Hơn 30 năm tuổi nghề dệt cửi hông'}
                      </p>
                      {artisan && (
                        <Link
                          href={`/artisan/${artisan.id}`}
                          className="text-xs text-[#174C38] hover:text-[#C99A45] font-medium inline-block pt-0.5"
                        >
                          Xem hồ sơ nghệ nhân &rarr;
                        </Link>
                      )}
                    </div>

                    {/* Pillar 2: Village & Time */}
                    <div className="p-4 bg-[#FAF5EC] rounded-xl border border-[#E8DFC8] space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-[#C99A45] uppercase">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>2. Nguồn gốc địa bàn</span>
                      </div>
                      <p className="text-sm font-semibold text-[#174C38]">
                        {product.location || 'Làng Kép, Ia Mơ Nông, Chư Păh, Gia Lai'}
                      </p>
                      <p className="text-xs text-[#59524C] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#C99A45]" />
                        <span>Thời gian dệt: <strong>{product.production_time}</strong></span>
                      </p>
                    </div>

                    {/* Pillar 3: Materials & Weaving */}
                    <div className="p-4 bg-[#FAF5EC] rounded-xl border border-[#E8DFC8] space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-[#C99A45] uppercase">
                        <Layers className="w-3.5 h-3.5" />
                        <span>3. Chất liệu & Kỹ thuật</span>
                      </div>
                      <p className="text-xs text-[#59524C]">
                        <strong className="text-[#174C38] font-medium">Chất liệu:</strong> {product.material}
                      </p>
                      <p className="text-xs text-[#59524C]">
                        <strong className="text-[#174C38] font-medium">Kỹ thuật:</strong> Dệt cửi hông (backstrap loom), cài hoa văn nổi 3D.
                      </p>
                    </div>

                    {/* Pillar 4: Motif Symbolism */}
                    <div className="p-4 bg-[#FAF5EC] rounded-xl border border-[#E8DFC8] space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-[#C99A45] uppercase">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>4. Ý nghĩa hoa văn</span>
                      </div>
                      <p className="text-xs font-semibold text-[#174C38]">
                        {product.motif_name || (motif ? motif.name : 'Hoa văn hình học cổ di sản')}
                      </p>
                      <p className="text-xs text-[#59524C] line-clamp-2">
                        {motif?.meaning || 'Biểu trưng của sự hòa hợp cùng thiên nhiên và trật tự buôn làng.'}
                      </p>
                    </div>
                  </div>

                  {/* Narrative Summary */}
                  {product.story && (
                    <div className="p-4 bg-[#FAF5EC] rounded-xl border border-[#E8DFC8] space-y-1">
                      <h4 className="text-xs font-medium text-[#C99A45] uppercase tracking-wider">
                        {product.story_title || 'Ý nghĩa văn hóa tác phẩm'}
                      </h4>
                      <p className="text-xs text-[#59524C] leading-relaxed italic">
                        {product.story_lead || product.story.slice(0, 260) + '...'}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <Link
                      href={`/product/${product.id}`}
                      className="inline-flex items-center gap-2 bg-[#174C38] hover:bg-[#0E3626] text-[#FFFDF9] text-xs font-medium px-5 py-2.5 rounded-xl shadow-xs transition-all"
                    >
                      <span>Xem sản phẩm này</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C99A45]" />
                    </Link>

                    <div className="text-xs text-[#59524C] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#174C38]" />
                      <span>Xác thực số hóa bởi HTX Dệt Ia Mơ Nông</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PRINT & DOWNLOAD QR TOOLS */}
            <div className="bg-[#FFFDF9] p-6 sm:p-8 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-3">
              <h3 className="text-base sm:text-lg font-semibold text-[#174C38]">
                Công cụ in thẻ tem mã QR
              </h3>
              <p className="text-xs text-[#59524C]">
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
    </div>
  );
}

export default function TraceabilityPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#FAF5EC] py-20 text-center text-[#59524C]">Đang tải hệ thống tra cứu nguồn gốc sản phẩm...</div>}>
      <TraceabilityContent />
    </React.Suspense>
  );
}
