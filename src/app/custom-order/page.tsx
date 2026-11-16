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
} from 'lucide-react';
import { addToCart } from '@/lib/data-store';
import { Product } from '@/types';

// 1. CÁC LOẠI SẢN PHẨM ĐẶT DỆT THEO YÊU CẦU
interface CustomProductType {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  days: string;
  desc: string;
  suggestedArtisan: string;
}

const CUSTOM_PRODUCTS: CustomProductType[] = [
  {
    id: 'tui-deo-cheo',
    name: 'Túi Đeo Chéo Thổ Cẩm',
    category: 'Túi',
    basePrice: 450000,
    days: '7 - 10 ngày dệt cửi hông',
    desc: 'Thiết kế phom gọn thanh lịch, quai dệt sợi đôi chắc chắn, nắp gài nút gỗ thông rừng.',
    suggestedArtisan: 'Nghệ nhân Rơ Châm Mril (Làng Kép)',
  },
  {
    id: 'khan-quang-co',
    name: 'Khăn Quàng Cổ Thổ Cẩm',
    category: 'Khăn',
    basePrice: 380000,
    days: '5 - 7 ngày dệt tay',
    desc: 'Sợi bông Kơpăh mềm mại giữ ấm, hai đầu viền tua rua dệt sợi bazan truyền thống.',
    suggestedArtisan: 'Nghệ nhân Puih H’Lâm (Làng Phung)',
  },
  {
    id: 'vi-cam-tay',
    name: 'Ví Cầm Tay Thổ Cẩm',
    category: 'Ví',
    basePrice: 280000,
    days: '3 - 5 ngày dệt tay',
    desc: 'Kích thước vừa vặn đựng điện thoại và thẻ tiền, khóa kéo đồng mộc bền chắc.',
    suggestedArtisan: 'Nghệ nhân Siu H’Poi (Làng Kép)',
  },
  {
    id: 'ao-tho-cam',
    name: 'Áo Thổ Cẩm Nam/Nữ Truyền Thống',
    category: 'Áo',
    basePrice: 850000,
    days: '10 - 15 ngày dệt cửi hông',
    desc: 'Phom áo cổ tròn xẻ ngực Jrai nguyên bản, dệt viền hoa văn bảo vệ trước ngực và vạt áo.',
    suggestedArtisan: 'Nghệ nhân Ksor H’Bia (Làng Mrông Yố)',
  },
  {
    id: 'vay-tho-cam',
    name: 'Váy Thổ Cẩm Lễ Hội Jrai',
    category: 'Váy',
    basePrice: 1200000,
    days: '12 - 18 ngày dệt cửi hông',
    desc: 'Váy quấn nguyên khổ may đo theo vòng eo, kết tinh tinh hoa mẫu hệ và sợi chỉ tình yêu.',
    suggestedArtisan: 'Nghệ nhân Rơ Châm Mril (Làng Kép)',
  },
  {
    id: 'tap-de',
    name: 'Tạp Dề Thổ Cẩm Nghệ Thuật',
    category: 'Tạp dề',
    basePrice: 320000,
    days: '4 - 6 ngày dệt tay',
    desc: 'Vải dệt dày dặn chống bám bụi, túi ngực tiện dụng cho barista, nghệ nhân, làm bếp.',
    suggestedArtisan: 'Nghệ nhân Rơ Lan H’Ngọc (Làng Phung)',
  },
  {
    id: 'tui-tote',
    name: 'Túi Tote Thổ Cẩm Đa Năng',
    category: 'Túi tote',
    basePrice: 350000,
    days: '6 - 8 ngày dệt tay',
    desc: 'Sức chứa rộng rãi đựng vừa tài liệu và laptop 14 inch, đáy túi dệt gia cố sợi đôi.',
    suggestedArtisan: 'Nghệ nhân Siu H’Poi (Làng Kép)',
  },
  {
    id: 'bau-nuoc',
    name: 'Bầu Nước Truyền Thống Bọc Thổ Cẩm',
    category: 'Bầu nước',
    basePrice: 250000,
    days: '3 - 4 ngày đan dệt',
    desc: 'Quả bầu rừng phơi khô phủ sáp ong tự nhiên, quàng đai thổ cẩm phong thủy may mắn.',
    suggestedArtisan: 'Nghệ nhân Puih H’Lâm (Làng Phung)',
  },
];

