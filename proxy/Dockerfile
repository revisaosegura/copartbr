FROM nginx:1.25-alpine

RUN apk add --no-cache bash

COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

ENV PORT=8080 \
    UPSTREAM_HOST=www.copart.com.br \
    WHATSAPP_URL=http://wa.me/5511958462009 \
    DJANGO_UPSTREAM=localhost:8000

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
