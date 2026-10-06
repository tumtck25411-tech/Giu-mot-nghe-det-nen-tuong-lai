'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { FileText, Save, Check } from 'lucide-react';
import { getPageContent, updatePageContent } from '@/lib/data-store';
import { PageContent } from '@/types';

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState<'home' | 'about_brocade' | 'about_project'>('home');
  const [content, setContent] = useState<PageContent | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Editable fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [introText, setIntroText] = useState('');

  useEffect(() => {
    const pageData = getPageContent(activeTab);
    if (pageData) {
      setContent(pageData);
      setTitle(pageData.title);
      setSubtitle(pageData.subtitle || '');
      setIntroText(pageData.intro_text);
    }
  }, [activeTab]);

  const handleSave = () => {
    const updated = updatePageContent(activeTab, {
      title,
      subtitle,
      intro_text: introText,
    });

    if (updated) {
      setContent(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <AdminHeader
        title="Quản Lý Nội Dung Các Trang Website"
        subtitle="Chỉnh sửa nội dung Trang chủ, Trang Về Thổ Cẩm và Trang Về Dự Án trực tiếp không cần sửa code"
      />

      <div className="px-8 space-y-6 max-w-4xl">
        {/* Navigation Tabs */}
        <div className="flex bg-white p-2 rounded-2xl border border-slate-200 gap-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition ${
              activeTab === 'home'
                ? 'bg-amber-800 text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Trang Chủ (Home)
          </button>
          <button
            onClick={() => setActiveTab('about_brocade')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition ${
              activeTab === 'about_brocade'
                ? 'bg-amber-800 text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Trang Về Thổ Cẩm
          </button>
          <button
            onClick={() => setActiveTab('about_project')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition ${
              activeTab === 'about_project'
                ? 'bg-amber-800 text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Trang Về Dự Án
          </button>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Đã lưu chỉnh sửa nội dung thành công! Website công khai đã cập nhật.</span>
          </div>
        )}

        {/* Content Editor Form */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <h3 className="font-serif font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
            Nội Dung Trang: {activeTab.toUpperCase()}
          </h3>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Tiêu đề chính (Title)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-bold text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Tiêu đề phụ / Slogan (Subtitle)</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Đoạn giới thiệu (Intro Text)</label>
              <textarea
                rows={5}
                value={introText}
                onChange={(e) => setIntroText(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs leading-relaxed"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSave}
              className="bg-stone-900 hover:bg-amber-900 text-white font-bold text-xs py-3 px-6 rounded-xl transition flex items-center gap-2 shadow"
            >
              <Save className="w-4 h-4" />
              <span>[LƯU NỘI DUNG TRANG]</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
