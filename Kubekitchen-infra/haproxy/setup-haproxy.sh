#!/bin/bash
set -e

K8S_NODE_IP=${1:-"REPLACE_WITH_K8S_NODE_IP"}

echo "=== Installing HAProxy ==="
sudo apt-get update -y
sudo apt-get install -y haproxy

sed -i "s|K8S_NODE_IP|$K8S_NODE_IP|g" haproxy.cfg

sudo cp haproxy.cfg /etc/haproxy/haproxy.cfg
sudo haproxy -c -f /etc/haproxy/haproxy.cfg

sudo systemctl restart haproxy
sudo systemctl enable haproxy

echo "=== HAProxy Status ==="
sudo systemctl status haproxy

echo ""
echo "HAProxy Stats: http://$(curl -s ifconfig.me):8404/stats"
echo "Dev traffic:   http://$(curl -s ifconfig.me):8082"
echo "Prod traffic:  http://$(curl -s ifconfig.me):80"