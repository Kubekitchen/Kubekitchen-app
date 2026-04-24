#!/bin/bash

# Build and push all Kubekitchen images to Docker Hub (secretpower)

echo "Building auth-service..."
docker build -t secretpower/kubekitchen-auth:dev-latest ./services/auth-service

echo "Building restaurant-service..."
docker build -t secretpower/kubekitchen-restaurant:dev-latest ./services/restaurant-service

echo "Building menu-service..."
docker build -t secretpower/kubekitchen-menu:dev-latest ./services/menu-service

echo "Building order-service..."
docker build -t secretpower/kubekitchen-order:dev-latest ./services/order-service

echo "Building frontend..."
docker build -t secretpower/kubekitchen-frontend:dev-latest ./services/frontend

echo "Pushing images to Docker Hub..."
docker push secretpower/kubekitchen-auth:dev-latest
docker push secretpower/kubekitchen-restaurant:dev-latest
docker push secretpower/kubekitchen-menu:dev-latest
docker push secretpower/kubekitchen-order:dev-latest
docker push secretpower/kubekitchen-frontend:dev-latest

echo "All images built and pushed successfully!"