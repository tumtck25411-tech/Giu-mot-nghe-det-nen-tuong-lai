'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/AdminHeader';
import { ArrowLeft, Save, Upload, Check, Video, Image as ImageIcon, Trash2 } from 'lucide-react';
import { addProduct, getMotifs, getArtisans, getProducts } from '@/lib/data-store';
import { Motif, Artisan } from '@/types';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { uploadFileToServer } from '@/lib/upload-helper';

export default function NewProductPage() {
  const router = useRouter();
  const [motifs, setMotifs] = useState<Motif[]>([]);
  const [artisans, setArtisans] = useState<Artisan[]>([]);

  // Form State
  const [category, setCategory] = useState('Túi');
  const [productCode, setProductCode] = useState('T002');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFileName, setVideoFileName] = useState('');
  const [productionTime, setProductionTime] = useState('7 ngày dệt thủ công tỉ mỉ');
  const [story, setStory] = useState('');
  const [location, setLocation] = useState('Làng Kép, xã Ia Mơ Nông, huyện Chư Păh, tỉnh Gia Lai');
  const [artisanId, setArtisanId] = useState('');
  const [selectedMotifIds, setSelectedMotifIds] = useState<string[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [createdProductId, setCreatedProductId] = useState('');

  useEffect(() => {
    const allMotifs = getMotifs();
    setMotifs(allMotifs);

    const allArtisans = getArtisans();
    setArtisans(allArtisans);
    if (allArtisans.length > 0) setArtisanId(allArtisans[0].id);

    if (allMotifs.length > 0) {
      setSelectedMotifIds([allMotifs[0].id]);
    }
  }, []);

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    const existing = getProducts();
    let prefix = 'T';
    if (newCat.includes('Khăn')) prefix = 'K';
    else if (newCat.includes('Ví')) prefix = 'V';
    else if (newCat.includes('Áo')) prefix = 'A';
    else if (newCat.includes('Khố')) prefix = 'KH';
    else if (newCat.includes('Váy')) prefix = 'VY';

    const count = existing.filter((p) => p.product_code.startsWith(prefix)).length + 1;
    const nextNum = String(count).padStart(3, '0');
    setProductCode(`${prefix}${nextNum}`);
  };

  const handleToggleMotif = (motifId: string) => {
    setSelectedMotifIds((prev) =>
      prev.includes(motifId) ? prev.filter((id) => id !== motifId) : [...prev, motifId]
    );
  };

  // Direct File Selection Handlers for Computer Explorer
  const handleMainImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadFileToServer(file);
      setImageUrl(url);
    }
  };

  const handleAdditionalImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      for (const file of Array.from(files)) {
        const url = await uploadFileToServer(file);
        setAdditionalImages((prev) => [...prev, url]);
      }
    }
  };

  const handleVideoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFileName(file.name);
      const url = await uploadFileToServer(file);
      setVideoUrl(url);
    }
  };

  const handleRemoveAdditionalImage = (index: number) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (targetStatus: 'draft' | 'published') => {
    if (!name || !productCode) {
      alert('Vui lòng nhập Tên sản phẩm và Mã sản phẩm!');
      return;
    }

    const newProd = addProduct({
      product_code: productCode,
      name,
      category,
      description,
      image_url: imageUrl,
      additional_images: additionalImages,
      video_url: videoUrl,
      production_time: productionTime,
      story,
      location,
      artisan_id: artisanId,
      status: targetStatus,
      motif_ids: selectedMotifIds,
    });

    setCreatedProductId(newProd.id);
    setSavedSuccess(true);
  };

  const createdProductUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/product/${createdProductId}`
    : `https://detnentuonglai.vercel.app/product/${createdProductId}`;

  return (
    <div className="space-y-6 pb-16">
      <AdminHeader
        title="Thêm Sản Phẩm Mới & Tải Ảnh/Video Từ Máy Tính"
        subtitle="Chọn ảnh và video trực tiếp từ máy tính. Mã QR tự động sinh sau khi lưu."
      />

      <div className="px-8 max-w-5xl space-y-6">
        <button
          onClick={() => router.push('/admin/products')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-amber-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách sản phẩm</span>
        </button>

        {savedSuccess && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-6 rounded-xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Check className="w-5 h-5 text-emerald-600" />
                <span>ĐÃ THÊM SẢN PHẨM & TỰ ĐỘNG XUẤT MÃ QR THÀNH CÔNG!</span>
              </div>
              <button
                onClick={() => router.push('/admin/products')}
                className="bg-stone-900 text-white font-bold text-xs py-2 px-4 rounded-xl"
              >
                Về danh sách sản phẩm
              </button>
            </div>

            <QRCodeGenerator
              productUrl={createdProductUrl}
              productName={name}
              productCode={productCode}
              category={category}
              location={location}
            />
          </div>
        )}

        {!savedSuccess && (
          <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-xs space-y-8">
            {/* Section 1: Metadata */}
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-slate-900 border-b border-slate-100 pb-2">
                1. Thông Tin Cơ Bản & Mã Ký Hiệu
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Loại sản phẩm</label>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-amber-800"
                  >
                    <option value="Túi">Túi (Ký hiệu T001, T002...)</option>
                    <option value="Khăn quàng cổ">Khăn quàng cổ (Ký hiệu K001, K002...)</option>
                    <option value="Ví">Ví (Ký hiệu V001, V002...)</option>
                    <option value="Áo">Áo (Ký hiệu A001, A002...)</option>
                    <option value="Khố">Khố (Ký hiệu KH001, KH002...)</option>
                    <option value="Váy">Váy (Ký hiệu VY001, VY002...)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-900">Mã ký hiệu tự động *</label>
                  <input
                    type="text"
                    required
                    value={productCode}
                    onChange={(e) => setProductCode(e.target.value)}
                    className="w-full p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs font-mono font-bold text-amber-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Túi Thổ Cẩm Jrai Đeo Chéo Kơ-pă"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Thời gian sản xuất (Dệt mất bao nhiêu thời gian)</label>
                <input
                  type="text"
                  placeholder="VD: 7 ngày dệt thủ công tỉ mỉ"
                  value={productionTime}
                  onChange={(e) => setProductionTime(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Mô tả tóm tắt</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả chất liệu, kiểu dáng..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Section 2: DIRECT COMPUTER FILE PICKER FOR IMAGES & VIDEOS */}
            <div className="space-y-4 bg-amber-50/50 p-6 rounded-2xl border border-amber-200">
              <h3 className="font-serif font-bold text-lg text-amber-900 border-b border-amber-200/80 pb-2 flex items-center gap-2">
                <Upload className="w-5 h-5 text-amber-800" />
                <span>2. Chọn Trực Tiếp Ảnh & Video Từ Thư Mục Máy Tính</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Main Image File Picker */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-800 block">
                    📸 1. Chọn Ảnh Chính Từ Máy Tính (JPG, PNG, WEBP)
                  </label>
                  
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-amber-700/40 hover:border-amber-700 rounded-2xl cursor-pointer bg-white transition text-center shadow-xs">
                    <ImageIcon className="w-8 h-8 text-amber-800 mb-2" />
                    <span className="font-bold text-xs text-amber-900">Bấm Để Chọn Ảnh Từ Thư Mục Máy Tính</span>
                    <span className="text-xs text-slate-500 mt-1">Mở Windows File Explorer để chọn file</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageSelect}
                      className="hidden"
                    />
                  </label>

                  {imageUrl && (
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-300 shadow-xs">
                      <img src={imageUrl} alt="Xem trước ảnh chính" className="w-full h-full object-cover" />
                      <div className="absolute bottom-2 left-2 bg-stone-900/90 text-white text-xs font-bold px-2 py-0.5 rounded">
                        Đã chọn ảnh chính thành công
                      </div>
                    </div>
                  )}
                </div>

                {/* Video File Picker */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-800 block">
                    🎥 2. Chọn Video Quá Trình Dệt Từ Máy Tính (MP4, MOV, WEBM)
                  </label>

                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-400 hover:border-amber-700 rounded-2xl cursor-pointer bg-white transition text-center shadow-xs">
                    <Video className="w-8 h-8 text-amber-800 mb-2" />
                    <span className="font-bold text-xs text-slate-800">Bấm Để Chọn File Video Từ Thư Mục Máy Tính</span>
                    <span className="text-xs text-slate-500 mt-1">Hỗ trợ file video MP4, MOV, WebM</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoSelect}
                      className="hidden"
                    />
                  </label>

                  {videoUrl && (
                    <div className="space-y-1">
                      <div className="aspect-video rounded-xl overflow-hidden bg-black border border-slate-300">
                        <video src={videoUrl} controls className="w-full h-full" />
                      </div>
                      {videoFileName && (
                        <p className="text-xs font-bold text-emerald-700 truncate">
                          ✓ File video đã chọn: {videoFileName}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Gallery Photos File Picker */}
              <div className="pt-3 border-t border-amber-200/80 space-y-3">
                <label className="text-xs font-bold text-slate-800 block">
                  🖼️ 3. Chọn Thêm Các Ảnh Bổ Sung Từ Máy Tính (Chọn cùng lúc nhiều ảnh)
                </label>
                
                <label className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer transition">
                  <Upload className="w-4 h-4" />
                  <span>Chọn nhiều ảnh góc khác từ máy tính</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImageSelect}
                    className="hidden"
                  />
                </label>

                {additionalImages.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-2">
                    {additionalImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-300 group">
                        <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveAdditionalImage(idx)}
                          className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full opacity-90 hover:opacity-100"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Multi-Motif Selection */}
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-slate-900 border-b border-slate-100 pb-2">
                3. Hoa Văn Được Sử Dụng Trên Sản Phẩm
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {motifs.map((m) => {
                  const checked = selectedMotifIds.includes(m.id);
                  return (
                    <label
                      key={m.id}
                      onClick={() => handleToggleMotif(m.id)}
                      className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                        checked
                          ? 'bg-amber-50 border-amber-800 ring-1 ring-amber-800'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {}}
                        className="mt-1 text-amber-800 focus:ring-amber-800 rounded"
                      />
                      <div>
                        <div className="font-mono font-bold text-xs text-amber-900">
                          {m.motif_code} - {m.name}
                        </div>
                        <div className="text-xs text-slate-500 line-clamp-1">{m.meaning}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Section 4: Artisan & Story */}
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-slate-900 border-b border-slate-100 pb-2">
                4. Nghệ Nhân Làm & Địa Điểm
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Nghệ nhân thực hiện</label>
                  <select
                    value={artisanId}
                    onChange={(e) => setArtisanId(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  >
                    {artisans.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.experience})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Địa điểm làng dệt</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Câu chuyện sản phẩm</label>
                <textarea
                  rows={4}
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Submit Bar */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-end">
              <button
                onClick={() => handleSubmit('published')}
                className="bg-stone-900 hover:bg-amber-900 text-white font-bold text-xs py-3.5 px-7 rounded-2xl transition flex items-center gap-2 shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>[XUẤT BẢN SẢN PHẨM & TỰ ĐỘNG TẠO QR]</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
