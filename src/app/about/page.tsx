'use client';

import React from 'react';
import Link from 'next/link';
import {
  Compass,
  Users,
  Sparkles,
  MapPin,
  Clock,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

const teamMembers = [
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
    name: 'Mai Thị Cẩm Tú',
    role: 'Lead / Trưởng Nhóm Dự Án',
    badge: 'LEAD',
    image: '/images/team/MaiThiCamTu_brocade.png',
    desc: 'Điều phối tổng thể, nghiên cứu mô hình kinh doanh xã hội & kết nối hợp tác buôn làng.',
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
    stage: 'Chặng 01 • Bìa rừng Chư Păh',
    title: 'Thu hái bông Kơpăh tự nhiên',
    subtitle: 'Mùa khô Tây Nguyên • Thu hái thủ công',
    image: '/images/weaving/step-1.jpg',
    pills: ['Tháng 11 - 12', 'Rừng Chư Păh', '100% Bông mộc'],
    desc: 'Vào khoảng tháng 11 - 12 hàng năm, phụ nữ Jrai lên nương rẫy thu hái quả bông tự nhiên vừa nở trắng muốt, giữ trọn độ tơi xốp và tinh khiết của đất trời.',
  },
  {
    step: '02',
    stage: 'Chặng 02 • Bên hiên nhà sàn',
    title: 'Cán bông & kéo sợi mộc',
    subtitle: 'Trục cán gỗ cổ truyền • Kéo sợi đều đặn',
    image: '/images/weaving/step-2.jpg',
    pills: ['2 - 3 ngày', 'Hiên nhà sàn', 'Trục cán gỗ'],
    desc: 'Tách hạt bằng trục cán gỗ, vò bông thành từng búp mịn rồi dùng ống quay xa bằng tay để kéo thành những cuộn chỉ dai chắc, bền bỉ theo từng nhịp quay.',
  },
  {
    step: '03',
    stage: 'Chặng 03 • Nồi nhuộm tự nhiên',
    title: 'Nhuộm thảo mộc rừng bản địa',
    subtitle: 'Lá chàm mun, vỏ cây Klét, rễ Knung • 0% hóa chất',
    image: '/images/weaving/step-5.jpg',
    pills: ['5 - 7 ngày ngâm ủ', 'Làng Kép', 'Thảo mộc tự nhiên'],
    desc: 'Lá chàm mun ủ chum cho sắc đen chàm, vỏ cây Klét đun sôi cho màu đỏ đất bazan, rễ cây Knung cho sắc vàng óng. Sợi được ngâm ủ kỹ lưỡng nhiều ngày đêm.',
  },
  {
    step: '04',
    stage: 'Chặng 04 • Cửi hông truyền thống',
    title: 'Mắc khung cửi hông (Backstrap Loom)',
    subtitle: 'Cố định đai lưng • Tạo lực căng bằng cơ thể',
    image: '/images/weaving/step-7.jpg',
    pills: ['1 ngày mắc cửi', 'Đai lưng nghệ nhân', 'Căng sợi tự nhiên'],
    desc: 'Khung cửi hông Jrai cố định bằng đai da áp sát lưng. Độ ngả người và lực đẩy đôi chân của nghệ nhân tạo nên độ căng tự nhiên hoàn hảo cho từng sợi dọc.',
  },
  {
    step: '05',
    stage: 'Chặng 05 • Ký ức mẫu hệ',
    title: 'Dệt hoa văn độc bản theo trí nhớ',
    subtitle: 'Đếm từng sợi chỉ • Không bản vẽ in sẵn',
    image: '/images/weaving/step-9.jpg',
    pills: ['10 - 20 ngày dệt', 'Làng Phung & Làng Kép', 'Ký ức mẫu hệ'],
    desc: 'Không cần sơ đồ trên giấy, nghệ nhân nhặt đếm từng sợi chỉ theo bài ca truyền khẩu. Các hoa văn chim thú, cồng chiêng, sóng âm hiện lên sống động.',
  },
  {
    step: '06',
    stage: 'Chặng 06 • Minh bạch số hóa',
    title: 'Cấp tem mã QR định danh di sản',
    subtitle: 'Minh bạch thợ dệt • Số giờ công • Ý nghĩa hoa văn',
    image: '/images/background/image5.jpg',
    pills: ['Định danh độc bản', 'HTX Ia Mơ Nông', 'Quét QR tra cứu'],
    desc: 'Tác phẩm dệt xong được kiểm định và gắn tem QR độc bản. Khách hàng dùng điện thoại quét mã là thấy ngay chân dung nghệ nhân và số giờ công dệt.',
  },
];

