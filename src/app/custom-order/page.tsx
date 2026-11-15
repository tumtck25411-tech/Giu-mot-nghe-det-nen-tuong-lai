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
  QrCode,
  Palette,
  Layers,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Info,
  Check,
  Share2,
  Download,
  Flame,
} from 'lucide-react';
import { addToCart } from '@/lib/data-store';
import { Product } from '@/types';

// 1. PRODUCTS TO CUSTOMIZE
interface CustomProductType {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  days: string;
  image: string;
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
    image: '/images/products/c001.jpg',
    desc: 'Thiết kế phom gọn thanh lịch, quai dệt sợi đôi chắc chắn, nắp đậy gài nút gỗ thông rừng.',
    suggestedArtisan: 'Nghệ nhân Rơ Châm Mril (Làng Kép)',
  },
  {
    id: 'khan-quang-co',
    name: 'Khăn Quàng Cổ Thổ Cẩm',
    category: 'Khăn',
    basePrice: 380000,
    days: '5 - 7 ngày dệt tay',
    image: '/images/products/k001.jpg',
    desc: 'Sợi bông Kơpăh mềm mại, giữ ấm mùa đông, hai đầu viền tua rua dệt sợi bazan truyền thống.',
    suggestedArtisan: 'Nghệ nhân Puih H’Lâm (Làng Phung)',
  },
  {
    id: 'vi-cam-tay',
    name: 'Ví Cầm Tay Thổ Cẩm',
    category: 'Ví',
    basePrice: 280000,
    days: '3 - 5 ngày dệt tay',
    image: '/images/products/vi001.jpg',
    desc: 'Kích thước vừa vặn đựng điện thoại, thẻ và tiền mặt, khóa kéo đồng mộc bền chắc.',
    suggestedArtisan: 'Nghệ nhân Siu H’Poi (Làng Kép)',
  },
  {
    id: 'ao-tho-cam',
    name: 'Áo Thổ Cẩm Nam/Nữ Truyền Thống',
    category: 'Áo',
    basePrice: 850000,
    days: '10 - 15 ngày dệt cửi hông',
    image: '/images/products/a001.jpg',
    desc: 'Phom áo cổ tròn xẻ ngực Jrai nguyên bản, dệt viền ngực và gấu áo hoa văn bảo vệ.',
    suggestedArtisan: 'Nghệ nhân Ksor H’Bia (Làng Mrông Yố)',
  },
  {
    id: 'vay-tho-cam',
    name: 'Váy Thổ Cẩm Lễ Hội Jrai',
    category: 'Váy',
    basePrice: 1200000,
    days: '12 - 18 ngày dệt cửi hông',
    image: '/images/products/v001.jpg',
    desc: 'Váy quấn nguyên khổ may đo theo vòng eo, kết tinh tinh hoa mẫu hệ và sợi chỉ tình yêu.',
    suggestedArtisan: 'Nghệ nhân Rơ Châm Mril (Làng Kép)',
  },
  {
    id: 'tap-de',
    name: 'Tạp Dề Thổ Cẩm Nghệ Thuật',
    category: 'Tạp dề',
    basePrice: 320000,
    days: '4 - 6 ngày dệt tay',
    image: '/images/products/td001.jpg',
    desc: 'Vải dệt dày dặn chống bám bụi, túi ngực thổ cẩm tiện dụng cho barista, nghệ nhân, đầu bếp.',
    suggestedArtisan: 'Nghệ nhân Rơ Lan H’Ngọc (Làng Phung)',
  },
  {
    id: 'tui-tote',
    name: 'Túi Tote Thổ Cẩm Đa Năng',
    category: 'Túi tote',
    basePrice: 350000,
    days: '6 - 8 ngày dệt tay',
    image: '/images/products/tt001.jpg',
    desc: 'Sức chứa rộng rãi đựng vừa laptop 14 inch, đáy túi lót gia cố dệt sợi chỉ đôi.',
    suggestedArtisan: 'Nghệ nhân Siu H’Poi (Làng Kép)',
  },
  {
    id: 'bau-nuoc',
    name: 'Bầu Nước Truyền Thống Bọc Thổ Cẩm',
    category: 'Bầu nước',
    basePrice: 250000,
    days: '3 - 4 ngày đan dệt',
    image: '/images/products/b001.jpg',
    desc: 'Quả bầu rừng phơi khô phủ sáp ong tự nhiên, quàng đai thổ cẩm phong thủy may mắn.',
    suggestedArtisan: 'Nghệ nhân Puih H’Lâm (Làng Phung)',
  },
];

