FROM nginx:1.25-alpine

RUN apk add --no-cache bash

# Copiar configuração do Nginx
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

# Copiar robots.txt
COPY nginx/robots.txt /etc/nginx/robots.txt

# Criar favicon padrão (opcional)
RUN echo "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAYAAABPYyMiAAAABmJLR0T///////8JWPfcAAAACXBIWXMAAABIAAAASABGyWs+AAAAF0lEQVRIx2NgGAWjYBSMglEwCkbBSAcACREBAYpz+2IAAAAASUVORK5CYII=" | base64 -d > /etc/nginx/favicon.ico

# Criar diretórios estáticos
RUN mkdir -p /app/static /app/media

# Criar sitemap vazio
RUN echo '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>' > /etc/nginx/sitemap.xml

ENV PORT=8080 \
    UPSTREAM_HOST=www.copart.com.br \
    DJANGO_UPSTREAM=localhost:8000 \
    WHATSAPP_URL=https://wa.me/5511958462009 \
    SCHEME=https

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