// 2. MÀU SẮC NHUỘM TỰ NHIÊN
interface CustomColorType {
  id: string;
  name: string;
  code: string;
  badge: string;
  fee: number;
  origin: string;
  meaning: string;
}

const CUSTOM_COLORS: CustomColorType[] = [
  {
    id: 'xanh-cham',
    name: 'Xanh Chàm Đại Ngàn',
    code: '#1E3A8A',
    badge: 'Lá Rơman Tự Nhiên',
    fee: 0,
    origin: 'Chiết xuất từ lá chàm Rơman ủ chum đất nung theo công thức cổ truyền Jrai.',
    meaning: 'Tượng trưng cho bầu trời Tây Nguyên lộng gió, sự bình yên và tâm hồn khoáng đạt.',
  },
  {
    id: 'do-bazan',
    name: 'Đỏ Đất Bazan',
    code: '#A94335',
    badge: 'Vỏ Rễ Kơkơh Rừng',
    fee: 0,
    origin: 'Nấu từ vỏ rễ cây Kơkơh và đất sét đỏ bazan đồi Chư Păh.',
    meaning: 'Biểu trưng ngọn lửa thiêng sưởi ấm gian nhà sàn, lòng nhiệt huyết và đất mẹ.',
  },
  {
    id: 'tim-hoa-sim',
    name: 'Tím Hoa Sim',
    code: '#7C3AED',
    badge: 'Quả Sim Rừng Mùa Khô',
    fee: 20000,
    origin: 'Chiết xuất từ quả sim rừng Chư Păh chín mọng thu hái vào đầu mùa khô.',
    meaning: 'Tượng trưng cho tình yêu chung thủy son sắt và vẻ đẹp dịu dàng của thiếu nữ buôn làng.',
  },
  {
    id: 'vang-sap-ong',
    name: 'Vàng Sáp Ong Rừng',
    code: '#C99A45',
    badge: 'Củ Nghệ Rừng & Tro Củi',
    fee: 15000,
    origin: 'Sắc vàng óng ả từ củ nghệ rừng ngâm tro củi gỗ kơ-nia.',
    meaning: 'Ánh nắng ban mai xuyên qua tán rừng, sự trù phú no đủ và mùa màng bội thu.',
  },
  {
    id: 'trang-kopah',
    name: 'Trắng Bông Thô Kơpăh',
    code: '#FAF5EC',
    badge: 'Bông Tự Nhiên Mộc',
    fee: 0,
    origin: 'Sợi bông Kơpăh hái tay tại bìa rừng Chư Păh, giữ trọn sắc trắng ngà không tẩy hóa chất.',
    meaning: 'Sự tinh khôi, chân phương và cội nguồn nguyên bản của đất trời Tây Nguyên.',
  },
  {
    id: 'den-mun',
    name: 'Đen Mun Than Củi',
    code: '#18181B',
    badge: 'Than Gỗ & Bùn Non',
    fee: 10000,
    origin: 'Nhuộm từ than củi gỗ rừng ngâm trong bùn non suối Ia Mơ Nông.',
    meaning: 'Đêm đại ngàn huyền bí, sự trầm mặc, bền gan và kiên định của đồng bào.',
  },
];

// 3. HOA VĂN THỔ CẨM JRAI
interface CustomMotifType {
  id: string;
  name: string;
  codeName: string;
  fee: number;
  meaning: string;
  provenance: string;
}

