#!/bin/bash
set -e

WORKER1_IP=${1:-""}
WORKER2_IP=${2:-""}

# ── Resolve the directory this script lives in ──────────────────────────────
# This means you can run the script from ANY directory:
#   cd /home/ubuntu && ./haproxy/setup-haproxy.sh 1.2.3.4 5.6.7.8   ✅
#   cd /home/ubuntu/haproxy && ./setup-haproxy.sh 1.2.3.4 5.6.7.8   ✅
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_CFG="$SCRIPT_DIR/haproxy.cfg"
WORK_CFG="/tmp/haproxy-rendered.cfg"

# ── Validate arguments ───────────────────────────────────────────────────────
if [[ -z "$WORKER1_IP" || -z "$WORKER2_IP" ]]; then
  echo "❌ Usage: $0 <WORKER1_IP> <WORKER2_IP>"
  echo "   Example: $0 172.31.66.23 172.31.78.132"
  exit 1
fi

if [[ ! -f "$SOURCE_CFG" ]]; then
  echo "❌ haproxy.cfg not found at: $SOURCE_CFG"
  exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Worker 1 IP : $WORKER1_IP"
echo "  Worker 2 IP : $WORKER2_IP"
echo "  Config file : $SOURCE_CFG"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "=== Installing HAProxy ==="
sudo apt-get update -y
sudo apt-get install -y haproxy

echo ""
echo "=== Configuring HAProxy ==="
# Work on a COPY so the source haproxy.cfg keeps its placeholders
# and can be re-run safely with different IPs
cp "$SOURCE_CFG" "$WORK_CFG"
sed -i "s|WORKER1_IP|$WORKER1_IP|g" "$WORK_CFG"
sed -i "s|WORKER2_IP|$WORKER2_IP|g" "$WORK_CFG"

sudo cp "$WORK_CFG" /etc/haproxy/haproxy.cfg
rm -f "$WORK_CFG"

echo ""
echo "=== Validating HAProxy config ==="
sudo haproxy -c -f /etc/haproxy/haproxy.cfg

echo ""
echo "=== Starting HAProxy ==="
sudo systemctl restart haproxy
sudo systemctl enable haproxy

echo ""
echo "=== HAProxy Status ==="
sudo systemctl status haproxy --no-pager

HAPROXY_IP=$(curl -s ifconfig.me 2>/dev/null || echo "<unknown>")
echo ""
echo "✅ HAProxy configured successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Stats Dashboard : http://$HAPROXY_IP:8404/stats"
echo "🌐 Application URL : http://$HAPROXY_IP"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"