export default function AboutPage() {
  return (
    <div className="w-full bg-[#FAF5EC] min-h-screen py-10 lg:py-14">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 space-y-16">
        
        {/* 1. HERO BANNER - Modern Ethnic Boutique */}
        <section className="bg-[#FFFDF9] p-8 sm:p-14 rounded-2xl border border-[#E8DFC8] shadow-xs text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF5EC] border border-[#E8DFC8] text-xs font-medium text-[#C99A45]">
            <span>◇</span>
            <span>Dự Án Dệt Nên Tương Lai</span>
            <span>◇</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#174C38] tracking-tight leading-tight">
            Từ câu hỏi về sinh kế <br />
            <span className="text-[#C99A45]">đến khát vọng giữ lửa nghề</span>
          </h1>

          <p className="text-[#59524C] text-sm sm:text-base leading-relaxed italic max-w-2xl mx-auto font-normal">
            &ldquo;Nếu một nghề truyền thống có giá trị nhưng người làm nghề không thể sống được từ nghề, thì làm thế nào để nghề ấy tiếp tục tồn tại?&rdquo; — Câu hỏi trăn trở ấy đã đưa chúng tôi đến với buôn làng Ia Mơ Nông.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#174C38] hover:bg-[#0E3626] text-[#FFFDF9] font-medium text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-xs transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-[#C99A45]" />
              <span>Khám phá 57 tác phẩm</span>
            </Link>
            <Link
              href="/artisans"
              className="inline-flex items-center gap-2 bg-[#FAF5EC] hover:bg-[#E8DFC8] text-[#174C38] font-medium text-xs sm:text-sm px-5 py-2.5 rounded-xl border border-[#E8DFC8] transition-all"
            >
              <Users className="w-4 h-4 text-[#174C38]" />
              <span>9 nghệ nhân giữ nghề</span>
            </Link>
          </div>
        </section>

        {/* 2. HÀNH TRÌNH THỰC ĐỊA IA MƠ NÔNG (Balanced Image & Text) */}
        <section className="bg-[#FFFDF9] p-8 sm:p-12 rounded-2xl border border-[#E8DFC8] shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-4 text-[#59524C] text-xs sm:text-sm leading-relaxed">
              <span className="text-xs font-medium text-[#C99A45] uppercase tracking-wider block">
                Hành trình thực địa Ia Mơ Nông
              </span>

              <h2 className="text-2xl sm:text-3xl font-semibold text-[#174C38] leading-tight">
                Không chỉ bảo tồn, mà làm cho giá trị của nghề được nhìn thấy
              </h2>

              <p>
                Từ những ngày đầu khảo sát thực tế đến khi hoàn thiện nền tảng thương mại điện tử, dự án chuyển mình từ một ý tưởng kết nối văn hóa thành một hệ sinh thái gắn liền với <strong>địa bàn thật, người làm nghề thật, sản phẩm thật</strong> và mang lại sinh kế bền vững.
              </p>

              <p>
                Tại xã Ia Mơ Nông, huyện Chư Păh, chúng tôi ngồi cùng những người phụ nữ Jrai bên hiên nhà sàn, lắng nghe tiếng lách cách của thoi đưa và nhận ra: công nghệ số không thay thế đôi bàn tay nghệ nhân, mà là chiếc cầu nối đưa câu chuyện và công sức phía sau từng nếp dệt đến với những khách hàng trân quý.
              </p>

              <div className="bg-[#FAF5EC] border-l-3 border-[#174C38] p-3.5 rounded-r-xl text-xs sm:text-sm text-[#174C38] font-medium italic">
                &ldquo;Không thay đổi cái gốc của nghề, thay đổi cách giá trị của nghề được nhìn thấy.&rdquo;
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden border border-[#E8DFC8] shadow-xs aspect-[4/3] bg-[#FAF5EC]">
                <img
                  src="/images/background/image6.jpg"
                  alt="Đội ngũ JRAI ƠI và nghệ nhân tại Ia Mơ Nông"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-3 p-3 bg-[#FAF5EC] rounded-xl border border-[#E8DFC8] text-xs text-[#59524C] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C99A45] shrink-0" />
                <span>CLB Dệt Thổ Cẩm Ia Mơ Nông, Huyện Chư Păh, Gia Lai</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. TIMELINE QUY TRÌNH 6 BƯỚC DỄ THEO DÕI */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-medium text-[#C99A45] uppercase tracking-wider block">
              Quy trình thủ công truyền thống
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#174C38]">
              Hành trình dệt nên một tác phẩm thổ cẩm
            </h2>
            <p className="text-xs sm:text-sm text-[#59524C]">
              Mỗi tấm thổ cẩm Jrai là kết tinh của hàng chục giờ đếm từng sợi chỉ trên khung cửi hông, trải qua 6 công đoạn khắt khe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weavingStages.map((stage) => (
              <div
                key={stage.step}
                className="bg-[#FFFDF9] rounded-2xl border border-[#E8DFC8] hover:border-[#C99A45] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] bg-[#FAF5EC] overflow-hidden">
                    <img
                      src={stage.image}
                      alt={stage.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-[#174C38] text-[#FFFDF9] text-xs font-mono font-medium px-2.5 py-0.5 rounded-full shadow-xs">
                      BƯỚC {stage.step}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <span className="text-[11px] font-medium text-[#C99A45] uppercase tracking-wider block">
                      {stage.stage}
                    </span>
                    <h3 className="font-semibold text-base text-[#174C38]">
                      {stage.title}
                    </h3>
                    <p className="text-xs text-[#59524C] leading-relaxed line-clamp-3 font-normal">
                      {stage.desc}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="flex flex-wrap gap-1.5 pt-2.5 border-t border-[#E8DFC8]">
                    {stage.pills.map((pill, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-[#FAF5EC] text-[#59524C] px-2 py-0.5 rounded-full border border-[#E8DFC8]"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. ĐỘI NGŨ SÁNG LẬP & VẬN HÀNH (5 THÀNH VIÊN) */}
        <section className="bg-[#FFFDF9] p-8 sm:p-12 rounded-2xl border border-[#E8DFC8] shadow-xs space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-medium text-[#C99A45] uppercase tracking-wider block">
              Đội ngũ sáng lập & vận hành
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#174C38]">
              Những người đồng hành cùng buôn làng
            </h2>
            <p className="text-xs sm:text-sm text-[#59524C]">
              Những người gieo khát vọng số hóa và xây dựng cầu nối thương mại đưa thổ cẩm Jrai vươn xa.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="bg-[#FAF5EC] rounded-2xl overflow-hidden border border-[#E8DFC8] p-4 text-center space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="aspect-square rounded-xl overflow-hidden bg-white border border-[#E8DFC8] mx-auto shadow-xs">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#C99A45] bg-[#FFFDF9] px-2 py-0.5 rounded-full border border-[#E8DFC8]">
                      {member.badge}
                    </span>
                    <h3 className="font-semibold text-sm text-[#174C38] mt-1.5">
                      {member.name}
                    </h3>
                    <p className="text-[11px] text-[#C99A45] font-medium">
                      {member.role}
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-[#59524C] leading-relaxed line-clamp-3 pt-2 border-t border-[#E8DFC8]">
                  {member.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. 5 CAM KẾT VÀNG & ĐỊA BÀN TRIỂN KHAI */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#FFFDF9] p-6 sm:p-8 rounded-2xl border border-[#E8DFC8] space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#C99A45]" />
              <h3 className="text-lg font-semibold text-[#174C38]">5 cam kết vàng của JRAI ƠI</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-[#59524C]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#174C38] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#174C38]">100% Thủ công bản địa:</strong> Dệt cửi hông bởi các nghệ nhân làng Kép & làng Phung.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#174C38] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#174C38]">Minh bạch nguồn gốc:</strong> Mỗi sản phẩm gắn mã QR định danh số tra cứu người dệt và giờ công.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#174C38] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#174C38]">Thương mại công bằng:</strong> Thù lao trả trực tiếp và trích quỹ hỗ trợ nghệ nhân cao tuổi.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#174C38] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#174C38]">Bảo tồn tri thức mẫu hệ:</strong> Ghi chép và số hóa các bài ca, hoa văn truyền khẩu.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#174C38] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#174C38]">Giao nhận tin cậy:</strong> Kiểm tra hàng thực tế trước khi thanh toán (COD).
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-[#FFFDF9] p-6 sm:p-8 rounded-2xl border border-[#E8DFC8] space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#C99A45]" />
              <h3 className="text-lg font-semibold text-[#174C38]">Địa bàn triển khai thực địa</h3>
            </div>
            <p className="text-xs text-[#59524C] leading-relaxed">
              Website thương mại điện tử thổ cẩm di sản JRAI ƠI được phối hợp thực hiện cùng cộng đồng địa phương:
            </p>
            <div className="space-y-2 text-xs text-[#59524C]">
              <div className="p-3 bg-[#FAF5EC] rounded-xl border border-[#E8DFC8]">
                <span className="font-semibold text-[#174C38] block mb-0.5">Hợp tác xã & CLB Dệt Thổ Cẩm:</span>
                Làng Kép & Làng Phung, Xã Ia Mơ Nông, Huyện Chư Păh, Tỉnh Gia Lai.
              </div>
              <div className="p-3 bg-[#FAF5EC] rounded-xl border border-[#E8DFC8]">
                <span className="font-semibold text-[#174C38] block mb-0.5">Đơn vị quản trị & vận hành:</span>
                Đội ngũ sáng lập & thương hiệu Thổ Cẩm Bản Địa JRAI ƠI.
              </div>
              <div className="p-3 bg-[#FAF5EC] rounded-xl border border-[#E8DFC8]">
                <span className="font-semibold text-[#174C38] block mb-0.5">Hotline / Zalo:</span>
                <strong className="text-[#A94335]">0383 451 929</strong> • Email: contact@jraioi.vn
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
