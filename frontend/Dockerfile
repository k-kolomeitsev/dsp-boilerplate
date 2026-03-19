FROM node:22-alpine AS build

WORKDIR /app

# Yarn v1 is required because the project uses "yarn lockfile v1".
RUN rm -f /usr/local/bin/yarn /usr/local/bin/yarnpkg \
  && npm install -g yarn@1.22.22

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --non-interactive

COPY index.html vite.config.ts tsconfig*.json eslint.config.js ./
COPY public ./public
COPY src ./src

RUN yarn build

FROM nginx:1.27-alpine AS runtime

# Remove default nginx config and default static content.
RUN rm -f /etc/nginx/conf.d/default.conf \
  && rm -rf /usr/share/nginx/html/*

# SPA-ready nginx config (React Router) + caching for Vite assets.
RUN cat > /etc/nginx/conf.d/default.conf <<'EOF'
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  server_tokens off;

  # Security headers (safe defaults for SPA)
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

  # Compression
  gzip on;
  gzip_vary on;
  gzip_proxied any;
  gzip_comp_level 6;
  gzip_min_length 256;
  gzip_types
    text/plain
    text/css
    application/json
    application/javascript
    application/xml
    image/svg+xml;

  # Health endpoint (for infra checks)
  location = /health {
    add_header Content-Type text/plain;
    return 200 "ok";
  }

  # Vite hashed assets: cache forever (immutable)
  location ^~ /assets/ {
    try_files $uri =404;
    expires 1y;
    add_header Cache-Control "public, max-age=31536000, immutable" always;
  }

  # Other static files (e.g. /img/*)
  location ~* \.(?:css|js|mjs|map|png|jpg|jpeg|gif|webp|svg|ico|woff2|woff|ttf|otf|eot)$ {
    try_files $uri =404;
    expires 30d;
    add_header Cache-Control "public, max-age=2592000" always;
  }

  # Do not cache HTML shell
  location = /index.html {
    expires -1;
    add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0" always;
  }

  # SPA fallback (React Router)
  location / {
    try_files $uri $uri/ /index.html;
  }
}
EOF

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

