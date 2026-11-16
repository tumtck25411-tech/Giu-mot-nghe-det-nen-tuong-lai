'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  Clock,
  User,
  ShieldCheck,
  Palette,
  ArrowRight,
  ArrowLeft,
  Check,
  CircleDot,
  X,
  Info,
} from 'lucide-react';
import { addToCart } from '@/lib/data-store';
import { Product } from '@/types';
import { INITIAL_MOTIFS } from '@/lib/initial-data';

// 1. CÁC LOẠI SẢN PHẨM ĐẶT DỆT THEO YÊU CẦU (8 SẢN PHẨM CHUẨN)
interface CustomProductType {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  days: string;
  desc: string;
  image: string;
  suggestedArtisan: string;
}

const CUSTOM_PRODUCTS: CustomProductType[] = [
  {
    id: 'tui-deo-cheo',
    name: 'Túi Đeo Chéo Thổ Cẩm',
    category: 'Túi',
    basePrice: 450000,
    days: '7 - 10 ngày dệt cửi hông',
    desc: 'Phom gọn, quai dệt sợi đôi',
    image: '/images/products/c001.jpg',
    suggestedArtisan: 'Nghệ nhân Rơ Châm Mril (Làng Kép)',
  },
  {
    id: 'khan-quang-co',
    name: 'Khăn Quàng Cổ Thổ Cẩm',
    category: 'Khăn',
    basePrice: 380000,
    days: '5 - 7 ngày dệt tay',
    desc: 'Bông Kơpăh mềm mại giữ ấm',
    image: '/images/products/k001.jpg',
    suggestedArtisan: 'Nghệ nhân Puih H’Lâm (Làng Phung)',
  },
  {
    id: 'vi-cam-tay',
    name: 'Ví Cầm Tay Thổ Cẩm',
    category: 'Ví',
    basePrice: 280000,
    days: '3 - 5 ngày dệt tay',
    desc: 'Vừa vặn điện thoại và thẻ',
    image: '/images/products/vi001.jpg',
    suggestedArtisan: 'Nghệ nhân Siu H’Poi (Làng Kép)',
  },
  {
    id: 'ao-tho-cam',
    name: 'Áo Thổ Cẩm Nam/Nữ Truyền Thống',
    category: 'Áo',
    basePrice: 850000,
    days: '10 - 15 ngày dệt cửi hông',
    desc: 'Phom cổ tròn xẻ ngực Jrai',
    image: '/images/products/a001.jpg',
    suggestedArtisan: 'Nghệ nhân Ksor H’Bia (Làng Mrông Yố)',
  },
  {
    id: 'vay-tho-cam',
    name: 'Váy Thổ Cẩm Lễ Hội Jrai',
    category: 'Váy',
    basePrice: 1200000,
    days: '12 - 18 ngày dệt cửi hông',
    desc: 'Váy quấn may đo theo eo',
    image: '/images/products/v001.jpg',
    suggestedArtisan: 'Nghệ nhân Rơ Châm Mril (Làng Kép)',
  },
  {
    id: 'tap-de',
    name: 'Tạp Dề Thổ Cẩm Nghệ Thuật',
    category: 'Tạp dề',
    basePrice: 320000,
    days: '4 - 6 ngày dệt tay',
    desc: 'Vải dày dặn, tiện làm bếp',
    image: '/images/products/td001.jpg',
    suggestedArtisan: 'Nghệ nhân Rơ Lan H’Ngọc (Làng Phung)',
  },
  {
    id: 'tui-tote',
    name: 'Túi Tote Thổ Cẩm Đa Năng',
    category: 'Túi tote',
    basePrice: 350000,
    days: '6 - 8 ngày dệt tay',
    desc: 'Rộng rãi, đựng vừa laptop 14"',
    image: '/images/products/tt001.jpg',
    suggestedArtisan: 'Nghệ nhân Siu H’Poi (Làng Kép)',
  },
  {
    id: 'bau-nuoc',
    name: 'Bầu Nước Truyền Thống Bọc Thổ Cẩm',
    category: 'Bầu nước',
    basePrice: 250000,
    days: '3 - 4 ngày đan dệt',
    desc: 'Bầu khô phủ sáp ong tự nhiên',
    image: '/images/products/b001.jpg',
    suggestedArtisan: 'Nghệ nhân Puih H’Lâm (Làng Phung)',
  },
];

// 2. MÀU SẮC NHUỘM TỰ NHIÊN (6 SẮC MÀU BẢN ĐỊA - RÚT GỌN 1 DÒNG NGUỒN GỐC)
interface CustomColorType {
  id: string;
  name: string;
  code: string;
  badge: string;
  fee: number;
  shortDesc: string;
  origin?: string;
  meaning?: string;
}

