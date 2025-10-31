# Stage 1: Build the application
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# Generate prisma client
RUN npx prisma generate
# Build TypeScript
RUN npm run build

# Stage 2: Create the production image
FROM node:18-alpine
WORKDIR /usr/src/app
# Copy only necessary files from the builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

EXPOSE 5001
CMD ["node", "dist/server.js"]