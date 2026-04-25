#!/bin/bash
set -e

WORKER1_IP=${1:-"REPLACE_WITH_WORKER1_IP"}
WORKER2_IP=${2:-"REPLACE_WITH_WORKER2_IP"}

echo "=== Installing HAProxy ==="
sudo apt-get update -y
sudo apt-get install -y haproxy

echo "=== Configuring HAProxy ==="
# Replace WORKER1_IP and WORKER2_IP placeholders with actual IPs
sed -i "s|WORKER1_IP|$WORKER1_IP|g" haproxy.cfg
sed -i "s|WORKER2_IP|$WORKER2_IP|g" haproxy.cfg

sudo cp haproxy.cfg /etc/haproxy/haproxy.cfg

echo "=== Validating HAProxy config ==="
sudo haproxy -c -f /etc/haproxy/haproxy.cfg

echo "=== Starting HAProxy ==="
sudo systemctl restart haproxy
sudo systemctl enable haproxy

echo "=== HAProxy Status ==="
sudo systemctl status haproxy --no-pager

HAPROXY_IP=$(curl -s ifconfig.me)
echo ""
echo "✅ HAProxy installed successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Stats Dashboard : http://$HAPROXY_IP:8404/stats"
echo "🌐 Application URL : http://$HAPROXY_IP"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"