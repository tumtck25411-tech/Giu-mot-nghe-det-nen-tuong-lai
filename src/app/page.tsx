'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Grid,
  Users,
  User,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Clock,
  MapPin,
  QrCode,
  ArrowRight,
  ShoppingBag,
  Heart,
  Star,
  CheckCircle2,
  Compass,
  Bookmark,
  Layers,
  X,
  CreditCard,
  Truck,
  Plus,
  Minus,
  Trash2,
  Download,
  Printer,
  Copy,
  Check,
  Filter,
  Tag,
  Eye,
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '@/lib/initial-data';
import {
  getProducts,
  getMotifs,
  getArtisans,
  getReviews,
  getWeavingSteps,
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
  getCartTotal,
  toggleWishlist,
  isInWishlist,
  syncWithServer,
  createOrder,
  getCustomerSession,
} from '@/lib/data-store';
import { Product, Motif, Artisan, Review, WeavingStep, CartItem, CustomerUser } from '@/types';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import CustomerAuthModal from '@/components/CustomerAuthModal';

const CATEGORIES_METADATA = [
  { id: 'all', name: 'Tất cả (57)', label: 'Tất cả', count: 57, filterKey: 'all' },
  { id: 'scarf', name: 'Khăn quàng cổ (28)', label: 'Khăn quàng cổ', count: 28, filterKey: 'scarf' },
  { id: 'crossbag', name: 'Túi đeo chéo (9)', label: 'Túi đeo chéo', count: 9, filterKey: 'crossbag' },
  { id: 'wallet', name: 'Ví cầm tay (7)', label: 'Ví cầm tay', count: 7, filterKey: 'wallet' },
  { id: 'apron', name: 'Tạp dề (5)', label: 'Tạp dề', count: 5, filterKey: 'apron' },
  { id: 'tote', name: 'Túi tote (3)', label: 'Túi tote', count: 3, filterKey: 'tote' },
  { id: 'dress', name: 'Váy nữ (2)', label: 'Váy nữ', count: 2, filterKey: 'dress' },
  { id: 'shirt', name: 'Áo nam (2)', label: 'Áo nam', count: 2, filterKey: 'shirt' },
  { id: 'gourd', name: 'Bầu nước (1)', label: 'Bầu nước', count: 1, filterKey: 'gourd' },
];

const FOUNDING_TEAM = [
  {
    name: 'Huỳnh Diệp Cẩm Tú',
    role: 'Phụ Trách Pháp Lý & Đối Ngoại',
    badge: 'LEGAL',
    image: '/images/team/HuynhDiepCamTu_brocade.png',
    desc: 'Bảo vệ quyền sở hữu trí tuệ hoa văn truyền thống, hợp đồng thương mại công bằng và kết nối buôn làng.',
  },
  {
    name: 'Nguyễn Ngọc Nữ',
    role: 'Trưởng Ban Du Lịch Sinh Thái & Bản Địa',
    badge: 'TOURISM',
    image: '/images/team/NguyenNgocNu_brocade.png',
    desc: 'Phụ trách trải nghiệm bản địa, kết nối làng du lịch cộng đồng Ia Mơ Nông & lan tỏa văn hóa thổ cẩm Jrai.',
  },
  {
    name: 'Mai Thị Cẩm Tú',
    role: 'Lead / Trưởng Nhóm Dự Án',
    badge: 'LEAD',
    image: '/images/team/MaiThiCamTu_brocade.png',
    desc: 'Điều phối tổng thể, nghiên cứu mô hình kinh doanh xã hội & kết nối hợp tác buôn làng.',
  },
  {
    name: 'Đinh Sĩ Doãn Đăng',
    role: 'Phụ Trách Truyền Thông & Hình Ảnh',
    badge: 'MEDIA',
    image: '/images/team/DinhSiDoanDang_brocade.png',
    desc: 'Xây dựng chiến lược truyền thông thị giác, kể câu chuyện di sản qua lăng kính nhiếp ảnh và thương hiệu.',
  },
  {
    name: 'Phạm Nguyễn Thảo Nhi',
    role: 'Phụ Trách Vận Hành & Khách Hàng',
    badge: 'OPS',
    image: '/images/team/PhamNguyenThaoNhi_brocade.png',
    desc: 'Tối ưu hóa quy trình tiếp nhận đơn hàng may đo thủ công, điều phối chuỗi cung ứng sợi bông buôn làng và trải nghiệm khách hàng.',
  },
];

const WEAVING_STAGES_FULL = [
  {
    step: '01',
    stage: 'CHẶNG 01 • BÌA RỪNG CHƯ PĂH',
    numLabel: 'BƯỚC 01 / NGUYÊN LIỆU MỘC',
    title: 'Thu Hái Bông Kơpăh Tự Nhiên',
    subtitle: 'Mùa khô Tây Nguyên • Thu hái hoàn toàn thủ công',
    image: '/images/weaving/step-1.jpg',
    pills: ['⏱️ Tháng 11 - 12 (Mùa khô)', '📍 Rừng Kơpăh Ia Mơ Nông', '🌿 100% Bông tự nhiên'],
    desc: 'Vào khoảng tháng 11 - 12 hàng năm, phụ nữ Jrai lên nương rẫy và bìa rừng Chư Păh thu hái những quả bông tự nhiên vừa bung nở trắng muốt, giữ trọn vẹn độ tơi xốp và tinh khiết của đất trời đại ngàn.',
  },
  {
    step: '02',
    stage: 'CHẶNG 02 • BÊN HIÊN NHÀ SÀN',
    numLabel: 'BƯỚC 02 / BẬT BÔNG & KÉO SỢI',
    title: 'Cán Bông & Kéo Sợi Mộc',
    subtitle: 'Tách hạt gỗ truyền thống • Se sợi con sâu đều đặn',
    image: '/images/weaving/step-2.jpg',
    pills: ['⏱️ 2 - 3 ngày thao tác', '📍 Hiên nhà sàn truyền thống', '🪵 Trục cán gỗ & Xa quay tay'],
    desc: 'Tách sạch hạt bằng trục cán gỗ mộc mạc, vò bông thành từng búp mịn rồi dùng ống quay xa bằng tay để kéo thành những cuộn sợi chỉ dai chắc, bền bỉ và đều đặn theo từng nhịp quay nhịp nhàng.',
  },
  {
    step: '03',
    stage: 'CHẶNG 03 • NỒI NHUỘM BẢN ĐỊA',
    numLabel: 'BƯỚC 03 / SẮC MÀU THẢO MỘC',
    title: 'Nhuộm Thảo Mộc Rừng Tự Nhiên',
    subtitle: 'Lá chàm mun, vỏ cây Klét, rễ Knung • 0% hóa chất',
    image: '/images/weaving/step-5.jpg',
    pills: ['⏱️ 5 - 7 ngày ngâm ủ', '📍 Làng Kép, Chư Păh', '🍃 Chàm mun, Klét, Knung'],
    desc: "Nấu nước lá chàm mun (T'râm) tạo sắc đen huyền bí, vỏ cây Klét đun sôi cho màu đỏ đất bazan, rễ cây Knung cho sắc vàng tươi ấm áp. Từng cuộn sợi được ngâm ủ kỹ lưỡng nhiều ngày đêm dưới nắng gió.",
  },
  {
    step: '04',
    stage: 'CHẶNG 04 • CỬI HÔNG TRUYỀN THỐNG',
    numLabel: 'BƯỚC 04 / KHUNG CỬI DỆT HÔNG',
    title: 'Mắc Khung Cửi Hông (Backstrap Loom)',
    subtitle: 'Cố định đai lưng • Tạo lực căng bằng chính cơ thể',
    image: '/images/weaving/step-7.jpg',
    pills: ['⏱️ 1 ngày mắc cửi', '📍 Đai lưng nghệ nhân', '🧵 Căng sợi tự nhiên'],
    desc: 'Khác biệt hoàn toàn với cửi đứng công nghiệp, khung cửi hông Jrai được cố định bằng đai da áp sát lưng nghệ nhân. Độ ngả người và lực đẩy đôi chân tạo nên độ căng tự nhiên hoàn hảo cho từng sợi dọc.',
  },
  {
    step: '05',
    stage: 'CHẶNG 05 • TRUYỀN KHẨU KÝ ỨC',
    numLabel: 'BƯỚC 05 / TẠO TÁC HOA VĂN',
    title: 'Dệt Hoa Văn Độc Bản Theo Ký Ức',
    subtitle: 'Đếm từng sợi chỉ • Không bản vẽ in sẵn',
    image: '/images/weaving/step-9.jpg',
    pills: ['⏱️ 10 - 20 ngày dệt tay', '📍 Làng Phung & Làng Kép', '✨ Ký ức mẫu hệ'],
    desc: 'Không cần sơ đồ trên giấy, nghệ nhân nhặt đếm từng sợi chỉ theo bài ca truyền khẩu của mẫu hệ. Hoa văn cánh bướm Kơkơh, sóng âm Chiêng cồng, Răng cưa bảo vệ hiện lên sắc sảo, sống động.',
  },
  {
    step: '06',
    stage: 'CHẶNG 06 • MINH BẠCH SỐ HÓA',
    numLabel: 'BƯỚC 06 / ĐỊNH DANH SỐ HÓA JRAI ƠI',
    title: 'Cấp Tem Mã QR Định Danh Di Sản',
    subtitle: 'Minh bạch nghệ nhân • Số giờ dệt • Ý nghĩa hoa văn',
    image: '/images/background/image5.jpg',
    pills: ['⏱️ Định danh số độc bản', '📍 CLB Dệt Ia Mơ Nông', '📱 Quét QR xem nghệ nhân'],
    desc: 'Tác phẩm dệt xong được kiểm định khắt khe và cấp một tem mác QR độc bản. Người mua dùng camera điện thoại quét mã là thấy ngay chân dung nghệ nhân, làng nghề Ia Mơ Nông và công sức dệt nên sản phẩm.',
  },
];

// 4 Curated Hero Background Slides with Authentic High-Resolution Photography
const HERO_SLIDES = [
  {
    image: '/images/custom/tay_nguyen_misty_mountain.jpg',
    caption: '✦ Sương sớm đại ngàn Chư Păh & thung lũng dệt thổ cẩm Ia Mơ Nông, Gia Lai',
    alt: 'Khung cảnh thiên nhiên sương mờ đại ngàn Chư Păh, Gia Lai',
  },
  {
    image: '/images/background/hero_jrai_stilt_house_weaving.jpg',
    caption: '✦ Không gian dệt cửi hông & kéo sợi bông bên hiên nhà sàn Jrai',
    alt: 'Các nghệ nhân Jrai dệt thổ cẩm và quay sợi bông bên hiên nhà sàn truyền thống',
  },
  {
    image: '/images/background/hero_bonfire_xoang_festival.jpg',
    caption: '✦ Đêm hội lửa thiêng buôn làng & vũ điệu Xoang quanh cây Nêu di sản',
    alt: 'Đêm hội lửa thiêng Tây Nguyên và điệu múa Xoang truyền thống quanh cây Nêu',
  },
  {
    image: '/images/background/hero_sacred_fire_gong_heritage.jpg',
    caption: '✦ Lửa thiêng Tây Nguyên & nhịp cồng chiêng di sản đại ngàn',
    alt: 'Lửa thiêng đại ngàn và không gian văn hóa cồng chiêng Tây Nguyên',
  },
  {
    image: '/images/background/image6.jpg',
    caption: '✦ Đội ngũ JRAI ƠI thực địa gìn giữ nghề dệt tại buôn làng Ia Mơ Nông, Gia Lai',
    alt: 'Đội ngũ JRAI ƠI khảo sát thực tế và làm việc cùng các nghệ nhân buôn làng',
  },
];

