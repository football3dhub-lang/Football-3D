@echo off
@chcp 65001 >nul
title تشغيل سيرفر Sport 3D AI
color 0A

echo ========================================
echo 🚀 جاري تشغيل السيرفر الصناعي Sport 3D AI
echo ========================================

REM الانتقال إلى مجلد السيرفر
F:
cd "F:\New folder\Football 3D"

REM تشغيل السيرفر
node chat.js

pause