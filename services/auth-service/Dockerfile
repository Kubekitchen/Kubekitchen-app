FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS runner
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY src ./src
RUN chown -R appuser:appgroup /app
USER appuser
EXPOSE 4001
CMD ["node", "src/index.js"]