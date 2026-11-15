import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'DỆT NÊN TƯƠNG LAI — Giữ Một Nghề, Dệt Nên Tương Lai | JRAI ƠI',
  description:
    'Website thương mại điện tử chính thức của thương hiệu JRAI ƠI kế thừa dự án Dệt Nên Tương Lai. Chuyên cung cấp sản phẩm thổ cẩm dệt cửi hông độc bản từ các nghệ nhân Gia Lai. Tích hợp mã định danh QR số hóa truy xuất nguồn gốc.',
  keywords: [
    'JRAI ƠI',
    'Dệt nên tương lai',
    'Thổ cẩm Jrai',
    'Dệt thổ cẩm',
    'Thổ cẩm Gia Lai',
    'Khăn thổ cẩm',
    'Túi thổ cẩm',
    'Ví thổ cẩm',
    'Nghệ nhân Jrai',
    'Hoa văn thổ cẩm',
    'Thương mại điện tử thổ cẩm',
  ],
  openGraph: {
    title: 'DỆT NÊN TƯƠNG LAI — Giữ Một Nghề, Dệt Nên Tương Lai | JRAI ƠI',
    description:
      'Mỗi sản phẩm là một câu chuyện, mỗi hoa văn là một giá trị được gìn giữ. Truy xuất nguồn gốc bằng mã QR độc bản.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="lang-vi min-h-screen flex flex-col antialiased selection:bg-[#B9383A] selection:text-white">
        <Header />
        <main className="w-full flex-1 flex flex-col items-center">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
