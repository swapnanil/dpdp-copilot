FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont

# Install deps
COPY package.json package-lock.json* ./
RUN npm install

# Copy source
COPY . .

# Build
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

EXPOSE 3000

# 👇 CRITICAL PART
# Copy static assets into standalone
RUN cp -r .next/static .next/standalone/.next/static

CMD ["node", ".next/standalone/server.js"]
