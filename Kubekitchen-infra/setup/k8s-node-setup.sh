#!/bin/bash
set -e

echo "=== Installing NFS Client on K8s Nodes ==="
sudo apt-get update -y
sudo apt-get install -y nfs-common

NFS_SERVER_IP=$1
NFS_PATH="/mnt/kubekitchen-nfs"

echo "Testing NFS mount from $NFS_SERVER_IP..."
sudo mkdir -p /tmp/nfs-test
sudo mount -t nfs $NFS_SERVER_IP:$NFS_PATH /tmp/nfs-test
echo "NFS test file $(date)" | sudo tee /tmp/nfs-test/test.txt
sudo umount /tmp/nfs-test
echo "=== NFS Client Setup Complete ==="