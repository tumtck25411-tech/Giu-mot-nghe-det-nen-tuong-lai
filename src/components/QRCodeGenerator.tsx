'use client';

import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Printer, Copy, Check, QrCode as QrIcon, ExternalLink } from 'lucide-react';

interface QRCodeGeneratorProps {
  productUrl: string;
  productName: string;
  productCode: string;
  category?: string;
  location?: string;
}

export default function QRCodeGenerator({
  productUrl,
  productName,
  productCode,
  category,
  location,
}: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const printRef = useRef<HTMLDivElement | null>(null);
  const [svgDataUrl, setSvgDataUrl] = useState<string>('');
  const [pngDataUrl, setPngDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!productUrl) return;

    // Generate PNG Canvas
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        productUrl,
        {
          width: 320,
          margin: 2,
          color: {
            dark: '#1E293B',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'H',
        },
        (err) => {
          if (err) console.error('Error generating QR Canvas', err);
          else if (canvasRef.current) {
            setPngDataUrl(canvasRef.current.toDataURL('image/png'));
          }
        }
      );
    }

    // Generate SVG string
    QRCode.toString(
      productUrl,
      {
        type: 'svg',
        width: 320,
        margin: 2,
        color: {
          dark: '#1E293B',
          light: '#FFFFFF',
        },
      },
      (err, string) => {
        if (!err && string) {
          const blob = new Blob([string], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          setSvgDataUrl(url);
        }
      }
    );
  }, [productUrl]);

  const handleDownloadPNG = () => {
    if (!pngDataUrl) return;
    const a = document.createElement('a');
    a.href = pngDataUrl;
    a.download = `QR-${productCode || 'san-pham'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadSVG = () => {
    if (!svgDataUrl) return;
    const a = document.createElement('a');
    a.href = svgDataUrl;
    a.download = `QR-${productCode || 'san-pham'}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(productUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintCard = () => {
    const printWindow = window.open('', '_blank', 'width=600,height=700');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Thẻ QR Sản phẩm - ${productCode}</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background-color: #f4f4f5;
              padding: 20px;
            }
            .card {
              background: #fff;
              border: 3px solid #9E3B27;
              border-radius: 16px;
              padding: 32px;
              width: 360px;
              text-align: center;
              box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            }
            .badge {
              background: #9E3B27;
              color: white;
              font-weight: 700;
              font-size: 12px;
              letter-spacing: 1px;
              padding: 4px 12px;
              border-radius: 20px;
              text-transform: uppercase;
              display: inline-block;
              margin-bottom: 12px;
            }
            .title {
              font-size: 20px;
              font-weight: 800;
              color: #1E293B;
              margin: 0 0 6px 0;
            }
            .code {
              font-size: 14px;
              font-weight: 600;
              color: #D97706;
              margin-bottom: 16px;
            }
            .qr-frame {
              border: 2px dashed #CBD5E1;
              padding: 16px;
              border-radius: 12px;
              background: #FAF8F5;
              display: inline-block;
              margin-bottom: 16px;
            }
            .qr-frame img {
              width: 220px;
              height: 220px;
              display: block;
            }
            .scan-text {
              font-size: 13px;
              font-weight: 600;
              color: #475569;
              margin-bottom: 8px;
            }
            .url-text {
              font-size: 11px;
              color: #94A3B8;
              word-break: break-all;
            }
            .footer {
              margin-top: 20px;
              border-top: 1px solid #E2E8F0;
              padding-top: 12px;
              font-size: 11px;
              color: #64748B;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="badge">DỆT NÊN TƯƠNG LAI</div>
            <h2 class="title">${productName}</h2>
            <div class="code">MÃ SẢN PHẨM: ${productCode}</div>
            <div class="qr-frame">
              <img src="${pngDataUrl}" alt="Mã QR ${productCode}" />
            </div>
            <div class="scan-text">📱 QUÉT MÃ ĐỂ XEM THÔNG TIN SẢN PHẨM & HOA VĂN</div>
            <div class="url-text">${productUrl}</div>
            <div class="footer">NGÂN HÀNG SỐ HOA VĂN JRAI • "Giữ một nghề – Dệt một tương lai"</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="bg-amber-50/40 border border-amber-200/80 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4 border-b border-amber-200/60 pb-3">
        <div className="w-10 h-10 rounded-xl bg-amber-700 text-white flex items-center justify-center font-bold shadow-sm">
          <QrIcon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-lg">Mã QR Định Danh Sản Phẩm</h3>
          <p className="text-xs text-slate-600">
            QR cố định dẫn trực tiếp tới trang sản phẩm. Admin cập nhật thông tin không cần đổi QR.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* QR Display */}
        <div className="bg-white p-4 rounded-xl border-2 border-amber-800/20 shadow-inner flex flex-col items-center shrink-0">
          <canvas ref={canvasRef} className="max-w-full rounded" />
          <div className="mt-2 text-center">
            <span className="font-mono text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-md">
              {productCode}
            </span>
          </div>
        </div>

        {/* Info & Action Buttons */}
        <div className="flex-1 w-full space-y-3">
          <div className="bg-white/80 p-3 rounded-xl border border-slate-200 text-sm">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Đường dẫn sản phẩm chính thức:
            </div>
            <a
              href={productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-800 hover:text-amber-900 font-medium break-all flex items-center gap-1.5 hover:underline"
            >
              <span>{productUrl}</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={handleDownloadPNG}
              className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs py-2.5 px-4 rounded-xl transition shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Tải QR PNG</span>
            </button>

            <button
              onClick={handleDownloadSVG}
              className="flex items-center justify-center gap-2 bg-amber-800 hover:bg-amber-900 text-white font-medium text-xs py-2.5 px-4 rounded-xl transition shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Tải QR SVG</span>
            </button>

            <button
              onClick={handlePrintCard}
              className="flex items-center justify-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-medium text-xs py-2.5 px-4 rounded-xl transition border border-amber-300"
            >
              <Printer className="w-4 h-4" />
              <span>In thẻ QR Sản phẩm</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs py-2.5 px-4 rounded-xl transition border border-slate-300"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Đã chép link!' : 'Sao chép Link'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
