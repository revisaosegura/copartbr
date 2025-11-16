# Análise do Problema no Render

## Problema Identificado

O scraper está falhando no ambiente Render devido ao **Incapsula/Imperva** (sistema anti-bot) que está bloqueando as requisições HTTP simples.

### Evidências do Log:

1. **Primeira tentativa** (linha 12): Retorna 404 com HTML do Tomcat
2. **Segunda tentativa** (linha 38-42): Retorna HTML com script Incapsula:
   - `<script src="/_Incapsula_Resource?SWJIYLWA=..."`
   - Resposta não-JSON quando esperava JSON

### Causa Raiz

O código atual tenta lidar com Incapsula através de:
- `prepareCopartSession()` - Inicializa sessão e cookies
- `attemptIncapsulaBootstrap()` - Extrai e processa recursos Incapsula
- `fetchIncapsulaResource()` - Busca recursos JavaScript do Incapsula

**Porém**, o Incapsula está retornando desafios mais complexos que requerem:
1. Execução de JavaScript
2. Fingerprinting do navegador
3. Possivelmente resolução de desafios CAPTCHA

## Solução Proposta

O ambiente Render não tem navegador instalado (Playwright/Puppeteer), então o código está usando `fetch()` puro, que não executa JavaScript.

### Opções:

1. **Usar Playwright no Render** (RECOMENDADO)
   - Instalar dependências do navegador
   - Usar o navegador para fazer as requisições iniciais
   - Extrair cookies e usar em requisições subsequentes

2. **Melhorar o bypass do Incapsula**
   - Adicionar delays entre requisições
   - Melhorar headers e fingerprinting
   - Implementar retry logic mais robusto

## Correção Implementada

Vou implementar a **Opção 1** usando Playwright para inicializar a sessão no Render.
