#!/bin/bash
set -e

echo "=== Setting up NFS Server ==="

sudo apt-get update -y
sudo apt-get install -y nfs-kernel-server

sudo mkdir -p /mnt/kubekitchen-nfs
sudo chmod 777 /mnt/kubekitchen-nfs
sudo chown nobody:nogroup /mnt/kubekitchen-nfs

echo "/mnt/kubekitchen-nfs *(rw,sync,no_subtree_check,no_root_squash)" | \
  sudo tee -a /etc/exports

sudo exportfs -ra
sudo systemctl restart nfs-kernel-server
sudo systemctl enable nfs-kernel-server

echo "=== NFS Server Ready ==="
echo "NFS exports:"
sudo exportfs -v