// 6 Curated Featured Brocade Products (Tu Quy Garden Inspired Showcase)
const FEATURED_SHOWCASE_CONFIG = [
  {
    code: 'K001',
    badge: { icon: '🔥', text: 'Bán chạy', bg: 'bg-[#B9383A]' },
    artisanNote: "Nghệ nhân H' Uyên Niê • Làng Kép",
    reviewCount: 48,
    rating: 5.0,
  },
  {
    code: 'C001',
    badge: { icon: '✨', text: 'Tiêu biểu', bg: 'bg-[#1E4D38]' },
    artisanNote: "Nghệ nhân Rơ Châm H'Mút • Làng Kép",
    reviewCount: 52,
    rating: 5.0,
  },
  {
    code: 'VI001',
    badge: { icon: '🔥', text: 'Bán chạy', bg: 'bg-[#B9383A]' },
    artisanNote: "Nghệ nhân Siu H'Blang • Làng Phung",
    reviewCount: 36,
    rating: 4.9,
  },
  {
    code: 'A001',
    badge: { icon: '👑', text: 'Tinh hoa', bg: 'bg-[#8A2325]' },
    artisanNote: "Nghệ nhân Rơ Châm H'Mút • Làng Kép",
    reviewCount: 29,
    rating: 5.0,
  },
  {
    code: 'V001',
    badge: { icon: '🌟', text: 'Kiệt tác', bg: 'bg-[#C59B27]' },
    artisanNote: "Nghệ nhân Siu H'Blang • Làng Phung",
    reviewCount: 31,
    rating: 5.0,
  },
  {
    code: 'B001',
    badge: { icon: '🌿', text: 'Bản địa', bg: 'bg-[#1E4D38]' },
    artisanNote: "Nghệ nhân Ksor H'Búp • Làng Kép",
    reviewCount: 24,
    rating: 4.9,
  },
];

