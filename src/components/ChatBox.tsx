'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  X,
  Send,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  links?: { label: string; href: string }[];
}

const DEFAULT_SUGGESTIONS = [
  'Ý nghĩa các hoa văn Jrai?',
  'Quy trình dệt cửi hông thủ công?',
  'Tra cứu mã định danh số QR là gì?',
  'Gợi ý quà tặng thổ cẩm ý nghĩa?',
  'Hướng dẫn đặt may theo yêu cầu?',
  'Chính sách giao hàng & đổi trả?',
];

function getBotResponse(input: string): { text: string; links?: { label: string; href: string }[] } {
  const query = input.toLowerCase().trim();

  // 1. Hoa văn & ý nghĩa
  if (query.includes('hoa văn') || query.includes('ý nghĩa') || query.includes('klang liếp') || query.includes('den đông') || query.includes('dưng room') || query.includes('rúp') || query.includes('motif')) {
    return {
      text: `Hoa văn thổ cẩm Jrai là ngôn ngữ biểu tượng truyền đời qua văn hóa mẫu hệ:\n\n• **Klang Liếp (Hình thoi):** Biểu tượng mắt rồng và lòng dũng cảm, che chở buôn làng và mang lại bình an cho chủ nhân.\n• **Den Đông (Đường zíc zắc):** Tái hiện dòng suối Ia Mơ Nông uốn lượn và triền núi Chư Păh hùng vĩ.\n• **Dưng Room (Đường thẳng):** Tượng trưng cho sự ngay thẳng, kỷ cương và trật tự của cộng đồng Jrai.\n• **Rúp (Hình nhân / Đám trẻ / Muông thú):** Khắc họa đời sống lao động, ngày mùa lúa mới và khát vọng tự do.`,
      links: [
        { label: 'Tra cứu 20 hoa văn di sản Jrai', href: '/motifs' },
        { label: 'Thử nghiệm AI Studio thiết kế hoa văn', href: '/#studio' },
      ],
    };
  }

  // 2. Quy trình dệt cửi hông
  if (query.includes('dệt') || query.includes('quy trình') || query.includes('cửi hông') || query.includes('kơpăh') || query.includes('nhuộm') || query.includes('chàm') || query.includes('khung')) {
    return {
      text: `Nghệ thuật dệt cửi hông (Backstrap Loom) của người Jrai gồm 6 chặng thủ công kỳ công:\n\n1. **Thu hái bông Kơpăh tự nhiên:** Vào mùa khô tháng 11 - 12 tại bìa rừng Chư Păh.\n2. **Cán bông & kéo sợi mộc:** Tách hạt bằng trục cán gỗ, kéo sợi bằng xa quay tay nhịp nhàng.\n3. **Nhuộm thảo mộc 100% tự nhiên:** Lá chàm mun T'râm (màu đen chàm), vỏ cây Klét (đỏ đất bazan), rễ Knung (vàng tươi).\n4. **Mắc khung cửi hông:** Dùng dây đai tựa vào lưng thợ dệt, tạo lực căng bằng chính cơ thể.\n5. **Dệt đếm sợi thủ công:** Tốn từ 40h đến 140h tập trung cao độ.\n6. **Khâu ráp & định danh số QR:** Gắn mã passport nguồn gốc trước khi đến tay bạn.`,
      links: [
        { label: 'Xem chi tiết 6 bước hành trình dệt', href: '/#journey' },
        { label: 'Gặp gỡ nghệ nhân làng Kép & làng Phung', href: '/artisans' },
      ],
    };
  }

  // 3. Mã định danh số QR
  if (query.includes('qr') || query.includes('định danh') || query.includes('tra cứu') || query.includes('passport') || query.includes('nguồn gốc')) {
    return {
      text: `Mỗi sản phẩm JRAI ƠI xuất xưởng đều được cấp một **Mã định danh số QR độc bản** (ví dụ K001, C001, VI001, A001, V001, B001).\n\nKhi quét mã hoặc nhập mã vào hệ thống, bạn có thể kiểm chứng:\n• Tên và chân dung nghệ nhân dệt.\n• Làng dệt thực địa (Làng Kép hoặc Làng Phung, Xã Ia Mơ Nông, Gia Lai).\n• Số giờ dệt cửi hông thực tế (40h - 140h).\n• Loại hoa văn và thông điệp văn hóa mẫu hệ trao gửi.`,
      links: [
        { label: 'Trải nghiệm Cổng tra cứu QR Passport', href: '/traceability' },
      ],
    };
  }

  // 4. Gợi ý quà tặng
  if (query.includes('quà') || query.includes('tặng') || query.includes('gợi ý') || query.includes('tư vấn') || query.includes('mua gì') || query.includes('bán chạy')) {
    return {
      text: `Dưới đây là các gợi ý tác phẩm thổ cẩm độc bản ý nghĩa nhất tại JRAI ƠI:\n\n🎁 **Quà tặng trang trọng (Đối tác, khách quý):**\n• Khăn Quàng Cổ Kơpăh hoa văn Rồng (K001 - 700.000₫)\n• Áo Thổ Cẩm Nam sát nách Jrai (A001 - 1.250.000₫)\n• Váy Nữ lễ hội mẫu hệ độc bản (V001 - 1.200.000₫)\n\n👜 **Quà tặng thanh lịch, hiện đại (Bạn bè, người thân):**\n• Túi Đeo Chéo Dáng Vuông (C001 - 300.000₫)\n• Ví Cầm Tay thổ cẩm đan cài (VI001 - 320.000₫)\n• Túi Tote sức chứa lớn (TT001 - 380.000₫)\n\n🌿 **Quà lưu niệm di sản:**\n• Bầu Nước Quấn Thổ Cẩm Jrai (B001 - 200.000₫)`,
      links: [
        { label: 'Khám phá Bộ sưu tập 57 mẫu', href: '/products' },
        { label: 'Xem 6 sản phẩm nổi bật trang chủ', href: '/#featured-products' },
      ],
    };
  }

  // 5. Đặt may theo yêu cầu
  if (query.includes('đặt may') || query.includes('yêu cầu') || query.includes('may đo') || query.includes('custom') || query.includes('theo ý')) {
    return {
      text: `Dịch vụ **Đặt May Riêng Theo Yêu Cầu** cho phép bạn cộng tác trực tiếp cùng các nghệ nhân bản địa qua 4 bước:\n\n1. Chọn loại sản phẩm: Áo, váy, túi, khăn hoặc phụ kiện.\n2. Chọn hoa văn hộ mệnh mang thông điệp riêng.\n3. Chọn bảng phối màu nhuộm thảo mộc thiên nhiên.\n4. Điền số đo cơ thể hoặc kích thước mong muốn.\n\nThời gian dệt may thủ công từ 7 - 14 ngày, kèm hình ảnh tiến độ cập nhật từ buôn làng.`,
      links: [
        { label: 'Khởi tạo đơn đặt may riêng ngay', href: '/custom-order' },
      ],
    };
  }

  // 6. Giao hàng & chính sách
  if (query.includes('giao hàng') || query.includes('vận chuyển') || query.includes('ship') || query.includes('đổi trả') || query.includes('bảo hành') || query.includes('thanh toán') || query.includes('cod')) {
    return {
      text: `Chính sách bán hàng và giao nhận của JRAI ƠI:\n\n• **Phí giao hàng:** Miễn phí giao hàng toàn quốc cho đơn hàng từ 500.000₫ (phí tiêu chuẩn 30.000₫ cho đơn dưới 500k).\n• **Hình thức thanh toán:** Hỗ trợ COD (Nhận hàng - Kiểm tra đúng thổ cẩm thủ công - Thanh toán) hoặc Chuyển khoản ngân hàng.\n• **Đổi trả:** Hỗ trợ 1 đổi 1 trong vòng 7 ngày nếu sản phẩm có lỗi kỹ thuật dệt vải.\n• **Cam kết:** 100% sợi tự nhiên mộc mạc dệt cửi hông, trích quỹ hỗ trợ sinh kế nghệ nhân cao tuổi buôn làng.`,
      links: [
        { label: 'Xem trang Giỏ Hàng', href: '/#products' },
      ],
    };
  }

  // 7. Nghệ nhân & Làng nghề
  if (query.includes('nghệ nhân') || query.includes('làng kép') || query.includes('làng phung') || query.includes('ia mơ nông') || query.includes('chư păh') || query.includes('gia lai')) {
    return {
      text: `Dự án JRAI ƠI cộng tác trực tiếp cùng các nghệ nhân cựu trào tại xã Ia Mơ Nông, huyện Chư Păh, tỉnh Gia Lai:\n\n• **Nghệ nhân Rơ Châm H'Mút (Làng Kép):** Bậc thầy 45 năm gắn bó cùng khung cửi dệt hông.\n• **Nghệ nhân Siu H'Blang (Làng Phung):** Chuyên gia phối sắc thảo mộc chàm mun và vỏ cây rừng.\n• **Nghệ nhân Ksor H'Búp (Làng Kép):** Gìn giữ các tích hoa văn cổ về muông thú và mùa màng.\n• **Nghệ nhân H' Uyên Niê:** Nghệ nhân dệt khăn Kơpăh truyền thống.`,
      links: [
        { label: 'Xem danh sách & câu chuyện nghệ nhân', href: '/artisans' },
      ],
    };
  }

  // Default Fallback
  return {
    text: `Cảm ơn bạn đã nhắn tin cho JRAI ƠI! Mình luôn sẵn sàng hỗ trợ bạn khám phá di sản dệt cửi hông Tây Nguyên. Bạn có thể nhấn vào các gợi ý bên dưới hoặc hỏi mình về bất kỳ mẫu thổ cẩm nào bạn đang quan tâm nhé!`,
    links: [
      { label: 'Khám phá Cửa Hàng Thổ Cẩm', href: '/products' },
      { label: 'Tra cứu mã định danh số QR', href: '/traceability' },
      { label: 'Dịch vụ Đặt May Riêng', href: '/custom-order' },
    ],
  };
}

