@echo off
title Quantum TechDocs IETM Level-4 Server
echo ============================================================
echo   QUANTUM TECHDOCS - IETM LEVEL-4 AIR-GAPPED LAN SERVER
echo   Indian Defence Standard JSG 0852 Level-4 Compliant
echo ============================================================
echo.
echo Starting Embedded IETM Server on port 5000...
echo Accessible from any browser at: http://localhost:5000
echo.
set ELECTRON_RUN_AS_NODE=1
".\node_modules\.bin\electron.cmd" ./electron/server.js
pause

