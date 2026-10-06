'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminHeader from '@/components/AdminHeader';
import { ArrowLeft, Save, Upload, Check, Eye, QrCode, Video, Image as ImageIcon, Trash2 } from 'lucide-react';
import { getProductById, updateProduct, getMotifs, getArtisans } from '@/lib/data-store';
import { Product, Motif, Artisan } from '@/types';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { uploadFileToServer } from '@/lib/upload-helper';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [motifs, setMotifs] = useState<Motif[]>([]);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [product, setProduct] = useState<Product | null>(null);

  // Form state
  const [productCode, setProductCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFileName, setVideoFileName] = useState('');
  const [productionTime, setProductionTime] = useState('');
  const [story, setStory] = useState('');
  const [location, setLocation] = useState('');
  const [artisanId, setArtisanId] = useState('');
  const [selectedMotifIds, setSelectedMotifIds] = useState<string[]>([]);
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setMotifs(getMotifs());
    setArtisans(getArtisans());

    if (id) {
      const p = getProductById(id);
      if (p) {
        setProduct(p);
        setProductCode(p.product_code);
        setName(p.name);
        setCategory(p.category);
        setDescription(p.description);
        setImageUrl(p.image_url);
        setAdditionalImages(p.additional_images || []);
        setVideoUrl(p.video_url || '');
        setProductionTime(p.production_time);
        setStory(p.story);
        setLocation(p.location);
        setArtisanId(p.artisan_id || '');
        setSelectedMotifIds(p.motif_ids || []);
        setStatus(p.status);
      }
    }
  }, [id]);

  const handleToggleMotif = (motifId: string) => {
    setSelectedMotifIds((prev) =>
      prev.includes(motifId) ? prev.filter((mId) => mId !== motifId) : [...prev, motifId]
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

  const handleSave = (targetStatus?: 'draft' | 'published') => {
    if (!product) return;

    const updated = updateProduct(product.id, {
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
      status: targetStatus || status,
      motif_ids: selectedMotifIds,
    });

    if (updated) {
      setProduct(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  if (!product) {
    return (
      <div className="p-8">
        <p className="text-slate-500 text-sm">Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  const currentProductUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/product/${product.id}`
    : `https://detnentuonglai.vercel.app/product/${product.id}`;

  return (
    <div className="space-y-6 pb-16">
      <AdminHeader
        title={`Chỉnh Sửa: ${product.name}`}
        subtitle={`Mã sản phẩm: ${product.product_code} — Chọn ảnh/video trực tiếp từ thư mục máy tính`}
      />

      <div className="px-8 max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/admin/products')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-amber-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại danh sách sản phẩm</span>
          </button>

          <a
            href={`/product/${product.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs py-2 px-3.5 rounded-xl transition border border-amber-800/40"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Xem Trang Công Khai</span>
          </a>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl text-xs font-bold flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Đã lưu cập nhật thành công! Website công khai đã được cập nhật dữ liệu mới.</span>
            </div>
            <a
              href={`/product/${product.id}`}
              target="_blank"
              className="text-amber-900 underline font-extrabold"
            >
              Kiểm tra ngay →
            </a>
          </div>
        )}

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-8">
          {/* Section 1: Basic Metadata */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-slate-900 border-b border-slate-100 pb-2">
              1. Thông Tin Cơ Bản
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-800 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Mã sản phẩm *</label>
                <input
                  type="text"
                  required
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-amber-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Loại sản phẩm</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                  Thời gian sản xuất (Dệt mất bao nhiêu thời gian)
                </label>
                <input
                  type="text"
                  value={productionTime}
                  onChange={(e) => setProductionTime(e.target.value)}
                  className="w-full p-3 bg-amber-50/60 border border-amber-300 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Mô tả tóm tắt</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Section 2: DIRECT FILE SELECTION FROM COMPUTER */}
          <div className="space-y-4 bg-amber-50/50 p-6 rounded-2xl border border-amber-200">
            <h3 className="font-serif font-bold text-lg text-amber-900 border-b border-amber-200/80 pb-2 flex items-center gap-2">
              <Upload className="w-5 h-5 text-amber-800" />
              <span>2. Thêm / Thay Đổi Ảnh & Video Trực Tiếp Từ Thư Mục Máy Tính</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Main Image File Picker */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-800 block">
                  📸 1. Đổi Ảnh Chính Của Sản Phẩm
                </label>
                
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-amber-700/40 hover:border-amber-700 rounded-2xl cursor-pointer bg-white transition text-center shadow-xs">
                  <ImageIcon className="w-8 h-8 text-amber-800 mb-2" />
                  <span className="font-bold text-xs text-amber-900">Bấm Để Chọn Ảnh Mới Từ Thư Mục Máy Tính</span>
                  <span className="text-[10px] text-slate-500 mt-1">Mở Windows File Explorer để chọn file</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageSelect}
                    className="hidden"
                  />
                </label>

                {imageUrl && (
                  <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-300 shadow-xs">
                    <img src={imageUrl} alt="Xem trước ảnh chính" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Video File Picker */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-800 block">
                  🎥 2. Đổi Video Quá Trình Dệt Từ Thư Mục Máy Tính
                </label>

                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-400 hover:border-amber-700 rounded-2xl cursor-pointer bg-white transition text-center shadow-xs">
                  <Video className="w-8 h-8 text-amber-800 mb-2" />
                  <span className="font-bold text-xs text-slate-800">Bấm Để Chọn File Video Từ Máy Tính</span>
                  <span className="text-[10px] text-slate-500 mt-1">Hỗ trợ file video MP4, MOV, WebM</span>
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
                      <p className="text-[11px] font-bold text-emerald-700 truncate">
                        ✓ File video mới: {videoFileName}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Additional Gallery Photos File Picker */}
            <div className="pt-3 border-t border-amber-200/80 space-y-3">
              <label className="text-xs font-bold text-slate-800 block">
                🖼️ 3. Chọn Thêm Các Ảnh Bổ Sung Từ Thư Mục Máy Tính
              </label>
              
              <label className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer transition">
                <Upload className="w-4 h-4" />
                <span>Chọn thêm ảnh từ máy tính</span>
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
                      <div className="text-[11px] text-slate-500 line-clamp-1">{m.meaning}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* QR Generator Card */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="font-bold text-sm text-slate-900 mb-3">Mã QR Định Danh Sản Phẩm:</h4>
            <QRCodeGenerator
              productUrl={currentProductUrl}
              productName={name}
              productCode={productCode}
              category={category}
              location={location}
            />
          </div>

          {/* Save Action Bar */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-700">Trạng thái xuất bản:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
              >
                <option value="published">Xuất bản công khai</option>
                <option value="draft">Lưu nháp (Ẩn khỏi public)</option>
              </select>
            </div>

            <button
              onClick={() => handleSave()}
              className="bg-stone-900 hover:bg-amber-900 text-white font-bold text-xs py-3.5 px-7 rounded-2xl transition flex items-center gap-2 shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>LƯU CẬP NHẬT SẢN PHẨM</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
