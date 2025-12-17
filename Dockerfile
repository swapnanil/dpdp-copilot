FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat ca-certificates

# Install deps
COPY package.json package-lock.json* ./
RUN npm install

# Copy source
COPY . .

# Build
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# 👇 CRITICAL PART
# Copy static assets into standalone
RUN cp -r .next/static .next/standalone/.next/static

# ✅ CRITICAL FIX FOR PDFKIT
# Ensure pdfkit-data exists at runtime
RUN cp -r pdfkit-data .next/standalone/pdfkit-data

CMD ["node", ".next/standalone/server.js"]
