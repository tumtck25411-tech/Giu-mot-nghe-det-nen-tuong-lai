'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Clock,
  MapPin,
  User,
  ChevronRight,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  Heart,
  Share2,
  CheckCircle2,
  Star,
  QrCode,
  Layers,
  MessageSquare,
  Check,
} from 'lucide-react';
import {
  getProductById,
  getMotifs,
  getArtisanById,
  getProducts,
  getReviews,
  addReview,
  addToCart,
  toggleWishlist,
  isInWishlist,
  getPublicDomain,
  syncWithServer,
} from '@/lib/data-store';
import { Product, Motif, Artisan, Review } from '@/types';
import QRCodeGenerator from '@/components/QRCodeGenerator';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [linkedMotifs, setLinkedMotifs] = useState<Motif[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadData = () => {
      const foundProduct = getProductById(id);
      if (foundProduct) {
        setProduct(foundProduct);
        setActiveImage(foundProduct.image_url);

        if (foundProduct.artisan_id) {
          const foundArtisan = getArtisanById(foundProduct.artisan_id);
          if (foundArtisan) setArtisan(foundArtisan);
        }

        const allMotifs = getMotifs(true);
        const motifsForProd = allMotifs.filter((m) =>
          foundProduct.motif_ids?.includes(m.id) || foundProduct.motif_id === m.id
        );
        setLinkedMotifs(motifsForProd);

        const allProds = getProducts(true);
        const related = allProds
          .filter((p) => p.category === foundProduct.category && p.id !== foundProduct.id)
          .slice(0, 4);
        setRelatedProducts(related.length > 0 ? related : allProds.filter((p) => p.id !== foundProduct.id).slice(0, 4));

        setReviews(getReviews(foundProduct.id));
      }
    };

    loadData();
    syncWithServer().then(() => loadData());

    window.addEventListener('jrai_store_updated', loadData);
    return () => window.removeEventListener('jrai_store_updated', loadData);
  }, [id]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-serif font-bold text-white">
          Không tìm thấy thông tin sản phẩm!
        </h1>
        <p className="text-stone-400 text-sm">
          Mã sản phẩm hoặc liên kết không tồn tại trong hệ thống.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-[#B9383A] text-white font-bold text-xs py-3 px-6 rounded-xl shadow"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh mục sản phẩm</span>
        </Link>
      </div>
    );
  }

  const inWish = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedNotice(`Đã thêm ${quantity} x "${product.name}" vào giỏ hàng!`);
    setTimeout(() => setAddedNotice(null), 3500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    addReview({
      productId: product.id,
      productCode: product.product_code,
      customerName: reviewerName.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
      isVerifiedPurchase: true,
    });

    setReviewerName('');
    setReviewComment('');
    setShowReviewForm(false);
    setReviews(getReviews(product.id));
    setAddedNotice('Cảm ơn bạn! Đánh giá đã được ghi nhận.');
    setTimeout(() => setAddedNotice(null), 3000);
  };

  const traceabilityUrl = `${getPublicDomain()}/traceability?code=${product.product_code}`;

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-12">
      {/* Toast Feedback */}
      {addedNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#B9383A] text-white px-5 py-3.5 rounded-2xl shadow-sm border border-amber-400/40 flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-5 h-5 text-amber-300" />
          <span className="text-xs font-bold">{addedNotice}</span>
          <Link href="/cart" className="text-xs underline font-bold ml-2 text-amber-200">
            Xem giỏ &rarr;
          </Link>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#5D554D]">
        <Link href="/" className="hover:text-[#C43B3D] transition">
          Trang chủ
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#8A7E72]" />
        <Link href="/products" className="hover:text-[#C43B3D] transition">
          Sản phẩm
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#8A7E72]" />
        <Link
          href={`/products?category=${product.category}`}
          className="hover:text-[#C43B3D] transition text-[#5D554D]"
        >
          {product.category_name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#8A7E72]" />
        <span className="text-[#C43B3D] font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* TOP SECTION: GALLERY + PRIMARY BUYING ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Image Gallery (5 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square bg-[#FBF8F3] rounded-xl overflow-hidden border border-[#E5DACB] shadow-sm">
            <img
              src={activeImage || product.image_url}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="bg-[#C43B3D] text-white text-xs font-black uppercase px-3 py-1 rounded-full shadow-sm">
                {product.category_name}
              </span>
              <span className="bg-white/90 backdrop-blur-sm text-[#1F1D1B] text-xs font-mono px-2.5 py-0.5 rounded border border-[#E5DACB]">
                MÃ: {product.product_code}
              </span>
            </div>
          </div>

          {/* Thumbnails switcher */}
          {product.additional_images && product.additional_images.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveImage(product.image_url)}
                className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition ${
                  activeImage === product.image_url
                    ? 'border-[#C43B3D] ring-2 ring-[#C43B3D]/30'
                    : 'border-[#E5DACB] opacity-70 hover:opacity-100'
                }`}
              >
                <img src={product.image_url} alt="Main" className="w-full h-full object-cover" />
              </button>
              {product.additional_images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition ${
                    activeImage === img
                      ? 'border-[#C43B3D] ring-2 ring-[#C43B3D]/30'
                      : 'border-[#E5DACB] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Extra ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Fast QR Passport Quick Banner */}
          <div className="p-4 bg-white rounded-xl border border-[#E5DACB] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#F2ECE1] rounded-xl text-[#C43B3D]">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1F1D1B]">Mã QR Định Danh Độc Bản</p>
                <p className="text-xs text-[#5D554D]">Xem minh bạch giờ dệt, thợ dệt & hoa văn</p>
              </div>
            </div>
            <Link
              href={`/traceability?code=${product.product_code}`}
              className="text-xs bg-[#F2ECE1] hover:bg-[#E5DACB] text-[#1F1D1B] font-bold px-3.5 py-2 rounded-xl border border-[#E5DACB] transition"
            >
              Tra cứu &rarr;
            </Link>
          </div>
        </div>

        {/* Right Column: Buying Box & Specifications (7 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs font-mono font-bold text-[#EA8E23] uppercase tracking-wider">
              {product.product_code} • THỔ CẨM GIA LAI
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-[#1F1D1B] mt-1 leading-tight">
              {product.name}
            </h1>
            <p className="text-xs text-[#5D554D] mt-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price & Stock */}
          <div className="p-5 bg-white rounded-xl border border-[#E5DACB] shadow-sm flex items-center justify-between">
            <div>
              <div className="text-3xl font-black text-[#C43B3D] font-serif">
                {product.price.toLocaleString('vi-VN')}₫
              </div>
              {product.original_price && product.original_price > product.price && (
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-[#8A7E72] line-through">
                    {product.original_price.toLocaleString('vi-VN')}₫
                  </span>
                  <span className="text-xs font-bold bg-[#C43B3D] text-white px-2 py-0.5 rounded-full">
                    Tiết kiệm {((product.original_price - product.price) / 1000).toFixed(0)}k
                  </span>
                </div>
              )}
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Còn {product.stock_quantity || 8} sản phẩm</span>
              </span>
              <p className="text-xs text-[#5D554D] mt-1">Dệt tay độc bản tại Làng Kép</p>
            </div>
          </div>

          {/* Artisan & Cultural Quick Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-[#FBF8F3] rounded-xl border border-[#E5DACB] flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#EA8E23] shrink-0" />
              <div>
                <span className="text-xs text-[#8A7E72] uppercase font-bold block">Thời gian dệt</span>
                <span className="text-xs font-bold text-[#1F1D1B]">{product.production_time}</span>
              </div>
            </div>

            <div className="p-3.5 bg-[#FBF8F3] rounded-xl border border-[#E5DACB] flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#EA8E23] shrink-0" />
              <div>
                <span className="text-xs text-[#8A7E72] uppercase font-bold block">Địa bàn dệt</span>
                <span className="text-xs font-bold text-[#1F1D1B] truncate block max-w-[140px]">
                  {product.location || 'Ia Mơ Nông, Chư Păh'}
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-[#FBF8F3] rounded-xl border border-[#E5DACB] flex items-center gap-3">
              <Layers className="w-5 h-5 text-[#EA8E23] shrink-0" />
              <div>
                <span className="text-xs text-[#8A7E72] uppercase font-bold block">Chất liệu</span>
                <span className="text-xs font-bold text-[#1F1D1B] truncate block max-w-[140px]">
                  {product.material}
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-[#FBF8F3] rounded-xl border border-[#E5DACB] flex items-center gap-3">
              <User className="w-5 h-5 text-[#EA8E23] shrink-0" />
              <div>
                <span className="text-xs text-[#8A7E72] uppercase font-bold block">Nghệ nhân thực hiện</span>
                <span className="text-xs font-bold text-[#1F1D1B] truncate block max-w-[140px]">
                  {product.artisan_name || 'Nghệ nhân Jrai'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Row: Quantity + Add to Cart + Buy Now + Wishlist */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity Adjuster */}
              <div className="flex items-center bg-[#FBF8F3] border border-[#E5DACB] rounded-2xl p-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-xl bg-white hover:bg-[#F2ECE1] text-[#1F1D1B] font-black text-base flex items-center justify-center transition border border-[#E5DACB]"
                >
                  -
                </button>
                <span className="w-12 text-center text-sm font-bold text-[#1F1D1B] font-mono">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 rounded-xl bg-white hover:bg-[#F2ECE1] text-[#1F1D1B] font-black text-base flex items-center justify-center transition border border-[#E5DACB]"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-[#F2ECE1] hover:bg-[#E5DACB] text-[#1F1D1B] font-bold text-sm border border-[#E5DACB] flex items-center justify-center gap-2 shadow-sm transition"
              >
                <ShoppingBag className="w-4 h-4 text-[#C43B3D]" />
                <span>THÊM VÀO GIỎ HÀNG</span>
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-2xl border transition shadow-sm ${
                  inWish
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'bg-[#FBF8F3] border-[#E5DACB] text-[#5D554D] hover:text-red-500'
                }`}
                title={inWish ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
              >
                <Heart className={`w-5 h-5 ${inWish ? 'fill-red-500 text-red-500' : ''}`} />
              </button>

              {/* Share Button */}
              <button
                type="button"
                onClick={handleShare}
                className="p-3.5 rounded-2xl bg-[#FBF8F3] border border-[#E5DACB] text-[#5D554D] hover:text-[#1F1D1B] transition shadow-sm"
                title="Sao chép liên kết"
              >
                {copiedLink ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
              </button>
            </div>

            {/* Buy Now Button (Fast Checkout) */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full py-4 px-6 rounded-2xl bg-[#C43B3D] hover:bg-[#8A2325] text-white font-serif font-bold text-base shadow-md transition"
            >
              MUA NGAY (TIẾN HÀNH THANH TOÁN)
            </button>
          </div>

          {/* Guarantees Badges */}
          <div className="p-4 bg-[#FBF8F3] rounded-xl border border-[#E5DACB] text-xs text-[#5D554D] space-y-2">
            <p className="flex items-center gap-2 text-[#1F1D1B]">
              <ShieldCheck className="w-4 h-4 text-[#EA8E23]" />
              <span><strong>Cam kết JRAI ƠI:</strong> 100% thù lao trả trực tiếp cho nghệ nhân làng Kép.</span>
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Kiểm tra hàng trước khi thanh toán (COD), đổi trả trong 7 ngày nếu có lỗi kỹ thuật dệt.</span>
            </p>
          </div>
        </div>
      </div>

      {/* SECTION: CÂU CHUYỆN ĐẰNG SAU SẢN PHẨM (DEDICATED SECTION) */}
      <section className="bg-white p-8 sm:p-12 rounded-xl border border-[#E5DACB] shadow-sm space-y-8">
        <div className="border-b border-[#E5DACB] pb-4">
          <span className="section-tag gold mb-2 inline-flex">
            <Sparkles className="w-3.5 h-3.5 text-[#EA8E23]" />
            <span>Hồ Sơ Di Sản & Nhân Sinh Quan</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#1F1D1B]">
            CÂU CHUYỆN ĐẰNG SAU SẢN PHẨM
          </h2>
          <p className="text-sm font-serif italic text-[#EA8E23] mt-1">
            {product.story_title || '“Giữ hồn di sản trong từng đường dệt Jrai”'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Story Narrative (8 Cols) */}
          <div className="lg:col-span-8 space-y-4 text-sm text-[#5D554D] leading-relaxed font-normal">
            {product.story_paragraphs && product.story_paragraphs.length > 0 ? (
              product.story_paragraphs.map((para, i) => (
                <p key={i} className="leading-relaxed">
                  {para}
                </p>
              ))
            ) : (
              <p className="whitespace-pre-line leading-relaxed">{product.story}</p>
            )}

            {product.impact && (
              <div className="p-4 bg-[#FDF6ED] rounded-xl border border-[#EA8E23]/40 text-xs text-[#1F1D1B] mt-6">
                <strong>Tác động cộng đồng:</strong> {product.impact}
              </div>
            )}
          </div>

          {/* Linked Artisan & Motif Profile Cards (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Artisan Profile Box */}
            {artisan && (
              <div className="bg-[#FBF8F3] p-5 rounded-2xl border border-[#E5DACB] space-y-3 shadow-sm">
                <div className="text-xs font-bold text-[#EA8E23] uppercase tracking-wider">
                  Nghệ Nhân Thực Hiện
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={artisan.avatar || artisan.image_url}
                    alt={artisan.name}
                    className="w-14 h-14 object-cover rounded-full border border-[#E5DACB]"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#1F1D1B]">{artisan.name}</h4>
                    <p className="text-xs text-[#5D554D]">{artisan.experience}</p>
                    <p className="text-xs text-[#EA8E23]">{artisan.village}</p>
                  </div>
                </div>
                {artisan.quote && (
                  <p className="text-xs text-[#5D554D] italic bg-white p-3 rounded-xl border border-[#E5DACB]">
                    &ldquo;{artisan.quote}&rdquo;
                  </p>
                )}
                <Link
                  href={`/artisan/${artisan.id}`}
                  className="block text-center text-xs font-bold text-[#1F1D1B] hover:text-[#C43B3D] bg-white py-2 rounded-xl border border-[#E5DACB] transition"
                >
                  Xem hồ sơ nghệ nhân &rarr;
                </Link>
              </div>
            )}

            {/* Linked Motif Box */}
            {linkedMotifs.length > 0 && (
              <div className="bg-[#FBF8F3] p-5 rounded-2xl border border-[#E5DACB] space-y-3 shadow-sm">
                <div className="text-xs font-bold text-[#EA8E23] uppercase tracking-wider">
                  Hoa Văn Ứng Dụng
                </div>
                {linkedMotifs.map((m) => (
                  <div key={m.id} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white p-1.5 rounded-xl border border-[#E5DACB] flex items-center justify-center shrink-0">
                        <img src={m.image_url} alt={m.name} className="max-h-full object-contain" />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-xs text-[#1F1D1B] line-clamp-1">{m.name}</h4>
                        <span className="text-xs font-mono text-[#EA8E23]">{m.motif_code}</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#5D554D] line-clamp-3">
                      {m.meaning || m.philosophy}
                    </p>
                    <Link
                      href={`/motif/${m.id}`}
                      className="block text-center text-xs font-bold text-[#1F1D1B] hover:text-[#C43B3D] bg-white py-2 rounded-xl border border-[#E5DACB] transition"
                    >
                      Giải mã hoa văn {m.motif_code} &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION: DIGITAL PRODUCT PASSPORT (QR CODE TRACEABILITY) */}
      <section className="bg-white p-8 sm:p-12 rounded-xl border border-[#E5DACB] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DACB] pb-4">
          <div>
            <span className="section-tag gold mb-2 inline-flex">
              <QrCode className="w-3.5 h-3.5 text-[#EA8E23]" />
              <span>HỆ THỐNG ĐỊNH DANH SỐ QR</span>
            </span>
            <h2 className="text-2xl font-serif font-black text-[#1F1D1B]">
              Hộ Chiếu Số & Tem Truy Xuất Nguồn Gốc
            </h2>
            <p className="text-xs text-[#5D554D] mt-1">
              Mã QR này được in trên thẻ mác gắn kèm mỗi sản phẩm gửi đến quý khách hàng.
            </p>
          </div>

          <Link
            href={`/traceability?code=${product.product_code}`}
            className="inline-flex items-center gap-2 bg-[#C43B3D] hover:bg-[#8A2325] text-white text-xs font-bold px-5 py-3 rounded-xl shadow transition"
          >
            <QrCode className="w-4 h-4" />
            <span>Xem trang hộ chiếu số</span>
          </Link>
        </div>

        <QRCodeGenerator
          productUrl={traceabilityUrl}
          productName={product.name}
          productCode={product.product_code}
          category={product.category_name}
          location={product.location}
        />
      </section>

      {/* SECTION: ĐÁNH GIÁ SẢN PHẨM & GỬI NHẬN XÉT */}
      <section className="bg-white p-8 sm:p-10 rounded-xl border border-[#E5DACB] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DACB] pb-4">
          <div>
            <h3 className="text-xl font-serif font-black text-[#1F1D1B] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#EA8E23]" />
              <span>Đánh Giá Từ Khách Hàng ({reviews.length})</span>
            </h3>
            <p className="text-xs text-[#5D554D] mt-0.5">
              Những chia sẻ chân thực từ khách hàng đã sở hữu tác phẩm thổ cẩm này.
            </p>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="text-xs font-bold bg-[#F2ECE1] hover:bg-[#E5DACB] text-[#1F1D1B] px-4 py-2.5 rounded-xl border border-[#E5DACB] transition"
          >
            {showReviewForm ? 'Đóng biểu mẫu' : 'Viết đánh giá của bạn'}
          </button>
        </div>

        {/* Review Form Modal/Drawer */}
        {showReviewForm && (
          <form onSubmit={handleReviewSubmit} className="p-5 bg-[#FBF8F3] rounded-2xl border border-[#E5DACB] space-y-4">
            <h4 className="text-sm font-bold text-[#1F1D1B]">Gửi nhận xét của bạn về sản phẩm</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#5D554D] font-bold block mb-1">Họ và tên của bạn</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hoàng Minh"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full bg-white border border-[#E5DACB] rounded-xl px-3.5 py-2 text-xs text-[#1F1D1B] placeholder-[#8A7E72] focus:outline-none focus:border-[#C43B3D]"
                />
              </div>

              <div>
                <label className="text-xs text-[#5D554D] font-bold block mb-1">Đánh giá sao</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full bg-white border border-[#E5DACB] rounded-xl px-3.5 py-2 text-xs text-[#1F1D1B] focus:outline-none focus:border-[#C43B3D]"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 sao - Tuyệt vời)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 sao - Rất tốt)</option>
                  <option value={3}>⭐⭐⭐ (3 sao - Hài lòng)</option>
                  <option value={2}>⭐⭐ (2 sao - Trung bình)</option>
                  <option value={1}>⭐ (1 sao - Cần cải thiện)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-[#5D554D] font-bold block mb-1">Nội dung nhận xét</label>
              <textarea
                required
                rows={3}
                placeholder="Chia sẻ cảm nhận về độ đanh mịn của sợi, màu sắc thảo mộc và câu chuyện di sản..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full bg-white border border-[#E5DACB] rounded-xl p-3 text-xs text-[#1F1D1B] placeholder-[#8A7E72] focus:outline-none focus:border-[#C43B3D]"
              />
            </div>

            <button
              type="submit"
              className="bg-[#C43B3D] hover:bg-[#8A2325] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow transition"
            >
              GỬI ĐÁNH GIÁ
            </button>
          </form>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <p className="text-xs text-[#8A7E72] italic py-4">
            Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên trải nghiệm và chia sẻ!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((r) => (
              <div key={r.id} className="p-4 bg-[#FBF8F3] rounded-2xl border border-[#E5DACB] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1F1D1B]">{r.customerName}</span>
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
                      Đã mua hàng
                    </span>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[#5D554D] leading-relaxed italic">&ldquo;{r.comment}&rdquo;</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION: SẢN PHẨM LIÊN QUAN */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-serif font-black text-[#1F1D1B]">
              Sản Phẩm Cùng Danh Mục
            </h3>
            <Link
              href={`/products?category=${product.category}`}
              className="text-xs font-bold text-[#C43B3D] hover:underline"
            >
              Xem tất cả &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rp) => (
              <Link
                key={rp.id}
                href={`/product/${rp.id}`}
                className="group bg-white rounded-xl border border-[#E5DACB] hover:border-[#C43B3D] overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between hover:-translate-y-1"
              >
                <div className="aspect-[4/3] bg-[#FBF8F3] overflow-hidden">
                  <img
                    src={rp.image_url}
                    alt={rp.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <span className="text-xs font-mono text-[#EA8E23]">{rp.product_code}</span>
                  <h4 className="font-serif font-bold text-xs text-[#1F1D1B] group-hover:text-[#C43B3D] line-clamp-1">
                    {rp.name}
                  </h4>
                  <div className="text-sm font-black text-[#C43B3D]">
                    {rp.price.toLocaleString('vi-VN')}₫
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
