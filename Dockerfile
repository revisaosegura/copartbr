FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

# Porta para Render
ENV PORT=8000
EXPOSE 8000

# Cria superusuário se não existir e roda o Gunicorn
CMD bash entrypoint.sh

FROM nginx:1.25-alpine

RUN apk add --no-cache bash

COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

ENV PORT=8080 \
    UPSTREAM_HOST=www.copart.com.br \
    WHATSAPP_URL=http://wa.me/5511958462009 \
    DJANGO_UPSTREAM=

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
