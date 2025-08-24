#!/usr/bin/env bash
set -e

python manage.py migrate --noinput

# Cria superuser via env se não existir
python - <<'PY'
import os
from django.contrib.auth import get_user_model
import django
django.setup()
User = get_user_model()
u = os.environ.get("SUPERUSER_USERNAME")
p = os.environ.get("SUPERUSER_PASSWORD")
e = os.environ.get("SUPERUSER_EMAIL")
if u and p and e:
    if not User.objects.filter(username=u).exists():
        User.objects.create_superuser(username=u, email=e, password=p)
        print("Superuser criado:", u)
    else:
        print("Superuser já existe:", u)
else:
    print("Variáveis SUPERUSER_* não definidas; pulando criação de superuser.")
PY

# Coleta estáticos (para servir simples via Django)
python manage.py collectstatic --noinput || true

# Inicia Gunicorn
exec gunicorn sitehub.wsgi:application --bind 0.0.0.0:${PORT} --workers 2
