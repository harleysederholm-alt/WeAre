FROM node:20-alpine AS base

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
# Install turbo (global)
RUN npm install -g turbo
# Copy the entire monorepo
COPY . .
# Clean install dependencies
RUN npm ci
# Build the API specifically
RUN npx turbo run build --filter=api
# Prune development dependencies to keep image small
RUN npm prune --production

FROM base AS runner
WORKDIR /app

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

# Copy built artifacts and production dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./dist

# Env variables should be passed at runtime, but we set defaults
ENV PORT 3001
EXPOSE 3001

CMD ["node", "dist/main"]
