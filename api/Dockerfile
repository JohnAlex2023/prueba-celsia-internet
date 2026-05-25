# ---------- Etapa de build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Instalamos dependencias usando cache de capas
COPY package*.json tsconfig.json ./
RUN npm install

# Copiamos el código y compilamos
COPY src ./src
RUN npm run build

# ---------- Etapa de runtime ----------
FROM node:20-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

# Solo dependencias de producción
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

# Artefactos compilados
COPY --from=builder /app/dist ./dist

# Usuario sin privilegios
USER node

EXPOSE 3000

# Healthcheck básico
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --spider -q http://localhost:3000/api/v1/health || exit 1

CMD ["node", "dist/server.js"]