const CUSTOM_COLORS: CustomColorType[] = [
  {
    id: 'xanh-cham',
    name: 'Xanh Chàm Đại Ngàn',
    code: '#1E3A8A',
    badge: 'Lá Rơman Tự Nhiên',
    fee: 0,
    shortDesc: 'Nhuộm lá chàm tự nhiên',
    origin: 'Chiết xuất từ lá chàm Rơman ủ chum đất nung theo công thức cổ truyền Jrai.',
    meaning: 'Tượng trưng cho bầu trời Tây Nguyên lộng gió, sự bình yên và tâm hồn khoáng đạt.',
  },
  {
    id: 'do-bazan',
    name: 'Đỏ Đất Bazan',
    code: '#A94335',
    badge: 'Vỏ Rễ Kơkơh Rừng',
    fee: 0,
    shortDesc: 'Sắc đỏ từ đất bazan',
    origin: 'Nấu từ vỏ rễ cây Kơkơh và đất sét đỏ bazan đồi Chư Păh.',
    meaning: 'Biểu trưng ngọn lửa thiêng sưởi ấm gian nhà sàn, lòng nhiệt huyết và đất mẹ.',
  },
  {
    id: 'tim-hoa-sim',
    name: 'Tím Hoa Sim',
    code: '#7C3AED',
    badge: 'Quả Sim Rừng Mùa Khô',
    fee: 20000,
    shortDesc: 'Nhuộm từ quả sim rừng',
    origin: 'Chiết xuất từ quả sim rừng Chư Păh chín mọng thu hái vào đầu mùa khô.',
    meaning: 'Tượng trưng cho tình yêu chung thủy son sắt và vẻ đẹp dịu dàng của thiếu nữ buôn làng.',
  },
  {
    id: 'vang-sap-ong',
    name: 'Vàng Sáp Ong Rừng',
    code: '#C99A45',
    badge: 'Củ Nghệ Rừng & Tro Củi',
    fee: 15000,
    shortDesc: 'Sắc vàng tự nhiên',
    origin: 'Sắc vàng óng ả từ củ nghệ rừng ngâm tro củi gỗ kơ-nia.',
    meaning: 'Ánh nắng ban mai xuyên qua tán rừng, sự trù phú no đủ và mùa màng bội thu.',
  },
  {
    id: 'trang-kopah',
    name: 'Trắng Bông Thô Kơpăh',
    code: '#FAF5EC',
    badge: 'Bông Tự Nhiên Mộc',
    fee: 0,
    shortDesc: 'Sợi bông nguyên bản',
    origin: 'Sợi bông Kơpăh hái tay tại bìa rừng Chư Păh, giữ trọn sắc trắng ngà không tẩy hóa chất.',
    meaning: 'Sự tinh khôi, chân phương và cội nguồn nguyên bản của đất trời Tây Nguyên.',
  },
  {
    id: 'den-mun',
    name: 'Đen Mun Than Củi',
    code: '#18181B',
    badge: 'Than Gỗ & Bùn Non',
    fee: 10000,
    shortDesc: 'Nhuộm than củi tự nhiên',
    origin: 'Nhuộm từ than củi gỗ rừng ngâm trong bùn non suối Ia Mơ Nông.',
    meaning: 'Đêm đại ngàn huyền bí, sự trầm mặc, bền gan và kiên định của đồng bào.',
  },
];

// 3. TOÀN BỘ 20 HOA VĂN THỔ CẨM JRAI DI SẢN
interface CustomMotifType {
  id: string;
  name: string;
  codeName: string;
  fee: number;
  meaning: string;
  provenance: string;
  description: string;
  image: string;
}

const CUSTOM_MOTIFS: CustomMotifType[] = INITIAL_MOTIFS.map((m, idx) => ({
  id: m.id,
  name: m.name,
  codeName: m.name_jrai || m.motif_code || `JRAI-M0${idx + 1}`,
  fee: idx % 4 === 0 ? 30000 : idx % 2 === 0 ? 20000 : 0,
  meaning: m.meaning || 'Biểu tượng di sản dệt cửi hông Jrai cổ truyền.',
  provenance: m.village || 'Làng Kép & Làng Phung, Chư Păh',
  description: m.description || m.philosophy || m.meaning,
  image: m.image_url || '/images/motifs/con-ga-jrai.png',
}));