const CUSTOM_MOTIFS: CustomMotifType[] = [
  {
    id: 'con-ga',
    name: 'Hoa Văn Con Gà Rừng (Kơkơh)',
    codeName: 'MOTIF-CHICKEN',
    fee: 30000,
    meaning: 'Tiếng gà gáy gọi bình minh, xua tan đêm tối, đón nhận vận khí an lành và sự khởi đầu hanh thông.',
    provenance: 'Hoa văn tiêu biểu truyền khẩu tại Làng Kép & Làng Phung.',
  },
  {
    id: 'hoa-mao-ga',
    name: 'Hoa Văn Hoa Mào Gà (Rơkơh)',
    codeName: 'MOTIF-CELOSIA',
    fee: 40000,
    meaning: 'Sức sống kiên cường, vẻ đẹp rực rỡ và nét duyên dáng không bao giờ phai tàn của phụ nữ Tây Nguyên.',
    provenance: 'Thường xuất hiện trên dải ngực váy lễ hội của các thiếu nữ Jrai.',
  },
  {
    id: 'doi-lua',
    name: 'Hoa Văn Đôi Lứa (Gắn Kết Buôn Làng)',
    codeName: 'MOTIF-COUPLE',
    fee: 50000,
    meaning: 'Tình yêu thủy chung, hòa hợp lứa đôi và sợi dây liên kết bền chặt giữa hai dòng họ mẫu hệ.',
    provenance: 'Hoa văn độc bản trên mẫu váy cưới và khăn quàng lễ hỏi.',
  },
  {
    id: 'song-am-cong-chieng',
    name: 'Hoa Văn Sóng Âm Cồng Chiêng',
    codeName: 'MOTIF-GONG',
    fee: 45000,
    meaning: 'Nhịp đập cội nguồn, tiếng chiêng cồng nối trần thế với thần linh Yang, ban phước lành buôn làng.',
    provenance: 'Hoa văn nhịp điệu dệt sợi đỏ bazan viền quanh vạt áo.',
  },
  {
    id: 'rang-cua-bao-ve',
    name: 'Hoa Văn Răng Cưa Bảo Vệ',
    codeName: 'MOTIF-SAWTOOTH',
    fee: 35000,
    meaning: 'Khiên chắn tâm linh của núi rừng, xua đuổi tà khí và bảo bọc bình an cho người mặc.',
    provenance: 'Hoa văn đường viền kinh điển trên toàn bộ trang phục Jrai.',
  },
  {
    id: 'cay-neu-yang',
    name: 'Hoa Văn Cây Nêu Thần Linh',
    codeName: 'MOTIF-TREE',
    fee: 55000,
    meaning: 'Cột trụ vũ trụ nối đất và trời trong các mùa lễ hội tạ ơn, cầu mong mùa màng bội thu và sức khỏe.',
    provenance: 'Mô-típ trang trọng bậc nhất của nghệ nhân Chư Păh.',
  },
];

