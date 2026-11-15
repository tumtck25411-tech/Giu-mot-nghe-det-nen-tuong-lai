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
      <nav className="flex items-center gap-2 text-xs text-stone-400">
        <Link href="/" className="hover:text-white transition">
          Trang chủ
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
        <Link href="/products" className="hover:text-white transition">
          Sản phẩm
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
        <Link
          href={`/products?category=${product.category}`}
          className="hover:text-white transition text-stone-300"
        >
          {product.category_name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
        <span className="text-amber-400 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* TOP SECTION: GALLERY + PRIMARY BUYING ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Image Gallery (5 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square bg-[#1A1412] rounded-xl overflow-hidden border border-amber-900/40 shadow-sm">
            <img
              src={activeImage || product.image_url}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="bg-[#B9383A] text-white text-xs font-black uppercase px-3 py-1 rounded-full shadow">
                {product.category_name}
              </span>
              <span className="bg-stone-950/80 backdrop-blur-sm text-amber-300 text-xs font-mono px-2.5 py-0.5 rounded border border-amber-500/40">
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
                    ? 'border-amber-400 ring-2 ring-amber-400/30'
                    : 'border-stone-800 opacity-70 hover:opacity-100'
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
                      ? 'border-amber-400 ring-2 ring-amber-400/30'
                      : 'border-stone-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Extra ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Fast QR Passport Quick Banner */}
          <div className="p-4 bg-[#231C18] rounded-2xl border border-amber-900/40 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#8B2522] rounded-xl text-amber-300">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Mã QR Định Danh Độc Bản</p>
                <p className="text-xs text-stone-400">Xem minh bạch giờ dệt, thợ dệt & hoa văn</p>
              </div>
            </div>
            <Link
              href={`/traceability?code=${product.product_code}`}
              className="text-xs bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold px-3.5 py-2 rounded-xl border border-amber-900/60 transition"
            >
              Tra cứu &rarr;
            </Link>
          </div>
        </div>

        {/* Right Column: Buying Box & Specifications (7 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wider">
              {product.product_code} • THỔ CẨM GIA LAI
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-[#FFFDF9] mt-1 leading-tight">
              {product.name}
            </h1>
            <p className="text-xs text-stone-400 mt-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price & Stock */}
          <div className="p-5 bg-[#231C18] rounded-2xl border border-amber-900/40 flex items-center justify-between">
            <div>
              <div className="text-3xl font-black text-amber-400 font-serif">
                {product.price.toLocaleString('vi-VN')}₫
              </div>
              {product.original_price && product.original_price > product.price && (
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-stone-500 line-through">
                    {product.original_price.toLocaleString('vi-VN')}₫
                  </span>
                  <span className="text-xs font-bold bg-[#B9383A] text-white px-2 py-0.5 rounded-full">
                    Tiết kiệm {((product.original_price - product.price) / 1000).toFixed(0)}k
                  </span>
                </div>
              )}
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/40">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Còn {product.stock_quantity || 8} sản phẩm</span>
              </span>
              <p className="text-xs text-stone-400 mt-1">Dệt tay độc bản tại Làng Kép</p>
            </div>
          </div>

          {/* Artisan & Cultural Quick Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-[#1C1714] rounded-xl border border-stone-800 flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <span className="text-xs text-stone-500 uppercase font-bold block">Thời gian dệt</span>
                <span className="text-xs font-bold text-stone-200">{product.production_time}</span>
              </div>
            </div>

            <div className="p-3.5 bg-[#1C1714] rounded-xl border border-stone-800 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <span className="text-xs text-stone-500 uppercase font-bold block">Địa bàn dệt</span>
                <span className="text-xs font-bold text-stone-200 truncate block max-w-[140px]">
                  {product.location || 'Ia Mơ Nông, Chư Păh'}
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-[#1C1714] rounded-xl border border-stone-800 flex items-center gap-3">
              <Layers className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <span className="text-xs text-stone-500 uppercase font-bold block">Chất liệu</span>
                <span className="text-xs font-bold text-stone-200 truncate block max-w-[140px]">
                  {product.material}
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-[#1C1714] rounded-xl border border-stone-800 flex items-center gap-3">
              <User className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <span className="text-xs text-stone-500 uppercase font-bold block">Nghệ nhân thực hiện</span>
                <span className="text-xs font-bold text-stone-200 truncate block max-w-[140px]">
                  {product.artisan_name || 'Nghệ nhân Jrai'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Row: Quantity + Add to Cart + Buy Now + Wishlist */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity Adjuster */}
              <div className="flex items-center bg-[#231C18] border border-amber-900/50 rounded-2xl p-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 font-black text-base flex items-center justify-center transition"
                >
                  -
                </button>
                <span className="w-12 text-center text-sm font-bold text-white font-mono">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 font-black text-base flex items-center justify-center transition"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-[#2A201A] hover:bg-[#382B23] text-amber-300 font-bold text-sm border border-amber-600/50 flex items-center justify-center gap-2 shadow-lg transition hover:scale-[1.01]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>THÊM VÀO GIỎ HÀNG</span>
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-2xl border transition shadow-sm ${
                  inWish
                    ? 'bg-red-950/80 border-red-600 text-red-400'
                    : 'bg-[#231C18] border-amber-900/40 text-stone-400 hover:text-white'
                }`}
                title={inWish ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
              >
                <Heart className={`w-5 h-5 ${inWish ? 'fill-red-500 text-red-500' : ''}`} />
              </button>

              {/* Share Button */}
              <button
                type="button"
                onClick={handleShare}
                className="p-3.5 rounded-2xl bg-[#231C18] border border-amber-900/40 text-stone-400 hover:text-white transition shadow-sm"
                title="Sao chép liên kết"
              >
                {copiedLink ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
              </button>
            </div>

            {/* Buy Now Button (Fast Checkout) */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#B9383A] to-[#8B2522] hover:from-[#A83232] hover:to-[#7A1F1C] text-white font-serif font-bold text-base shadow-xl border border-amber-500/40 transition hover:scale-[1.01]"
            >
              MUA NGAY (TIẾN HÀNH THANH TOÁN)
            </button>
          </div>

          {/* Guarantees Badges */}
          <div className="p-4 bg-[#181411] rounded-2xl border border-amber-900/30 text-xs text-stone-400 space-y-2">
            <p className="flex items-center gap-2 text-stone-300">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span><strong>Cam kết JRAI ƠI:</strong> 100% thù lao trả trực tiếp cho nghệ nhân làng Kép.</span>
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Kiểm tra hàng trước khi thanh toán (COD), đổi trả trong 7 ngày nếu có lỗi kỹ thuật dệt.</span>
            </p>
          </div>
        </div>
      </div>

      {/* SECTION: CÂU CHUYỆN ĐẰNG SAU SẢN PHẨM (DEDICATED SECTION) */}
      <section className="bg-[#1C1714] p-8 sm:p-12 rounded-xl border border-amber-900/40 shadow-sm space-y-8">
        <div className="border-b border-stone-800 pb-4">
          <div className="inline-flex items-center gap-2 bg-[#8B2522] text-amber-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hồ Sơ Di Sản & Nhân Sinh Quan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#FFFDF9]">
            CÂU CHUYỆN ĐẰNG SAU SẢN PHẨM
          </h2>
          <p className="text-sm font-serif italic text-amber-300 mt-1">
            {product.story_title || '“Giữ hồn di sản trong từng đường dệt Jrai”'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Story Narrative (8 Cols) */}
          <div className="lg:col-span-8 space-y-4 text-sm text-stone-300 leading-relaxed font-normal">
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
              <div className="p-4 bg-[#2A1E17] rounded-2xl border border-amber-700/40 text-xs text-amber-200 mt-6">
                <strong>Tác động cộng đồng:</strong> {product.impact}
              </div>
            )}
          </div>

          {/* Linked Artisan & Motif Profile Cards (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Artisan Profile Box */}
            {artisan && (
              <div className="bg-[#231C18] p-5 rounded-2xl border border-amber-900/40 space-y-3 shadow-md">
                <div className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                  Nghệ Nhân Thực Hiện
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={artisan.avatar || artisan.image_url}
                    alt={artisan.name}
                    className="w-14 h-14 object-cover rounded-full border border-amber-600/50"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-white">{artisan.name}</h4>
                    <p className="text-xs text-stone-400">{artisan.experience}</p>
                    <p className="text-xs text-amber-400/80">{artisan.village}</p>
                  </div>
                </div>
                {artisan.quote && (
                  <p className="text-xs text-stone-400 italic bg-[#1C1714] p-3 rounded-xl border border-stone-800">
                    {artisan.quote}
                  </p>
                )}
                <Link
                  href={`/artisan/${artisan.id}`}
                  className="block text-center text-xs font-bold text-amber-300 hover:text-white bg-stone-900 py-2 rounded-xl transition"
                >
                  Xem hồ sơ nghệ nhân &rarr;
                </Link>
              </div>
            )}

            {/* Linked Motif Box */}
            {linkedMotifs.length > 0 && (
              <div className="bg-[#231C18] p-5 rounded-2xl border border-amber-900/40 space-y-3 shadow-md">
                <div className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                  Hoa Văn Ứng Dụng
                </div>
                {linkedMotifs.map((m) => (
                  <div key={m.id} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-stone-900 p-1.5 rounded-xl border border-stone-800 flex items-center justify-center shrink-0">
                        <img src={m.image_url} alt={m.name} className="max-h-full object-contain" />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-xs text-white line-clamp-1">{m.name}</h4>
                        <span className="text-xs font-mono text-amber-400">{m.motif_code}</span>
                      </div>
                    </div>
                    <p className="text-xs text-stone-400 line-clamp-3">
                      {m.meaning || m.philosophy}
                    </p>
                    <Link
                      href={`/motif/${m.id}`}
                      className="block text-center text-xs font-bold text-amber-300 hover:text-white bg-stone-900 py-2 rounded-xl transition"
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
      <section className="bg-[#231C18] p-8 sm:p-12 rounded-xl border border-amber-900/40 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#8B2522] text-amber-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <QrCode className="w-3.5 h-3.5" />
              <span>HỆ THỐNG ĐỊNH DANH SỐ QR</span>
            </div>
            <h2 className="text-2xl font-serif font-black text-white">
              Hộ Chiếu Số & Tem Truy Xuất Nguồn Gốc
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Mã QR này được in trên thẻ mác gắn kèm mỗi sản phẩm gửi đến quý khách hàng.
            </p>
          </div>

          <Link
            href={`/traceability?code=${product.product_code}`}
            className="inline-flex items-center gap-2 bg-[#B9383A] hover:bg-[#A83232] text-white text-xs font-bold px-5 py-3 rounded-xl shadow transition"
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
      <section className="bg-[#1C1714] p-8 sm:p-10 rounded-xl border border-amber-900/40 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div>
            <h3 className="text-xl font-serif font-black text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              <span>Đánh Giá Từ Khách Hàng ({reviews.length})</span>
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Những chia sẻ chân thực từ khách hàng đã sở hữu tác phẩm thổ cẩm này.
            </p>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="text-xs font-bold bg-[#231C18] hover:bg-[#32261E] text-amber-300 px-4 py-2.5 rounded-xl border border-amber-900/50 transition"
          >
            {showReviewForm ? 'Đóng biểu mẫu' : 'Viết đánh giá của bạn'}
          </button>
        </div>

        {/* Review Form Modal/Drawer */}
        {showReviewForm && (
          <form onSubmit={handleReviewSubmit} className="p-5 bg-[#231C18] rounded-2xl border border-amber-900/50 space-y-4">
            <h4 className="text-sm font-bold text-white">Gửi nhận xét của bạn về sản phẩm</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-stone-400 font-bold block mb-1">Họ và tên của bạn</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hoàng Minh"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full bg-[#120F0D] border border-amber-900/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-stone-400 font-bold block mb-1">Đánh giá sao</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full bg-[#120F0D] border border-amber-900/50 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
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
              <label className="text-xs text-stone-400 font-bold block mb-1">Nội dung nhận xét</label>
              <textarea
                required
                rows={3}
                placeholder="Chia sẻ cảm nhận về độ đanh mịn của sợi, màu sắc thảo mộc và câu chuyện di sản..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full bg-[#120F0D] border border-amber-900/50 rounded-xl p-3 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              className="bg-[#B9383A] hover:bg-[#A83232] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow transition"
            >
              GỬI ĐÁNH GIÁ
            </button>
          </form>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <p className="text-xs text-stone-500 italic py-4">
            Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên trải nghiệm và chia sẻ!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((r) => (
              <div key={r.id} className="p-4 bg-[#231C18] rounded-2xl border border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-300">{r.customerName}</span>
                    <span className="text-xs bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800/40">
                      Đã mua hàng
                    </span>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed italic">&ldquo;{r.comment}&rdquo;</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION: SẢN PHẨM LIÊN QUAN */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-serif font-black text-white">
              Sản Phẩm Cùng Danh Mục
            </h3>
            <Link
              href={`/products?category=${product.category}`}
              className="text-xs font-bold text-amber-400 hover:underline"
            >
              Xem tất cả &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rp) => (
              <Link
                key={rp.id}
                href={`/product/${rp.id}`}
                className="group bg-[#231C18] rounded-2xl border border-amber-900/30 hover:border-amber-500/60 overflow-hidden shadow-lg transition flex flex-col justify-between"
              >
                <div className="aspect-[4/3] bg-stone-900 overflow-hidden">
                  <img
                    src={rp.image_url}
                    alt={rp.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <span className="text-xs font-mono text-amber-500">{rp.product_code}</span>
                  <h4 className="font-serif font-bold text-xs text-white group-hover:text-amber-400 line-clamp-1">
                    {rp.name}
                  </h4>
                  <div className="text-sm font-black text-amber-400">
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