// 2. HERITAGE NATURAL COLORS
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
    name: 'Xanh Chàm Đại Ngàn (Indigo Blue)',
    code: '#1E3A8A',
    badge: 'Lá Rơman Tự Nhiên',
    fee: 0,
    origin: 'Chiết xuất từ lá chàm Rơman ủ chum đất nung theo công thức cổ truyền Jrai.',
    meaning: 'Tượng trưng cho bầu trời Tây Nguyên lộng gió, sự bình yên và tâm hồn khoáng đạt.',
  },
  {
    id: 'do-bazan',
    name: 'Đỏ Đất Bazan (Bazan Red)',
    code: '#B9383A',
    badge: 'Vỏ Rễ Kơkơh Rừng',
    fee: 0,
    origin: 'Nấu từ vỏ rễ cây Kơkơh và đất sét đỏ bazan đồi Chư Păh.',
    meaning: 'Biểu trưng ngọn lửa thiêng sưởi ấm gian nhà sàn, lòng nhiệt huyết và đất mẹ.',
  },
  {
    id: 'tim-hoa-sim',
    name: 'Tím Hoa Sim (Wild Berry Purple)',
    code: '#7C3AED',
    badge: 'Quả Sim Rừng Mùa Khô',
    fee: 20000,
    origin: 'Chiết xuất từ quả sim rừng Chư Păh chín mọng thu hái vào đầu mùa khô.',
    meaning: 'Tượng trưng cho tình yêu chung thủy son sắt và vẻ đẹp dịu dàng của thiếu nữ buôn làng.',
  },
  {
    id: 'vang-sap-ong',
    name: 'Vàng Sáp Ong Rừng (Forest Gold)',
    code: '#D97706',
    badge: 'Củ Nghệ Rừng & Tro Củi',
    fee: 15000,
    origin: 'Sắc vàng óng ả từ củ nghệ rừng ngâm tro củi gỗ kơ-nia.',
    meaning: 'Ánh nắng ban mai xuyên qua tán rừng, sự trù phú no đủ và mùa màng bội thu.',
  },
  {
    id: 'trang-kopah',
    name: 'Trắng Bông Thô Kơpăh (Ivory White)',
    code: '#F8FAFC',
    badge: 'Bông Tự Nhiên Mộc',
    fee: 0,
    origin: 'Sợi bông Kơpăh hái tay tại bìa rừng Chư Păh, giữ trọn sắc trắng ngà không tẩy hóa chất.',
    meaning: 'Sự tinh khôi, chân phương và cội nguồn nguyên bản của đất trời Tây Nguyên.',
  },
  {
    id: 'den-mun',
    name: 'Đen Mun Than Củi (Midnight Charcoal)',
    code: '#18181B',
    badge: 'Than Gỗ & Bùn Non',
    fee: 10000,
    origin: 'Nhuộm từ than củi gỗ rừng ngâm trong bùn non suối Ia Mơ Nông.',
    meaning: 'Đêm đại ngàn huyền bí, sự trầm mặc, bền gan và kiên định của đồng bào.',
  },
];

// 3. JRAI TRADITIONAL MOTIFS
interface CustomMotifType {
  id: string;
  name: string;
  codeName: string;
  fee: number;
  image: string;
  meaning: string;
  provenance: string;
}

