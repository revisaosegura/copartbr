# Espelhamento Copart (Proxy + Django Admin)
Este projeto entrega:
1) **Proxy reverso Nginx** que espelha `https://www.copart.com.br`, injeta botão do WhatsApp em **todas as páginas**, reescreve links absolutos e encaminha rotas internas para um backend Django.
2) **Aplicação Django** com **login/registro no seu domínio**, **admin** para ver usuários registrados e **simulador de lances** (não envia lances ao Copart).

> Observação legal: use conforme leis e termos do site de origem. Áreas autenticadas do Copart podem exigir políticas/headers específicos do próprio site que fogem ao controle.

## Estrutura
```
copart_full_mirror_project/
├─ proxy/                 # Nginx reverse proxy (serviço 1)
│  ├─ Dockerfile
│  └─ nginx/
│     └─ default.conf.template
├─ django_app/            # Django app (serviço 2)
│  ├─ Dockerfile
│  ├─ requirements.txt
│  ├─ manage.py
│  ├─ sitehub/
│  │  ├─ __init__.py
│  │  ├─ settings.py
│  │  ├─ urls.py
│  │  └─ wsgi.py
│  ├─ accounts/
│  │  ├─ __init__.py
│  │  ├─ admin.py
│  │  ├─ apps.py
│  │  ├─ forms.py
│  │  ├─ models.py
│  │  ├─ urls.py
│  │  └─ views.py
│  ├─ bids/
│  │  ├─ __init__.py
│  │  ├─ admin.py
│  │  ├─ apps.py
│  │  ├─ models.py
│  │  ├─ urls.py
│  │  └─ views.py
│  └─ entrypoint.sh
└─ render.yaml            # Blueprint para subir 2 serviços no Render
```

## Como usar (resumo)
1. Faça upload deste repositório no GitHub.
2. No Render, crie **dois Web Services** a partir das subpastas:
   - Serviço **Django**: apontar para `django_app/` (env Docker).
   - Serviço **Proxy**: apontar para `proxy/` (env Docker).
3. Após o deploy do Django, copie a **URL pública** do Django (ex.: `https://sua-app.onrender.com`).
4. Nas **variáveis do Proxy**, defina `DJANGO_UPSTREAM` com a URL pública do Django.
5. Adicione seu domínio customizado ao **Proxy** (esse será o front principal).
6. Acesse `seu-dominio/admin` para entrar no **Django Admin** (credenciais configuradas via env).

### Variáveis de ambiente (Render)
- **Proxy**:
  - `PORT` (Render define automaticamente)
  - `UPSTREAM_HOST=www.copart.com.br`
  - `WHATSAPP_URL=http://wa.me/5511958462009`
  - `DJANGO_UPSTREAM` = URL do serviço Django (ex.: `https://sua-app.onrender.com`)
- **Django**:
  - `PORT` (Render define automaticamente)
  - `DJANGO_SECRET_KEY` (defina um valor seguro)
  - `DJANGO_ALLOWED_HOSTS` (ex.: `*` ou seu domínio)
  - `SUPERUSER_USERNAME` (ex.: `admin`)
  - `SUPERUSER_EMAIL` (ex.: `admin@exemplo.com`)
  - `SUPERUSER_PASSWORD` (ex.: `troque-isto`)

### Notas
- O **login/registro** são **do seu domínio (Django)** e **não** do Copart.
- O **simulador de lances** registra intenções de lance em seu banco (não interage com o Copart).
- O **botão do WhatsApp** aparece em **todas as páginas** proxied e também nas páginas do Django.
