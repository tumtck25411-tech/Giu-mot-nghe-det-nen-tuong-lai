@echo off
chcp 65001 >nul
title JRAI OI - DONG BO LEN GITHUB & VERCEL VINH VIEN
echo =========================================================================
echo       JRAI OI - ĐỒNG BỘ TOÀN BỘ CODE MỚI LÊN GITHUB & VERCEL
echo   Website chính thức vĩnh viễn: https://detnentuonglai.vercel.app/
echo =========================================================================
echo.
echo [1/3] Di chuyen vao thu muc du an...
cd /d "C:\Users\Cam Tu\.gemini\antigravity\scratch\det-nen-tuong-lai"

echo [2/3] Kiem tra trang thai Git...
git status -s

echo [3/3] Dang day code len GitHub (origin main)...
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =========================================================================
    echo [THANH CONG!] Code da duoc day len GitHub thanh cong!
    echo Vercel dang tu dong build va cap nhat toan bo giao dien moi vinh vien tai:
    echo 👉 https://detnentuonglai.vercel.app/
    echo =========================================================================
) else (
    echo.
    echo =========================================================================
    echo [CHU Y] Git yeu cau xac thuc tai khoan GitHub cua ban (Cam Tu).
    echo Vui long dang nhap GitHub trong cua so hien len de hoan tat.
    echo =========================================================================
)
echo.
pause
