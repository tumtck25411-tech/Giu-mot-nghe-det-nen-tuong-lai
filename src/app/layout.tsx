import type { Metadata } from 'next';
import { Lora, Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const lora = Lora({
  subsets: ['vietnamese', 'latin'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['vietnamese', 'latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DỆT NÊN TƯƠNG LAI — Ngân Hàng Số Hoa Văn Jrai',
  description: 'Nền tảng số hóa, lưu giữ và tra cứu di sản thổ cẩm Jrai. Kết nối sản phẩm thổ cẩm với hoa văn, nghệ nhân và câu chuyện văn hóa Tây Nguyên.',
  keywords: ['Thổ cẩm Jrai', 'Hoa văn Jrai', 'Dệt thổ cẩm', 'Gia Lai', 'Tây Nguyên', 'Ngân hàng hoa văn số', 'Dệt nên tương lai'],
  openGraph: {
    title: 'DỆT NÊN TƯƠNG LAI — Ngân Hàng Số Hoa Văn Jrai',
    description: 'Bảo tồn & tra cứu tri thức di sản thổ cẩm Jrai qua hệ thống mã QR số hóa.',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${lora.variable} ${inter.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col antialiased selection:bg-amber-800 selection:text-white font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
