# Correção do Problema no Render - Bypass Incapsula

## Problema

O scraper estava falhando no ambiente Render devido ao sistema anti-bot **Incapsula/Imperva** que bloqueava as requisições HTTP simples feitas com `fetch()`. O Incapsula retornava:

1. Páginas HTML com desafios JavaScript em vez de JSON
2. Recursos `_Incapsula_Resource` que requerem execução de JavaScript
3. Cookies de sessão que só são definidos após execução do JavaScript

## Solução Implementada

### 1. Adicionado Fallback com Playwright

Criada a função `prepareCopartSessionWithPlaywright()` que:
- Inicia um navegador Chromium headless
- Navega para a página inicial do Copart
- Aguarda a execução completa dos scripts Incapsula
- Extrai os cookies de sessão válidos
- Armazena os cookies para uso em requisições subsequentes

### 2. Modificações no Código

**Arquivo: `copart.ts`**
- Importado `chromium` do Playwright
- Adicionada função `prepareCopartSessionWithPlaywright()`
- Modificada função `prepareCopartSession()` para usar Playwright como fallback quando `fetch()` falhar

**Arquivo: `scripts/build.sh`**
- Adicionado comando para instalar navegadores Playwright durante o build
- Comando: `pnpm exec playwright install --with-deps chromium`

### 3. Fluxo de Funcionamento

1. Primeira tentativa: usa `fetch()` para obter cookies (rápido)
2. Se falhar: usa Playwright para inicializar sessão (mais lento, mas efetivo)
3. Cookies obtidos são reutilizados em todas as requisições subsequentes
4. Sessão permanece válida durante toda a execução do scraper

## Benefícios

- ✅ Bypass efetivo do Incapsula no ambiente Render
- ✅ Mantém performance quando `fetch()` funciona
- ✅ Fallback robusto com navegador real quando necessário
- ✅ Não requer mudanças na lógica de scraping existente
- ✅ Compatível com ambiente de produção no Render

## Arquivos Modificados

1. `copart.ts` - Adicionada lógica de fallback com Playwright
2. `scripts/build.sh` - Instalação de navegadores Playwright