export default function CustomOrderPage() {
  // Step state (1 -> 2 -> 3 -> 4)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Customization choices
  const [selectedProduct, setSelectedProduct] = useState<CustomProductType>(CUSTOM_PRODUCTS[0]);
  const [selectedColor, setSelectedColor] = useState<CustomColorType>(CUSTOM_COLORS[0]);
  const [selectedMotif, setSelectedMotif] = useState<CustomMotifType>(CUSTOM_MOTIFS[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [modalMotif, setModalMotif] = useState<CustomMotifType | null>(null);

  const [customNote, setCustomNote] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');

  // Cart Notice
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  // Calculate dynamic price
  const unitPrice = useMemo(() => {
    return selectedProduct.basePrice + selectedColor.fee + selectedMotif.fee;
  }, [selectedProduct, selectedColor, selectedMotif]);

  const grandTotal = useMemo(() => {
    return unitPrice * quantity;
  }, [unitPrice, quantity]);

  // Unique custom product code
  const customSku = useMemo(() => {
    return `JRAI-BESPOKE-${selectedProduct.id.slice(0, 3).toUpperCase()}-${selectedColor.id.slice(0, 2).toUpperCase()}`;
  }, [selectedProduct, selectedColor]);

  // Tự động nhảy bước khi chọn
  const handleSelectProduct = (prod: CustomProductType) => {
    setSelectedProduct(prod);
    setTimeout(() => {
      setCurrentStep(2);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 120, behavior: 'smooth' });
      }
    }, 240);
  };

  const handleSelectColor = (col: CustomColorType) => {
    setSelectedColor(col);
    setTimeout(() => {
      setCurrentStep(3);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 120, behavior: 'smooth' });
      }
    }, 240);
  };

  const handleSelectMotif = (mot: CustomMotifType) => {
    setSelectedMotif(mot);
    setTimeout(() => {
      setCurrentStep(4);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 120, behavior: 'smooth' });
      }
    }, 240);
  };

  // Handle Add to Cart
  const handleAddCustomToCart = () => {
    const bespokeProduct: Product = {
      id: `CUSTOM-${Date.now()}`,
      product_code: customSku,
      slug_id: `custom-${selectedProduct.id}-${Date.now()}`,
      name: `${selectedProduct.name} [ĐẶT DỆT THEO YÊU CẦU]`,
      category: selectedProduct.category,
      category_name: selectedProduct.category,
      price: unitPrice,
      original_price: unitPrice + 80000,
      image_url: selectedProduct.image,
      production_time: selectedProduct.days,
      description: `Sản phẩm đặt làm theo yêu cầu riêng: Màu ${selectedColor.name} • Hoa văn ${selectedMotif.name} • Số lượng: ${quantity} • Ghi chú: ${customNote || 'May đo tiêu chuẩn'}.`,
      material: 'Sợi bông Kơpăh dệt tay 100% nhuộm tự nhiên',
      location: 'CLB Dệt Thổ Cẩm Ia Mơ Nông, Chư Păh, Gia Lai',
      artisan_name: selectedProduct.suggestedArtisan,
      artisan_id: 'ro-cham-h-mut',
      motif_ids: [selectedMotif.id],
      story: `Sản phẩm được nghệ nhân ${selectedProduct.suggestedArtisan} dệt thủ công độc bản theo đơn đặt hàng riêng, phối sắc ${selectedColor.name} kết hợp cùng biểu tượng hoa văn ${selectedMotif.name}.`,
      status: 'published',
      in_stock: true,
      featured: false,
      rating: 5,
      review_count: 1,
      stock_quantity: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    addToCart(bespokeProduct, quantity, selectedColor.name);
    setAddedNotice(`Đã thêm ${quantity} x thiết kế đặt may "${bespokeProduct.name}" vào giỏ hàng!`);
    setTimeout(() => setAddedNotice(null), 4000);
  };

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

      {/* FULL-WIDTH CONTAINER: 94-96% Viewport, max-w-[1600px] */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 space-y-8 flex flex-col items-center relative z-10">
        
        {/* Toast Notification */}
        {addedNotice && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#174C38] text-[#FFFDF9] px-6 py-4 rounded-2xl shadow-xl border border-[#C99A45] flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
            <CheckCircle2 className="w-5 h-5 text-[#C99A45] shrink-0" />
            <div className="text-sm font-medium">{addedNotice}</div>
          </div>
        )}

        {/* HEADER: TIÊU ĐỀ GỌN, THANH THOÁT */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFDF9] border border-[#E8DFC8] text-xs font-medium text-[#C99A45]">
            <span>◇</span>
            <span>Dịch Vụ Đặt Dệt Riêng</span>
            <span>◇</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#174C38] tracking-tight">
            Đặt dệt thổ cẩm theo yêu cầu
          </h1>
          <p className="text-sm sm:text-base text-[#59524C] leading-relaxed font-normal">
            Lựa chọn loại sản phẩm, màu sắc tự nhiên và hoa văn di sản. Nghệ nhân Jrai làng nghề sẽ trực tiếp dệt thủ công theo cấu hình riêng của bạn.
          </p>
        </div>

        {/* 4-STEP WIZARD PROGRESS BAR (TRẢI RỘNG THEO KHUNG FULL WIDTH) */}
        <div className="w-full bg-[#FFFDF9] p-2.5 sm:p-3.5 rounded-2xl border border-[#E8DFC8] shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
            {[
              { num: 1, title: '1. Loại sản phẩm', sub: selectedProduct.name },
              { num: 2, title: '2. Màu sắc', sub: selectedColor.name },
              { num: 3, title: '3. Hoa văn', sub: selectedMotif.name },
              { num: 4, title: '4. Báo giá & Đặt hàng', sub: `${grandTotal.toLocaleString('vi-VN')}₫` },
            ].map((step) => {
              const isCurrent = currentStep === step.num;
              const isPast = currentStep > step.num;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => setCurrentStep(step.num)}
                  className={`p-3 sm:p-3.5 rounded-xl text-left transition-all duration-200 flex flex-col justify-between cursor-pointer border ${
                    isCurrent
                      ? 'bg-[#174C38] text-white border-[#174C38] shadow-sm'
                      : 'bg-[#FAF5EC] text-[#174C38] border-[#E8DFC8] hover:border-[#174C38]/40 hover:bg-[#F4ECE1]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-wider ${
                        isCurrent ? 'text-[#C99A45]' : 'text-[#8A7E72]'
                      }`}
                    >
                      BƯỚC 0{step.num}
                    </span>
                    {isPast && (
                      <span className="w-4 h-4 rounded-full bg-[#174C38] text-white flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </span>
                    )}
                    {isCurrent && <CircleDot className="w-4 h-4 text-[#C99A45]" />}
                  </div>
                  <div
                    className={`text-xs sm:text-sm font-semibold ${
                      isCurrent ? 'text-white' : 'text-[#174C38]'
                    }`}
                  >
                    {step.title}
                  </div>
                  <div
                    className={`text-[11px] leading-snug truncate mt-0.5 ${
                      isCurrent ? 'text-[#FAF5EC]/85' : 'text-[#7A7265]'
                    }`}
                  >
                    {step.sub}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            BƯỚC 1: CHỌN LOẠI SẢN PHẨM (GIỮ NGUYÊN GIAO DIỆN ĐÃ DUYỆT)
        ======================================================== */}
        {currentStep === 1 && (
          <div className="w-full bg-[#FFFDF9] p-6 sm:p-8 lg:p-10 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DFC8] pb-4">
              <div>
                <span className="text-xs font-semibold text-[#C99A45] uppercase tracking-wider">
                  BƯỚC 1 TRÊN 4 • CHỌN SẢN PHẨM
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#174C38] mt-1">
                  Chọn loại sản phẩm bạn muốn dệt
                </h2>
                <p className="text-xs text-[#59524C] mt-0.5">
                  Chọn sản phẩm sẽ tự động chuyển sang Bước 2 (chọn màu sắc)
                </p>
              </div>
              <span className="text-xs font-medium text-[#174C38] bg-[#FAF5EC] px-3.5 py-1 rounded-full border border-[#E8DFC8] self-start sm:self-auto">
                8 lựa chọn sản phẩm
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {CUSTOM_PRODUCTS.map((prod) => {
                const isSelected = selectedProduct.id === prod.id;
                return (
                  <div
                    key={prod.id}
                    onClick={() => handleSelectProduct(prod)}
                    className={`group p-3.5 sm:p-4 rounded-2xl transition-all duration-200 cursor-pointer flex items-center gap-3.5 sm:gap-4 relative ${
                      isSelected
                        ? 'bg-[#F2F8F5] border-2 border-[#174C38] shadow-sm'
                        : 'bg-[#FFFDF9] border border-[#E8DFC8] hover:border-[#174C38]/40 hover:bg-[#FAF7F2]'
                    }`}
                  >
                    {/* Ảnh sản phẩm thực tế (25–30% card width, vuông, bo góc nhẹ) */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 aspect-square rounded-xl overflow-hidden shrink-0 border border-[#E8DFC8]/70 bg-[#FAF5EC] relative">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    {/* Thông tin sản phẩm bên phải */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5 space-y-1.5">
                      {/* Hàng 1: Tên sản phẩm & Nút chọn góc phải */}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-[15px] sm:text-base text-[#174C38] leading-snug line-clamp-1">
                          {prod.name}
                        </h3>
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-[#174C38] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-[#D4C4A8] bg-white shrink-0 mt-0.5 group-hover:border-[#174C38]/50" />
                        )}
                      </div>

                      {/* Hàng 2: Một câu mô tả ngắn (3-6 từ) */}
                      <p className="text-xs sm:text-[13px] text-[#59524C] font-normal leading-relaxed line-clamp-1">
                        {prod.desc}
                      </p>

                      {/* Hàng 3: Thời gian dệt có icon đồng hồ vàng đất & Giá bán màu đỏ đất */}
                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#E8DFC8]/60">
                        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#7A7265]">
                          <Clock className="w-3.5 h-3.5 text-[#C99A45] shrink-0" />
                          <span className="truncate">{prod.days}</span>
                        </div>
                        <div className="font-bold text-base sm:text-lg text-[#A94335] shrink-0">
                          {prod.basePrice.toLocaleString('vi-VN')}₫
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4 border-t border-[#E8DFC8]">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2.5 rounded-xl bg-[#174C38] hover:bg-[#0E3626] text-[#FFFDF9] font-medium text-sm shadow-xs flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>Tiếp tục: Bước 2 (Chọn màu sắc)</span>
                <ArrowRight className="w-4 h-4 text-[#C99A45]" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            BƯỚC 2: CHỌN MÀU SẮC (TINH GỌN THEO CHUẨN BƯỚC 1: 3 CỘT DESKTOP, 2 CỘT TABLET, 1 CỘT MOBILE)
        ======================================================== */}
        {currentStep === 2 && (
          <div className="w-full bg-[#FFFDF9] p-6 sm:p-8 lg:p-10 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DFC8] pb-4">
              <div>
                <span className="text-xs font-semibold text-[#C99A45] uppercase tracking-wider">
                  BƯỚC 2 TRÊN 4 • CHỌN MÀU SẮC
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#174C38] mt-1">
                  Chọn màu sắc chủ đạo (Nhuộm tự nhiên)
                </h2>
                <p className="text-xs text-[#59524C] mt-0.5">
                  Chọn màu sắc sẽ tự động chuyển sang Bước 3 (chọn hoa văn)
                </p>
              </div>
              <span className="text-xs font-medium text-[#174C38] bg-[#FAF5EC] px-3.5 py-1 rounded-full border border-[#E8DFC8] self-start sm:self-auto">
                6 sắc màu di sản
              </span>
            </div>

            {/* Bố cục: 3 cột Desktop, 2 cột Tablet, 1 cột Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {CUSTOM_COLORS.map((col) => {
                const isSelected = selectedColor.id === col.id;
                return (
                  <div
                    key={col.id}
                    onClick={() => handleSelectColor(col)}
                    className={`group p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 relative ${
                      isSelected
                        ? 'bg-[#F2F8F5] border-2 border-[#174C38] shadow-sm'
                        : 'bg-[#FFFDF9] border border-[#E8DFC8] hover:border-[#174C38]/40 hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Chấm màu lớn */}
                      <div
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[#E8DFC8] shadow-xs shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: col.code }}
                      >
                        {col.code === '#FAF5EC' && (
                          <div className="w-full h-full rounded-full border border-stone-300" />
                        )}
                      </div>

                      {/* Tên màu nổi bật & mô tả nguồn gốc 1 dòng */}
                      <div className="min-w-0 space-y-1">
                        <h3 className="font-semibold text-base sm:text-[17px] text-[#174C38] leading-tight truncate">
                          {col.name}
                        </h3>
                        <p className="text-xs text-[#59524C] font-normal truncate">
                          {col.shortDesc}
                        </p>
                        <div className="text-xs font-semibold text-[#A94335]">
                          {col.fee === 0 ? 'Miễn phí di sản' : `+${col.fee.toLocaleString('vi-VN')}₫`}
                        </div>
                      </div>
                    </div>

                    {/* Dấu tích rõ ràng */}
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-[#174C38] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-[#D4C4A8] bg-white shrink-0 group-hover:border-[#174C38]/50" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E8DFC8]">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-xl bg-[#FAF5EC] hover:bg-[#E8DFC8] text-[#174C38] font-medium text-xs sm:text-sm flex items-center gap-2 border border-[#E8DFC8] cursor-pointer transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại Bước 1</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2.5 rounded-xl bg-[#174C38] hover:bg-[#0E3626] text-[#FFFDF9] font-medium text-xs sm:text-sm shadow-xs flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>Tiếp tục: Bước 3 (Chọn hoa văn)</span>
                <ArrowRight className="w-4 h-4 text-[#C99A45]" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            BƯỚC 3: CHỌN HOA VĂN (ĐẦY ĐỦ 20 HOA VĂN DI SẢN THẬT, CÓ POP-UP TÌM HIỂU Ý NGHĨA)
        ======================================================== */}
        {currentStep === 3 && (
          <div className="w-full bg-[#FFFDF9] p-6 sm:p-8 lg:p-10 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DFC8] pb-4">
              <div>
                <span className="text-xs font-semibold text-[#C99A45] uppercase tracking-wider">
                  BƯỚC 3 TRÊN 4 • CHỌN HOA VĂN
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#174C38] mt-1">
                  Chọn hoa văn thổ cẩm Jrai thủ công
                </h2>
                <p className="text-xs text-[#59524C] mt-0.5">
                  Chọn hoa văn sẽ tự động chuyển sang Bước 4 (xác nhận & báo giá). Bấm &ldquo;Tìm hiểu ý nghĩa&rdquo; để xem chi tiết văn hóa.
                </p>
              </div>
              <span className="text-xs font-medium text-[#174C38] bg-[#FAF5EC] px-3.5 py-1 rounded-full border border-[#E8DFC8] self-start sm:self-auto">
                20 hoa văn di sản
              </span>
            </div>

            {/* Bố cục 4 cột Desktop, 3 cột Tablet, 2 cột Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {CUSTOM_MOTIFS.map((mot) => {
                const isSelected = selectedMotif.id === mot.id;
                return (
                  <div
                    key={mot.id}
                    onClick={() => handleSelectMotif(mot)}
                    className={`group p-3.5 sm:p-4 rounded-2xl transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-2.5 relative ${
                      isSelected
                        ? 'bg-[#F2F8F5] border-2 border-[#174C38] shadow-sm'
                        : 'bg-[#FFFDF9] border border-[#E8DFC8] hover:border-[#174C38]/40 hover:bg-[#FAF7F2]'
                    }`}
                  >
                    {/* Header: Ảnh hoa văn thực tế & Nút chọn */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 aspect-square rounded-xl overflow-hidden shrink-0 border border-[#E8DFC8] bg-[#FAF5EC] p-1.5 flex items-center justify-center">
                        <img
                          src={mot.image}
                          alt={mot.name}
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-[#174C38] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-[#D4C4A8] bg-white shrink-0 mt-0.5 group-hover:border-[#174C38]/50" />
                      )}
                    </div>

                    {/* Tên hoa văn & Ý nghĩa ngắn gọn */}
                    <div className="space-y-1">
                      <h3 className="font-semibold text-sm sm:text-base text-[#174C38] leading-tight line-clamp-1">
                        {mot.name}
                      </h3>
                      <p className="text-xs text-[#59524C] font-normal leading-snug line-clamp-2">
                        {mot.meaning}
                      </p>
                    </div>

                    {/* Footer: Phụ phí & Nút Tìm hiểu ý nghĩa */}
                    <div className="pt-2 border-t border-[#E8DFC8]/60 flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalMotif(mot);
                        }}
                        className="text-[#C99A45] hover:text-[#174C38] font-medium underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Info className="w-3 h-3" />
                        <span>Ý nghĩa di sản</span>
                      </button>
                      <span className="font-bold text-[#A94335]">
                        {mot.fee === 0 ? 'Miễn phí' : `+${mot.fee.toLocaleString('vi-VN')}₫`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ghi chú may đo riêng */}
            <div className="pt-4 border-t border-[#E8DFC8] space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-[#174C38] block">
                Ghi chú riêng cho nghệ nhân (kích thước đo, thêu tên viết tắt, yêu cầu thêm):
              </label>
              <textarea
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Ví dụ: Vòng eo 68cm, quai túi dài 100cm, thêu chữ cái C.T..."
                rows={3}
                className="w-full p-3.5 bg-[#FAF5EC] border border-[#E8DFC8] rounded-xl text-xs sm:text-sm text-[#2D2926] placeholder-[#8A7E72] focus:outline-none focus:border-[#174C38] focus:bg-[#FFFDF9]"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E8DFC8]">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-xl bg-[#FAF5EC] hover:bg-[#E8DFC8] text-[#174C38] font-medium text-xs sm:text-sm flex items-center gap-2 border border-[#E8DFC8] cursor-pointer transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại Bước 2</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-6 py-2.5 rounded-xl bg-[#174C38] hover:bg-[#0E3626] text-[#FFFDF9] font-medium text-xs sm:text-sm shadow-xs flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>Tiếp tục: Bước 4 (Xem báo giá)</span>
                <ArrowRight className="w-4 h-4 text-[#C99A45]" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            BƯỚC 4: BÁO GIÁ & XÁC NHẬN ĐẶT HÀNG (2 KHU VỰC: TRÁI THÔNG TIN - PHẢI BÁO GIÁ)
        ======================================================== */}
        {currentStep === 4 && (
          <div className="w-full bg-[#FFFDF9] p-6 sm:p-8 lg:p-10 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DFC8] pb-4">
              <div>
                <span className="text-xs font-semibold text-[#C99A45] uppercase tracking-wider">
                  BƯỚC 4 TRÊN 4 • XÁC NHẬN & BÁO GIÁ
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#174C38] mt-1">
                  Chi tiết cấu hình & báo giá đơn dệt
                </h2>
              </div>
              <span className="text-xs text-[#174C38] font-medium bg-[#FAF5EC] px-3.5 py-1 rounded-full border border-[#E8DFC8] flex items-center gap-1.5 self-start sm:self-auto">
                <Check className="w-3.5 h-3.5 text-[#174C38]" />
                <span>Cấu hình hoàn tất</span>
              </span>
            </div>

            {/* 2 KHU VỰC RÕ RÀNG THEO YÊU CẦU */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              {/* BÊN TRÁI: THÔNG TIN THIẾT KẾ (7 COLS) */}
              <div className="lg:col-span-7 bg-[#FAF5EC] p-5 sm:p-7 rounded-2xl border border-[#E8DFC8] space-y-4">
                <h3 className="text-sm font-semibold text-[#174C38] uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C99A45]" />
                  <span>Thông tin thiết kế của bạn:</span>
                </h3>

                <div className="space-y-3">
                  {/* 1. Sản phẩm */}
                  <div className="p-3.5 bg-[#FFFDF9] rounded-xl border border-[#E8DFC8] flex items-center gap-3.5">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#E8DFC8]/70 bg-[#FAF5EC]">
                      <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] text-[#8A7E72] uppercase block font-semibold">1. Loại sản phẩm:</span>
                      <h4 className="text-base font-semibold text-[#174C38] truncate">{selectedProduct.name}</h4>
                      <p className="text-xs text-[#59524C] truncate">{selectedProduct.desc}</p>
                    </div>
                  </div>

                  {/* 2. Màu sắc */}
                  <div className="p-3.5 bg-[#FFFDF9] rounded-xl border border-[#E8DFC8] flex items-center gap-3.5">
                    <div
                      className="w-12 h-12 rounded-full border-2 border-[#E8DFC8] shadow-xs shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: selectedColor.code }}
                    >
                      {selectedColor.code === '#FAF5EC' && (
                        <div className="w-full h-full rounded-full border border-stone-300" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] text-[#8A7E72] uppercase block font-semibold">2. Màu sắc chủ đạo:</span>
                      <h4 className="text-base font-semibold text-[#174C38] truncate">{selectedColor.name}</h4>
                      <p className="text-xs text-[#59524C] truncate">{selectedColor.shortDesc}</p>
                    </div>
                  </div>

                  {/* 3. Hoa văn */}
                  <div className="p-3.5 bg-[#FFFDF9] rounded-xl border border-[#E8DFC8] flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-[#E8DFC8] bg-[#FAF5EC] p-1 flex items-center justify-center">
                      <img src={selectedMotif.image} alt={selectedMotif.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] text-[#8A7E72] uppercase block font-semibold">3. Hoa văn di sản:</span>
                      <h4 className="text-base font-semibold text-[#C99A45] truncate">{selectedMotif.name}</h4>
                      <p className="text-xs text-[#59524C] line-clamp-1">{selectedMotif.meaning}</p>
                    </div>
                  </div>

                  {/* 4. Số lượng & Thời gian dự kiến */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 bg-[#FFFDF9] rounded-xl border border-[#E8DFC8] flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-[#8A7E72] uppercase block font-semibold">Số lượng đặt:</span>
                        <span className="text-sm font-semibold text-[#174C38]">{quantity} sản phẩm</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-8 h-8 rounded-lg bg-[#FAF5EC] hover:bg-[#E8DFC8] border border-[#E8DFC8] text-[#174C38] font-bold flex items-center justify-center cursor-pointer transition"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-bold text-sm text-[#174C38]">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-8 h-8 rounded-lg bg-[#FAF5EC] hover:bg-[#E8DFC8] border border-[#E8DFC8] text-[#174C38] font-bold flex items-center justify-center cursor-pointer transition"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="p-3.5 bg-[#FFFDF9] rounded-xl border border-[#E8DFC8] flex items-center gap-2.5">
                      <Clock className="w-5 h-5 text-[#C99A45] shrink-0" />
                      <div>
                        <span className="text-[11px] text-[#8A7E72] uppercase block font-semibold">Thời gian dự kiến:</span>
                        <span className="text-xs sm:text-sm font-semibold text-[#174C38]">{selectedProduct.days}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BÊN PHẢI: BẢNG BÁO GIÁ (5 COLS) */}
              <div className="lg:col-span-5 bg-[#FFFDF9] p-5 sm:p-7 rounded-2xl border border-[#E8DFC8] shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-[#174C38] uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#174C38]" />
                    <span>Bảng báo giá chi tiết</span>
                  </h3>

                  <div className="space-y-3 text-xs sm:text-sm text-[#59524C]">
                    <div className="flex justify-between items-center py-2 border-b border-[#E8DFC8]/60">
                      <span>Phôi dệt ({selectedProduct.name}):</span>
                      <span className="font-semibold text-[#2D2926]">
                        {selectedProduct.basePrice.toLocaleString('vi-VN')}₫
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-[#E8DFC8]/60">
                      <span>Phụ phí màu ({selectedColor.name}):</span>
                      <span className="font-semibold text-[#2D2926]">
                        {selectedColor.fee === 0 ? '0₫ (Miễn phí)' : `+${selectedColor.fee.toLocaleString('vi-VN')}₫`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-[#E8DFC8]/60">
                      <span>Phụ phí hoa văn ({selectedMotif.name}):</span>
                      <span className="font-semibold text-[#2D2926]">
                        {selectedMotif.fee === 0 ? '0₫ (Miễn phí)' : `+${selectedMotif.fee.toLocaleString('vi-VN')}₫`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-[#E8DFC8]/60">
                      <span>Đơn giá mỗi sản phẩm:</span>
                      <span className="font-semibold text-[#174C38]">
                        {unitPrice.toLocaleString('vi-VN')}₫
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-[#E8DFC8]/60">
                      <span>Số lượng:</span>
                      <span className="font-semibold text-[#174C38]">
                        x {quantity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tổng tiền nổi bật */}
                <div className="pt-4 border-t border-[#E8DFC8] space-y-1">
                  <span className="text-xs uppercase font-semibold text-[#59524C] block tracking-wider">
                    Tổng tiền thanh toán:
                  </span>
                  <div className="text-3xl sm:text-4xl font-bold text-[#A94335]">
                    {grandTotal.toLocaleString('vi-VN')}₫
                  </div>
                  <span className="text-[11px] text-[#174C38] italic block">
                    Đã bao gồm tem mã QR định danh số và chứng nhận nghệ nhân
                  </span>
                </div>
              </div>
            </div>

            {/* Khối ghi chú riêng cho nghệ nhân */}
            <div className="p-4 bg-[#FAF5EC] rounded-xl border border-[#E8DFC8] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#174C38] uppercase font-semibold">Ghi chú riêng cho nghệ nhân:</span>
                <span className="text-[11px] text-[#8A7E72] italic">Có thể bổ sung trực tiếp</span>
              </div>
              <textarea
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Ví dụ: Vòng eo 68cm, quai túi dài 100cm, thêu chữ cái C.T..."
                rows={2}
                className="w-full p-2.5 bg-[#FFFDF9] border border-[#E8DFC8] rounded-lg text-xs sm:text-sm text-[#2D2926] placeholder-[#8A7E72] focus:outline-none focus:border-[#174C38]"
              />
            </div>

            {/* THÔNG TIN LIÊN HỆ NGƯỜI ĐẶT */}
            <div className="space-y-3 pt-1">
              <h3 className="text-xs font-semibold text-[#174C38] uppercase tracking-wider">
                Thông tin người đặt (để nghệ nhân liên hệ xác nhận):
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[#59524C] block mb-1">Họ và tên của bạn *</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Nguyễn Văn A"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-3 bg-[#FAF5EC] border border-[#E8DFC8] rounded-xl text-xs sm:text-sm text-[#2D2926] placeholder-[#8A7E72] focus:outline-none focus:border-[#174C38] focus:bg-[#FFFDF9]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#59524C] block mb-1">Số điện thoại nhận hàng *</label>
                  <input
                    type="tel"
                    placeholder="Ví dụ: 0901 234 567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-3 bg-[#FAF5EC] border border-[#E8DFC8] rounded-xl text-xs sm:text-sm text-[#2D2926] placeholder-[#8A7E72] focus:outline-none focus:border-[#174C38] focus:bg-[#FFFDF9]"
                  />
                </div>
              </div>
            </div>

            {/* CÁC NÚT HÀNH ĐỘNG */}
            <div className="pt-4 border-t border-[#E8DFC8] flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAddCustomToCart}
                className="flex-1 py-3.5 px-6 rounded-xl bg-[#174C38] hover:bg-[#0E3626] text-[#FFFDF9] font-semibold text-sm sm:text-base shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-[#C99A45]" />
                <span>Thêm vào giỏ hàng ({grandTotal.toLocaleString('vi-VN')}₫)</span>
              </button>

              <Link
                href="/cart"
                className="py-3.5 px-6 rounded-xl bg-[#FAF5EC] hover:bg-[#E8DFC8] text-[#174C38] font-semibold text-sm sm:text-base border border-[#E8DFC8] flex items-center justify-center gap-2 text-center transition-all"
              >
                <span>Xem giỏ hàng</span>
                <ArrowRight className="w-4 h-4 text-[#C99A45]" />
              </Link>
            </div>

            <div className="flex flex-wrap justify-between items-center text-xs pt-1">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="text-[#59524C] hover:text-[#174C38] font-medium cursor-pointer"
              >
                &larr; Chỉnh sửa hoa văn
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="text-[#59524C] hover:text-[#174C38] font-medium cursor-pointer"
              >
                Chọn lại từ đầu (Bước 1)
              </button>
            </div>
          </div>
        )}

      </div>

      {/* MODAL CHI TIẾT Ý NGHĨA HOA VĂN */}
      {modalMotif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FFFDF9] rounded-2xl border border-[#E8DFC8] max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl relative">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl border border-[#E8DFC8] bg-[#FAF5EC] p-2 flex items-center justify-center">
                  <img src={modalMotif.image} alt={modalMotif.name} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#174C38]">{modalMotif.name}</h3>
                  <span className="text-xs font-mono text-[#C99A45]">{modalMotif.codeName}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalMotif(null)}
                className="w-8 h-8 rounded-full bg-[#FAF5EC] hover:bg-[#E8DFC8] text-[#59524C] flex items-center justify-center text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-[#59524C] leading-relaxed">
              <div>
                <strong className="text-[#174C38] block mb-1">Ý nghĩa văn hóa & triết lý:</strong>
                <p>{modalMotif.description || modalMotif.meaning}</p>
              </div>
              <div>
                <strong className="text-[#174C38] block mb-1">Xuất xứ & bảo lưu:</strong>
                <p>{modalMotif.provenance}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8DFC8] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setModalMotif(null)}
                className="px-4 py-2 rounded-xl bg-[#FAF5EC] hover:bg-[#E8DFC8] text-[#59524C] text-xs font-medium cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSelectMotif(modalMotif);
                  setModalMotif(null);
                }}
                className="px-5 py-2 rounded-xl bg-[#174C38] hover:bg-[#0E3626] text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                Chọn hoa văn này
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
