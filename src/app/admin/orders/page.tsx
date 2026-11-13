'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  Eye,
  X,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Package,
} from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import { getAdminSession, getOrders, updateOrderStatus, syncWithServer } from '@/lib/data-store';
import { Order, OrderStatus } from '@/types';

const STATUS_LABELS: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Chờ xác nhận', color: 'text-amber-400', bg: 'bg-amber-950/80 border-amber-700/60' },
  confirmed: { label: 'Đã xác nhận', color: 'text-blue-400', bg: 'bg-blue-950/80 border-blue-700/60' },
  processing: { label: 'Đang chuẩn bị', color: 'text-purple-400', bg: 'bg-purple-950/80 border-purple-700/60' },
  shipping: { label: 'Đang giao hàng', color: 'text-indigo-400', bg: 'bg-indigo-950/80 border-indigo-700/60' },
  delivered: { label: 'Đã giao hàng', color: 'text-emerald-400', bg: 'bg-emerald-950/80 border-emerald-700/60' },
  cancelled: { label: 'Đã hủy', color: 'text-red-400', bg: 'bg-red-950/80 border-red-700/60' },
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelNote, setCancelNote] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const admin = getAdminSession();
    if (!admin) {
      router.push('/admin/login');
      return;
    }

    const loadOrders = () => {
      setOrders(getOrders());
    };

    loadOrders();
    syncWithServer().then(() => loadOrders());

    window.addEventListener('jrai_store_updated', loadOrders);
    return () => window.removeEventListener('jrai_store_updated', loadOrders);
  }, [router]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        o.code.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q);

      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    const updated = updateOrderStatus(orderId, newStatus);
    if (updated) {
      setOrders(getOrders());
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
    }
  };

  const handleCancelOrder = (orderId: string) => {
    const updated = updateOrderStatus(orderId, 'cancelled', cancelNote || 'Đơn hàng bị hủy bởi Quản trị viên');
    if (updated) {
      setOrders(getOrders());
      setSelectedOrder(updated);
      setShowCancelModal(false);
      setCancelNote('');
    }
  };

  // Metrics
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const shippingCount = orders.filter((o) => o.status === 'shipping').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;

  return (
    <div className="flex min-h-screen bg-[#0D0B0A] text-stone-200">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Quản Lý Đơn Hàng" />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-[#181411] rounded-2xl border border-amber-900/40 space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                Doanh Thu Hiệu Lực
              </span>
              <div className="text-xl font-black text-amber-400 font-mono">
                {totalRevenue.toLocaleString('vi-VN')}₫
              </div>
              <p className="text-[11px] text-stone-500">Từ {orders.length} đơn hàng ghi nhận</p>
            </div>

            <div className="p-5 bg-[#181411] rounded-2xl border border-amber-900/40 space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                Chờ Xác Nhận
              </span>
              <div className="text-xl font-black text-white font-mono">{pendingCount} đơn</div>
              <p className="text-[11px] text-stone-500">Cần liên hệ khách hàng xác nhận</p>
            </div>

            <div className="p-5 bg-[#181411] rounded-2xl border border-amber-900/40 space-y-1">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                Đang Giao Vận
              </span>
              <div className="text-xl font-black text-white font-mono">{shippingCount} đơn</div>
              <p className="text-[11px] text-stone-500">Đã gửi bưu tá vận chuyển</p>
            </div>

            <div className="p-5 bg-[#181411] rounded-2xl border border-amber-900/40 space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                Giao Thành Công
              </span>
              <div className="text-xl font-black text-emerald-400 font-mono">{deliveredCount} đơn</div>
              <p className="text-[11px] text-stone-500">Đã hoàn tất thanh toán</p>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="p-4 bg-[#181411] rounded-2xl border border-stone-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full sm:max-w-md relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-500" />
              <input
                type="text"
                placeholder="Tìm mã đơn (JRAI-ORD...), tên khách, SĐT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#120F0D] border border-amber-900/40 rounded-xl text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-2.5 px-3 bg-[#120F0D] border border-amber-900/40 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-400"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="processing">Đang chuẩn bị</option>
                <option value="shipping">Đang giao hàng</option>
                <option value="delivered">Đã giao hàng</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-[#181411] rounded-2xl border border-stone-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-[#120F0D] border-b border-stone-800 text-stone-400 uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="p-4">Mã Đơn</th>
                    <th className="p-4">Khách Hàng</th>
                    <th className="p-4">Số SP</th>
                    <th className="p-4">Tổng Tiền</th>
                    <th className="p-4">Thanh Toán</th>
                    <th className="p-4">Trạng Thái</th>
                    <th className="p-4">Ngày Đặt</th>
                    <th className="p-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/80">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-stone-500 italic">
                        Không tìm thấy đơn hàng nào phù hợp.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#201A16] transition">
                        <td className="p-4 font-mono font-bold text-amber-400">
                          {ord.code}
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-white">{ord.customerName}</p>
                          <p className="text-[11px] text-stone-500 font-mono">{ord.customerPhone}</p>
                        </td>
                        <td className="p-4">{ord.items.length} món</td>
                        <td className="p-4 font-mono font-bold text-white">
                          {ord.totalAmount.toLocaleString('vi-VN')}₫
                        </td>
                        <td className="p-4">
                          <span className="text-[11px] uppercase font-mono">
                            {ord.paymentMethod === 'cod' ? 'COD' : 'VietQR'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              STATUS_LABELS[ord.status]?.bg
                            } ${STATUS_LABELS[ord.status]?.color}`}
                          >
                            {STATUS_LABELS[ord.status]?.label || ord.status}
                          </span>
                        </td>
                        <td className="p-4 text-[11px] text-stone-400">
                          {new Date(ord.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="bg-[#2A1E17] hover:bg-[#382B23] text-amber-300 font-bold px-3 py-1.5 rounded-lg border border-amber-800/50 transition inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Chi tiết</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[#1C1714] border border-amber-900/60 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto text-stone-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-stone-500 uppercase">CHI TIẾT ĐƠN HÀNG</span>
                <h3 className="text-xl font-serif font-black text-amber-400 font-mono">
                  {selectedOrder.code}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-stone-400 hover:text-white rounded-xl bg-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Changer Bar */}
            <div className="p-4 bg-[#231C18] rounded-2xl border border-amber-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Cập nhật trạng thái đơn:
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    STATUS_LABELS[selectedOrder.status]?.bg
                  } ${STATUS_LABELS[selectedOrder.status]?.color}`}
                >
                  {STATUS_LABELS[selectedOrder.status]?.label || selectedOrder.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'confirmed')}
                  disabled={selectedOrder.status === 'confirmed'}
                  className="px-3 py-1.5 rounded-xl bg-blue-950 text-blue-300 border border-blue-800 text-xs font-bold hover:bg-blue-900 disabled:opacity-40"
                >
                  Xác nhận đơn
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'processing')}
                  disabled={selectedOrder.status === 'processing'}
                  className="px-3 py-1.5 rounded-xl bg-purple-950 text-purple-300 border border-purple-800 text-xs font-bold hover:bg-purple-900 disabled:opacity-40"
                >
                  HTX Đóng gói
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'shipping')}
                  disabled={selectedOrder.status === 'shipping'}
                  className="px-3 py-1.5 rounded-xl bg-indigo-950 text-indigo-300 border border-indigo-800 text-xs font-bold hover:bg-indigo-900 disabled:opacity-40"
                >
                  Bàn giao bưu tá
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}
                  disabled={selectedOrder.status === 'delivered'}
                  className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-bold hover:bg-emerald-900 disabled:opacity-40"
                >
                  Đã giao thành công
                </button>

                <button
                  type="button"
                  onClick={() => setShowCancelModal(true)}
                  disabled={selectedOrder.status === 'cancelled'}
                  className="px-3 py-1.5 rounded-xl bg-red-950 text-red-300 border border-red-800 text-xs font-bold hover:bg-red-900 disabled:opacity-40 ml-auto"
                >
                  Hủy đơn
                </button>
              </div>
            </div>

            {/* Cancel Order Sub-modal */}
            {showCancelModal && (
              <div className="p-4 bg-red-950/80 rounded-2xl border border-red-800 space-y-3">
                <h4 className="text-xs font-bold text-red-200">Xác nhận hủy đơn hàng</h4>
                <textarea
                  rows={2}
                  placeholder="Lý do hủy đơn (Khách đổi ý, hết mẫu...)"
                  value={cancelNote}
                  onChange={(e) => setCancelNote(e.target.value)}
                  className="w-full bg-[#120F0D] border border-red-700/60 rounded-xl p-2.5 text-xs text-white placeholder-stone-600 focus:outline-none"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="px-3 py-1.5 text-xs text-stone-300 bg-stone-900 rounded-lg"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={() => handleCancelOrder(selectedOrder.id)}
                    className="px-3 py-1.5 text-xs text-white bg-red-800 hover:bg-red-700 font-bold rounded-lg"
                  >
                    Xác nhận hủy
                  </button>
                </div>
              </div>
            )}

            {/* Recipient & Order Data */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#231C18] rounded-2xl border border-stone-800 space-y-1.5">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">
                  Người Nhận Hàng
                </span>
                <p><strong>Họ tên:</strong> {selectedOrder.customerName}</p>
                <p><strong>SĐT:</strong> {selectedOrder.customerPhone}</p>
                {selectedOrder.customerEmail && <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>}
                <p><strong>Địa chỉ:</strong> {selectedOrder.shippingAddress}, {selectedOrder.ward}, {selectedOrder.district}, {selectedOrder.province}</p>
                {selectedOrder.orderNotes && <p className="italic text-stone-400"><strong>Ghi chú:</strong> {selectedOrder.orderNotes}</p>}
              </div>

              <div className="p-4 bg-[#231C18] rounded-2xl border border-stone-800 space-y-1.5">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">
                  Thanh Toán & Vận Chuyển
                </span>
                <p><strong>Hình thức:</strong> {selectedOrder.paymentMethod === 'cod' ? 'Thanh toán COD khi nhận hàng' : 'Chuyển khoản VietQR'}</p>
                <p><strong>Trạng thái tiền:</strong> {selectedOrder.paymentStatus === 'paid' ? 'Đã thu tiền' : 'Chờ thu tiền'}</p>
                <p><strong>Tạm tính:</strong> {selectedOrder.subtotal.toLocaleString('vi-VN')}₫</p>
                <p><strong>Phí ship:</strong> {selectedOrder.shippingFee === 0 ? 'Miễn phí' : `${selectedOrder.shippingFee.toLocaleString('vi-VN')}₫`}</p>
                {selectedOrder.discountAmount > 0 && <p className="text-amber-400"><strong>Giảm giá ({selectedOrder.discountCode}):</strong> -{selectedOrder.discountAmount.toLocaleString('vi-VN')}₫</p>}
                <p className="text-sm font-black text-amber-400 font-mono">
                  <strong>Tổng cộng:</strong> {selectedOrder.totalAmount.toLocaleString('vi-VN')}₫
                </p>
              </div>
            </div>

            {/* Ordered Products */}
            <div className="p-4 bg-[#231C18] rounded-2xl border border-stone-800 space-y-3">
              <span className="text-xs font-bold text-stone-300 uppercase tracking-wider block">
                Danh sách sản phẩm trong đơn ({selectedOrder.items.length})
              </span>
              <div className="divide-y divide-stone-800">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">{it.productName}</p>
                      <p className="text-[11px] text-stone-400 font-mono">Mã: {it.productCode}</p>
                    </div>
                    <div className="text-right font-mono">
                      <span>{it.quantity} x {it.unitPrice.toLocaleString('vi-VN')}₫</span>
                      <p className="font-bold text-amber-400">{it.totalPrice.toLocaleString('vi-VN')}₫</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
