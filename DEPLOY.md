# Deploy no Render - Copart Brasil

## Pré-requisitos

1. Banco de dados MySQL configurado
2. Conta no Render.com

## Variáveis de Ambiente Obrigatórias

Configure as seguintes variáveis no Dashboard do Render (Settings → Environment):

### Banco de Dados (OBRIGATÓRIO)
```
DATABASE_URL=mysql://usuario:senha@host:porta/database
```

### Apify (OBRIGATÓRIO para sincronização de veículos)
```
APIFY_API_TOKEN=seu_token_apify_aqui
```

### Outras Variáveis (Opcionais)
```
NODE_ENV=production
JWT_SECRET=seu-jwt-secret-aqui
STRIPE_SECRET_KEY=sk_test_... (opcional, para pagamentos)
STRIPE_WEBHOOK_SECRET=whsec_... (opcional, para webhooks Stripe)
OAUTH_SERVER_URL=https://api.manus.im (opcional, para OAuth)
```

## Configuração no Render

1. **Environment**: Node
2. **Build Command**: `bash scripts/build.sh`
3. **Start Command**: `bash scripts/start.sh`
4. **Node Version**: 22.13.0 (detectado automaticamente via .nvmrc)

## Primeiro Deploy

No primeiro deploy, o sistema irá:

1. ✅ Instalar dependências (pnpm install)
2. ✅ Compilar o projeto (pnpm build)
3. ✅ Executar migrations do banco (pnpm db:push)
4. ✅ Verificar status do banco de dados
5. ✅ Iniciar o servidor

**IMPORTANTE**: Se o banco estiver vazio, a sincronização de veículos será executada automaticamente a cada 4 horas. Aguarde alguns minutos após o primeiro deploy para que os veículos apareçam.

## Verificação de Problemas

### Veículos não aparecem no site

**Causa**: Banco de dados vazio ou token Apify não configurado

**Solução**:
1. Verifique se `APIFY_API_TOKEN` está configurado nas variáveis de ambiente
2. Verifique se `DATABASE_URL` está correto e o banco está acessível
3. Aguarde a próxima execução automática do cron (a cada 4 horas)
4. Ou force uma sincronização manual acessando o painel admin e clicando em "Sincronizar Agora"

### Erro de conexão com banco de dados

**Causa**: DATABASE_URL incorreto ou banco inacessível

**Solução**:
1. Verifique se o formato da URL está correto: `mysql://usuario:senha@host:porta/database`
2. Certifique-se de que o banco MySQL está rodando e acessível
3. Verifique se as credenciais estão corretas

### Erro "Stripe not configured"

**Causa**: Variáveis do Stripe não configuradas (isso é normal se você não usa pagamentos)

**Solução**: Isso é apenas um aviso. O site funciona normalmente sem Stripe. Se quiser remover o aviso, configure as variáveis `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET`.

## Acesso ao Painel Admin

Após o deploy, acesse:
```
https://seu-site.onrender.com/admin
```

**Credenciais**:
- Usuário: `copart2025`
- Senha: `Copart2025`

## Sincronização Manual

Se precisar forçar uma sincronização imediata:

1. Acesse o painel admin
2. Clique no botão "Sincronizar Agora"
3. Aguarde a sincronização completar (pode levar alguns minutos)
4. Verifique os logs de sincronização no painel

## Suporte

Para problemas ou dúvidas:
- Email: contato@copartbr.com.br
- WhatsApp: +55 11 91471-9390
