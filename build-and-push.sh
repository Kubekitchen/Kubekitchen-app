#!/bin/bash

# Build and push all Kubekitchen images to Docker Hub (secretpower)

echo "Building auth-service..."
docker build -t secretpower/kubekitchen-auth:latest ./services/auth-service

echo "Building restaurant-service..."
docker build -t secretpower/kubekitchen-restaurant:latest ./services/restaurant-service

echo "Building menu-service..."
docker build -t secretpower/kubekitchen-menu:latest ./services/menu-service

echo "Building order-service..."
docker build -t secretpower/kubekitchen-order:latest ./services/order-service

echo "Building frontend..."
docker build -t secretpower/kubekitchen-frontend:latest ./services/frontend

echo "Pushing images to Docker Hub..."
docker push secretpower/kubekitchen-auth:latest
docker push secretpower/kubekitchen-restaurant:latest
docker push secretpower/kubekitchen-menu:latest
docker push secretpower/kubekitchen-order:latest
docker push secretpower/kubekitchen-frontend:latest

echo "All images built and pushed successfully!"