'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, Lock, FileText, ChevronRight, ArrowLeft } from 'lucide-react';

const POLICY_DATA: Record<
  string,
  {
    title: string;
    subtitle: string;
    icon: any;
    sections: { heading: string; content: string[] }[];
  }
> = {
  shipping: {
    title: 'Chính Sách Vận Chuyển & Giao Hàng',
    subtitle: 'Cam kết giao vận an toàn tận tay khách hàng trên toàn quốc',
    icon: Truck,
    sections: [
      {
        heading: '1. Phạm vi & Thời gian vận chuyển',
        content: [
          'JRAI ƠI hỗ trợ giao hàng trên toàn bộ 63 tỉnh thành Việt Nam thông qua các đối tác vận chuyển uy tín (Viettel Post, Giao Hàng Tiết Kiệm, VNPost).',
          'Thời gian xử lý đóng gói tại Hợp tác xã Ia Mơ Nông (Gia Lai): 1 - 2 ngày làm việc để nghệ nhân kiểm tra kỹ lưỡng đường dệt và gắn thẻ định danh QR.',
          'Thời gian phát hàng dự kiến: 2 - 3 ngày đối với các tỉnh Tây Nguyên và Đông Nam Bộ (TP. Hồ Chí Minh); 3 - 5 ngày đối với khu vực miền Bắc (Hà Nội, các tỉnh phía Bắc).',
        ],
      },
      {
        heading: '2. Cước phí vận chuyển',
        content: [
          'Cước phí giao hàng tiêu chuẩn đồng giá 30.000₫ cho mọi đơn hàng dưới 500.000₫.',
          'MIỄN PHÍ VẬN CHUYỂN 100% đối với tất cả đơn hàng có tổng giá trị thanh toán từ 500.000₫ trở lên.',
        ],
      },
      {
        heading: '3. Kiểm tra hàng trước khi thanh toán (COD)',
        content: [
          'JRAI ƠI áp dụng chính sách “Đồng kiểm khi nhận hàng”. Quý khách hoàn toàn được quyền mở hộp kiểm tra chất lượng sợi vải, màu sắc hoa văn và mã số tem QR trước khi thanh toán tiền mặt cho nhân viên giao hàng.',
          'Nếu sản phẩm bị lỗi chỉ hoặc không đúng mẫu mã đã đặt, quý khách có quyền từ chối nhận hàng mà không phải chịu bất kỳ chi phí nào.',
        ],
      },
    ],
  },
  returns: {
    title: 'Chính Sách Đổi Trả & Bảo Hành',
    subtitle: 'Đảm bảo sự an tâm tuyệt đối khi sở hữu sản phẩm thủ công truyền thống',
    icon: RotateCcw,
    sections: [
      {
        heading: '1. Điều kiện đổi trả trong 7 ngày',
        content: [
          'Khách hàng được đổi trả sản phẩm miễn phí trong vòng 7 ngày kể từ ngày nhận hàng thành công.',
          'Điều kiện: Sản phẩm còn nguyên tem mác mã QR số hóa, chưa qua giặt tẩy, không có mùi lạ và không bị rách, xước do tác động bên ngoài.',
          'Các trường hợp được chấp nhận đổi mới ngay lập tức: Sản phẩm bị đứt chỉ kết cấu, sai mẫu mã hoặc sai kích thước so với thông tin đăng tải.',
        ],
      },
      {
        heading: '2. Quy trình đổi trả hàng',
        content: [
          'Bước 1: Liên hệ hotline / Zalo CSKH: 0383 451 929 hoặc email contact@jraioi.vn kèm ảnh chụp sản phẩm và mã đơn hàng.',
          'Bước 2: Bộ phận CSKH tiếp nhận và gửi mã gửi hàng hoàn về Hợp tác xã dệt Ia Mơ Nông.',
          'Bước 3: Sau khi nhận được sản phẩm hoàn, JRAI ƠI sẽ gửi sản phẩm thay thế hoặc hoàn tiền 100% qua tài khoản ngân hàng trong vòng 24 - 48 giờ.',
        ],
      },
      {
        heading: '3. Bảo hành hoa văn & kỹ thuật dệt',
        content: [
          'Cam kết bảo hành đường may và nút thắt tua rua thủ công trong vòng 30 ngày sử dụng.',
        ],
      },
    ],
  },
  privacy: {
    title: 'Chính Sách Bảo Mật Thông Tin Khách Hàng',
    subtitle: 'Bảo vệ quyền riêng tư và dữ liệu cá nhân theo tiêu chuẩn',
    icon: Lock,
    sections: [
      {
        heading: '1. Thu thập thông tin khách hàng',
        content: [
          'JRAI ƠI chỉ thu thập các thông tin tối thiểu cần thiết để xử lý đơn hàng gồm: Họ tên, Số điện thoại, Địa chỉ nhận hàng, Email (nếu có).',
          'Chúng tôi không thu thập hay lưu trữ thông tin thẻ ngân hàng hoặc mật khẩu tài khoản tài chính của quý khách.',
        ],
      },
      {
        heading: '2. Mục đích sử dụng thông tin',
        content: [
          'Xác nhận đơn hàng và điều phối nhân viên bưu tá giao sản phẩm.',
          'Gửi thông báo tiến trình vận chuyển và thông tin thẻ số định danh QR.',
          'Hỗ trợ giải quyết khiếu nại, bảo hành và chăm sóc khách hàng sau bán.',
        ],
      },
      {
        heading: '3. Cam kết bảo mật',
        content: [
          'JRAI ƠI cam kết không bán, không chia sẻ hay trao đổi thông tin khách hàng cho bất kỳ bên thứ ba nào vì mục đích thương mại.',
        ],
      },
    ],
  },
  terms: {
    title: 'Điều Khoản Dịch Vụ & Sử Dụng',
    subtitle: 'Quy định giao dịch minh bạch giữa JRAI ƠI và khách hàng',
    icon: FileText,
    sections: [
      {
        heading: '1. Tính chất đặc thù của sản phẩm thủ công',
        content: [
          'Mọi sản phẩm của JRAI ƠI đều được dệt thủ công bằng tay trên khung cửi hông, sử dụng sợi bông tự nhiên và màu thảo mộc dân gian.',
          'Do đó, giữa các sản phẩm cùng mã có thể xuất hiện độ chênh lệch rất nhỏ (± 1 - 2cm) về kích thước hoặc sắc độ màu — đây là nét độc bản tự nhiên của thủ công truyền thống, không phải lỗi sản xuất.',
        ],
      },
      {
        heading: '2. Quyền sở hữu trí tuệ & bản quyền di sản',
        content: [
          'Các hoa văn và câu chuyện di sản trên website thuộc quyền sở hữu tri thức cộng đồng của người Jrai tại Gia Lai và đã được dự án số hóa xác thực.',
          'Nghiêm cấm sao chép nguyên trạng dữ liệu và hình ảnh nhằm mục đích giả mạo nguồn gốc xuất xứ.',
        ],
      },
    ],
  },
};