export default function HomePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [motifs, setMotifs] = useState<Motif[]>([]);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [steps, setSteps] = useState<WeavingStep[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Hero carousel slide state
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  // Filter States for 57 Products
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [selectedArtisanFilter, setSelectedArtisanFilter] = useState('all');

  // Interactive Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedMotif, setSelectedMotif] = useState<Motif | null>(null);
  const [selectedArtisanModal, setSelectedArtisanModal] = useState<Artisan | null>(null);

  // Traceability Interactive State
  const [passportCode, setPassportCode] = useState('K001');
  const [passportProduct, setPassportProduct] = useState<Product | null>(null);

  // Cart Drawer State
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  // Curated Featured Products list for Tu Quy Garden style bottom section
  const featuredShowcaseList = React.useMemo(() => {
    const source = allProducts.length > 0 ? allProducts : INITIAL_PRODUCTS;
    return FEATURED_SHOWCASE_CONFIG.map((cfg) => {
      const product = source.find(
        (p) => p.product_code === cfg.code || p.id === cfg.code
      );
      return {
        ...cfg,
        product,
      };
    }).filter((item): item is typeof item & { product: Product } => Boolean(item.product));
  }, [allProducts]);

  // Checkout modal
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'banking'>('banking');
  const [orderCreatedId, setOrderCreatedId] = useState<string | null>(null);

  // Customer Auth state
  const [customerUser, setCustomerUser] = useState<CustomerUser | null>(null);
  const [customerAuthOpen, setCustomerAuthOpen] = useState(false);

  const refreshStoreData = () => {
    const prods = getProducts(true);
    setAllProducts(prods);
    setMotifs(getMotifs(true));
    setArtisans(getArtisans());
    setSteps(getWeavingSteps());
    setReviews(getReviews());
    setCartItems(getCart());

    const sess = getCustomerSession();
    setCustomerUser(sess);
    if (sess) {
      if (!customerName) setCustomerName(sess.name);
      if (!customerPhone) setCustomerPhone(sess.phone);
    }

    if (prods.length > 0 && !passportProduct) {
      const found = prods.find((p) => p.product_code.toLowerCase() === passportCode.toLowerCase()) || prods[0];
      setPassportProduct(found);
    }
  };

  const handleProceedToCheckout = () => {
    const session = getCustomerSession();
    setCartOpen(false);
    if (!session) {
      setCustomerAuthOpen(true);
    } else {
      setCustomerUser(session);
      if (!customerName) setCustomerName(session.name);
      if (!customerPhone) setCustomerPhone(session.phone);
      setCheckoutOpen(true);
    }
  };


  useEffect(() => {
    refreshStoreData();
    syncWithServer().then(() => refreshStoreData());

    window.addEventListener('jrai_store_updated', refreshStoreData);
    window.addEventListener('jrai_cart_updated', () => setCartItems(getCart()));
    return () => {
      window.removeEventListener('jrai_store_updated', refreshStoreData);
    };
  }, []);

  // Animated Counters for Hero Heritage Stats
  const [stat1, setStat1] = useState(0);
  const [stat2, setStat2] = useState(0);
  const [stat3, setStat3] = useState(0);
  const [stat4, setStat4] = useState(0);

  useEffect(() => {
    // Run counter animation on mount
    const duration = 1800;
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - (1 - progress) * (1 - progress);

      setStat1(Math.floor(easeProgress * 100));
      setStat2(Math.floor(easeProgress * 40));
      setStat3(Math.floor(easeProgress * 30));
      setStat4(Math.floor(easeProgress * 65));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);

    // Scroll reveal observer for all sections
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Auto-advance hero carousel slides every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextHeroSlide = () => setCurrentHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevHeroSlide = () => setCurrentHeroSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  // Update passport product when passportCode changes
  useEffect(() => {
    if (!passportCode || allProducts.length === 0) return;
    const found = allProducts.find(
      (p) =>
        p.product_code.toLowerCase() === passportCode.trim().toLowerCase() ||
        p.id.toLowerCase() === passportCode.trim().toLowerCase()
    );
    setPassportProduct(found || null);
  }, [passportCode, allProducts]);

  // Handle Add To Cart
  const handleAddToCart = (p: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addToCart(p, 1);
    setCartItems(getCart());
    setAddedNotice(`Đã thêm "${p.name}" vào giỏ hàng!`);
    setTimeout(() => setAddedNotice(null), 3500);
  };

  // Filter 57 Products
  const filteredProducts = allProducts.filter((p) => {
    if (selectedCategory !== 'all') {
      const catLower = (p.category || '').toLowerCase();
      const nameLower = (p.name || '').toLowerCase();
      if (selectedCategory === 'scarf' && !catLower.includes('scarf') && !nameLower.includes('khăn')) return false;
      if (selectedCategory === 'crossbag' && !catLower.includes('crossbag') && !nameLower.includes('đeo chéo')) return false;
      if (selectedCategory === 'wallet' && !catLower.includes('wallet') && !nameLower.includes('ví')) return false;
      if (selectedCategory === 'apron' && !catLower.includes('apron') && !nameLower.includes('tạp dề')) return false;
      if (selectedCategory === 'tote' && !catLower.includes('tote') && !nameLower.includes('tote')) return false;
      if (selectedCategory === 'dress' && !catLower.includes('dress') && !nameLower.includes('váy')) return false;
      if (selectedCategory === 'shirt' && !catLower.includes('shirt') && !nameLower.includes('áo')) return false;
      if (selectedCategory === 'gourd' && !catLower.includes('gourd') && !nameLower.includes('bầu')) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = p.name.toLowerCase().includes(q);
      const matchCode = p.product_code.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchDesc) return false;
    }

    if (priceRange !== 'all') {
      if (priceRange === 'under-300' && p.price >= 300000) return false;
      if (priceRange === '300-600' && (p.price < 300000 || p.price > 600000)) return false;
      if (priceRange === 'over-600' && p.price <= 600000) return false;
    }

    if (selectedArtisanFilter !== 'all' && p.artisan_id !== selectedArtisanFilter) {
      return false;
    }

    return true;
  });

  const cartTotal = getCartTotal();
  const freeShipThreshold = 500000;
  const isFreeShip = cartTotal.subtotal >= freeShipThreshold;

  // Handle Checkout Submit
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !shippingAddress) {
      alert('Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ giao hàng!');
      return;
    }

    const order = createOrder({
      customerName,
      customerPhone,
      shippingAddress,
      paymentMethod,
      orderNotes: 'Đặt hàng qua Cổng Tất-Cả-Trong-Một JRAI ƠI',
    });

    if (order) {
      setOrderCreatedId(order.id);
      setCartItems([]);
    }
  };

  return (
    <div className="w-full space-y-24 pb-24 overflow-hidden relative">
      {/* Toast Notification */}
      {addedNotice && (
        <div className="fixed bottom-22 sm:bottom-24 right-6 z-50 bg-[#B9383A] text-white px-5 py-3.5 rounded-xl shadow-xl border border-amber-400/40 flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
          <span className="text-sm font-bold">{addedNotice}</span>
          <button
            onClick={() => setCartOpen(true)}
            className="text-xs underline font-bold ml-2 text-amber-200 hover:text-white cursor-pointer"
          >
            Mở giỏ hàng &rarr;
          </button>
        </div>
      )}

      {/* Floating Cart Button (Balanced Position above Chatbot) - Larger Icon */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-22 sm:bottom-24 right-6 z-30 bg-[#B9383A] hover:bg-[#A83232] text-white px-4 sm:px-5 py-3 sm:py-3.5 rounded-full shadow-xl border-2 border-amber-300/40 flex items-center gap-3 transition-all hover:scale-105 cursor-pointer"
        title="Mở giỏ hàng JRAI ƠI"
      >
        <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300 shrink-0" />
        <span className="text-xs sm:text-sm font-bold font-mono bg-stone-900/80 px-2.5 py-0.5 rounded-full text-amber-300 border border-amber-500/30">
          {cartTotal.count}
        </span>
        <span className="text-xs sm:text-sm font-bold hidden sm:inline">{cartTotal.subtotal.toLocaleString('vi-VN')}₫</span>
      </button>

      {/* ========================================================
          1. MỤC 1: TRANG CHỦ (#home) - HERO CAROUSEL SLIDER KẾ THỪA DETNENTUONGLAI
      ======================================================== */}
      <section id="home" className="relative min-h-[680px] lg:min-h-[760px] bg-[#120F0D] text-white overflow-hidden flex items-center justify-center w-full border-b border-[#3D2C1F] scroll-mt-20">
        {/* Background Slider with 5 Authentic Slides */}
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentHeroSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
            style={{ transitionProperty: 'opacity, transform', transitionDuration: '1000ms' }}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover object-center"
            />
          </div>
        ))}

        {/* Ambient Overlays: Bright, Clear & Warm Atmospheric Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#100D0B] via-[#100D0B]/40 to-black/20" />
        <div className="absolute inset-0 bg-black/10" />

        {/* Radiant Central Glow for High-Impact Vibrant Depth */}
        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
          <div
            className="w-[600px] sm:w-[900px] lg:w-[1100px] h-[450px] bg-gradient-radial from-[#C99A45]/25 via-[#174C38]/20 to-transparent rounded-full blur-3xl opacity-80 animate-pulse"
            style={{ animationDuration: '6s' }}
          />
        </div>

        {/* Hero Slider Caption Badge */}
        <div className="absolute bottom-6 right-6 z-20 hidden md:block">
          <div className="bg-[#1A1412]/90 backdrop-blur-md border border-[#F5C542]/50 text-amber-200 text-xs px-4 py-2 rounded-full shadow-lg font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F5C542] animate-pulse" />
            <span>{HERO_SLIDES[currentHeroSlide].caption}</span>
          </div>
        </div>

        {/* Hero Slider Controls: Prev/Next & Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 lg:left-auto lg:right-6 lg:translate-x-0 z-30 flex items-center gap-3">
          <button
            onClick={prevHeroSlide}
            aria-label="Slide trước"
            className="w-9 h-9 rounded-full bg-[#181310]/85 hover:bg-[#174C38] text-white border border-[#F5C542]/40 flex items-center justify-center transition shadow-md text-lg cursor-pointer"
          >
            ‹
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#181310]/85 rounded-full border border-stone-800">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentHeroSlide(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  i === currentHeroSlide ? 'w-6 bg-[#F5C542]' : 'w-2 bg-stone-500 hover:bg-stone-300'
                }`}
              />
            ))}
          </div>
          <button
            onClick={nextHeroSlide}
            aria-label="Slide tiếp theo"
            className="w-9 h-9 rounded-full bg-[#181310]/85 hover:bg-[#174C38] text-white border border-[#F5C542]/40 flex items-center justify-center transition shadow-md text-lg cursor-pointer"
          >
            ›
          </button>
        </div>

        {/* Hero Content with Radiant Vibrant Typography & Interactive CTAs */}
        <div className="w-full max-w-[1600px] xl:px-12 mx-auto px-4 sm:px-6 lg:px-12 z-20 flex flex-col items-center justify-center text-center py-20 lg:py-24 space-y-6">
          
          {/* Top Heritage Badge: Glowing Diamond Pill */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-gradient-to-r from-[#174C38]/95 via-[#1E5C44]/95 to-[#174C38]/95 border border-[#F5C542]/70 shadow-[0_0_25px_rgba(201,154,69,0.35)] backdrop-blur-md animate-pulse">
            <span className="text-[#F5C542] text-xs">❖</span>
            <span className="text-[#FFFDF9] text-xs sm:text-[13px] font-bold tracking-[1.5px] uppercase">
              Di Sản Thổ Cẩm Dệt Cửi Hông • Ia Mơ Nông, Gia Lai
            </span>
            <span className="text-[#F5C542] text-xs">❖</span>
          </div>

          {/* Main Title & Vibrant Highlight */}
          <div className="text-center space-y-2">
            <h1
              className="text-5xl sm:text-6xl lg:text-8xl font-serif font-black tracking-wider bg-gradient-to-b from-[#FFFFFF] via-[#FFF5EA] to-[#F5C542] bg-clip-text !text-transparent filter drop-shadow-[0_6px_25px_rgba(0,0,0,0.95)] drop-shadow-[0_0_35px_rgba(245,197,66,0.55)] select-none"
              style={{
                WebkitTextFillColor: 'transparent',
                backgroundImage: 'linear-gradient(to bottom, #FFFFFF 0%, #FFF5EA 45%, #F5C542 100%)',
              }}
            >
              JRAI ƠI
            </h1>
            <div
              className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight bg-gradient-to-r from-[#FFF5D0] via-[#F5C542] to-[#E59E2B] bg-clip-text !text-transparent filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] drop-shadow-[0_0_28px_rgba(245,197,66,0.6)] select-none"
              style={{
                WebkitTextFillColor: 'transparent',
                backgroundImage: 'linear-gradient(to right, #FFF5D0 0%, #F5C542 50%, #E59E2B 100%)',
              }}
            >
              Thổ Cẩm Bản Địa Tây Nguyên
            </div>
            
            {/* Elegant Golden Brocade Divider */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <span className="h-px w-16 sm:w-28 bg-gradient-to-r from-transparent via-[#F5C542] to-transparent"></span>
              <span className="text-[#F5C542] text-sm font-bold">❖</span>
              <span className="h-px w-16 sm:w-28 bg-gradient-to-r from-transparent via-[#F5C542] to-transparent"></span>
            </div>
          </div>

          {/* Description with High Contrast Glassmorphic Backdrop */}
          <p className="!text-[#FAF5EC] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal px-6 py-4 rounded-2xl bg-[#14100E]/75 backdrop-blur-md border border-[#F5C542]/30 shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
            Bảo tồn nguyên vẹn tri thức dệt cửi hông cổ truyền người Jrai tại buôn làng Ia Mơ Nông (Gia Lai). Mỗi tác phẩm dệt là một câu chuyện di sản, tích hợp mã số QR định danh minh bạch nghệ nhân và số giờ công dệt.
          </p>

          {/* Quick Action CTAs: High-End Boutique Buttons with Vibrant Hover Glow */}
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 pt-1">
            <a
              href="#products"
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#174C38] via-[#23654D] to-[#174C38] hover:from-[#23654D] hover:to-[#174C38] !text-[#FFFDF9] font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full border-2 border-[#F5C542] shadow-[0_4px_25px_rgba(245,197,66,0.45)] hover:shadow-[0_6px_35px_rgba(245,197,66,0.7)] transition-all duration-300 hover:scale-105"
            >
              <ShoppingBag className="w-4 h-4 text-[#F5C542]" />
              <span className="!text-[#FFFDF9] font-bold">Khám Phá 57 Tác Phẩm</span>
            </a>

            <a
              href="#artisans"
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#F5C542] via-[#E59E2B] to-[#F5C542] hover:from-[#FFF0B8] hover:to-[#F5C542] !text-[#0E3626] font-extrabold text-xs sm:text-sm px-5 py-3.5 rounded-full border border-[#FFF5EA] shadow-[0_4px_22px_rgba(245,197,66,0.45)] hover:shadow-[0_6px_30px_rgba(245,197,66,0.65)] transition-all duration-300 hover:scale-105"
            >
              <Users className="w-4 h-4 !text-[#0E3626]" />
              <span className="!text-[#0E3626] font-extrabold">Nghệ Nhân Buôn Làng</span>
            </a>

            <a
              href="#motifs"
              className="inline-flex items-center gap-2.5 bg-[#174C38]/90 hover:bg-[#1E5C44] !text-[#FFFDF9] font-bold text-xs sm:text-sm px-5 py-3.5 rounded-full border border-[#F5C542]/70 hover:border-[#F5C542] shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_6px_25px_rgba(245,197,66,0.4)] transition-all duration-300 hover:scale-105 backdrop-blur-md"
            >
              <Grid className="w-4 h-4 text-[#F5C542]" />
              <span className="!text-[#FFFDF9] font-bold">Ngân Hàng Hoa Văn</span>
            </a>

            <a
              href="#traceability"
              className="inline-flex items-center gap-2.5 bg-[#231A14]/90 hover:bg-[#32251D] !text-[#FFFDF9] font-bold text-xs sm:text-sm px-5 py-3.5 rounded-full border border-[#F5C542]/70 hover:border-[#F5C542] shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_6px_25px_rgba(245,197,66,0.4)] transition-all duration-300 hover:scale-105 backdrop-blur-md"
            >
              <QrCode className="w-4 h-4 text-[#F5C542]" />
              <span className="!text-[#FFFDF9] font-bold">Tra Cứu QR</span>
            </a>
          </div>

          {/* Heritage Stats Grid with Glassmorphic Glowing Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 w-full max-w-4xl mx-auto pt-6 border-t border-[#F5C542]/30">
            <div className="bg-[#171310]/75 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-[#F5C542]/30 hover:border-[#F5C542] transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.4)] group">
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif bg-gradient-to-r from-[#FFF0BD] via-[#F5C542] to-[#E59E2B] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(245,197,66,0.4)]">
                {stat1}%
              </span>
              <span className="block text-xs sm:text-[13px] text-stone-300 group-hover:text-white font-medium mt-1">
                Định danh QR độc bản
              </span>
            </div>

            <div className="bg-[#171310]/75 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-[#F5C542]/30 hover:border-[#F5C542] transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.4)] group">
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif bg-gradient-to-r from-[#FFF0BD] via-[#F5C542] to-[#E59E2B] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(245,197,66,0.4)]">
                {stat2}+ H
              </span>
              <span className="block text-xs sm:text-[13px] text-stone-300 group-hover:text-white font-medium mt-1">
                Giờ dệt tay mỗi tác phẩm
              </span>
            </div>

            <div className="bg-[#171310]/75 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-[#F5C542]/30 hover:border-[#F5C542] transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.4)] group">
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif bg-gradient-to-r from-[#FFF0BD] via-[#F5C542] to-[#E59E2B] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(245,197,66,0.4)]">
                {stat3}+
              </span>
              <span className="block text-xs sm:text-[13px] text-stone-300 group-hover:text-white font-medium mt-1">
                Nghệ nhân Ia Mơ Nông
              </span>
            </div>

            <div className="bg-[#171310]/75 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-[#F5C542]/30 hover:border-[#F5C542] transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.4)] group">
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif bg-gradient-to-r from-[#FFF0BD] via-[#F5C542] to-[#E59E2B] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(245,197,66,0.4)]">
                {stat4}%
              </span>
              <span className="block text-xs sm:text-[13px] text-stone-300 group-hover:text-white font-medium mt-1">
                Doanh thu tới tay người dệt
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE CHẠY CHỮ DI SẢN THỔ CẨM JRAI */}
      <div className="marquee-strip" aria-hidden="true">
        <div className="marquee-track">
          <div className="marquee-item">
            <span className="highlight-gold">DI SẢN THỔ CẨM JRAI</span>
            <span className="separator-symbol">✦</span>
            <span>XÃ IA MƠ NÔNG, HUYỆN CHƯ PĂH, GIA LAI</span>
            <span className="separator-symbol">✦</span>
            <span className="highlight-gold">100% SỢI BÔNG KƠPĂH TỰ NHIÊN</span>
            <span className="separator-symbol">✦</span>
            <span>THƯƠNG HIỆU THỔ CẨM JRAI ƠI</span>
            <span className="separator-symbol">✦</span>
            <span className="text-white">100% ĐỊNH DANH QR ĐỘC BẢN</span>
            <span className="separator-symbol">✦</span>
            <span>BẢO TỒN NGUYÊN BẢN CỬI HÔNG</span>
            <span className="separator-symbol">✦</span>
            <span className="highlight-gold">LAN TỎA BẢN SẮC ĐẠI NGÀN</span>
            <span className="separator-symbol">✦</span>
          </div>
          <div className="marquee-item">
            <span className="highlight-gold">DI SẢN THỔ CẨM JRAI</span>
            <span className="separator-symbol">✦</span>
            <span>XÃ IA MƠ NÔNG, HUYỆN CHƯ PĂH, GIA LAI</span>
            <span className="separator-symbol">✦</span>
            <span className="highlight-gold">100% SỢI BÔNG KƠPĂH TỰ NHIÊN</span>
            <span className="separator-symbol">✦</span>
            <span>THƯƠNG HIỆU THỔ CẨM JRAI ƠI</span>
            <span className="separator-symbol">✦</span>
            <span className="text-white">100% ĐỊNH DANH QR ĐỘC BẢN</span>
            <span className="separator-symbol">✦</span>
            <span>BẢO TỒN NGUYÊN BẢN CỬI HÔNG</span>
            <span className="separator-symbol">✦</span>
            <span className="highlight-gold">LAN TỎA BẢN SẮC ĐẠI NGÀN</span>
            <span className="separator-symbol">✦</span>
          </div>
          <div className="marquee-item">
            <span className="highlight-gold">DI SẢN THỔ CẨM JRAI</span>
            <span className="separator-symbol">✦</span>
            <span>XÃ IA MƠ NÔNG, HUYỆN CHƯ PĂH, GIA LAI</span>
            <span className="separator-symbol">✦</span>
            <span className="highlight-gold">100% SỢI BÔNG KƠPĂH TỰ NHIÊN</span>
            <span className="separator-symbol">✦</span>
            <span>THƯƠNG HIỆU THỔ CẨM JRAI ƠI</span>
            <span className="separator-symbol">✦</span>
            <span className="text-white">100% ĐỊNH DANH QR ĐỘC BẢN</span>
            <span className="separator-symbol">✦</span>
            <span>BẢO TỒN NGUYÊN BẢN CỬI HÔNG</span>
            <span className="separator-symbol">✦</span>
            <span className="highlight-gold">LAN TỎA BẢN SẮC ĐẠI NGÀN</span>
            <span className="separator-symbol">✦</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          BÀI TOÁN & LỜI GIẢI ĐỔI MỚI (MÔ HÌNH THƯƠNG MẠI ĐIỆN TỬ BỀN VỮNG)
      ======================================================== */}
      <section className="section section-watermark-hearth reveal-on-scroll">
        <div className="w-full max-w-[1600px] xl:px-12 mx-auto px-4 sm:px-6 lg:px-12">
          <div className="innovation-grid w-full">
            <div className="space-y-6">
              <span className="section-tag">
                <Sparkles className="w-4 h-4" />
                <span>Bài toán & Lời giải đổi mới</span>
              </span>

              <h2 className="section-title">
                Làm sao để một nghề truyền thống có thể tự nuôi sống chính mình?
              </h2>

              <p className="section-desc">
                Tại Gia Lai, nghề dệt thổ cẩm Jrai đối mặt thách thức lớn: sản phẩm thủ công tốn hàng chục giờ đếm sợi, khó cạnh tranh về giá với hàng dệt máy công nghiệp giá rẻ. Khi nghề không tạo ra đủ sinh kế, thế hệ trẻ dần rời xa khung cửi.
              </p>

              <p className="section-desc">
                Dự án không chọn cách làm thổ cẩm rẻ hơn để cạnh tranh, mà chọn con đường <strong className="text-amber-800 font-bold">nâng tầm giá trị</strong>: biến thời gian, kỹ thuật độc bản và chiều sâu văn hóa thành lý do để khách hàng trân trọng và lựa chọn thông qua nền tảng số hóa và mã định danh QR.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-stone-600">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>Thực địa tại làng Kép & làng Phung</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  <span>Mã hóa 20 hoa văn bản địa</span>
                </div>
              </div>
            </div>

            <div className="innovation-card-box">
              <div style={{ borderBottom: '1px solid #E8DFC8', paddingBottom: '14px', marginBottom: '20px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-forest-gold, #C99A45)', letterSpacing: '0.5px' }}>Mô hình sinh kế bền vững</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-forest-green, #174C38)', marginTop: '4px' }}>
                  Mô hình “Bảo Tồn — Kết Nối — Thí Điểm”
                </h3>
              </div>

              {/* Pillar 01 */}
              <div className="pillar-item">
                <div className="pillar-icon">01</div>
                <div>
                  <h4 className="pillar-title">Bảo Tồn Nguyên Bản</h4>
                  <p className="pillar-desc">
                    Giữ nguyên kỹ thuật dệt khung cửi hông, màu nhuộm thảo mộc tự nhiên từ vỏ cây rừng và sợi bông thô Kơpăh.
                  </p>
                </div>
              </div>

              {/* Pillar 02 */}
              <div className="pillar-item">
                <div className="pillar-icon gold">02</div>
                <div>
                  <h4 className="pillar-title">Kết Nối Công Nghệ Số & Du Lịch</h4>
                  <p className="pillar-desc">
                    Số hóa hoa văn thành Ngân hàng di sản và gắn mã QR định danh độc bản; liên kết chuỗi homestay, resort tại Gia Lai.
                  </p>
                </div>
              </div>

              {/* Pillar 03 */}
              <div className="pillar-item">
                <div className="pillar-icon green">03</div>
                <div>
                  <h4 className="pillar-title">Thí Điểm Sinh Kế Thực Tế</h4>
                  <p className="pillar-desc">
                    Triển khai thực địa tại Xã Ia Mơ Nông với nghệ nhân thật, sản phẩm thật, đo lường thu nhập cải thiện rõ rệt cho phụ nữ Jrai.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. MỤC 2: SẢN PHẨM (#products) - TOÀN BỘ 57 SẢN PHẨM CĂN GIỮA
      ======================================================== */}
      <section className="section section-watermark-weave reveal-on-scroll w-full flex flex-col items-center" id="products" style={{ scrollMarginTop: '80px' }}>
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 flex flex-col items-center">
          <div className="text-center max-w-3xl mx-auto space-y-3.5 mb-6 flex flex-col items-center justify-center">
            <span className="section-tag inline-flex items-center justify-center">
              Bộ sưu tập tiêu biểu
            </span>
            <h2 className="section-title text-center">
              Sản Phẩm Thổ Cẩm Ứng Dụng Đời Sống
            </h2>
            <p className="section-desc text-center mx-auto">
              100% sản phẩm dệt cửi hông thủ công bởi bàn tay của các nghệ nhân làng Kép và làng Phung. Khi mua sản phẩm, bạn nhận kèm một mã định danh số QR giúp tra cứu tên thợ dệt, thời gian hoàn thành và ý nghĩa hoa văn.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <span className="text-xs font-bold text-amber-900 bg-amber-100/90 px-3.5 py-1.5 rounded-full border border-amber-300">
                Hiển thị {filteredProducts.length} / 57 tác phẩm
              </span>
              <Link href="/products" className="btn btn-outline-dark btn-sm font-bold">
                Xem toàn bộ 57 mẫu &rarr;
              </Link>
            </div>
          </div>

        {/* Filter Controls: Search & Category Pills Căn giữa hoàn hảo */}
        <div className="w-full max-w-[1600px] mx-auto space-y-4 bg-white p-5 sm:p-7 rounded-2xl border border-[#E5DACB] shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8A7E72]" />
              <input
                type="text"
                placeholder="Tìm theo tên sản phẩm hoặc mã (K001, B001, C001, VI001...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#FBF8F3] border border-[#E5DACB] text-sm text-[#1F1D1B] placeholder-[#8A7E72] focus:outline-none focus:border-[#C43B3D] focus:bg-white"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-3 py-2.5 rounded-lg bg-[#FBF8F3] border border-[#E5DACB] text-sm text-[#1F1D1B] focus:outline-none focus:border-[#C43B3D] focus:bg-white"
              >
                <option value="all">Mọi mức giá</option>
                <option value="under-300">Dưới 300.000₫</option>
                <option value="300-600">300.000₫ - 600.000₫</option>
                <option value="over-600">Trên 600.000₫</option>
              </select>

              <select
                value={selectedArtisanFilter}
                onChange={(e) => setSelectedArtisanFilter(e.target.value)}
                className="px-3 py-2.5 rounded-lg bg-[#FBF8F3] border border-[#E5DACB] text-sm text-[#1F1D1B] focus:outline-none focus:border-[#C43B3D] focus:bg-white"
              >
                <option value="all">Tất cả nghệ nhân</option>
                {artisans.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.village})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Phân loại sản phẩm: Các nút bấm nổi bật, căn giữa, khoảng cách thoáng rộng rãi */}
          <div className="pt-4 border-t border-[#E8E2D9]">
            <div className="text-xs font-bold text-[#5A3E2D] uppercase tracking-wider mb-3 flex items-center justify-center gap-2 text-center">
              <Tag className="w-3.5 h-3.5 text-[#1E4D38]" />
              <span>PHÂN LOẠI TÁC PHẨM THỔ CẨM:</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              {CATEGORIES_METADATA.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    type="button"
                    className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer select-none ${
                      isActive
                        ? 'bg-[#1E4D38] text-white shadow-xs border border-[#143527]'
                        : 'bg-white hover:bg-[#FAF8F5] text-[#2B221D] hover:text-[#1E4D38] border border-[#E8E2D9] hover:border-[#1E4D38]/40'
                    }`}
                  >
                    <span>{cat.label || cat.name}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-mono font-medium ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#FAF8F5] text-[#5A3E2D] border border-[#E8E2D9]'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 57 Products Grid - 3 sản phẩm/hàng trên Desktop Căn giữa chuẩn */}
        <div className="products-grid w-full max-w-[1600px] mx-auto">
          {filteredProducts.map((p) => {
            const inWish = isInWishlist(p.id);
            return (
              <div key={p.id} className="product-card group">
                <div
                  className="product-img-wrap cursor-pointer"
                  onClick={() => setSelectedProduct(p)}
                >
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="product-img"
                    loading="lazy"
                  />
                  <span className="product-hours-badge">
                    {p.production_time || '40h dệt tay'}
                  </span>
                  <span
                    className="product-qr-badge"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPassportCode(p.product_code);
                      const el = document.getElementById('traceability');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    title="Xem mã định danh QR độc bản"
                  >
                    MÃ QR
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(p.id);
                    }}
                    className="absolute top-3 left-3 p-1.5 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-red-500 shadow-xs border border-[#E8E2D9] transition"
                    title={inWish ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                  >
                    <Heart className={`w-3.5 h-3.5 ${inWish ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>

                <div className="product-body">
                  <div className="flex items-center justify-between text-xs text-[#1E4D38] font-semibold mb-1">
                    <span>{p.category_name}</span>
                    <span className="font-mono text-[#8A7E72]">{p.product_code}</span>
                  </div>
                  <h3 className="product-title">
                    <Link
                      href={`/product/${p.id}`}
                      className="hover:text-[#1E4D38] transition-colors"
                      title="Xem trang chi tiết sản phẩm"
                    >
                      {p.name}
                    </Link>
                  </h3>

                  {p.story && (
                    <div className="text-xs text-[#6B5E51] line-clamp-1 mb-1 italic">
                      {p.story}
                    </div>
                  )}

                  <a
                    href="#artisans"
                    className="product-artisan-link"
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById('artisans');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Nghệ nhân: <strong className="font-medium text-[#1F1D1B]">{p.artisan_name || 'Nghệ nhân Jrai'}</strong> ({p.artisan_village || 'Làng Kép'})
                  </a>

                  <div className="product-footer">
                    <div className="product-price-row">
                      <div>
                        <span className="product-price">
                          {p.price.toLocaleString('vi-VN')}₫
                        </span>
                        {p.original_price && p.original_price > p.price && (
                          <span className="text-xs text-stone-400 line-through ml-2">
                            {p.original_price.toLocaleString('vi-VN')}₫
                          </span>
                        )}
                      </div>
                      <button
                        className="btn-detail"
                        onClick={() => {
                          setPassportCode(p.product_code);
                          const el = document.getElementById('traceability');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        title="Mở mã QR định danh"
                      >
                        Mã QR
                      </button>
                    </div>

                    <div className="product-actions-row flex gap-2">
                      <button
                        onClick={() => setSelectedProduct(p)}
                        className="btn btn-sm btn-outline-dark flex-1 text-center justify-center font-bold"
                      >
                        Chi tiết
                      </button>
                      <button
                        onClick={(e) => handleAddToCart(p, e)}
                        className="btn btn-sm btn-primary flex-1 text-center justify-center font-bold flex items-center gap-1.5"
                      >
                        <ShoppingBag className="w-4.5 h-4.5" />
                        <span>Thêm giỏ</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </section>

      {/* ========================================================
          3. MỤC 3: NGÂN HÀNG HOA VĂN (#motifs) - ĐẦY ĐỦ 20 HOA VĂN
      ======================================================== */}
      <section className="section section-watermark-mist reveal-on-scroll" id="motifs" style={{ scrollMarginTop: '80px' }}>
        <div className="w-full max-w-[1600px] xl:px-12 mx-auto px-4 sm:px-6 lg:px-12 space-y-8">
          <div className="text-center" style={{ maxWidth: '780px', margin: '0 auto 48px' }}>
            <span className="section-tag gold">
              Kho tri thức di sản bản địa Jrai
            </span>
            <h2 className="section-title">
              Ngân Hàng Số Hoa Văn Thổ Cẩm Jrai (20 Hoa Văn)
            </h2>
            <p className="section-desc">
              Hệ thống số hóa 20 hoa văn cổ truyền người Jrai tại Gia Lai. Mỗi hoa văn là một ký hiệu văn hóa ước lệ khắc họa thiên nhiên, vũ trụ quan và đời sống tâm linh đại ngàn, được giải mã và lưu trữ cẩn trọng.
            </p>
            <div style={{ marginTop: '16px' }}>
              <span className="text-xs font-semibold text-[#1E4D38] bg-[#FAF8F5] px-4 py-1.5 rounded-full border border-[#E8E2D9]">
                20 / 20 biểu tượng hoa văn di sản đã xác minh
              </span>
            </div>
          </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {motifs.map((m) => (
            <div
              key={m.id}
              onClick={() => setSelectedMotif(m)}
              className="motif-card cursor-pointer group"
            >
              <div className="motif-header">
                <img
                  src={m.image_url}
                  alt={m.name}
                  loading="lazy"
                  className="group-hover:scale-105 transition-transform"
                />
                <div className="motif-jrai-name">{m.name_jrai || m.name}</div>
              </div>
              <div className="motif-body">
                <span className="motif-theme-tag">
                  {m.theme_name} • MÃ: {m.motif_code}
                </span>
                <h3 className="motif-title">{m.name}</h3>
                <p className="motif-meaning">{m.meaning || m.philosophy}</p>
                <div className="motif-verified">
                  <span>✓ Xác minh: Nghệ nhân làng Kép</span>
                </div>
                <div style={{ marginTop: '14px', display: 'flex', gap: '8px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMotif(m);
                    }}
                    className="btn btn-sm btn-outline-dark"
                    style={{ flex: 1, textAlign: 'center', justifyContent: 'center' }}
                  >
                    Khám phá ý nghĩa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center" style={{ marginTop: '45px' }}>
          <Link href="/motifs" className="btn btn-gold">
            Khám phá toàn bộ 20 Hoa Văn Di Sản &rarr;
          </Link>
        </div>
      </div>
    </section>

    {/* ========================================================
        4. MỤC 4: NGHỆ NHÂN (#artisans) - MODERN ETHNIC BOUTIQUE DEMO FORMAT
    ======================================================== */}
    <section className="section relative overflow-hidden py-14 lg:py-20" id="artisans" style={{ scrollMarginTop: '80px', backgroundColor: '#FAF7F2', backgroundImage: "url('/images/custom/texture_paper_cotton.jpg')" }}>
      {/* Decorative Brocade Diamond Watermarks on Top Corners */}
      <div
        className="absolute top-0 left-0 w-64 sm:w-80 h-32 pointer-events-none opacity-25 bg-contain bg-no-repeat bg-top-left"
        style={{ backgroundImage: "url('/images/custom/brocade_corner_left.png')" }}
        aria-hidden="true"
      />
      <div
        className="absolute top-0 right-0 w-64 sm:w-80 h-32 pointer-events-none opacity-25 bg-contain bg-no-repeat bg-top-right"
        style={{ backgroundImage: "url('/images/custom/brocade_corner_right.png')" }}
        aria-hidden="true"
      />

      <div className="w-full max-w-[1600px] xl:px-12 mx-auto px-4 sm:px-6 lg:px-12 relative z-10 space-y-10">
        {/* Header Format Chuẩn Demo Hình 5 */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#174C38] tracking-tight font-serif">
            Nghệ nhân Dệt Thổ Cẩm
          </h2>

          <div className="flex justify-center">
            <div className="subtitle-pill-brocade shadow-2xs">
              <span className="text-[#C97A3E] text-xs">❖</span>
              <span>Làng Kép — Ia Mơ Nông</span>
              <span className="text-[#C97A3E] text-xs">❖</span>
            </div>
          </div>

          <p className="text-[#4A453F] text-sm sm:text-base italic max-w-xl mx-auto font-normal pt-1">
            Gìn giữ nghề truyền thống, lan tỏa giá trị thổ cẩm Jrai
          </p>
        </div>

        {/* 3 Featured Artisan Cards Chuẩn Format Demo Hình 5 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full max-w-[1600px] mx-auto">
          {artisans.slice(0, 3).map((a) => {
            const cleanAQuote = a.quote ? a.quote.replace(/^[“"«\s]+|[”"»\s]+$/g, '').trim() : '';
            return (
              <div
                key={a.id}
                className="artisan-demo-card group cursor-pointer"
                onClick={() => setSelectedArtisanModal(a)}
              >
                <div>
                  {/* Photo with top-left badge and floating name pill */}
                  <div className="relative aspect-[16/11] sm:aspect-[4/3] w-full overflow-hidden bg-[#FAF5EC] rounded-t-[19px]">
                    <img
                      src={a.avatar || a.image_url}
                      alt={a.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                    />

                    {/* Top-left: Star badge "★ X năm tuổi nghề" */}
                    <div className="absolute top-3.5 left-3.5 z-10">
                      <div className="artisan-badge-pill">
                        <Star className="w-3.5 h-3.5 fill-white text-white shrink-0" />
                        <span>{a.experience_years ? `${a.experience_years} năm tuổi nghề` : a.experience}</span>
                      </div>
                    </div>

                    {/* Floating Name Pill overlapping bottom edge of image */}
                    <div className="absolute -bottom-4 left-4 z-10">
                      <div className="artisan-name-pill">
                        <User className="w-3.5 h-3.5 text-white shrink-0" />
                        <span>{a.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="pt-7 px-5 pb-4 space-y-3">
                    {/* Location Row with Map Pin - Full text, clean wrapping */}
                    <div className="flex items-start gap-2 text-xs sm:text-[13px] text-[#4A453F] leading-snug">
                      <MapPin className="w-4 h-4 text-[#174C38] shrink-0 mt-0.5" />
                      <span>{a.village || a.location}</span>
                    </div>

                    {/* Quote with Orange/Terracotta Left Border */}
                    {cleanAQuote && (
                      <div className="artisan-quote-accent">
                        &ldquo;{cleanAQuote}&rdquo;
                      </div>
                    )}
                  </div>
                </div>

                {/* Centered Outline Pill Button: Xem hồ sơ */}
                <div className="px-5 pb-5 pt-1 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedArtisanModal(a);
                    }}
                    className="btn-artisan-outline w-full sm:w-auto"
                  >
                    <span>Xem hồ sơ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Bottom Button flanked by Diamond Motifs */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 pt-4">
          <span className="text-[#C97A3E] text-base select-none">❖</span>
          <span className="h-px w-10 sm:w-24 bg-[#D4C4A8]"></span>
          <Link
            href="/artisans"
            className="inline-flex items-center gap-2 px-7 sm:px-9 py-3 rounded-full bg-[#174C38] hover:bg-[#0E3626] text-white font-semibold text-sm shadow-md transition transform hover:scale-[1.02] cursor-pointer"
          >
            <span>Khám phá thêm 6 nghệ nhân khác</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <span className="h-px w-10 sm:w-24 bg-[#D4C4A8]"></span>
          <span className="text-[#C97A3E] text-base select-none">❖</span>
        </div>

      </div>
    </section>

    {/* ========================================================
        5. MỤC 5: TRA CỨU QR (#traceability) - TƯƠNG TÁC NGAY TẠI CHỖ
    ======================================================== */}
    <section className="section section-watermark-stilt reveal-on-scroll" id="traceability" style={{ scrollMarginTop: '80px' }}>
      <div className="w-full max-w-[1600px] xl:px-12 mx-auto px-4 sm:px-6 lg:px-12 space-y-8">
        <div className="text-center" style={{ maxWidth: '780px', margin: '0 auto 40px' }}>
          <span className="section-tag gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <QrCode className="w-3.5 h-3.5" />
            <span>HỆ THỐNG ĐỊNH DANH SỐ (DIGITAL PRODUCT PASSPORT)</span>
          </span>
          <h2 className="section-title">
            Tra Cứu Minh Bạch Nguồn Gốc Từng Mũi Dệt
          </h2>
          <p className="section-desc">
            Nhập mã sản phẩm hoặc bấm chọn các mã mẫu dưới đây để xem ngay Hộ Chiếu Số bao gồm: Nghệ nhân thực hiện, Ý nghĩa hoa văn và Bản đồ tọa độ Gia Lai.
          </p>
        </div>

        {/* Input & Sample Buttons */}
        <div className="bg-white p-6 rounded-xl border border-[#E5DACB] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={passportCode}
              onChange={(e) => setPassportCode(e.target.value.toUpperCase())}
              placeholder="Nhập mã sản phẩm: K001, B001, C001, VI001, TT001..."
              className="flex-1 bg-[#FBF8F3] border border-[#E5DACB] rounded-lg px-4 py-3 text-sm text-[#1F1D1B] placeholder-[#8A7E72] focus:outline-none focus:border-[#C43B3D] focus:bg-white font-mono"
            />
            <button
              onClick={() => {
                if (passportCode.trim()) {
                  const found = allProducts.find(
                    (p) => p.product_code.toLowerCase() === passportCode.trim().toLowerCase()
                  );
                  setPassportProduct(found || null);
                }
              }}
              className="bg-[#C43B3D] hover:bg-[#8A2325] text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-lg shadow-sm transition whitespace-nowrap"
            >
              TRA CỨU HỘ CHIẾU
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs sm:text-sm">
            <span className="text-[#8A7E72] whitespace-nowrap">Bấm thử mẫu:</span>
            {['K001', 'B001', 'VI001', 'C001', 'TT001', 'TD001', 'V001', 'A001'].map((c) => (
              <button
                key={c}
                onClick={() => setPassportCode(c)}
                className={`px-3 py-1.5 rounded-md font-mono font-bold transition ${
                  passportCode.toUpperCase() === c
                    ? 'bg-[#C43B3D] text-white shadow-xs'
                    : 'bg-[#FBF8F3] text-[#5D554D] hover:text-[#1F1D1B] border border-[#E5DACB]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Passport Result Box */}
        {passportProduct ? (
          <div className="bg-white rounded-xl border border-[#E5DACB] overflow-hidden shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E5DACB] pb-5">
              <div>
                <span className="text-xs sm:text-sm font-mono text-[#EA8E23] uppercase tracking-widest font-bold">
                  HỘ CHIẾU SỐ: JRAI-IMN-{passportProduct.product_code}
                </span>
                <h3 className="text-2xl font-serif font-black text-[#1F1D1B] mt-1">
                  {passportProduct.name}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-bold font-mono text-[#C43B3D]">
                  {passportProduct.price.toLocaleString('vi-VN')}₫
                </span>
                <p className="text-xs text-[#3D7535] font-semibold flex items-center gap-1 justify-end">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Xác thực di sản bản địa</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Product Image & Info */}
              <div className="space-y-4">
                <div className="aspect-[4/3] rounded-lg overflow-hidden border border-[#E5DACB] bg-[#F2ECE1]">
                  <img
                    src={passportProduct.image_url}
                    alt={passportProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 bg-[#FBF8F3] rounded-lg border border-[#E5DACB] space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#8A7E72]">Phân loại:</span>
                    <span className="font-bold text-[#1F1D1B]">{passportProduct.category_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A7E72]">Thời gian dệt:</span>
                    <span className="font-bold text-[#C43B3D]">{passportProduct.production_time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A7E72]">Chất liệu:</span>
                    <span className="font-bold text-[#1F1D1B]">{passportProduct.material}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A7E72]">Tọa độ:</span>
                    <span className="font-bold text-[#1F1D1B] truncate max-w-[160px]">{passportProduct.location}</span>
                  </div>
                </div>
              </div>

              {/* Story & Cultural Context */}
              <div className="space-y-4">
                <h4 className="text-sm sm:text-base font-serif font-bold text-[#1F1D1B] uppercase tracking-wider border-b border-[#E5DACB] pb-2">
                  Ý Nghĩa Văn Hóa & Câu Chuyện
                </h4>
                <p className="text-xs sm:text-sm text-[#5D554D] leading-relaxed">
                  {passportProduct.story || passportProduct.description}
                </p>

                <div className="p-4 bg-[#FBF8F3] rounded-lg border border-[#E5DACB] space-y-2 text-xs sm:text-sm">
                  <span className="text-xs sm:text-sm font-bold text-[#EA8E23] block">Nghệ nhân thực hiện:</span>
                  <p className="text-[#5D554D]">
                    Sản phẩm được dệt hoàn toàn bằng cửi hông bởi các nghệ nhân giàu kinh nghiệm tại xã Ia Mơ Nông, huyện Chư Păh, Gia Lai.
                  </p>
                </div>
              </div>

              {/* QR Tag Downloader Tool */}
              <div className="space-y-4 flex flex-col justify-between">
                <div className="p-5 bg-[#FBF8F3] rounded-lg border border-[#E5DACB] text-center space-y-3">
                  <span className="text-xs sm:text-sm font-bold text-[#1F1D1B] uppercase tracking-wider block">
                    Tem Nhãn QR Định Danh
                  </span>
                  <QRCodeGenerator
                    productUrl={typeof window !== 'undefined' ? `${window.location.origin}/traceability?code=${passportProduct.product_code}` : `https://detnentuonglai.vercel.app/traceability?code=${passportProduct.product_code}`}
                    productName={passportProduct.name}
                    productCode={passportProduct.product_code}
                    category={passportProduct.category_name}
                    location={passportProduct.location}
                  />
                </div>

                <button
                  onClick={() => handleAddToCart(passportProduct)}
                  className="w-full py-3.5 rounded-lg bg-[#C43B3D] hover:bg-[#8A2325] text-white font-bold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 transition"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-200" />
                  <span>THÊM SẢN PHẨM NÀY VÀO GIỎ HÀNG</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 bg-white rounded-xl border border-[#E5DACB] text-center text-[#5D554D] text-sm shadow-sm">
            Không tìm thấy thông tin cho mã &ldquo;{passportCode}&rdquo;. Vui lòng thử các mã mẫu như K001, B001, VI001...
          </div>
        )}
        </div>
      </section>

      {/* ========================================================
          6. MỤC 6: VỀ CHÚNG TÔI (#about) - CÂU CHUYỆN & ĐỘI NGŨ KẾ THỪA
      ======================================================== */}
      <section className="section reveal-on-scroll" id="about" style={{ scrollMarginTop: '80px' }}>
        <div className="w-full max-w-[1600px] xl:px-12 mx-auto px-4 sm:px-6 lg:px-12 space-y-16">
        {/* A. Hero Origin Story Banner */}
        <div className="bg-[#F2ECE1] p-8 sm:p-12 rounded-xl border border-[#E5DACB] border-b-2 border-b-[#EA8E23] relative overflow-hidden shadow-sm text-center">
          <div className="max-w-3xl mx-auto space-y-4 relative z-10">
            <span className="section-tag gold">
              <Compass className="w-3.5 h-3.5 inline mr-1 text-[#EA8E23]" />
              <span>CÂU CHUYỆN KHỞI NGUỒN • DỰ ÁN DỆT NÊN TƯƠNG LAI</span>
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#1F1D1B] leading-tight">
              Từ Câu Hỏi Về Sinh Kế Đến Khát Vọng Giữ Lửa Nghề
            </h2>

            <p className="text-[#5D554D] text-sm sm:text-base leading-relaxed italic border-l-4 border-[#C43B3D] pl-4 max-w-2xl mx-auto text-left sm:text-center">
              &ldquo;Nếu một nghề truyền thống có giá trị nhưng người làm nghề không thể sống được từ nghề, thì làm thế nào để nghề ấy tiếp tục tồn tại?&rdquo; — Câu hỏi trăn trở ấy đã đưa nhóm chúng tôi đặt chân đến buôn làng Ia Mơ Nông.
            </p>
          </div>
        </div>

        {/* B. Fieldwork Story: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4 text-[#5D554D] text-sm sm:text-base leading-relaxed">
            <span className="section-tag">
              <Sparkles className="w-3.5 h-3.5 inline mr-1 text-[#C43B3D]" />
              <span>HÀNH TRÌNH THỰC ĐỊA IA MƠ NÔNG</span>
            </span>

            <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#1F1D1B] leading-tight">
              Không chỉ là bảo tồn, mà là làm cho giá trị của nghề được nhìn thấy
            </h3>

            <p>
              Từ những ngày đầu nghiên cứu thực địa đến khi hoàn thiện nền tảng thương mại điện tử, dự án đã chuyển mình mạnh mẽ: từ một ý tưởng kết nối văn hóa thành một hệ sinh thái bán hàng có <strong>địa bàn thật, người làm nghề thật, sản phẩm thật</strong> và mang lại nguồn sinh kế bền vững trong thực tế.
            </p>

            <p>
              Tại xã Ia Mơ Nông, huyện Chư Păh, chúng tôi ngồi cùng những người phụ nữ Jrai bên hiên nhà sàn, lắng nghe tiếng lách cách của thoi đưa và nhận ra: công nghệ số không phải để thay thế đôi bàn tay nghệ nhân, mà là chiếc cầu nối để đưa câu chuyện, công sức và tri thức văn hóa phía sau từng nếp dệt đến với những khách hàng trân quý.
            </p>

            <div className="bg-[#F2ECE1] border-l-4 border-[#C43B3D] p-4 rounded-r-lg border-y border-r border-[#E5DACB]">
              <p className="font-serif italic font-bold text-[#1F1D1B] text-sm sm:text-base">
                &ldquo;Không thay đổi cái gốc của nghề, thay đổi cách giá trị của nghề được nhìn thấy.&rdquo;
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-xl overflow-hidden border border-[#E5DACB] shadow-sm aspect-[4/3]">
              <img
                src="/images/background/image6.jpg"
                alt="Đội ngũ JRAI ƠI và nghệ nhân gìn giữ nghề dệt tại Ia Mơ Nông"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute -bottom-4 -right-3 bg-white border border-[#E5DACB] border-l-4 border-l-[#EA8E23] p-4 rounded-xl shadow-md max-w-xs text-xs sm:text-sm text-[#5D554D]">
              <span className="text-xs font-extrabold uppercase text-[#EA8E23] block mb-0.5">
                ĐỊA BÀN THÍ ĐIỂM
              </span>
              <p className="font-serif font-bold text-[#1F1D1B] text-xs sm:text-sm">
                CLB Dệt Thổ Cẩm Ia Mơ Nông, Chư Păh, Gia Lai
              </p>
            </div>
          </div>
        </div>

        {/* C. 6 Weaving Stages with Actual Photos - Modern Ethnic Boutique Format */}
        <section className="section journey-section-bg py-16 px-4 sm:px-6 lg:px-8 rounded-3xl w-full border border-[#E8DFC8]" id="journey">
          <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-4">
            <div className="text-center" style={{ maxWidth: '780px', margin: '0 auto 35px' }}>
              <span
                className="section-tag inline-block mb-3 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
                style={{
                  color: 'var(--color-forest-gold, #C99A45)',
                  backgroundColor: 'rgba(201, 154, 69, 0.12)',
                  borderColor: 'rgba(201, 154, 69, 0.3)',
                }}
              >
                Quy trình thủ công truyền thống
              </span>
              <h3 className="section-title text-2xl sm:text-3xl lg:text-4xl font-serif font-semibold text-[#174C38] mb-3">
                Hành Trình Dệt Nên Một Tác Phẩm Thổ Cẩm
              </h3>
              <p className="section-desc text-sm sm:text-base text-[#4A453F]">
                Mỗi tấm thổ cẩm Jrai là kết tinh của hàng chục giờ đếm từng sợi chỉ trên khung cửi hông, trải qua 6 công đoạn khắt khe từ cây bông rừng đến mác định danh số QR.
              </p>
            </div>

            {/* LƯỚI 6 CÔNG ĐOẠN DỆT THỔ CẨM ĐỐI XỨNG CÂN ĐỐI FULL MÀN HÌNH (Symmetrical 3-Column Responsive Grid) */}
            <div className="w-full my-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {WEAVING_STAGES_FULL.map((stage) => (
                  <div
                    key={stage.step}
                    className="bg-[#FFFDF9] rounded-2xl border border-[#E8DFC8] hover:border-[#174C38] transition-all duration-300 overflow-hidden shadow-xs hover:shadow-lg flex flex-col justify-between hover:-translate-y-1.5 group"
                  >
                    {/* Ảnh thực tế công đoạn với tỷ lệ chuẩn & huy hiệu */}
                    <div className="relative h-56 sm:h-64 overflow-hidden bg-[#FAF5EC]">
                      <img
                        src={stage.image}
                        alt={stage.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3.5 left-3.5 z-10">
                        <span className="bg-[#174C38]/90 backdrop-blur-xs text-[#FAF5EC] border border-[#C99A45]/40 text-[11px] sm:text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                          {stage.stage}
                        </span>
                      </div>
                      <div className="absolute top-3.5 right-3.5 z-10">
                        <span className="bg-[#A94335] text-white font-mono font-semibold text-xs px-2.5 py-1 rounded-lg shadow-xs border border-white/20">
                          {stage.step}
                        </span>
                      </div>
                    </div>

                    {/* Nội dung chi tiết */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="text-xs font-semibold uppercase tracking-wider text-[#C99A45]">
                          {stage.numLabel}
                        </div>
                        <h4 className="font-serif font-semibold text-lg text-[#174C38] group-hover:text-[#C99A45] transition-colors">
                          {stage.title}
                        </h4>
                        <div className="text-xs text-[#7A7265] italic font-medium">
                          {stage.subtitle}
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1.5">
                          {stage.pills.map((pill, pIdx) => (
                            <span
                              key={pIdx}
                              className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#FAF5EC] text-[#4A453F] border border-[#E8DFC8]"
                            >
                              {pill}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm text-[#4A453F] leading-relaxed pt-1.5">
                          {stage.desc}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#E8DFC8]">
                        <Link
                          href="/weaving-process"
                          className="inline-flex items-center gap-2 text-xs font-semibold text-[#174C38] hover:text-[#C99A45] group/link transition-colors"
                        >
                          <span>Xem chi tiết công đoạn</span>
                          <span className="group-hover/link:translate-x-1 transition-transform">➔</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Nút xem toàn bộ công đoạn dệt */}
              <div className="text-center mt-12">
                <Link
                  href="/weaving-process"
                  className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#174C38] hover:bg-[#123829] text-white font-semibold text-sm sm:text-base shadow-sm hover:shadow-md transition-all transform hover:scale-[1.01]"
                >
                  <span>Khám Phá Trọn Vẹn 6 Công Đoạn Dệt Cửi Hông</span>
                  <span>➔</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* D. Mentor & Founding Team ("The People Behind The Weave") - Modern Ethnic Boutique Format */}
        <div className="team-section-container reveal-on-scroll" style={{ borderRadius: '16px', padding: '50px 24px 60px', margin: '20px 0' }}>
          <div className="text-center" style={{ maxWidth: '760px', margin: '0 auto 30px' }}>
            <span className="section-tag" style={{ color: '#C99A45', backgroundColor: 'rgba(201, 154, 69, 0.12)', borderColor: 'rgba(201, 154, 69, 0.3)' }}>
              ĐỘI NGŨ SÁNG LẬP & VẬN HÀNH DỰ ÁN
            </span>
            <h2 className="section-title" style={{ color: '#174C38' }}>
              The People Behind The Weave
            </h2>
            <p className="section-desc" style={{ color: '#4A453F', margin: '0 auto 30px' }}>
              Những người gieo khát vọng số hóa và xây dựng cầu nối thương mại điện tử đưa thổ cẩm Jrai vươn xa.
            </p>
          </div>

          {/* Tiêu đề khối đội ngũ sáng lập */}
          <div style={{ marginTop: '25px', marginBottom: '10px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#C99A45', textTransform: 'uppercase', letterSpacing: '1px' }}>
              BAN ĐIỀU HÀNH & PHÁT TRIỂN DỰ ÁN (5 THÀNH VIÊN)
            </span>
          </div>

          {/* Lưới 5 thành viên sáng lập: Format Tứ Quý Garden (Mai Thị Cẩm Tú ở chính giữa) */}
          <div className="team-grid">
            {/* 1. Huỳnh Diệp Cẩm Tú - Legal & Partnership */}
            <div className="team-card">
              <div className="team-bg-shape"></div>
              <div className="team-bg-text">LEGAL</div>
              <div className="team-portrait-wrapper">
                <img src="/images/team/HuynhDiepCamTu_brocade.png" alt="Huỳnh Diệp Cẩm Tú" />
              </div>
              <div className="team-info-overlay">
                <h4 className="team-name">Huỳnh Diệp Cẩm Tú</h4>
                <p className="team-role">Phụ Trách Pháp Lý & Đối Ngoại</p>
              </div>
            </div>

            {/* 2. Nguyễn Ngọc Nữ - Tourism & Culture */}
            <div className="team-card">
              <div className="team-bg-shape"></div>
              <div className="team-bg-text">TOURISM</div>
              <div className="team-portrait-wrapper">
                <img src="/images/team/NguyenNgocNu_brocade.png" alt="Nguyễn Ngọc Nữ" />
              </div>
              <div className="team-info-overlay">
                <h4 className="team-name">Nguyễn Ngọc Nữ</h4>
                <p className="team-role">Trưởng Ban Du Lịch Sinh Thái & Bản Địa</p>
              </div>
            </div>

            {/* 3. Mai Thị Cẩm Tú - Lead (Ở Chính Giữa) */}
            <div className="team-card">
              <div className="team-bg-shape"></div>
              <div className="team-bg-text">LEAD</div>
              <div className="team-portrait-wrapper">
                <img src="/images/team/MaiThiCamTu_brocade.png" alt="Mai Thị Cẩm Tú" />
              </div>
              <div className="team-info-overlay">
                <h4 className="team-name">Mai Thị Cẩm Tú</h4>
                <p className="team-role">Lead / Trưởng Nhóm Dự Án</p>
              </div>
            </div>

            {/* 4. Đinh Sĩ Doãn Đăng - Media & Marketing */}
            <div className="team-card">
              <div className="team-bg-shape"></div>
              <div className="team-bg-text">MEDIA</div>
              <div className="team-portrait-wrapper">
                <img src="/images/team/DinhSiDoanDang_brocade.png" alt="Đinh Sĩ Doãn Đăng" />
              </div>
              <div className="team-info-overlay">
                <h4 className="team-name">Đinh Sĩ Doãn Đăng</h4>
                <p className="team-role">Phụ Trách Truyền Thông & Hình Ảnh</p>
              </div>
            </div>

            {/* 5. Phạm Nguyễn Thảo Nhi - Operations & Customer */}
            <div className="team-card">
              <div className="team-bg-shape"></div>
              <div className="team-bg-text">OPS</div>
              <div className="team-portrait-wrapper">
                <img src="/images/team/PhamNguyenThaoNhi_brocade.png" alt="Phạm Nguyễn Thảo Nhi" />
              </div>
              <div className="team-info-overlay">
                <h4 className="team-name">Phạm Nguyễn Thảo Nhi</h4>
                <p className="team-role">Phụ Trách Vận Hành & Khách Hàng</p>
              </div>
            </div>
          </div>
        </div>

        {/* E. 5 Commitments & Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-7 rounded-xl border border-[#E5DACB] space-y-4 shadow-sm">
            <h3 className="text-xl font-serif font-bold text-[#1F1D1B] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#EA8E23]" />
              <span>5 Cam Kết Vàng Của JRAI ƠI</span>
            </h3>
            <ul className="space-y-3 text-sm text-[#5D554D]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>100% Thủ công bản địa:</strong> Dệt cửi hông bởi các nghệ nhân làng Kép & làng Phung, Ia Mơ Nông.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Minh bạch tuyệt đối:</strong> Mỗi sản phẩm đi kèm một mã số định danh QR tra cứu độc bản.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Thương mại công bằng:</strong> 100% thù lao dệt công bằng và trích quỹ hỗ trợ nghệ nhân cao tuổi.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Bảo tồn tri thức mẫu hệ:</strong> Ghi chép và số hóa các bài ca, hoa văn truyền khẩu Jrai.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Giao hàng toàn quốc:</strong> Kiểm tra hàng trước khi thanh toán (COD).</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-7 rounded-xl border border-[#E5DACB] space-y-4 shadow-sm">
            <h3 className="text-xl font-serif font-bold text-[#1F1D1B] flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>Đánh Giá Thực Tế Từ Khách Hàng</span>
            </h3>
            <div className="space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="p-3.5 bg-[#FBF8F3] rounded-lg border border-[#E5DACB] text-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1F1D1B]">{r.customerName}</span>
                    <div className="flex gap-0.5">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[#5D554D] italic">&ldquo;{r.comment}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* ========================================================
          9. SẢN PHẨM NỔI BẬT (TU QUY GARDEN STYLE SHOWCASE)
          Curated 6 Standout Brocade Pieces at Bottom of Homepage
      ======================================================== */}
      <section
        id="featured-products"
        className="section bg-[#F5F1E8] border-t border-[#E8E2D9] py-16 sm:py-20 lg:py-24 relative overflow-hidden reveal-on-scroll"
        style={{ scrollMarginTop: '80px' }}
      >
        <div className="w-full max-w-[1600px] xl:px-12 mx-auto px-4 sm:px-6 lg:px-12 space-y-10">
          {/* Section Header (Tu Quy Garden section-header-flex) */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-6 border-b border-[#E5DACB]">
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1E4D38]/10 text-[#1E4D38] text-xs font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
                <span>Tuyển chọn tiêu biểu • Độc bản Jrai Ơi</span>
              </div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#1F1D1B] tracking-tight">
                  Sản Phẩm Thổ Cẩm Nổi Bật
                </h2>
                <span className="text-2xl sm:text-3xl" role="img" aria-label="sparkles">✨</span>
              </div>
              <p className="text-sm sm:text-base text-[#5D554D] max-w-2xl leading-relaxed">
                Những tác phẩm dệt cửi hông thủ công tiêu biểu nhất được tuyển chọn từ nghệ nhân làng Kép và làng Phung — kết tinh kỹ thuật đếm sợi truyền thống, định danh số QR độc bản.
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1E4D38] hover:bg-[#153828] text-white text-xs sm:text-sm font-bold transition-all shadow-xs hover:shadow-md group self-start md:self-auto shrink-0 cursor-pointer"
            >
              <span>Xem tất cả (57 tác phẩm)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 6 Curated Featured Product Cards - 3 columns on Desktop, 2 on Tablet, 1 on Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredShowcaseList.map(({ product, badge, artisanNote, reviewCount, rating }) => {
              const inWish = isInWishlist(product.id);
              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl border border-[#E8E2D9] hover:border-[#1E4D38]/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Image Wrapper */}
                  <div
                    className="relative aspect-[4/3] bg-[#FAF8F5] overflow-hidden cursor-pointer"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Top-left: Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-white text-[11px] font-bold shadow-xs ${badge.bg}`}>
                        <span>{badge.icon}</span>
                        <span>{badge.text}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-xs text-amber-300 text-[11px] font-medium shadow-xs">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{product.production_time || '40h dệt tay'}</span>
                      </span>
                    </div>

                    {/* Top-right: Wishlist & QR */}
                    <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-red-500 flex items-center justify-center shadow-xs border border-[#E8E2D9] transition cursor-pointer"
                        title={inWish ? 'Bỏ yêu thích' : 'Yêu thích'}
                      >
                        <Heart className={`w-4 h-4 ${inWish ? 'fill-red-500 text-red-500' : ''}`} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPassportCode(product.product_code);
                          const el = document.getElementById('traceability');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-2 py-1 rounded-md bg-[#1E4D38]/90 hover:bg-[#1E4D38] text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1 shadow-xs border border-amber-400/30 transition cursor-pointer"
                        title="Xem mã định danh số QR độc bản"
                      >
                        <QrCode className="w-3 h-3 text-amber-300" />
                        <span>QR</span>
                      </button>
                    </div>

                    {/* Quick View Button on Hover (Tu Quy Garden style) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/95 hover:bg-white text-[#1F1D1B] text-xs font-bold shadow-md border border-[#E5DACB] opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1.5 z-10 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#1E4D38]" />
                      <span>Xem nhanh</span>
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#1E4D38] tracking-wide uppercase">
                          {product.category_name}
                        </span>
                        <span className="font-mono text-[#8A7E72] text-[11px] font-medium">
                          {product.product_code}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-lg text-[#1F1D1B] group-hover:text-[#1E4D38] transition-colors line-clamp-1">
                        <Link href={`/product/${product.id}`}>{product.name}</Link>
                      </h3>

                      <p className="text-xs text-[#5D554D] line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      <div className="text-[11px] text-[#8A7E72] flex items-center gap-1.5 pt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                        <span className="truncate">{artisanNote}</span>
                      </div>
                    </div>

                    {/* Rating Row (Tu Quy Garden style) */}
                    <div className="flex items-center gap-2 pt-2 border-t border-[#F2ECE1]">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-[#5D554D]">
                        {rating.toFixed(1)} ({reviewCount} đánh giá)
                      </span>
                    </div>

                    {/* Bottom Row: Price & Action */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex flex-col">
                        <span className="text-lg sm:text-xl font-bold font-mono text-[#B9383A]">
                          {product.price.toLocaleString('vi-VN')}₫
                        </span>
                        {product.original_price && product.original_price > product.price && (
                          <span className="text-xs text-[#8A7E72] line-through font-mono">
                            {product.original_price.toLocaleString('vi-VN')}₫
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="px-4 py-2.5 rounded-xl bg-[#1E4D38] hover:bg-[#153828] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer select-none"
                        title="Thêm vào giỏ hàng"
                      >
                        <ShoppingBag className="w-4.5 h-4.5" />
                        <span>Thêm giỏ</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Callout Banner: Custom Order */}
          <div className="mt-8 bg-white rounded-2xl border border-[#E5DACB] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="space-y-1.5 text-center md:text-left">
              <span className="text-xs font-bold text-[#1E4D38] uppercase tracking-wider flex items-center justify-center md:justify-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
                <span>Dịch vụ dệt may độc bản theo yêu cầu</span>
              </span>
              <h4 className="text-lg sm:text-xl font-serif font-bold text-[#1F1D1B]">
                Bạn muốn may đo sản phẩm riêng theo kích thước và phối màu yêu thích?
              </h4>
              <p className="text-xs sm:text-sm text-[#5D554D] max-w-2xl">
                Tự do chọn hoa văn hộ thân Jrai, phối màu nhuộm thảo mộc tự nhiên và kích thước riêng cùng các nghệ nhân bản địa.
              </p>
            </div>
            <Link
              href="/custom-order"
              className="px-6 py-3 rounded-full bg-[#1E4D38] hover:bg-[#153828] text-white text-xs sm:text-sm font-bold transition-all shadow-xs hover:shadow whitespace-nowrap flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Khám phá Đặt May Riêng</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          MODAL: PRODUCT QUICK VIEW
      ======================================================== */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5DACB] rounded-xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200 shadow-2xl">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#F2ECE1] hover:bg-[#E5DACB] text-[#5D554D] hover:text-[#1F1D1B]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-[#E5DACB] bg-[#FBF8F3]">
                <img
                  src={selectedProduct.image_url}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3">
                <span className="text-xs font-mono text-white uppercase font-bold bg-[#C43B3D] px-2.5 py-0.5 rounded">
                  {selectedProduct.product_code} • {selectedProduct.category_name}
                </span>
                <h3 className="font-serif font-bold text-xl text-[#1F1D1B]">
                  {selectedProduct.name}
                </h3>
                <div className="text-xl sm:text-2xl font-bold font-mono text-[#C43B3D]">
                  {selectedProduct.price.toLocaleString('vi-VN')}₫
                </div>
                <p className="text-sm text-[#5D554D] leading-relaxed">
                  {selectedProduct.description}
                </p>
                <div className="text-xs sm:text-sm text-[#5D554D] space-y-1 pt-1">
                  <div><strong className="text-[#1F1D1B]">Thời gian dệt:</strong> {selectedProduct.production_time}</div>
                  <div><strong className="text-[#1F1D1B]">Chất liệu:</strong> {selectedProduct.material}</div>
                  <div><strong className="text-[#1F1D1B]">Xuất xứ:</strong> {selectedProduct.location}</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5DACB] space-y-3">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    handleAddToCart(selectedProduct);
                    setSelectedProduct(null);
                    setCartOpen(true);
                  }}
                  className="flex-1 py-3 rounded-lg bg-[#C43B3D] hover:bg-[#8A2325] text-white font-bold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>MUA NGAY / THÊM GIỎ HÀNG</span>
                </button>

                <button
                  onClick={() => {
                    setPassportCode(selectedProduct.product_code);
                    setSelectedProduct(null);
                    const el = document.getElementById('traceability');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-3 rounded-lg bg-[#F2ECE1] hover:bg-[#E5DACB] text-[#1F1D1B] text-xs sm:text-sm font-bold border border-[#E5DACB] flex items-center gap-1.5"
                >
                  <QrCode className="w-4 h-4 text-[#C43B3D]" />
                  <span>Xem mã QR</span>
                </button>
              </div>

              <Link
                href={`/product/${selectedProduct.id}`}
                onClick={() => setSelectedProduct(null)}
                className="block text-center text-xs sm:text-sm text-[#C43B3D] hover:underline font-semibold transition"
              >
                Xem toàn bộ trang chi tiết sản phẩm &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: MOTIF DETAILS - MODERN ETHNIC BOUTIQUE
      ======================================================== */}
      {selectedMotif && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] border border-[#E8DFC8] rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200 shadow-xl">
            <button
              onClick={() => setSelectedMotif(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#FAF5EC] hover:bg-[#E8DFC8] text-[#4A453F] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[4/3] bg-[#FAF5EC] rounded-xl overflow-hidden p-6 flex items-center justify-center border border-[#E8DFC8]">
              <img src={selectedMotif.image_url} alt={selectedMotif.name} className="max-h-full object-contain" />
            </div>

            <div>
              <span className="text-xs font-mono text-[#C99A45] uppercase font-semibold">
                {selectedMotif.motif_code} • {selectedMotif.theme_name}
              </span>
              <h3 className="font-serif font-semibold text-xl text-[#174C38] mt-1">
                {selectedMotif.name}
              </h3>
            </div>

            <div className="space-y-3 text-sm text-[#4A453F] leading-relaxed">
              <div>
                <strong className="text-[#174C38] block mb-1 font-semibold">Ý nghĩa biểu tượng:</strong>
                <p>{selectedMotif.meaning}</p>
              </div>
              {selectedMotif.philosophy && (
                <div>
                  <strong className="text-[#174C38] block mb-1 font-semibold">Triết lý văn hóa Jrai:</strong>
                  <p>{selectedMotif.philosophy}</p>
                </div>
              )}
              {selectedMotif.informant_name && (
                <div className="p-3 bg-[#FAF5EC] rounded-xl border border-[#E8DFC8] text-xs sm:text-sm text-[#5D554D]">
                  <strong className="text-[#174C38]">Nguồn xác minh điền dã:</strong> {selectedMotif.informant_name} ({selectedMotif.verification_source})
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ARTISAN DETAILS - MODERN ETHNIC BOUTIQUE
      ======================================================== */}
      {selectedArtisanModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] border border-[#E8DFC8] rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200 shadow-xl">
            <button
              onClick={() => setSelectedArtisanModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#FAF5EC] hover:bg-[#E8DFC8] text-[#4A453F] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[#E8DFC8] bg-[#FAF5EC]">
              <img
                src={selectedArtisanModal.avatar || selectedArtisanModal.image_url}
                alt={selectedArtisanModal.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <span className="text-xs font-mono text-[#C99A45] uppercase font-semibold">
                {selectedArtisanModal.experience} • {selectedArtisanModal.village}
              </span>
              <h3 className="font-serif font-semibold text-xl text-[#174C38] mt-1">
                {selectedArtisanModal.name}
              </h3>
            </div>

            <p className="text-sm text-[#174C38] italic p-3.5 bg-[#FAF5EC] rounded-xl border border-[#E8DFC8]">
              &ldquo;{selectedArtisanModal.quote}&rdquo;
            </p>

            <p className="text-sm text-[#4A453F] leading-relaxed">
              {selectedArtisanModal.bio || `${selectedArtisanModal.name} là nghệ nhân kỳ cựu gìn giữ nghề dệt thổ cẩm cửi hông tại ${selectedArtisanModal.village}.`}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================
          SLIDE-OVER CART DRAWER & INLINE CHECKOUT - MODERN ETHNIC BOUTIQUE
      ======================================================== */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="bg-[#FFFDF9] w-full max-w-md h-full p-6 flex flex-col justify-between border-l border-[#E8DFC8] shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="space-y-4 flex-1 overflow-y-auto pr-1">
              <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#174C38]" />
                  <h3 className="font-serif font-semibold text-lg text-[#174C38]">Giỏ Hàng Của Bạn</h3>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 rounded-full bg-[#FAF5EC] hover:bg-[#E8DFC8] text-[#4A453F] transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Free ship progress */}
              <div className="p-3 bg-[#FAF5EC] rounded-xl border border-[#E8DFC8] text-xs sm:text-sm">
                {isFreeShip ? (
                  <span className="text-[#174C38] font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#174C38]" />
                    Đơn hàng đủ điều kiện MIỄN PHÍ VẬN CHUYỂN TOÀN QUỐC!
                  </span>
                ) : (
                  <span className="text-[#5D554D]">
                    Mua thêm <strong className="text-[#A94335]">{(freeShipThreshold - cartTotal.subtotal).toLocaleString('vi-VN')}₫</strong> để được FreeShip!
                  </span>
                )}
              </div>

              {/* Items List */}
              {cartItems.length === 0 ? (
                <div className="py-12 text-center text-[#8A7E72] text-sm space-y-3">
                  <ShoppingBag className="w-10 h-10 text-[#C99A45] mx-auto opacity-60" />
                  <p>Giỏ hàng đang trống.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.productId}
                      className="p-3 bg-[#FAF5EC] rounded-xl border border-[#E8DFC8] flex items-center gap-3"
                    >
                      <img
                        src={item.product?.image_url || '/images/products/k001.jpg'}
                        alt={item.product?.name || 'Sản phẩm'}
                        className="w-14 h-14 object-cover rounded-lg border border-[#E8DFC8] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-[#174C38] truncate">{item.product?.name}</h4>
                        <span className="text-xs font-mono text-[#C99A45]">{item.product?.product_code}</span>
                        <div className="text-sm font-semibold text-[#A94335] mt-0.5">
                          {((item.product?.price || 0) * item.quantity).toLocaleString('vi-VN')}₫
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-[#FFFDF9] px-2 py-1 rounded-md border border-[#E8DFC8]">
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          className="text-[#5D554D] hover:text-[#174C38] p-0.5 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold px-1.5 text-[#1F1D1B]">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          className="text-[#5D554D] hover:text-[#174C38] p-0.5 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-[#8A7E72] hover:text-[#A94335] p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cartItems.length > 0 && (
              <div className="pt-4 border-t border-[#E8DFC8] space-y-3">
                <div className="flex justify-between items-center text-sm font-semibold text-[#174C38]">
                  <span>Tổng tiền thanh toán:</span>
                  <span className="text-lg font-mono font-semibold text-[#A94335]">{cartTotal.subtotal.toLocaleString('vi-VN')}₫</span>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-3.5 rounded-xl bg-[#174C38] hover:bg-[#123829] text-white font-semibold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <CreditCard className="w-4 h-4 text-[#C99A45]" />
                  <span>TIẾN HÀNH THANH TOÁN (3 BƯỚC)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: INLINE CHECKOUT & ORDER SUCCESS - MODERN ETHNIC BOUTIQUE
      ======================================================== */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] border border-[#E8DFC8] rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200 shadow-2xl">
            <button
              onClick={() => {
                setCheckoutOpen(false);
                setOrderCreatedId(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#FAF5EC] hover:bg-[#E8DFC8] text-[#4A453F] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {orderCreatedId ? (
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 rounded-full bg-[#EAF3EE] border border-[#174C38]/30 text-[#174C38] flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-semibold text-2xl text-[#174C38]">Đặt Hàng Thành Công!</h3>
                <p className="text-sm text-[#4A453F]">
                  Mã đơn hàng của bạn là: <strong className="text-[#C99A45] font-mono text-base">{orderCreatedId}</strong>
                </p>

                {paymentMethod === 'banking' && (
                  <div className="p-4 bg-[#FAF5EC] rounded-xl border border-[#E8DFC8] space-y-3">
                    <span className="text-xs sm:text-sm font-semibold text-[#174C38] block">Mã VietQR Chuyển Khoản Tự Động:</span>
                    <img
                      src={`https://img.vietqr.io/image/970422-0383451929-compact2.png?amount=${cartTotal.subtotal}&addInfo=${encodeURIComponent(orderCreatedId)}&accountName=${encodeURIComponent('NGUYEN VAN THANG')}`}
                      alt="VietQR MB Bank"
                      className="w-48 h-48 mx-auto rounded-xl border border-[#E8DFC8] shadow-xs"
                    />
                    <div className="text-xs sm:text-sm text-[#4A453F] space-y-0.5 text-left">
                      <p>Ngân hàng: <strong className="text-[#1F1D1B]">MB Bank</strong></p>
                      <p>Số tài khoản: <strong className="text-[#1F1D1B]">0383451929</strong></p>
                      <p>Chủ tài khoản: <strong className="text-[#1F1D1B]">NGUYEN VAN THANG</strong></p>
                      <p>Nội dung: <strong className="text-[#174C38] font-mono">{orderCreatedId}</strong></p>
                    </div>
                  </div>
                )}

                <p className="text-xs sm:text-sm text-[#5D554D]">
                  Cảm ơn bạn đã đồng hành bảo tồn nghề dệt thổ cẩm Jrai!
                </p>

                <button
                  onClick={() => {
                    setCheckoutOpen(false);
                    setOrderCreatedId(null);
                  }}
                  className="w-full py-3.5 rounded-xl bg-[#174C38] hover:bg-[#123829] text-white font-semibold text-sm shadow-sm transition cursor-pointer"
                >
                  HOÀN TẤT & TIẾP TỤC KHÁM PHÁ
                </button>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="border-b border-[#E8DFC8] pb-3">
                  <h3 className="font-serif font-semibold text-xl text-[#174C38]">Thanh Toán Đơn Hàng</h3>
                  <p className="text-xs sm:text-sm text-[#5D554D]">
                    Tổng giá trị đơn ({cartTotal.count} món): <strong className="text-[#A94335] font-mono font-semibold">{cartTotal.subtotal.toLocaleString('vi-VN')}₫</strong>
                  </p>
                </div>

                {customerUser && (
                  <div className="bg-[#FAF5EC] border border-[#E8DFC8] rounded-xl p-3 flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-[#C99A45]/50 bg-white shrink-0">
                        <img
                          src={customerUser.avatar || '/images/team/MaiThiCamTu_user.png'}
                          alt={customerUser.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-semibold text-[#174C38] block">{customerUser.name}</span>
                        <span className="text-xs text-[#5D554D]">
                          {customerUser.provider ? `Đã xác thực qua ${customerUser.provider.toUpperCase()}` : customerUser.email}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs bg-[#EAF3EE] text-[#174C38] font-semibold px-2 py-0.5 rounded-full border border-[#174C38]/20">
                      Đã đăng nhập
                    </span>
                  </div>
                )}

                <div className="space-y-3 text-xs sm:text-sm">
                  <div>
                    <label className="text-[#1F1D1B] font-medium block mb-1">Họ và tên người nhận *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Nguyễn Văn A"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-[#FAF5EC] border border-[#E8DFC8] rounded-xl px-3.5 py-2.5 text-[#1F1D1B] focus:outline-none focus:border-[#174C38] text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-[#1F1D1B] font-medium block mb-1">Số điện thoại *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Ví dụ: 0987654321"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-[#FAF5EC] border border-[#E8DFC8] rounded-xl px-3.5 py-2.5 text-[#1F1D1B] focus:outline-none focus:border-[#174C38] text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-[#1F1D1B] font-medium block mb-1">Địa chỉ giao hàng chi tiết *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành..."
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full bg-[#FAF5EC] border border-[#E8DFC8] rounded-xl px-3.5 py-2.5 text-[#1F1D1B] focus:outline-none focus:border-[#174C38] text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-[#1F1D1B] font-medium block mb-1">Phương thức thanh toán</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('banking')}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          paymentMethod === 'banking'
                            ? 'bg-[#EAF3EE] border-[#174C38] text-[#174C38]'
                            : 'bg-[#FAF5EC] border-[#E8DFC8] text-[#5D554D]'
                        }`}
                      >
                        <div className="font-semibold text-sm">VietQR Tự Động</div>
                        <div className="text-xs text-[#7A7265] mt-0.5">Quét mã ngân hàng</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cod')}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          paymentMethod === 'cod'
                            ? 'bg-[#EAF3EE] border-[#174C38] text-[#174C38]'
                            : 'bg-[#FAF5EC] border-[#E8DFC8] text-[#5D554D]'
                        }`}
                      >
                        <div className="font-semibold text-sm">Thanh toán COD</div>
                        <div className="text-xs text-[#7A7265] mt-0.5">Nhận hàng trả tiền</div>
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#174C38] hover:bg-[#123829] text-white font-semibold text-sm shadow-sm transition cursor-pointer"
                >
                  XÁC NHẬN ĐẶT HÀNG ({cartTotal.subtotal.toLocaleString('vi-VN')}₫)
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: CUSTOMER AUTH (GOOGLE / FACEBOOK LOGIN FOR CHECKOUT)
      ======================================================== */}
      <CustomerAuthModal
        isOpen={customerAuthOpen}
        onClose={() => setCustomerAuthOpen(false)}
        onSuccess={(user) => {
          setCustomerUser(user);
          setCustomerName(user.name);
          setCustomerPhone(user.phone);
          setCustomerAuthOpen(false);
          setCheckoutOpen(true);
        }}
      />
    </div>
  );
}

