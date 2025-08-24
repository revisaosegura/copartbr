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
