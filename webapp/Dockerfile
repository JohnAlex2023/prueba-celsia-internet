# ---------- Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig.json vite.config.ts index.html ./
RUN npm install

COPY src ./src
COPY public ./public

# Permite inyectar la URL del API en build-time
ARG VITE_API_URL=http://localhost:3000/api/v1
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ---------- Runtime (nginx) ----------
FROM nginx:1.27-alpine AS runtime

# Config para SPA con fallback al index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --spider -q http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
