'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { Plus, Edit3, Trash2, Users, Save, X, Upload } from 'lucide-react';
import { getArtisans, addArtisan, updateArtisan, deleteArtisan } from '@/lib/data-store';
import { Artisan } from '@/types';
import { uploadFileToServer } from '@/lib/upload-helper';

export default function AdminArtisansPage() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingArtisan, setEditingArtisan] = useState<Artisan | null>(null);

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [bio, setBio] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setArtisans(getArtisans());
  };

  const handleOpenAdd = () => {
    setEditingArtisan(null);
    setName('');
    setLocation('Làng Kép, xã Ia Mơ Nông, Gia Lai');
    setExperience('30 năm kinh nghiệm dệt');
    setBio('');
    setImageUrl('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80');
    setShowModal(true);
  };

  const handleOpenEdit = (a: Artisan) => {
    setEditingArtisan(a);
    setName(a.name);
    setLocation(a.location);
    setExperience(a.experience);
    setBio(a.bio);
    setImageUrl(a.image_url);
    setShowModal(true);
  };

  const handleImageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadFileToServer(file);
      setImageUrl(url);
    }
  };

  const handleDelete = (id: string, artisanName: string) => {
    if (confirm(`Xóa thông tin nghệ nhân "${artisanName}"?`)) {
      deleteArtisan(id);
      refreshData();
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (editingArtisan) {
      updateArtisan(editingArtisan.id, {
        name,
        location,
        experience,
        bio,
        image_url: imageUrl,
      });
    } else {
      addArtisan({
        name,
        location,
        experience,
        bio,
        image_url: imageUrl,
      });
    }

    setShowModal(false);
    refreshData();
  };

  return (
    <div className="space-y-6 pb-12">
      <AdminHeader title="Quản Lý Nghệ Nhân Jrai" subtitle="Chọn ảnh chân dung nghệ nhân trực tiếp từ thư mục máy tính" />

      <div className="px-8 space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
          <div className="text-xs font-bold text-slate-700">Tổng số {artisans.length} nghệ nhân</div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-amber-800 hover:bg-amber-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow"
          >
            <Plus className="w-4 h-4" />
            <span>+ THÊM NGHỆ NHÂN MỚI</span>
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 uppercase text-xs font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-4 px-4">Ảnh</th>
                <th className="py-4 px-4">Tên Nghệ Nhân</th>
                <th className="py-4 px-4">Kinh Nghiệm</th>
                <th className="py-4 px-4">Địa Phương</th>
                <th className="py-4 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {artisans.map((a) => (
                <tr key={a.id}>
                  <td className="py-3 px-4">
                    <img src={a.image_url} alt={a.name} className="w-12 h-12 rounded-xl object-cover" />
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">{a.name}</td>
                  <td className="py-3 px-4 text-amber-900 font-semibold">{a.experience}</td>
                  <td className="py-3 px-4 text-slate-600">{a.location}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenEdit(a)} className="p-2 text-amber-800 font-bold">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(a.id, a.name)} className="p-2 text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg">{editingArtisan ? 'Sửa Nghệ Nhân' : 'Thêm Nghệ Nhân Mới'}</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="font-bold">Tên Nghệ Nhân *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>

              {/* Direct Computer File Picker */}
              <div className="space-y-2 bg-amber-50/60 p-4 rounded-2xl border border-amber-200">
                <label className="font-bold text-amber-900 block">📸 Chọn Ảnh Chân Dung Trực Tiếp Từ Máy Tính</label>
                <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-amber-700/50 hover:border-amber-700 rounded-xl cursor-pointer bg-white transition text-center shadow-xs">
                  <Upload className="w-5 h-5 text-amber-800" />
                  <span className="font-bold text-xs text-amber-900">Bấm Để Chọn File Ảnh Nghệ Nhân Từ Thư Mục Máy Tính</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileSelect}
                    className="hidden"
                  />
                </label>

                {imageUrl && (
                  <div className="aspect-square w-24 rounded-2xl overflow-hidden bg-slate-100 border border-slate-300 mt-2">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold">Số năm kinh nghiệm</label>
                <input
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold">Địa phương công tác</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold">Tiểu sử & Câu chuyện giữ nghề</label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-slate-100 py-2.5 px-4 rounded-xl font-bold"
                >
                  Hủy
                </button>
                <button type="submit" className="bg-stone-900 text-white font-bold py-2.5 px-5 rounded-xl">
                  Lưu Nghệ Nhân
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