export default function PolicyDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'shipping';
  const policy = POLICY_DATA[slug] || POLICY_DATA['shipping'];
  const Icon = policy.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <nav className="flex items-center gap-2 text-xs text-stone-400">
        <Link href="/" className="hover:text-white transition">
          Trang chủ
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
        <span className="text-amber-400 font-bold">{policy.title}</span>
      </nav>

      {/* Header */}
      <div className="bg-[#1C1714] p-8 sm:p-10 rounded-3xl border border-amber-900/40 shadow-xl space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-[#8B2522] text-amber-300 flex items-center justify-center">
          <Icon className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-black text-white">{policy.title}</h1>
        <p className="text-xs sm:text-sm text-stone-400">{policy.subtitle}</p>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {policy.sections.map((sec, idx) => (
          <div key={idx} className="bg-[#1C1714] p-6 rounded-2xl border border-stone-800 space-y-3">
            <h2 className="text-base font-serif font-bold text-amber-300">{sec.heading}</h2>
            <div className="space-y-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
              {sec.content.map((c, cIdx) => (
                <p key={cIdx}>{c}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 flex justify-between items-center text-xs text-stone-400 border-t border-stone-800">
        <span>Hotline hỗ trợ khách hàng: 0383 451 929</span>
        <Link href="/products" className="text-amber-400 hover:underline font-bold">
          Quay lại cửa hàng &rarr;
        </Link>
      </div>
    </div>
  );
}
