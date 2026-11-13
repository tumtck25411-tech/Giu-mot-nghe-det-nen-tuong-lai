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
];

const weavingStages = [
  {
    step: '01',
    stage: 'CHẶNG 01 • BÌA RỪNG CHƯ PĂH',
    title: 'Thu Hái Bông Kơpăh Tự Nhiên',
    subtitle: 'Mùa khô Tây Nguyên • Thu hái hoàn toàn thủ công',
    image: '/images/weaving/step-1.jpg',
    pills: ['⏱️ Tháng 11 - 12 (Mùa khô)', '📍 Rừng Kơpăh Ia Mơ Nông', '🌿 100% Bông tự nhiên'],
    desc: 'Vào khoảng tháng 11 - 12 hàng năm, phụ nữ Jrai lên nương rẫy và bìa rừng Chư Păh thu hái những quả bông tự nhiên vừa bung nở trắng muốt, giữ trọn vẹn độ tơi xốp và tinh khiết của đất trời đại ngàn.',
  },
  {
    step: '02',
    stage: 'CHẶNG 02 • BÊN HIÊN NHÀ SÀN',
    title: 'Cán Bông & Kéo Sợi Mộc',
    subtitle: 'Tách hạt gỗ truyền thống • Se sợi con sâu đều đặn',
    image: '/images/weaving/step-2.jpg',
    pills: ['⏱️ 2 - 3 ngày thao tác', '📍 Hiên nhà sàn truyền thống', '🪵 Trục cán gỗ & Xa quay tay'],
    desc: 'Tách sạch hạt bằng trục cán gỗ mộc mạc, vò bông thành từng búp mịn rồi dùng ống quay xa bằng tay để kéo thành những cuộn sợi chỉ dai chắc, bền bỉ và đều đặn theo từng nhịp quay nhịp nhàng.',
  },
  {
    step: '03',
    stage: 'CHẶNG 03 • NỒI NHUỘM BẢN ĐỊA',
    title: 'Nhuộm Thảo Mộc Rừng Tự Nhiên',
    subtitle: 'Lá chàm mun, vỏ cây Klét, rễ Knung • 0% hóa chất',
    image: '/images/weaving/step-5.jpg',
    pills: ['⏱️ 5 - 7 ngày ngâm ủ', '📍 Làng Kép, Chư Păh', '🍃 Chàm mun, Klét, Knung'],
    desc: "Nấu nước lá chàm mun (T'râm) tạo sắc đen huyền bí, vỏ cây Klét đun sôi cho màu đỏ đất bazan, rễ cây Knung cho sắc vàng tươi ấm áp. Từng cuộn sợi được ngâm ủ kỹ lưỡng nhiều ngày đêm dưới nắng gió.",
  },
  {
    step: '04',
    stage: 'CHẶNG 04 • CỬI HÔNG TRUYỀN THỐNG',
    title: 'Mắc Khung Cửi Hông (Backstrap Loom)',
    subtitle: 'Cố định đai lưng • Tạo lực căng bằng chính cơ thể',
    image: '/images/weaving/step-7.jpg',
    pills: ['⏱️ 1 ngày mắc cửi', '📍 Đai lưng nghệ nhân', '🧵 Căng sợi tự nhiên'],
    desc: 'Khác biệt hoàn toàn với cửi đứng công nghiệp, khung cửi hông Jrai được cố định bằng đai da áp sát lưng nghệ nhân. Độ ngả người và lực đẩy đôi chân tạo nên độ căng tự nhiên hoàn hảo cho từng sợi dọc.',
  },
  {
    step: '05',
    stage: 'CHẶNG 05 • TRUYỀN KHẨU KÝ ỨC',
    title: 'Dệt Hoa Văn Độc Bản Theo Ký Ức',
    subtitle: 'Đếm từng sợi chỉ • Không bản vẽ in sẵn',
    image: '/images/weaving/step-9.jpg',
    pills: ['⏱️ 10 - 20 ngày dệt tay', '📍 Làng Phung & Làng Kép', '✨ Ký ức mẫu hệ'],
    desc: 'Không cần sơ đồ trên giấy, nghệ nhân nhặt đếm từng sợi chỉ theo bài ca truyền khẩu của mẫu hệ. Hoa văn cánh bướm Kơkơh, sóng âm Chiêng cồng, Răng cưa bảo vệ hiện lên sắc sảo, sống động.',
  },
  {
    step: '06',
    stage: 'CHẶNG 06 • MINH BẠCH SỐ HÓA',
    title: 'Cấp Tem Mã QR Định Danh Di Sản',
    subtitle: 'Minh bạch nghệ nhân • Số giờ dệt • Ý nghĩa hoa văn',
    image: '/images/background/image5.jpg',
    pills: ['⏱️ Định danh số độc bản', '📍 CLB Dệt Ia Mơ Nông', '📱 Quét QR xem nghệ nhân'],
    desc: 'Tác phẩm dệt xong được kiểm định khắt khe và cấp một tem mác QR độc bản. Người mua dùng camera điện thoại quét mã là thấy ngay chân dung nghệ nhân, làng nghề Ia Mơ Nông và công sức dệt nên sản phẩm.',
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20">
      {/* 1. HERO BANNER: KẾ THỪA CÂU CHUYỆN KHỞI NGUỒN */}
      <section className="bg-gradient-to-r from-[#231C18] via-[#1E1713] to-[#231C18] text-white p-8 sm:p-14 rounded-3xl border border-amber-900/40 relative overflow-hidden shadow-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity"
          style={{ backgroundImage: `url('/images/background/image6.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#181411] via-[#181411]/90 to-transparent" />

        <div className="max-w-3xl space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#8B2522] text-amber-200 text-xs font-bold px-4 py-1.5 rounded-full border border-amber-500/40 uppercase tracking-wider shadow">
            <Compass className="w-4 h-4 text-amber-300" />
            <span>CÂU CHUYỆN KHỞI NGUỒN • DỰ ÁN DỆT NÊN TƯƠNG LAI</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#FFFDF9] leading-tight">
            Từ Câu Hỏi Về Sinh Kế <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
              Đến Khát Vọng Giữ Lửa Nghề
            </span>
          </h1>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed italic border-l-4 border-[#B9383A] pl-4">
            “Nếu một nghề truyền thống có giá trị nhưng người làm nghề không thể sống được từ nghề, thì làm thế nào để nghề ấy tiếp tục tồn tại?” — Câu hỏi trăn trở ấy đã đưa nhóm chúng tôi đặt chân đến buôn làng Ia Mơ Nông.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B9383A] to-[#8B2522] hover:from-[#A83232] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-xl border border-amber-500/30 transition hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-4 h-4 text-amber-300" />
              <span>KHÁM PHÁ 57 TÁC PHẨM</span>
            </Link>
            <Link
              href="/#artisans"
              className="inline-flex items-center gap-2 bg-[#231C18] hover:bg-[#32261E] text-amber-300 font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl border border-amber-900/50 transition hover:-translate-y-0.5"
            >
              <Users className="w-4 h-4" />
              <span>9 NGHỆ NHÂN GIỮ NGHỀ</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. HÀNH TRÌNH THỰC ĐỊA IA MƠ NÔNG */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-5 text-stone-300 text-sm leading-relaxed">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E58A1F]">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>HÀNH TRÌNH THỰC ĐỊA IA MƠ NÔNG</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-black text-white leading-tight">
            Không chỉ là bảo tồn, mà là làm cho giá trị của nghề được nhìn thấy
          </h2>

          <p>
            Từ vòng casting đến vòng đấu chính thức của cuộc thi SVTHM, dự án đã chuyển mình mạnh mẽ: từ một ý tưởng trên trang giấy thành một dự án có <strong>địa bàn thật, người làm nghề thật, sản phẩm thật</strong> và bước đầu được kiểm chứng trong thực tế.
          </p>

          <p>
            Tại xã Ia Mơ Nông, huyện Chư Păh, chúng tôi ngồi cùng những người phụ nữ Jrai bên hiên nhà sàn, lắng nghe tiếng lách cách của thoi đưa và nhận ra: công nghệ số không phải để thay thế đôi bàn tay nghệ nhân, mà là chiếc cầu nối để đưa câu chuyện, công sức và tri thức văn hóa phía sau từng nếp dệt đến với những khách hàng trân quý.
          </p>

          <div className="bg-[#231C18] border-l-4 border-[#B9383A] p-4 rounded-r-2xl border-y border-r border-amber-900/30">
            <p className="font-serif italic font-bold text-amber-200 text-sm sm:text-base">
              “Không thay đổi cái gốc của nghề, thay đổi cách giá trị của nghề được nhìn thấy.”
            </p>
          </div>
        </div>

        {/* Fieldwork Photo */}
        <div className="relative">
          <div className="rounded-3xl overflow-hidden border-2 border-amber-500/30 shadow-2xl aspect-[4/3]">
            <img
              src="/images/background/image6.jpg"
              alt="Sinh viên UEL và nghệ nhân gìn giữ nghề dệt tại Ia Mơ Nông"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="absolute -bottom-5 -right-3 bg-[#1C1714] border border-amber-500/40 p-4 rounded-2xl shadow-xl max-w-xs text-xs text-stone-300">
            <span className="text-[10px] font-extrabold uppercase text-[#E58A1F] block mb-1">
              ĐỊA BÀN THÍ ĐIỂM
            </span>
            <p className="font-serif font-bold text-white text-xs sm:text-sm">
              CLB Dệt Thổ Cẩm Ia Mơ Nông, Huyện Chư Păh, Tỉnh Gia Lai
            </p>
          </div>
        </div>
      </section>

      {/* 3. HÀNH TRÌNH 6 BƯỚC DỆT NÊN MỘT TÁC PHẨM THỔ CẨM */}
      <section className="space-y-10" id="journey">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E58A1F] bg-[#231C18] px-3.5 py-1 rounded-full border border-amber-900/40 inline-block">
            QUY TRÌNH THỦ CÔNG TRUYỀN THỐNG
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-white">
            Hành Trình 6 Chặng Dệt Nên Một Tác Phẩm Thổ Cẩm
          </h2>
          <p className="text-xs sm:text-sm text-stone-400">
            Mỗi tấm thổ cẩm Jrai là kết tinh của hàng chục giờ đếm từng sợi chỉ trên khung cửi hông, trải qua 6 công đoạn khắt khe từ cây bông rừng đến mác định danh số QR.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weavingStages.map((stage) => (
            <div
              key={stage.step}
              className="bg-[#1E1713] rounded-3xl border border-amber-900/40 overflow-hidden shadow-xl flex flex-col justify-between group hover:border-amber-500/60 transition-all"
            >
              <div>
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src={stage.image}
                    alt={stage.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#1C1714]/90 backdrop-blur-sm border border-amber-500/40 px-3 py-1 rounded-xl text-[10px] font-bold text-amber-300">
                    {stage.stage}
                  </div>
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-[#8B2522] text-white font-serif font-black text-xs flex items-center justify-center border border-amber-400/50 shadow">
                    {stage.step}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-serif font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                    {stage.title}
                  </h3>
                  <div className="text-[11px] text-[#E58A1F] font-semibold">{stage.subtitle}</div>

                  <div className="flex flex-wrap gap-1.5">
                    {stage.pills.map((pill, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-[#14110F] text-stone-300 px-2 py-0.5 rounded-lg border border-stone-800"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-stone-400 leading-relaxed pt-1">{stage.desc}</p>
                </div>
              </div>

              <div className="p-4 bg-[#181411] border-t border-stone-800/80 flex items-center justify-between text-xs text-amber-400 font-bold">
                <span>Chi tiết công đoạn {stage.step}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CỐ VẤN KHOA HỌC & ĐỘI NGŨ SÁNG LẬP */}
      <section className="space-y-12 bg-gradient-to-b from-[#1E1713] to-[#14110F] p-8 sm:p-12 rounded-3xl border border-amber-900/40 shadow-2xl">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E58A1F] bg-[#231C18] px-3.5 py-1 rounded-full border border-amber-900/40 inline-block">
            CỐ VẤN KHOA HỌC & ĐỘI NGŨ DỰ ÁN
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-white">
            The People Behind The Weave
          </h2>
          <p className="text-xs sm:text-sm text-stone-400">
            Những người gieo khát vọng số hóa và kết nối sinh kế bền vững cho buôn làng Jrai tại cuộc thi SVTHM 2026.
          </p>
        </div>

        {/* MENTOR SPOTLIGHT CARD */}
        {/* 4 FOUNDING TEAM MEMBERS */}
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#FFA726]">
              BAN ĐIỀU HÀNH & PHÁT TRIỂN DỰ ÁN (4 THÀNH VIÊN)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((mem) => (
              <div
                key={mem.name}
                className="bg-[#231C18] rounded-2xl border border-amber-900/40 p-5 flex flex-col justify-between space-y-4 shadow-lg hover:border-amber-500/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-amber-500/40 bg-stone-950 shrink-0 shadow-md">
                    <img
                      src={mem.image}
                      alt={mem.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold font-mono uppercase px-2 py-0.5 rounded bg-[#8B2522] text-[#FDE68A]">
                      {mem.badge}
                    </span>
                    <h4 className="font-serif font-bold text-sm sm:text-base text-white mt-1">
                      {mem.name}
                    </h4>
                    <p className="text-[11px] text-[#E58A1F] font-medium leading-tight">
                      {mem.role}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-stone-400 leading-relaxed border-t border-stone-800/80 pt-3">
                  {mem.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 5 CAM KẾT VÀNG & ĐỊA BÀN TRIỂN KHAI */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#231C18] p-8 rounded-3xl border border-amber-900/40 space-y-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-serif font-bold text-white">5 Cam Kết Vàng Của JRAI ƠI</h3>
          </div>
          <ul className="space-y-3.5 text-xs text-stone-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>100% Thủ công bản địa:</strong> Dệt cửi hông bởi các nghệ nhân làng Kép & làng Phung, Ia Mơ Nông.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Minh bạch tuyệt đối:</strong> Mỗi sản phẩm gắn một mã QR định danh số tra cứu người dệt và số giờ công.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Thương mại công bằng:</strong> 100% thù lao dệt công bằng và trích quỹ hỗ trợ nghệ nhân cao tuổi.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Bảo tồn tri thức mẫu hệ:</strong> Ghi chép và số hóa các bài ca, hoa văn truyền khẩu Jrai.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Giao nhận toàn quốc:</strong> Kiểm tra hàng thực tế trước khi thanh toán (COD).
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-[#231C18] p-8 rounded-3xl border border-amber-900/40 space-y-5">
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-serif font-bold text-white">Địa Bàn Triển Khai Thực Địa</h3>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            Dự án nghiên cứu & thương mại điện tử di sản được bảo trợ và phối hợp thực hiện cùng cộng đồng dân cư địa phương:
          </p>
          <div className="space-y-3 text-xs text-stone-400">
            <div className="p-3.5 bg-[#1C1714] rounded-xl border border-stone-800">
              <span className="font-bold text-amber-300 block mb-0.5">Hợp Tác Xã & CLB Dệt Thổ Cẩm:</span>
              Làng Kép & Làng Phung, Xã Ia Mơ Nông, Huyện Chư Păh, Tỉnh Gia Lai.
            </div>
            <div className="p-3.5 bg-[#1C1714] rounded-xl border border-stone-800">
              <span className="font-bold text-amber-300 block mb-0.5">Đơn Vị Nghiên Cứu:</span>
              Nhóm nghiên cứu sinh viên Trường Đại học Kinh tế - Luật (UEL), Đại học Quốc gia TP.HCM • Đề tài SVTHM 2026.
            </div>
            <div className="p-3.5 bg-[#1C1714] rounded-xl border border-stone-800">
              <span className="font-bold text-amber-300 block mb-0.5">Hotline / Zalo Dự Án:</span>
              <strong>0383 451 929</strong> • Email: contact@jraioi.vn
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
