#!/bin/bash
set -e

NFS_SERVER_IP=${1:-"REPLACE_WITH_NFS_IP"}
DOCKERHUB_USER=${2:-"REPLACE_WITH_DOCKERHUB_USERNAME"}

echo "========================================"
echo "  KubeKitchen K8s Deployment"
echo "  NFS Server: $NFS_SERVER_IP"
echo "  DockerHub:  $DOCKERHUB_USER"
echo "========================================"

# Replace placeholders
find k8s/ -name "*.yaml" -exec \
  sed -i "s|NFS_SERVER_PRIVATE_IP|$NFS_SERVER_IP|g" {} \;

find k8s/ -name "*.yaml" -exec \
  sed -i "s|YOUR_DOCKERHUB_USERNAME|$DOCKERHUB_USER|g" {} \;

sed -i "s|NFS_SERVER_PRIVATE_IP|$NFS_SERVER_IP|g" \
  k8s/02-storage/nfs-provisioner.yaml

echo ""
echo ">>> Step 1: Install kgateway CRDs"
kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.2.0/standard-install.yaml
sleep 5

echo ">>> Step 2: Install kgateway"
kubectl apply -f https://github.com/kgateway-dev/kgateway/releases/download/v2.0.0/install.yaml
echo "Waiting for kgateway..."
sleep 30

echo ">>> Step 3: Namespaces"
kubectl apply -f k8s/00-namespaces/namespace.yaml   # FIXED: was 'namespaces.yaml'
sleep 3

echo ">>> Step 4: RBAC"
kubectl apply -f k8s/01-rbac/nfs-rbac.yaml
kubectl apply -f k8s/01-rbac/service-accounts.yaml

echo ">>> Step 5: Storage"
kubectl apply -f k8s/02-storage/nfs-provisioner.yaml
kubectl apply -f k8s/02-storage/storageclass.yaml
sleep 5

echo ">>> Step 6: Secrets & ConfigMaps"
kubectl apply -f k8s/03-secrets/dev-secrets.yaml
kubectl apply -f k8s/03-secrets/prod-secrets.yaml
kubectl apply -f k8s/04-configmaps/dev-configmap.yaml
kubectl apply -f k8s/04-configmaps/prod-configmap.yaml

echo ">>> Step 7: Network Policies"
kubectl apply -f k8s/05-network-policies/dev-network-policy.yaml
kubectl apply -f k8s/05-network-policies/prod-network-policy.yaml

echo ">>> Step 8: PVCs"
kubectl apply -f k8s/06-storage-claims/dev-pvc.yaml
kubectl apply -f k8s/06-storage-claims/prod-pvc.yaml

echo ">>> Step 9: StatefulSets (MongoDB)"
kubectl apply -f k8s/07-statefulsets/dev-mongodb.yaml
kubectl apply -f k8s/07-statefulsets/prod-mongodb.yaml

echo "Waiting for MongoDB pods to be ready..."
kubectl wait --for=condition=ready pod \
  -l tier=database -n kubekitchen-dev --timeout=180s
kubectl wait --for=condition=ready pod \
  -l tier=database -n kubekitchen-prod --timeout=180s

echo ">>> Step 10: Deployments"
kubectl apply -f k8s/08-deployments/dev-deployments.yaml
kubectl apply -f k8s/08-deployments/prod-deployments.yaml

echo ">>> Step 11: Services"
kubectl apply -f k8s/09-services/dev-services.yaml
kubectl apply -f k8s/09-services/prod-services.yaml

echo ">>> Step 12: Gateway + Routes"
# Apply the GatewayClass (cluster-scoped, idempotent)
kubectl apply -f k8s/10-gateway/gatewayclass.yaml
# Apply the Gateway resource (creates Contour Envoy proxy in kubekitchen-dev)
kubectl apply -f k8s/10-gateway/gateway.yaml
echo "Waiting for Contour to provision the Envoy proxy pod..."
sleep 15
# Expose the Envoy proxy via NodePort 30080 (HAProxy target)
kubectl apply -f k8s/10-gateway/nodeport-service.yaml
# Apply all HTTPRoutes
kubectl apply -f k8s/10-gateway/httproutes.yaml

echo ""
echo "========================================"
echo "  Deployment Complete!"
echo "========================================"

echo ""
echo ">>> Verifying all resources..."
kubectl get pods -n kubekitchen-dev
kubectl get pods -n kubekitchen-prod
kubectl get pvc -n kubekitchen-dev
kubectl get pvc -n kubekitchen-prod
kubectl get svc -n kubekitchen-gateway
kubectl get gateway -n kubekitchen-gateway
kubectl get httproute -A

echo ""
echo ">>> NodePort for Gateway (update haproxy.cfg with these):"
kubectl get svc -n kubekitchen-gateway