export default function CustomOrderPage() {
  // Step state (1 -> 2 -> 3 -> 4)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Customization choices
  const [selectedProduct, setSelectedProduct] = useState<CustomProductType>(CUSTOM_PRODUCTS[0]);
  const [selectedColor, setSelectedColor] = useState<CustomColorType>(CUSTOM_COLORS[0]);
  const [selectedMotif, setSelectedMotif] = useState<CustomMotifType>(CUSTOM_MOTIFS[0]);
  const [customNote, setCustomNote] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');

  // Cart Notice
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  // Calculate dynamic price
  const totalPrice = useMemo(() => {
    return selectedProduct.basePrice + selectedColor.fee + selectedMotif.fee;
  }, [selectedProduct, selectedColor, selectedMotif]);

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
      price: totalPrice,
      original_price: totalPrice + 80000,
      image_url: '/images/products/c001.jpg',
      production_time: selectedProduct.days,
      description: `Sản phẩm đặt làm theo yêu cầu riêng: Màu ${selectedColor.name} • Hoa văn ${selectedMotif.name} • Ghi chú: ${customNote || 'May đo tiêu chuẩn'}.`,
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

    addToCart(bespokeProduct, 1, selectedColor.name);
    setAddedNotice(`Đã thêm thiết kế đặt may "${bespokeProduct.name}" vào giỏ hàng!`);
    setTimeout(() => setAddedNotice(null), 4000);
  };

  return (
    <div className="w-full bg-[#FAF5EC] min-h-screen py-10 lg:py-14">
      <div className="w-full max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 flex flex-col items-center">
        
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

        {/* 4-STEP WIZARD PROGRESS BAR */}
        <div className="w-full bg-[#FFFDF9] p-3 sm:p-4 rounded-2xl border border-[#E8DFC8] shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
            {[
              { num: 1, title: 'Bước 1: Loại sản phẩm', sub: selectedProduct.name },
              { num: 2, title: 'Bước 2: Màu sắc', sub: selectedColor.name },
              { num: 3, title: 'Bước 3: Hoa văn', sub: selectedMotif.name },
              { num: 4, title: 'Bước 4: Báo giá & Đặt', sub: `${totalPrice.toLocaleString('vi-VN')}₫` },
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
                      ? 'bg-[#174C38] text-[#FFFDF9] border-[#174C38] shadow-xs'
                      : isPast
                      ? 'bg-[#FFFDF9] text-[#174C38] border-[#174C38]/40 hover:bg-[#FAF5EC]'
                      : 'bg-[#FAF5EC] text-[#59524C] border-[#E8DFC8] hover:border-[#174C38]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[11px] font-medium uppercase tracking-wider ${isCurrent ? 'text-[#C99A45]' : isPast ? 'text-[#174C38]' : 'text-[#8A7E72]'}`}>
                      BƯỚC 0{step.num}
                    </span>
                    {isPast && <CheckCircle2 className="w-4 h-4 text-[#174C38]" />}
                    {isCurrent && <CircleDot className="w-4 h-4 text-[#C99A45]" />}
                  </div>
                  <div className={`text-xs sm:text-sm font-medium ${isCurrent ? 'text-[#FFFDF9]' : 'text-[#2D2926]'}`}>
                    {step.title}
                  </div>
                  <div className={`text-[11px] truncate mt-0.5 ${isCurrent ? 'text-[#E8DFC8]' : 'text-[#8A7E72]'}`}>
                    {step.sub}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            BƯỚC 1: CHỌN LOẠI SẢN PHẨM
        ======================================================== */}
        {currentStep === 1 && (
          <div className="w-full bg-[#FFFDF9] p-6 sm:p-8 lg:p-10 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DFC8] pb-4">
              <div>
                <span className="text-xs font-medium text-[#C99A45] uppercase tracking-wider">
                  BƯỚC 1 TRÊN 4 • CHỌN SẢN PHẨM
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#174C38] mt-1">
                  Chọn loại sản phẩm bạn muốn dệt
                </h2>
                <p className="text-xs text-[#59524C] mt-0.5">
                  Chọn sản phẩm sẽ tự động chuyển sang Bước 2 (chọn màu sắc)
                </p>
              </div>
              <span className="text-xs font-medium text-[#59524C] bg-[#FAF5EC] px-3 py-1 rounded-full border border-[#E8DFC8] self-start sm:self-auto">
                8 lựa chọn sản phẩm
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CUSTOM_PRODUCTS.map((prod) => {
                const isSelected = selectedProduct.id === prod.id;
                return (
                  <div
                    key={prod.id}
                    onClick={() => handleSelectProduct(prod)}
                    className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'bg-[#FAF5EC]/60 border-2 border-[#174C38] shadow-xs'
                        : 'bg-[#FFFDF9] border-[#E8DFC8] hover:border-[#174C38]/60 hover:bg-[#FAF5EC]/30'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-[#174C38] bg-[#FAF5EC] border border-[#E8DFC8] px-2.5 py-0.5 rounded-full">
                          {prod.category}
                        </span>
                        {isSelected ? (
                          <div className="flex items-center gap-1 text-xs font-medium text-[#174C38]">
                            <CheckCircle2 className="w-4 h-4 text-[#174C38]" />
                            <span>Đã chọn</span>
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-[#E8DFC8]" />
                        )}
                      </div>

                      <h3 className="font-semibold text-base sm:text-lg text-[#174C38] pt-0.5">
                        {prod.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#59524C] leading-relaxed font-normal">
                        {prod.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E8DFC8] flex items-center justify-between">
                      <div className="text-xs text-[#59524C] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#C99A45]" />
                        <span>{prod.days}</span>
                      </div>
                      <div className="font-semibold text-base sm:text-lg text-[#A94335]">
                        {prod.basePrice.toLocaleString('vi-VN')}₫
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
            BƯỚC 2: CHỌN MÀU SẮC
        ======================================================== */}
        {currentStep === 2 && (
          <div className="w-full bg-[#FFFDF9] p-6 sm:p-8 lg:p-10 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DFC8] pb-4">
              <div>
                <span className="text-xs font-medium text-[#C99A45] uppercase tracking-wider">
                  BƯỚC 2 TRÊN 4 • CHỌN MÀU SẮC
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#174C38] mt-1">
                  Chọn màu sắc chủ đạo (Nhuộm tự nhiên)
                </h2>
                <p className="text-xs text-[#59524C] mt-0.5">
                  Chọn màu sắc sẽ tự động chuyển sang Bước 3 (chọn hoa văn)
                </p>
              </div>
              <span className="text-xs font-medium text-[#59524C] bg-[#FAF5EC] px-3 py-1 rounded-full border border-[#E8DFC8] self-start sm:self-auto">
                6 sắc màu di sản
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CUSTOM_COLORS.map((col) => {
                const isSelected = selectedColor.id === col.id;
                return (
                  <div
                    key={col.id}
                    onClick={() => handleSelectColor(col)}
                    className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer space-y-2.5 ${
                      isSelected
                        ? 'bg-[#FAF5EC]/60 border-2 border-[#174C38] shadow-xs'
                        : 'bg-[#FFFDF9] border-[#E8DFC8] hover:border-[#174C38]/60 hover:bg-[#FAF5EC]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full border border-[#E8DFC8] shadow-xs shrink-0"
                          style={{ backgroundColor: col.code }}
                        />
                        <div>
                          <h3 className="font-semibold text-sm sm:text-base text-[#174C38]">{col.name}</h3>
                          <span className="text-[11px] font-medium text-[#C99A45] bg-[#FAF5EC] px-2 py-0.5 rounded border border-[#E8DFC8]">
                            {col.badge}
                          </span>
                        </div>
                      </div>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-[#174C38] shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-[#E8DFC8]" />
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-[#59524C] leading-relaxed font-normal">{col.origin}</p>
                    <p className="text-xs text-[#8A7E72] italic">&ldquo;{col.meaning}&rdquo;</p>

                    <div className="pt-2 border-t border-[#E8DFC8] flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-[#59524C]">Phụ phí nhuộm:</span>
                      <span className="font-semibold text-[#A94335]">
                        {col.fee === 0 ? 'Miễn phí di sản' : `+${col.fee.toLocaleString('vi-VN')}₫`}
                      </span>
                    </div>
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
            BƯỚC 3: CHỌN HOA VĂN
        ======================================================== */}
        {currentStep === 3 && (
          <div className="w-full bg-[#FFFDF9] p-6 sm:p-8 lg:p-10 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DFC8] pb-4">
              <div>
                <span className="text-xs font-medium text-[#C99A45] uppercase tracking-wider">
                  BƯỚC 3 TRÊN 4 • CHỌN HOA VĂN
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#174C38] mt-1">
                  Chọn hoa văn thổ cẩm Jrai thủ công
                </h2>
                <p className="text-xs text-[#59524C] mt-0.5">
                  Chọn hoa văn sẽ tự động chuyển sang Bước 4 (xác nhận & báo giá)
                </p>
              </div>
              <span className="text-xs font-medium text-[#59524C] bg-[#FAF5EC] px-3 py-1 rounded-full border border-[#E8DFC8] self-start sm:self-auto">
                6 hoa văn di sản
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CUSTOM_MOTIFS.map((mot) => {
                const isSelected = selectedMotif.id === mot.id;
                return (
                  <div
                    key={mot.id}
                    onClick={() => handleSelectMotif(mot)}
                    className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer space-y-2.5 ${
                      isSelected
                        ? 'bg-[#FAF5EC]/60 border-2 border-[#174C38] shadow-xs'
                        : 'bg-[#FFFDF9] border-[#E8DFC8] hover:border-[#174C38]/60 hover:bg-[#FAF5EC]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base text-[#174C38]">
                          {mot.name}
                        </h3>
                        <span className="text-[11px] font-mono text-[#C99A45] bg-[#FAF5EC] px-2 py-0.5 rounded border border-[#E8DFC8] inline-block mt-0.5">
                          {mot.codeName}
                        </span>
                      </div>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-[#174C38] shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-[#E8DFC8]" />
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-[#59524C] leading-relaxed font-normal">
                      {mot.meaning}
                    </p>

                    <div className="pt-2 border-t border-[#E8DFC8] flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-[11px] text-[#8A7E72]">{mot.provenance}</span>
                      <span className="font-semibold text-[#A94335]">
                        +{mot.fee.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ghi chú may đo riêng */}
            <div className="pt-4 border-t border-[#E8DFC8] space-y-2">
              <label className="text-xs sm:text-sm font-medium text-[#174C38] block">
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
            BƯỚC 4: BÁO GIÁ & XÁC NHẬN ĐẶT HÀNG
        ======================================================== */}
        {currentStep === 4 && (
          <div className="w-full bg-[#FFFDF9] p-6 sm:p-8 lg:p-10 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DFC8] pb-4">
              <div>
                <span className="text-xs font-medium text-[#C99A45] uppercase tracking-wider">
                  BƯỚC 4 TRÊN 4 • XÁC NHẬN & BÁO GIÁ
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#174C38] mt-1">
                  Chi tiết cấu hình & báo giá đơn dệt
                </h2>
              </div>
              <span className="text-xs text-[#174C38] font-medium bg-[#FAF5EC] px-3 py-1 rounded-full border border-[#E8DFC8] flex items-center gap-1.5 self-start sm:self-auto">
                <Check className="w-3.5 h-3.5 text-[#174C38]" />
                <span>Cấu hình hoàn tất</span>
              </span>
            </div>

            {/* BẢNG TỔNG KẾT CẤU HÌNH */}
            <div className="bg-[#FAF5EC] p-5 sm:p-6 rounded-2xl border border-[#E8DFC8] space-y-3">
              <h3 className="text-xs font-medium text-[#174C38] uppercase tracking-wider">
                Tổng kết yêu cầu của bạn:
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 bg-[#FFFDF9] rounded-xl border border-[#E8DFC8]">
                  <span className="text-[11px] text-[#8A7E72] uppercase block font-medium">1. Loại sản phẩm:</span>
                  <span className="text-base font-semibold text-[#174C38] block mt-0.5">{selectedProduct.name}</span>
                  <span className="text-xs text-[#59524C] mt-0.5 block">{selectedProduct.desc}</span>
                </div>

                <div className="p-3.5 bg-[#FFFDF9] rounded-xl border border-[#E8DFC8]">
                  <span className="text-[11px] text-[#8A7E72] uppercase block font-medium">2. Màu sắc chủ đạo:</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="w-4 h-4 rounded-full border border-[#E8DFC8] inline-block shadow-xs"
                      style={{ backgroundColor: selectedColor.code }}
                    />
                    <span className="text-base font-semibold text-[#174C38]">{selectedColor.name}</span>
                  </div>
                  <span className="text-xs text-[#59524C] mt-0.5 block">{selectedColor.badge}</span>
                </div>

                <div className="p-3.5 bg-[#FFFDF9] rounded-xl border border-[#E8DFC8]">
                  <span className="text-[11px] text-[#8A7E72] uppercase block font-medium">3. Hoa văn thổ cẩm:</span>
                  <span className="text-base font-semibold text-[#C99A45] block mt-0.5">{selectedMotif.name}</span>
                  <span className="text-xs text-[#59524C] mt-0.5 block">{selectedMotif.meaning}</span>
                </div>

                <div className="p-3.5 bg-[#FFFDF9] rounded-xl border border-[#E8DFC8]">
                  <span className="text-[11px] text-[#8A7E72] uppercase block font-medium">4. Nghệ nhân & Thời gian:</span>
                  <span className="text-base font-semibold text-[#174C38] block mt-0.5">{selectedProduct.suggestedArtisan}</span>
                  <span className="text-xs text-[#59524C] mt-0.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#C99A45]" />
                    <span>Ước tính: {selectedProduct.days}</span>
                  </span>
                </div>
              </div>

              {/* Khối xem và sửa ghi chú may đo riêng */}
              <div className="p-3.5 bg-[#FFFDF9] rounded-xl border border-[#E8DFC8] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#8A7E72] uppercase font-medium">Ghi chú riêng cho nghệ nhân:</span>
                  <span className="text-xs text-[#174C38] italic">Có thể bổ sung trực tiếp</span>
                </div>
                <textarea
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Ví dụ: Vòng eo 68cm, quai túi dài 100cm, thêu chữ cái C.T..."
                  rows={2}
                  className="w-full p-2.5 bg-[#FAF5EC] border border-[#E8DFC8] rounded-lg text-xs sm:text-sm text-[#2D2926] placeholder-[#8A7E72] focus:outline-none focus:border-[#174C38]"
                />
              </div>
            </div>

            {/* BẢNG KÊ CHI PHÍ MINH BẠCH */}
            <div className="bg-[#FFFDF9] p-5 rounded-2xl border border-[#E8DFC8] space-y-3">
              <h3 className="text-xs font-medium text-[#174C38] uppercase tracking-wider">
                Bảng kê chi phí minh bạch:
              </h3>

              <div className="space-y-2 text-xs sm:text-sm text-[#59524C]">
                <div className="flex justify-between items-center py-1.5 border-b border-[#E8DFC8]">
                  <span>Phôi dệt & công thợ ({selectedProduct.name}):</span>
                  <span className="font-semibold text-[#2D2926]">
                    {selectedProduct.basePrice.toLocaleString('vi-VN')}₫
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-[#E8DFC8]">
                  <span>Màu nhuộm tự nhiên ({selectedColor.name}):</span>
                  <span className="font-semibold text-[#2D2926]">
                    {selectedColor.fee === 0 ? '0₫ (Miễn phí di sản)' : `+${selectedColor.fee.toLocaleString('vi-VN')}₫`}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-[#E8DFC8]">
                  <span>Dệt hoa văn thủ công ({selectedMotif.name}):</span>
                  <span className="font-semibold text-[#2D2926]">
                    +{selectedMotif.fee.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8DFC8] flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <span className="text-xs font-medium text-[#59524C] uppercase tracking-wider block">
                    Tổng giá tiền hoàn thiện:
                  </span>
                  <span className="text-xs text-[#174C38]">
                    Đã bao gồm tem mã QR độc bản và chứng thực nghệ nhân
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-semibold text-[#A94335]">
                  {totalPrice.toLocaleString('vi-VN')}₫
                </div>
              </div>
            </div>

            {/* THÔNG TIN LIÊN HỆ NGƯỜI ĐẶT */}
            <div className="space-y-3 pt-1">
              <h3 className="text-xs font-medium text-[#174C38] uppercase tracking-wider">
                Thông tin người đặt (để cập nhật tiến độ dệt):
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
                className="flex-1 py-3.5 px-6 rounded-xl bg-[#174C38] hover:bg-[#0E3626] text-[#FFFDF9] font-medium text-sm sm:text-base shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-[#C99A45]" />
                <span>Thêm vào giỏ hàng ({totalPrice.toLocaleString('vi-VN')}₫)</span>
              </button>

              <Link
                href="/cart"
                className="py-3.5 px-6 rounded-xl bg-[#FAF5EC] hover:bg-[#E8DFC8] text-[#174C38] font-medium text-sm sm:text-base border border-[#E8DFC8] flex items-center justify-center gap-2 text-center transition-all"
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
    </div>
  );
}
