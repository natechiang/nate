#!/bin/bash
# Double-click this file to start a local server for The Whale's Lost Treasure.
# Then open http://localhost:8080 on your phone (must be on same WiFi).

cd "$(dirname "$0")"
echo ""
echo "🐋  The Whale's Lost Treasure — Local Server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Open this address in your browser:"
echo "  → http://localhost:8080"
echo ""
echo "To open on your phone (same WiFi):"
# Show local IP
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "check System Preferences → Network")
echo "  → http://$LOCAL_IP:8080"
echo ""
echo "Press Ctrl+C to stop the server."
echo ""

python3 -m http.server 8080
