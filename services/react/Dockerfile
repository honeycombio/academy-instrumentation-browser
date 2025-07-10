FROM node:20-slim AS builder

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Add nginx configuration for proxying
RUN cat <<'EOF' > /etc/nginx/conf.d/default.conf
server {
  listen 80;
  location /api/ {
    proxy_pass http://backend-for-frontend:10115;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
EOF

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]