const CUSTOM_MOTIFS: CustomMotifType[] = [
  {
    id: 'con-ga',
    name: 'Con Gà Rừng (Kơkơh)',
    codeName: 'MOTIF-CHICKEN',
    fee: 30000,
    image: '/images/motifs/con-ga.png',
    meaning: 'Tiếng gà rừng gáy gọi bình minh, xua tan đêm đen mịt mù, đón nhận vận khí an lành và sự khởi đầu hanh thông.',
    provenance: 'Hoa văn tiêu biểu truyền khẩu tại Làng Kép & Làng Phung.',
  },
  {
    id: 'hoa-mao-ga',
    name: 'Hoa Mào Gà (Rơkơh)',
    codeName: 'MOTIF-CELOSIA',
    fee: 40000,
    image: '/images/motifs/hoa-mao-ga.png',
    meaning: 'Sức sống kiên cường, vẻ đẹp rực rỡ và nét duyên dáng không bao giờ lụi tàn của người phụ nữ Tây Nguyên.',
    provenance: 'Thường xuất hiện trên dải ngực váy lễ hội của các thiếu nữ Jrai.',
  },
  {
    id: 'doi-lua',
    name: 'Hoa Văn Đôi Lứa (Gắn Kết Buôn Làng)',
    codeName: 'MOTIF-COUPLE',
    fee: 50000,
    image: '/images/motifs/doi-lua.png',
    meaning: 'Tình yêu thủy chung, sự hòa hợp lứa đôi và sợi dây liên kết bền chặt giữa hai dòng họ theo chế độ mẫu hệ.',
    provenance: 'Hoa văn độc bản trên mẫu váy cưới và khăn quàng lễ hỏi.',
  },
  {
    id: 'song-am-cong-chieng',
    name: 'Sóng Âm Cồng Chiêng (Gong Waves)',
    codeName: 'MOTIF-GONG',
    fee: 45000,
    image: '/images/motifs/hinh-hoc.png',
    meaning: 'Nhịp đập của cội nguồn, tiếng vang chiêng cồng nối liền trần thế với thần linh Yang, ban phước lành cho buôn làng.',
    provenance: 'Hoa văn nhịp điệu dệt sợi đỏ bazan viền quanh vạt áo.',
  },
  {
    id: 'rang-cua-bao-ve',
    name: 'Răng Cưa Bảo Vệ (Sawtooth Shield)',
    codeName: 'MOTIF-SAWTOOTH',
    fee: 35000,
    image: '/images/motifs/cay-tre.png',
    meaning: 'Khiên chắn tâm linh của núi rừng, xua đuổi tà khí và bảo bọc bình an cho người mặc trên mọi chặng đường.',
    provenance: 'Hoa văn đường viền kinh điển trên toàn bộ trang phục Jrai.',
  },
  {
    id: 'cay-neu-yang',
    name: 'Cây Nêu Thần Linh (Cay Neu Yang)',
    codeName: 'MOTIF-TREE',
    fee: 55000,
    image: '/images/motifs/cay-neu-yang.jpg',
    meaning: 'Cột trụ vũ trụ nối trời và đất trong lễ hội đâm trâu tạ ơn thần linh, cầu mong mùa màng bội thu và sức khỏe dồi dào.',
    provenance: 'Mô-típ trang trọng bậc nhất của nghệ nhân Chư Păh.',
  },
];

