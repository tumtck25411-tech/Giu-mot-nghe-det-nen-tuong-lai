'use client';

import React from 'react';
import Link from 'next/link';
import {
  Compass,
  Heart,
  ShieldCheck,
  Users,
  Sparkles,
  Award,
  MapPin,
  Clock,
  Layers,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  QrCode,
  Leaf,
  ChevronRight,
} from 'lucide-react';

const teamMembers = [
  {
    name: 'Mai Thị Cẩm Tú',
    role: 'Lead / Trưởng Nhóm Dự Án',
    badge: 'LEAD',
    image: '/images/team/MaiThiCamTu_brocade.png',
    desc: 'Điều phối tổng thể, nghiên cứu mô hình kinh doanh xã hội & kết nối hợp tác buôn làng.',
  },
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

const weavingStages = [
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

export default function AboutPage() {
  return (
    <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 py-10 space-y-20">
      {/* 1. HERO BANNER: KẾ THỪA CÂU CHUYỆN KHỞI NGUỒN - Centered Flex & Text */}
      <section className="bg-[#F2ECE1] p-8 sm:p-14 rounded-xl border border-[#E5DACB] border-b-2 border-b-[#EA8E23] relative overflow-hidden shadow-sm flex flex-col items-center justify-center text-center header-banner-box">
        <div className="max-w-3xl mx-auto space-y-5 relative z-10 flex flex-col items-center justify-center text-center w-full">
          <span className="section-tag gold inline-flex items-center justify-center mx-auto">
            <Compass className="w-3.5 h-3.5 inline mr-1 text-[#EA8E23]" />
            <span>CÂU CHUYỆN KHỞI NGUỒN • DỰ ÁN DỆT NÊN TƯƠNG LAI</span>
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#1F1D1B] leading-tight text-center mx-auto">
            Từ Câu Hỏi Về Sinh Kế <br />
            <span className="text-[#C43B3D]">
              Đến Khát Vọng Giữ Lửa Nghề
            </span>
          </h1>

          <p className="text-[#5D554D] text-sm sm:text-base leading-relaxed italic border-y border-[#C43B3D]/30 py-3.5 px-6 max-w-2xl mx-auto text-center">
            &ldquo;Nếu một nghề truyền thống có giá trị nhưng người làm nghề không thể sống được từ nghề, thì làm thế nào để nghề ấy tiếp tục tồn tại?&rdquo; — Câu hỏi trăn trở ấy đã đưa nhóm chúng tôi đặt chân đến buôn làng Ia Mơ Nông.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 bg-[#C43B3D] hover:bg-[#8A2325] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow transition hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>KHÁM PHÁ 57 TÁC PHẨM</span>
            </Link>
            <Link
              href="/#artisans"
              className="inline-flex items-center gap-2 bg-white hover:bg-[#F2ECE1] text-[#1F1D1B] font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl border border-[#E5DACB] transition hover:-translate-y-0.5"
            >
              <Users className="w-4 h-4 text-[#EA8E23]" />
              <span>9 NGHỆ NHÂN GIỮ NGHỀ</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. HÀNH TRÌNH THỰC ĐỊA IA MƠ NÔNG */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-5 text-[#5D554D] text-sm leading-relaxed">
          <span className="section-tag">
            <Sparkles className="w-3.5 h-3.5 inline mr-1 text-[#C43B3D]" />
            <span>HÀNH TRÌNH THỰC ĐỊA IA MƠ NÔNG</span>
          </span>

          <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#1F1D1B] leading-tight">
            Không chỉ là bảo tồn, mà là làm cho giá trị của nghề được nhìn thấy
          </h2>

          <p>
            Từ những ngày đầu khảo sát thực tế đến khi hoàn thiện nền tảng thương mại điện tử, dự án đã chuyển mình mạnh mẽ: từ một ý tưởng kết nối văn hóa thành một hệ sinh thái bán hàng có <strong>địa bàn thật, người làm nghề thật, sản phẩm thật</strong> và mang lại nguồn sinh kế bền vững trong thực tế.
          </p>

          <p>
            Tại xã Ia Mơ Nông, huyện Chư Păh, chúng tôi ngồi cùng những người phụ nữ Jrai bên hiên nhà sàn, lắng nghe tiếng lách cách của thoi đưa và nhận ra: công nghệ số không phải để thay thế đôi bàn tay nghệ nhân, mà là chiếc cầu nối để đưa câu chuyện, công sức và tri thức văn hóa phía sau từng nếp dệt đến với những khách hàng trân quý.
          </p>

          <div className="bg-[#F2ECE1] border-l-4 border-[#C43B3D] p-4 rounded-r-2xl border-y border-r border-[#E5DACB]">
            <p className="font-serif italic font-bold text-[#1F1D1B] text-sm sm:text-base">
              &ldquo;Không thay đổi cái gốc của nghề, thay đổi cách giá trị của nghề được nhìn thấy.&rdquo;
            </p>
          </div>
        </div>

        {/* Fieldwork Photo */}
        <div className="relative">
          <div className="rounded-xl overflow-hidden border border-[#E5DACB] shadow-sm aspect-[4/3]">
            <img
              src="/images/background/image6.jpg"
              alt="Đội ngũ JRAI ƠI và nghệ nhân gìn giữ nghề dệt tại Ia Mơ Nông"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="absolute -bottom-5 -right-3 bg-white border border-[#E5DACB] border-l-4 border-l-[#EA8E23] p-4 rounded-2xl shadow-xl max-w-xs text-xs text-[#5D554D]">
            <span className="text-xs font-extrabold uppercase text-[#EA8E23] block mb-1">
              ĐỊA BÀN THÍ ĐIỂM
            </span>
            <p className="font-serif font-bold text-[#1F1D1B] text-xs sm:text-sm">
              CLB Dệt Thổ Cẩm Ia Mơ Nông, Huyện Chư Păh, Tỉnh Gia Lai
            </p>
          </div>
        </div>
      </section>

      {/* 3. HÀNH TRÌNH 6 BƯỚC DỆT NÊN MỘT TÁC PHẨM THỔ CẨM - Centered 3-Column Grid */}
      <section className="journey-section-bg py-14 sm:py-16 px-6 sm:px-10 lg:px-12 rounded-2xl w-full max-w-[1400px] mx-auto shadow-md" id="journey">
        <div className="w-full">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span
              className="section-tag inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
              style={{
                color: '#FBBF24',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                borderColor: 'rgba(245, 158, 11, 0.35)',
              }}
            >
              Quy trình thủ công truyền thống
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-white leading-tight">
              Hành Trình Dệt Nên Một Tác Phẩm Thổ Cẩm
            </h2>
            <p className="text-sm sm:text-base text-[#D1CCC4] leading-relaxed">
              Mỗi tấm thổ cẩm Jrai là kết tinh của hàng chục giờ đếm từng sợi chỉ trên khung cửi hông, trải qua 6 công đoạn khắt khe từ cây bông rừng đến mác định danh số QR.
            </p>
          </div>

          {/* 6 Stages Grid - 3 cols Desktop, 2 cols Tablet, 1 col Mobile - Perfectly Centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8">
            {weavingStages.map((stage) => (
              <div
                key={stage.step}
                className="bg-[#241C17] border border-[#5A3E2D]/60 hover:border-[#FBBF24]/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  {/* Stage Thumbnail */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#1A1412]">
                    <img
                      src={stage.image}
                      alt={stage.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-[#13100E]/85 backdrop-blur-sm text-[#FCD34D] text-[11px] font-bold px-3 py-1 rounded-full border border-amber-500/40 uppercase tracking-wider">
                      {stage.stage}
                    </div>
                    <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-[#1E4D38] border border-[#22C55E]/50 text-white font-mono text-xs font-bold flex items-center justify-center shadow-md">
                      {stage.step}
                    </div>
                  </div>

                  {/* Stage Body */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-[#E58A1F] uppercase tracking-wider block">
                        {stage.numLabel}
                      </span>
                      <h3 className="font-serif font-bold text-lg text-white group-hover:text-[#FCD34D] transition-colors mt-0.5 leading-snug">
                        {stage.title}
                      </h3>
                      <p className="text-xs text-[#A89F95] mt-1">
                        {stage.subtitle}
                      </p>
                    </div>

                    {/* Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {stage.pills.map((pill, pIdx) => (
                        <span
                          key={pIdx}
                          className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#1A1412] text-[#D1CCC4] border border-[#3E2B1F]"
                        >
                          {pill}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-[#C4BCB3] leading-relaxed pt-1">
                      {stage.desc}
                    </p>
                  </div>
                </div>

                {/* Stage Link */}
                <div className="p-4 sm:p-5 pt-0">
                  <Link
                    href="/weaving-process"
                    className="text-xs font-bold text-[#FBBF24] hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <span>Xem chi tiết công đoạn</span>
                    <span>➔</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CỐ VẤN KHOA HỌC & ĐỘI NGŨ SÁNG LẬP */}
      <section className="space-y-12 bg-gradient-to-b from-[#1E1713] to-[#14110F] p-8 sm:p-12 rounded-xl border border-amber-900/40 shadow-sm">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E58A1F] bg-[#231C18] px-3.5 py-1 rounded-full border border-amber-900/40 inline-block">
            ĐỘI NGŨ SÁNG LẬP & VẬN HÀNH DỰ ÁN
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-white">
            The People Behind The Weave
          </h2>
          <p className="text-xs sm:text-sm text-stone-400">
            Những người gieo khát vọng số hóa và xây dựng cầu nối thương mại điện tử đưa thổ cẩm Jrai vươn xa.
          </p>
        </div>

        {/* 5 FOUNDING TEAM MEMBERS */}
        <div style={{ marginTop: '20px', marginBottom: '10px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFA726', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            BAN ĐIỀU HÀNH & PHÁT TRIỂN DỰ ÁN (5 THÀNH VIÊN)
          </span>
        </div>

        {/* Lưới 5 thành viên sáng lập: Format Tứ Quý Garden Chuẩn Tone Nóng */}
        <div className="team-grid">
          {/* 1. Mai Thị Cẩm Tú - Lead */}
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

          {/* 2. Huỳnh Diệp Cẩm Tú - Legal & Partnership */}
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

          {/* 3. Nguyễn Ngọc Nữ - Tourism & Culture */}
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
      </section>

      {/* 5. 5 CAM KẾT VÀNG & ĐỊA BÀN TRIỂN KHAI */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl border border-[#E5DACB] space-y-5 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#EA8E23]" />
            <h3 className="text-xl font-serif font-bold text-[#1F1D1B]">5 Cam Kết Vàng Của JRAI ƠI</h3>
          </div>
          <ul className="space-y-3.5 text-xs text-[#5D554D]">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>100% Thủ công bản địa:</strong> Dệt cửi hông bởi các nghệ nhân làng Kép & làng Phung, Ia Mơ Nông.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Minh bạch tuyệt đối:</strong> Mỗi sản phẩm gắn một mã QR định danh số tra cứu người dệt và số giờ công.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Thương mại công bằng:</strong> 100% thù lao dệt công bằng và trích quỹ hỗ trợ nghệ nhân cao tuổi.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Bảo tồn tri thức mẫu hệ:</strong> Ghi chép và số hóa các bài ca, hoa văn truyền khẩu Jrai.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Giao nhận toàn quốc:</strong> Kiểm tra hàng thực tế trước khi thanh toán (COD).
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-xl border border-[#E5DACB] space-y-5 shadow-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-[#EA8E23]" />
            <h3 className="text-xl font-serif font-bold text-[#1F1D1B]">Địa Bàn Triển Khai Thực Địa</h3>
          </div>
          <p className="text-xs text-[#5D554D] leading-relaxed">
            Website thương mại điện tử thổ cẩm di sản JRAI ƠI được phối hợp thực hiện cùng cộng đồng dân cư địa phương:
          </p>
          <div className="space-y-3 text-xs text-[#5D554D]">
            <div className="p-3.5 bg-[#FBF8F3] rounded-xl border border-[#E5DACB]">
              <span className="font-bold text-[#1F1D1B] block mb-0.5">Hợp Tác Xã & CLB Dệt Thổ Cẩm:</span>
              Làng Kép & Làng Phung, Xã Ia Mơ Nông, Huyện Chư Păh, Tỉnh Gia Lai.
            </div>
            <div className="p-3.5 bg-[#FBF8F3] rounded-xl border border-[#E5DACB]">
              <span className="font-bold text-[#1F1D1B] block mb-0.5">Đơn Vị Quản Trị & Vận Hành:</span>
              Đội ngũ sáng lập & thương hiệu Thổ Cẩm Bản Địa JRAI ƠI • Dự án Bảo tồn & Thương mại hóa Di sản Tây Nguyên.
            </div>
            <div className="p-3.5 bg-[#FBF8F3] rounded-xl border border-[#E5DACB]">
              <span className="font-bold text-[#1F1D1B] block mb-0.5">Hotline / Zalo Dự Án:</span>
              <strong className="text-[#C43B3D]">0383 451 929</strong> • Email: contact@jraioi.vn
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
