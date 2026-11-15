'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { GitCommit, Save, Check } from 'lucide-react';
import { getWeavingSteps, updateWeavingStep } from '@/lib/data-store';
import { WeavingStep } from '@/types';
import { uploadFileToServer } from '@/lib/upload-helper';

export default function AdminWeavingProcessPage() {
  const [steps, setSteps] = useState<WeavingStep[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Field states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setSteps(getWeavingSteps());
  }, []);

  const handleStartEdit = (step: WeavingStep) => {
    setEditingId(step.id);
    setTitle(step.title);
    setDescription(step.description);
    setDetails(step.details || '');
    setImageUrl(step.image_url || '');
  };

  const handleSaveStep = (id: string) => {
    const updated = updateWeavingStep(id, {
      title,
      description,
      details,
      image_url: imageUrl,
    });

    if (updated) {
      setSteps(getWeavingSteps());
      setEditingId(null);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <AdminHeader
        title="Quản Lý Hành Trình Dệt Thổ Cẩm Jrai"
        subtitle="Chỉnh sửa chi tiết nội dung và hình ảnh tư liệu cho các bước dệt thủ công"
      />

      <div className="px-8 space-y-6 max-w-5xl">
        {savedSuccess && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Đã cập nhật bước dệt thành công! Trang công khai đã cập nhật.</span>
          </div>
        )}

        <div className="space-y-4">
          {steps.map((step) => {
            const isEditing = editingId === step.id;

            return (
              <div
                key={step.id}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-800 text-white font-bold text-xs flex items-center justify-center">
                      {step.step_number}
                    </div>
                    <h3 className="font-serif font-bold text-base text-slate-900">
                      {step.title}
                    </h3>
                  </div>

                  {!isEditing ? (
                    <button
                      onClick={() => handleStartEdit(step)}
                      className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs py-1.5 px-3.5 rounded-xl transition"
                    >
                      Sửa Bước Này
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-slate-100 text-slate-700 font-bold text-xs py-1.5 px-3 rounded-xl"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={() => handleSaveStep(step.id)}
                        className="bg-stone-900 text-white font-bold text-xs py-1.5 px-4 rounded-xl flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Lưu Cập Nhật</span>
                      </button>
                    </div>
                  )}
                </div>

                {!isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                    <div className="md:col-span-8 space-y-2">
                      <p className="text-slate-700 leading-relaxed">{step.description}</p>
                      {step.details && (
                        <p className="text-amber-900 italic font-medium">Ghi chú: {step.details}</p>
                      )}
                    </div>
                    <div className="md:col-span-4">
                      {step.image_url && (
                        <img
                          src={step.image_url}
                          alt={step.title}
                          className="w-full h-24 rounded-xl object-cover border border-slate-200"
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700">Tên bước dệt</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700">Mô tả hành trình</label>
                      <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700">Chi tiết kỹ thuật</label>
                      <input
                        type="text"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Hình ảnh bước dệt (Chọn từ máy tính hoặc nhập URL)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          className="flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                          placeholder="Link ảnh hoặc chọn file..."
                        />
                        <label className="bg-amber-800 hover:bg-amber-900 text-white font-bold px-3 py-2.5 rounded-xl cursor-pointer text-xs flex items-center gap-1 shrink-0">
                          <span>📁 Máy tính</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = await uploadFileToServer(file);
                                setImageUrl(url);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