// Helper to render bold text nicely
function renderFormattedMessage(text: string) {
  const lines = text.split('\n');
  return lines.map((line, lineIdx) => {
    // Replace **bold** with <strong>
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <React.Fragment key={lineIdx}>
        {parts.map((part, partIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={partIdx} className="font-bold text-[#1F1D1B]">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        })}
        {lineIdx < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: 'Dạ xin chào! Mình là Jrai Ơi Assistant. Mình có thể giúp bạn tìm hiểu về các dòng thổ cẩm dệt cửi hông, tra cứu ý nghĩa hoa văn truyền thống, câu chuyện nghệ nhân, quy trình nhuộm thảo mộc và hỗ trợ đặt may theo yêu cầu!',
      timestamp: 'Vừa xong',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate smart thinking delay
    setTimeout(() => {
      const response = getBotResponse(query);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.text,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        links: response.links,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Trigger Button (Tu Quy Garden style with AI Badge) */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#1E4D38] hover:bg-[#153828] text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-emerald-500/30 group cursor-pointer"
        aria-label="Mở Trợ lý ảo JRAI ƠI"
        title="Jrai Ơi Assistant - Trợ lý di sản"
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform group-hover:rotate-90 text-white" />
        ) : (
          <div className="relative flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
            <span className="absolute -top-3.5 -right-3.5 bg-amber-400 text-stone-950 font-black text-[10px] tracking-wider px-1.5 py-0.5 rounded-full shadow-md border border-amber-300 animate-bounce">
              AI
            </span>
          </div>
        )}
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[380px] max-w-[calc(100vw-32px)] h-[560px] max-h-[82vh] bg-white rounded-2xl shadow-2xl border border-[#E5DACB] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200"
          style={{ boxShadow: '0 20px 40px -15px rgba(30, 77, 56, 0.4)' }}
        >
          {/* Header (Matching screenshot: Deep Green Bar, Leaf Avatar, Title, Active Dot, Weather Pill, Close Button) */}
          <div className="bg-[#1E4D38] text-white px-4 py-3.5 flex items-center justify-between border-b border-[#2D6A4F] relative shrink-0">
            <div className="flex items-center gap-3">
              {/* Avatar circle */}
              <div className="w-10 h-10 rounded-full bg-[#2B664B] border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold text-base shadow-inner">
                <span>🌿</span>
              </div>
              <div>
                <div style={{ color: '#FFFFFF' }} className="text-sm sm:text-base font-bold font-sans tracking-wide leading-tight">
                  Jrai Ơi Assistant
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-200 font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse"></span>
                    <span>Đang hoạt động</span>
                  </span>
                  <span className="text-[10px] font-semibold bg-[#143B2B] text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                    🌤️ 28°C Chư Păh
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition cursor-pointer"
              aria-label="Đóng chatbox"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF8F5]">
            {messages.map((m) => {
              const isBot = m.sender === 'bot';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                      isBot
                        ? 'bg-white border border-[#E8E2D9] text-[#2C241E] rounded-tl-xs shadow-xs space-y-2.5'
                        : 'bg-[#1E4D38] text-white rounded-tr-xs shadow-xs'
                    }`}
                  >
                    <div>{isBot ? renderFormattedMessage(m.text) : m.text}</div>

                    {/* Actionable links in bot answers */}
                    {m.links && m.links.length > 0 && (
                      <div className="pt-2.5 border-t border-[#F2ECE1] space-y-1.5">
                        <div className="text-[10px] font-bold text-[#8A7E72] uppercase tracking-wider">
                          Liên kết nhanh:
                        </div>
                        <div className="flex flex-col gap-1.5">
                          {m.links.map((link, idx) => (
                            <Link
                              key={idx}
                              href={link.href}
                              onClick={() => setIsOpen(false)}
                              className="inline-flex items-center gap-1.5 text-xs text-[#1E4D38] hover:text-[#B9383A] font-semibold underline underline-offset-2 transition"
                            >
                              <span>{link.label}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-[#8A7E72] px-1 mt-1 font-mono">
                    {m.timestamp}
                  </span>
                </div>
              );
            })}

            {/* Quick Suggestion Chips (Matches reference image style) */}
            {messages.length === 1 && (
              <div className="pt-2 space-y-2">
                <div className="text-[11px] font-bold text-[#5D554D] uppercase tracking-wider px-1">
                  Gợi ý câu hỏi:
                </div>
                <div className="flex flex-col gap-1.5">
                  {DEFAULT_SUGGESTIONS.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(item)}
                      className="text-left px-3.5 py-2 rounded-full bg-[#F4F9F5] hover:bg-[#E8F3EC] text-[#1E4D38] hover:text-[#143527] text-xs font-semibold border border-[#CDE3D5] hover:border-[#1E4D38]/50 transition shadow-2xs flex items-center justify-between group cursor-pointer"
                    >
                      <span>{item}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#1E4D38]/60 group-hover:text-[#1E4D38] group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white border border-[#E8E2D9] px-3.5 py-2.5 rounded-2xl rounded-tl-xs w-fit shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E4D38] animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E4D38] animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E4D38] animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[11px] text-[#8A7E72] ml-1.5 italic font-sans">
                  Trợ lý đang phản hồi...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area (Matches screenshot: Pill input + Circular send button) */}
          <div className="p-3 bg-white border-t border-[#E8E2D9] flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi của bạn..."
              className="flex-1 px-4 py-2.5 rounded-full bg-[#F8F5EE] border border-[#E5DACB] text-xs sm:text-sm text-[#1F1D1B] placeholder-[#8A7E72] focus:outline-none focus:border-[#1E4D38] focus:bg-white transition"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim()}
              className="w-10 h-10 rounded-full bg-[#1E4D38] hover:bg-[#153828] disabled:bg-stone-300 disabled:cursor-not-allowed text-white flex items-center justify-center transition shadow-xs cursor-pointer shrink-0"
              aria-label="Gửi tin nhắn"
            >
              <Send className="w-4 h-4 ml-0.5 text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