// BẢN DỰNG 3D STUDIO DO AI TẠO CHO TỪNG PHÂN LOẠI (RAY-TRACED 3D CGI - KHÔNG ÁM MÀU FILTER)
const PRODUCT_3D_RENDERS: Record<string, string> = {
  'tui-deo-cheo': '/images/custom/3d_bag_studio.jpg',
  'khan-quang-co': '/images/custom/3d_scarf_studio.jpg',
  'vi-cam-tay': '/images/custom/3d_wallet_studio.jpg',
  'ao-tho-cam': '/images/custom/3d_vest_studio.jpg',
  'vay-tho-cam': '/images/custom/3d_skirt_studio.jpg',
  'tap-de': '/images/custom/3d_apron_studio.jpg',
  'tui-tote': '/images/custom/3d_tote_studio.jpg',
  'bau-nuoc': '/images/custom/3d_gourd_studio.jpg',
};

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

  // 3D AI Studio Mode: '3d' (Bản dựng 3D AI Studio) | 'real' (Ảnh thực địa)
  const [previewMode, setPreviewMode] = useState<'3d' | 'real'>('3d');
  const [isRendering, setIsRendering] = useState<boolean>(false);

  const handleSelectProduct = (prod: CustomProductType) => {
    setSelectedProduct(prod);
    setIsRendering(true);
    setTimeout(() => setIsRendering(false), 300);
  };

  const handleSelectColor = (col: CustomColorType) => {
    setSelectedColor(col);
    setIsRendering(true);
    setTimeout(() => setIsRendering(false), 250);
  };

  const handleSelectMotif = (mot: CustomMotifType) => {
    setSelectedMotif(mot);
    setIsRendering(true);
    setTimeout(() => setIsRendering(false), 250);
  };

  // Cart Notice
  const [addedNotice, setAddedNotice] = useState<string | null>(null);
  const [isDemoGenerated, setIsDemoGenerated] = useState<boolean>(true);

  // Calculate dynamic price
  const totalPrice = useMemo(() => {
    return selectedProduct.basePrice + selectedColor.fee + selectedMotif.fee;
  }, [selectedProduct, selectedColor, selectedMotif]);

  // Unique custom product code
  const customSku = useMemo(() => {
    return `JRAI-BESPOKE-${selectedProduct.id.slice(0, 3).toUpperCase()}-${selectedColor.id.slice(0, 2).toUpperCase()}`;
  }, [selectedProduct, selectedColor]);

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
      image_url: selectedProduct.image,
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
    setAddedNotice(`Đã thêm thiết kế cá nhân hóa "${bespokeProduct.name}" vào giỏ hàng!`);
    setTimeout(() => setAddedNotice(null), 4000);
  };

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 py-10 space-y-10">
      {/* Toast Notification */}
      {addedNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#B9383A] text-white px-6 py-4 rounded-2xl shadow-sm border border-amber-400/50 flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-6 h-6 text-amber-300 shrink-0" />
          <div>
            <div className="text-xs font-bold">{addedNotice}</div>
            <Link href="/cart" className="text-xs underline font-bold text-amber-200 hover:text-white">
              Xem giỏ hàng & thanh toán &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* 1. HERO BANNER */}
      <div className="bg-[#F2ECE1] p-8 sm:p-12 rounded-xl border border-[#E5DACB] border-b-2 border-b-[#EA8E23] relative overflow-hidden shadow-sm text-center">
        <div className="max-w-3xl mx-auto space-y-3 relative z-10">
          <span className="section-tag gold">
            <Sparkles className="w-3.5 h-3.5 inline mr-1 text-[#EA8E23]" />
            <span>AI STUDIO • ĐẶT DỆT THỔ CẨM THEO YÊU CẦU</span>
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#1F1D1B] tracking-tight leading-tight">
            TỰ TAY THIẾT KẾ DI SẢN CỦA RIÊNG BẠN
          </h1>

          <p className="text-[#5D554D] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Chọn sản phẩm bạn muốn làm theo yêu cầu, phối sắc màu tự nhiên, chọn hoa văn thổ cẩm Jrai và ngắm nhìn bản demo mô phỏng bằng công nghệ AI cùng báo giá chi tiết minh bạch.
          </p>
        </div>

        {/* 4-STEP WIZARD PROGRESS BAR */}
        <div className="mt-8 pt-6 border-t border-[#E5DACB] max-w-3xl mx-auto">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {[
              { num: 1, title: '1. Chọn sản phẩm' },
              { num: 2, title: '2. Chọn màu sắc' },
              { num: 3, title: '3. Chọn hoa văn' },
              { num: 4, title: '4. Demo AI & Giá' },
            ].map((step) => {
              const isCurrent = currentStep === step.num;
              const isPast = currentStep > step.num;
              return (
                <button
                  key={step.num}
                  onClick={() => setCurrentStep(step.num)}
                  className={`py-2 px-1 rounded-xl transition font-bold flex flex-col items-center gap-1 ${
                    isCurrent
                      ? 'bg-[#C43B3D] text-white shadow-md'
                      : isPast
                      ? 'bg-[#F2ECE1] text-[#1F1D1B] border border-[#E5DACB] hover:bg-[#E5DACB]'
                      : 'bg-[#FBF8F3] text-[#8A7E72] border border-[#E5DACB] hover:text-[#1F1D1B]'
                  }`}
                >
                  <span className="text-xs opacity-80">BƯỚC 0{step.num}</span>
                  <span className="hidden sm:inline text-xs truncate max-w-full">{step.title}</span>
                  <span className="sm:hidden text-xs">{step.num}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. MAIN WIZARD CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: SELECTION STEPS (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: CHỌN LOẠI SẢN PHẨM */}
          {currentStep === 1 && (
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E5DACB] shadow-sm space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-[#E5DACB] pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-[#EA8E23] uppercase tracking-wider">
                    BƯỚC 1 TRÊN 4
                  </span>
                  <h2 className="text-xl font-serif font-black text-[#1F1D1B] mt-0.5">
                    Chọn loại sản phẩm muốn làm theo yêu cầu
                  </h2>
                </div>
                <span className="text-xs text-[#5D554D]">8 phân loại</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CUSTOM_PRODUCTS.map((prod) => {
                  const isSelected = selectedProduct.id === prod.id;
                  return (
                    <div
                      key={prod.id}
                      onClick={() => handleSelectProduct(prod)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 group ${
                        isSelected
                          ? 'bg-[#FDF6ED] border-[#EA8E23] shadow-md ring-2 ring-[#EA8E23]/20'
                          : 'bg-[#FBF8F3] border-[#E5DACB] hover:border-[#C43B3D] hover:bg-white'
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0 border border-[#E5DACB]">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold uppercase text-white bg-[#C43B3D] px-2 py-0.5 rounded">
                              {prod.category}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-[#EA8E23] shrink-0" />
                            )}
                          </div>
                          <h3 className="font-serif font-bold text-sm text-[#1F1D1B] mt-1 line-clamp-1">
                            {prod.name}
                          </h3>
                          <p className="text-xs text-[#5D554D] line-clamp-2 mt-1">
                            {prod.desc}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#E5DACB] flex items-center justify-between text-xs">
                        <span className="text-[#5D554D] text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#EA8E23]" />
                          <span>{prod.days}</span>
                        </span>
                        <span className="font-bold text-[#C43B3D] font-mono text-sm">
                          {prod.basePrice.toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4 border-t border-[#E5DACB]">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 rounded-xl bg-[#C43B3D] hover:bg-[#8A2325] text-white font-bold text-xs shadow-md flex items-center gap-2"
                >
                  <span>Tiếp tục: Chọn màu sắc</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CHỌN MÀU SẮC */}
          {currentStep === 2 && (
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E5DACB] shadow-sm space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-[#E5DACB] pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-[#EA8E23] uppercase tracking-wider">
                    BƯỚC 2 TRÊN 4
                  </span>
                  <h2 className="text-xl font-serif font-black text-[#1F1D1B] mt-0.5">
                    Chọn màu sắc chủ đạo (Nhuộm tự nhiên di sản)
                  </h2>
                </div>
                <span className="text-xs text-[#5D554D]">6 sắc màu rừng</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CUSTOM_COLORS.map((col) => {
                  const isSelected = selectedColor.id === col.id;
                  return (
                    <div
                      key={col.id}
                      onClick={() => handleSelectColor(col)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                        isSelected
                          ? 'bg-[#FDF6ED] border-[#EA8E23] shadow-md ring-2 ring-[#EA8E23]/20'
                          : 'bg-[#FBF8F3] border-[#E5DACB] hover:border-[#C43B3D] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full border-2 border-white shadow-md shrink-0"
                            style={{ backgroundColor: col.code }}
                          />
                          <div>
                            <h3 className="font-bold text-xs text-[#1F1D1B]">{col.name}</h3>
                            <span className="text-xs text-[#EA8E23] font-medium">{col.badge}</span>
                          </div>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#EA8E23] shrink-0" />}
                      </div>

                      <p className="text-xs text-[#5D554D] leading-relaxed">{col.origin}</p>
                      <p className="text-xs text-[#8A7E72] italic">&ldquo;{col.meaning}&rdquo;</p>

                      <div className="pt-2 border-t border-[#E5DACB] flex items-center justify-between text-xs">
                        <span className="text-[#5D554D] text-xs">Phụ thu nhuộm:</span>
                        <span className="font-bold text-[#C43B3D] font-mono">
                          {col.fee === 0 ? 'Miễn phí di sản' : `+${col.fee.toLocaleString('vi-VN')}₫`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#E5DACB]">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2.5 rounded-xl bg-[#F2ECE1] hover:bg-[#E5DACB] text-[#1F1D1B] font-bold text-xs flex items-center gap-1.5 border border-[#E5DACB]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 rounded-xl bg-[#C43B3D] hover:bg-[#8A2325] text-white font-bold text-xs shadow-md flex items-center gap-2"
                >
                  <span>Tiếp tục: Chọn hoa văn</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CHỌN HOA VĂN THỔ CẨM */}
          {currentStep === 3 && (
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E5DACB] shadow-sm space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-[#E5DACB] pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-[#EA8E23] uppercase tracking-wider">
                    BƯỚC 3 TRÊN 4
                  </span>
                  <h2 className="text-xl font-serif font-black text-[#1F1D1B] mt-0.5">
                    Chọn hoa văn thổ cẩm Jrai thủ công
                  </h2>
                </div>
                <span className="text-xs text-[#5D554D]">6 hoa văn di sản</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CUSTOM_MOTIFS.map((mot) => {
                  const isSelected = selectedMotif.id === mot.id;
                  return (
                    <div
                      key={mot.id}
                      onClick={() => handleSelectMotif(mot)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 group ${
                        isSelected
                          ? 'bg-[#FDF6ED] border-[#EA8E23] shadow-md ring-2 ring-[#EA8E23]/20'
                          : 'bg-[#FBF8F3] border-[#E5DACB] hover:border-[#C43B3D] hover:bg-white'
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#FBF8F3] p-1.5 shrink-0 border border-[#E5DACB] flex items-center justify-center">
                          <img
                            src={mot.image}
                            alt={mot.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-serif font-bold text-sm text-[#1F1D1B]">{mot.name}</h3>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-[#EA8E23] shrink-0" />}
                          </div>
                          <span className="text-xs text-[#EA8E23] font-mono block mt-0.5">
                            {mot.codeName}
                          </span>
                          <p className="text-xs text-[#5D554D] line-clamp-2 mt-1">
                            {mot.meaning}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#E5DACB] flex items-center justify-between text-xs">
                        <span className="text-[#8A7E72] text-xs truncate max-w-[150px]">
                          {mot.provenance}
                        </span>
                        <span className="font-bold text-[#C43B3D] font-mono">
                          +{mot.fee.toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Note input */}
              <div className="pt-4 border-t border-[#E5DACB] space-y-2">
                <label className="text-xs font-bold text-[#1F1D1B] block">
                  Ghi chú riêng cho nghệ nhân dệt (kích thước, thêu chữ, yêu cầu đặc biệt):
                </label>
                <textarea
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Ví dụ: Vòng eo 68cm, quai túi dài 105cm, thêu thêm chữ viết tắt tên Cẩm Tú..."
                  rows={2}
                  className="w-full p-3 bg-[#FBF8F3] border border-[#E5DACB] rounded-xl text-xs text-[#1F1D1B] placeholder-[#8A7E72] focus:outline-none focus:border-[#C43B3D] focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#E5DACB]">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 rounded-xl bg-[#F2ECE1] hover:bg-[#E5DACB] text-[#1F1D1B] font-bold text-xs flex items-center gap-1.5 border border-[#E5DACB]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-3 rounded-xl bg-[#C43B3D] hover:bg-[#8A2325] text-white font-bold text-xs shadow-md flex items-center gap-2"
                >
                  <span>Xem Demo AI & Báo giá</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: XEM BẢN DEMO AI & ĐẶT HÀNG */}
          {currentStep === 4 && (
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E5DACB] shadow-sm space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-[#E5DACB] pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-[#EA8E23] uppercase tracking-wider">
                    BƯỚC 4 TRÊN 4 • HOÀN THIỆN
                  </span>
                  <h2 className="text-xl font-serif font-black text-[#1F1D1B] mt-0.5">
                    Xác nhận cấu hình & Thông tin đặt dệt
                  </h2>
                </div>
                <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <Check className="w-4 h-4 text-emerald-600" /> Bản vẽ AI Đã Khóa
                </span>
              </div>

              {/* Summary Specs */}
              <div className="bg-[#FBF8F3] p-5 rounded-2xl border border-[#E5DACB] space-y-3">
                <div className="flex justify-between items-center text-xs text-[#5D554D] border-b border-[#E5DACB] pb-2">
                  <span>Sản phẩm:</span>
                  <span className="font-bold text-[#1F1D1B]">{selectedProduct.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-[#5D554D] border-b border-[#E5DACB] pb-2">
                  <span>Màu sắc chủ đạo:</span>
                  <span className="font-bold flex items-center gap-1.5 text-[#1F1D1B]">
                    <span
                      className="w-3.5 h-3.5 rounded-full inline-block border border-[#E5DACB]"
                      style={{ backgroundColor: selectedColor.code }}
                    />
                    {selectedColor.name}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-[#5D554D] border-b border-[#E5DACB] pb-2">
                  <span>Hoa văn dệt tay:</span>
                  <span className="font-bold text-[#EA8E23]">{selectedMotif.name}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-[#5D554D] border-b border-[#E5DACB] pb-2">
                  <span>Nghệ nhân phụ trách:</span>
                  <span className="font-bold text-[#1F1D1B]">{selectedProduct.suggestedArtisan}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-[#5D554D]">
                  <span>Thời gian dệt ước tính:</span>
                  <span className="font-bold text-[#EA8E23]">{selectedProduct.days}</span>
                </div>
              </div>

              {/* Orderer Contact Info */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-[#1F1D1B] uppercase tracking-wider">
                  Thông tin người đặt (để gửi cập nhật tiến độ dệt):
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Họ tên của bạn *"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="p-3 bg-[#FBF8F3] border border-[#E5DACB] rounded-xl text-xs text-[#1F1D1B] placeholder-[#8A7E72] focus:outline-none focus:border-[#C43B3D] focus:bg-white"
                  />
                  <input
                    type="tel"
                    placeholder="Số điện thoại nhận hàng *"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="p-3 bg-[#FBF8F3] border border-[#E5DACB] rounded-xl text-xs text-[#1F1D1B] placeholder-[#8A7E72] focus:outline-none focus:border-[#C43B3D] focus:bg-white"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#E5DACB] flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddCustomToCart}
                  className="flex-1 py-3.5 rounded-xl bg-[#C43B3D] hover:bg-[#8A2325] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-200" />
                  <span>THÊM VÀO GIỎ HÀNG ({totalPrice.toLocaleString('vi-VN')}₫)</span>
                </button>

                <Link
                  href="/cart"
                  className="py-3.5 px-6 rounded-xl bg-[#F2ECE1] hover:bg-[#E5DACB] text-[#1F1D1B] font-bold text-xs border border-[#E5DACB] flex items-center justify-center gap-2 text-center transition"
                >
                  <span>Đi tới Giỏ Hàng</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex justify-between items-center text-xs pt-2">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="text-[#5D554D] hover:text-[#C43B3D] underline"
                >
                  &larr; Chỉnh sửa hoa văn
                </button>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-[#5D554D] hover:text-[#C43B3D] underline"
                >
                  Chọn lại từ đầu
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: AI PREVIEW VISUALIZER CARD (5 COLS) */}
        <div className="lg:col-span-5 sticky top-28 space-y-6">
          <div className="bg-white p-6 rounded-xl border-2 border-[#EA8E23] shadow-sm relative overflow-hidden">
            {/* Visualizer Header: Mode Switcher & Sku */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-1 bg-[#F2ECE1] p-1 rounded-xl border border-[#E5DACB]">
                <button
                  type="button"
                  onClick={() => setPreviewMode('3d')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    previewMode === '3d'
                      ? 'bg-[#C43B3D] text-white shadow-xs'
                      : 'text-[#5D554D] hover:text-[#1F1D1B]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Ảnh 3D AI Studio</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('real')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    previewMode === 'real'
                      ? 'bg-[#C43B3D] text-white shadow-xs'
                      : 'text-[#5D554D] hover:text-[#1F1D1B]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Ảnh Mẫu Thật</span>
                </button>
              </div>

              <span className="text-xs font-mono text-[#5D554D] bg-[#FBF8F3] px-2.5 py-1 rounded-lg border border-[#E5DACB]">
                {customSku}
              </span>
            </div>

            {/* AI 3D STUDIO VISUALIZATION CANVAS - CHUẨN 3D DO AI TẠO, KHÔNG ÁM MÀU */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#181411] border border-[#E5DACB] shadow-md group">
              {/* Product Visual: 3D Studio Render or Real Photo */}
              <img
                src={previewMode === '3d' ? (PRODUCT_3D_RENDERS[selectedProduct.id] || selectedProduct.image) : selectedProduct.image}
                alt={`${selectedProduct.name} - Mô phỏng 3D AI`}
                className={`w-full h-full object-cover transition-all duration-500 ${isRendering ? 'opacity-40 scale-95 blur-xs' : 'opacity-100 scale-100'}`}
              />

              {/* Rendering State Overlay */}
              {isRendering && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-white z-20">
                  <Sparkles className="w-6 h-6 text-amber-400 animate-spin" />
                  <span className="text-xs font-bold text-amber-200">Đang dựng mô phỏng 3D AI Studio...</span>
                </div>
              )}

              {/* Subtle Studio Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

              {/* Top Left: 3D Engine Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-amber-400/40 text-[11px] text-amber-200 font-bold shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{previewMode === '3d' ? '3D AI Studio Render' : 'Ảnh Phôi Sản Phẩm'}</span>
              </div>

              {/* Top Right: Motif Overlay Pill Badge */}
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md rounded-xl p-2 border border-[#EA8E23] flex items-center gap-2 shadow-lg max-w-[170px]">
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#FBF8F3] p-1 shrink-0 flex items-center justify-center border border-[#E5DACB]">
                  <img
                    src={selectedMotif.image}
                    alt={selectedMotif.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-[9px] uppercase tracking-wider text-[#EA8E23] font-bold truncate">
                    Hoa văn đã chọn
                  </div>
                  <div className="text-xs font-bold text-[#1F1D1B] truncate">
                    {selectedMotif.name}
                  </div>
                </div>
              </div>

              {/* Selected Color Pill on Canvas */}
              <div className="absolute bottom-11 left-3 flex items-center gap-2 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs text-white shadow-md">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white shadow-sm shrink-0"
                  style={{ backgroundColor: selectedColor.code }}
                />
                <span className="font-semibold text-stone-200">{selectedColor.name.split(' (')[0]}</span>
              </div>

              {/* Bottom Canvas Caption */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs bg-black/70 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/20">
                <span className="font-medium truncate max-w-[210px] text-stone-200">
                  ✨ Mô phỏng tỷ lệ dệt cửi hông 100%
                </span>
                <span className="text-amber-300 font-bold font-mono">
                  {selectedProduct.days.split(' ')[0]} NGÀY
                </span>
              </div>
            </div>

            {/* AI Render Re-generate trigger button */}
            <div className="mt-3 flex justify-between items-center text-xs">
              <button
                type="button"
                onClick={() => {
                  setIsRendering(true);
                  setTimeout(() => setIsRendering(false), 400);
                }}
                className="text-xs font-bold text-[#C43B3D] hover:underline flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tạo lại bản dựng 3D AI</span>
              </button>
              <span className="text-[11px] text-[#8A7E72]">
                Công nghệ: Octane 3D Studio Mockup
              </span>
            </div>

            {/* LIVE PRICE BREAKDOWN */}
            <div className="mt-5 pt-4 border-t border-[#E5DACB] space-y-2.5">
              <div className="text-xs font-bold text-[#EA8E23] uppercase tracking-wider">
                Bảng Kê Chi Phí Minh Bạch:
              </div>

              <div className="space-y-1.5 text-xs text-[#5D554D]">
                <div className="flex justify-between">
                  <span>Phôi dệt & công thợ ({selectedProduct.name}):</span>
                  <span className="font-mono font-bold text-[#1F1D1B]">
                    {selectedProduct.basePrice.toLocaleString('vi-VN')}₫
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Kỹ thuật dệt hoa văn ({selectedMotif.name}):</span>
                  <span className="font-mono font-bold text-[#1F1D1B]">
                    +{selectedMotif.fee.toLocaleString('vi-VN')}₫
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Chi phí nhuộm tự nhiên ({selectedColor.name.split(' ')[0]}):</span>
                  <span className="font-mono font-bold text-[#1F1D1B]">
                    {selectedColor.fee === 0 ? '0₫ (Miễn phí)' : `+${selectedColor.fee.toLocaleString('vi-VN')}₫`}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5DACB] flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-[#8A7E72] uppercase tracking-wider block font-bold">
                    TỔNG GIÁ TIỀN HOÀN THIỆN:
                  </span>
                  <span className="text-xs text-emerald-700 font-medium">
                    Đã bao gồm tem mã QR & bảo chứng nghệ nhân
                  </span>
                </div>
                <div className="text-2xl font-black text-[#C43B3D] font-serif">
                  {totalPrice.toLocaleString('vi-VN')}₫
                </div>
              </div>
            </div>

            {/* ARTISAN COMMITMENT BADGE */}
            <div className="mt-5 p-3.5 bg-[#FBF8F3] rounded-xl border border-[#E5DACB] text-xs text-[#5D554D] space-y-1.5">
              <div className="flex items-center gap-2 text-[#EA8E23] font-bold">
                <ShieldCheck className="w-4 h-4 text-[#EA8E23] shrink-0" />
                <span>Cam kết chuẩn di sản SVTHM 2026:</span>
              </div>
              <p className="text-xs text-[#5D554D] leading-relaxed">
                Mỗi sản phẩm cá nhân hóa đều được cấp 01 tem mã QR số hóa truy xuất trực tiếp tên nghệ nhân làng nghề, số giờ dệt và chứng thực nguồn gốc bông Kơpăh tự nhiên tại Chư Păh, Gia Lai.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
