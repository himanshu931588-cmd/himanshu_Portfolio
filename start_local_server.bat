@echo off
title Himanshu Mishra Portfolio - Local Server
cls
echo =====================================================================
echo   Himanshu Mishra Portfolio - Local Development Server
echo =====================================================================
echo.
echo [1] PC Access:
echo     http://localhost:3000
echo.
echo [2] Mobile Access (Phone / Tablet on same Wi-Fi):
echo     Find your PC's IP address (e.g. 192.168.1.X) and visit:
echo     http://YOUR-PC-IP:3000
echo.
echo Press Ctrl+C in this window anytime to stop the server.
echo =====================================================================
echo.
start http://localhost:3000
python -m http.server 3000 --bind 0.0.0.0
pause
