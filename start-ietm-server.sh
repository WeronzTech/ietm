#!/usr/bin/env bash
echo "============================================================"
echo "  QUANTUM TECHDOCS - IETM LEVEL-4 AIR-GAPPED LAN SERVER"
echo "  Indian Defence Standard JSG 0852 Level-4 Compliant"
echo "============================================================"
echo ""
echo "Starting Embedded IETM Server on port 5000..."
echo "Accessible from any browser at: http://localhost:5000"
echo ""
export ELECTRON_RUN_AS_NODE=1
./node_modules/.bin/electron ./electron/server.js

