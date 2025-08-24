# Copart Reverse Proxy (Render + Nginx)

Proxy reverso para espelhar `www.copart.com.br` via Nginx, com **botão flutuante do WhatsApp** inserido **apenas na home (`/`)**.

## Estrutura
```
.
├─ Dockerfile
├─ render.yaml
├─ nginx/
│  └─ default.conf.template
└─ README.md
```

## Variáveis de ambiente
- `PORT` — definida automaticamente pelo Render (padrão local 8080)
- `UPSTREAM_HOST` — padrão `www.copart.com.br`
- `WHATSAPP_URL` — padrão `http://wa.me/5511958462009`

## Deploy no Render
1. Suba este projeto para um repositório (GitHub/GitLab).
2. No Render: **New → Web Service → Build & Deploy from a repository**.
3. Selecione **Environment: Docker**.
4. Em **Environment Variables**, configure:

   - `UPSTREAM_HOST=www.copart.com.br`

   - `WHATSAPP_URL=http://wa.me/5511958462009`

   - (`PORT` é definido automaticamente pelo Render)

5. Faça o deploy.

6. Em **Custom Domains**, aponte seu domínio (ex.: `copartbr.com.br`).

## Teste local
```bash
docker build -t copart-proxy .
docker run --rm -p 8080:8080   -e PORT=8080   -e UPSTREAM_HOST=www.copart.com.br   -e WHATSAPP_URL=http://wa.me/5511958462009   copart-proxy
```
Acesse: http://localhost:8080

## Notas
- Áreas autenticadas podem exigir ajustes extras de cookies/CORS.
- O botão só aparece na rota `/`.
