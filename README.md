# Copart Public Search Scraper (Brasil)

Recupere dados completos dos leilões públicos da Copart Brasil com chamadas diretas à API oficial. Este ator extrai os lotes publicados em https://www.copart.com.br, suportando tanto URLs de busca quanto URLs de um único lote. Para cada veículo, ele combina as informações da busca com os detalhes completos do lote, ficha técnica (build sheet), danos e dados dinâmicos do leilão.

## ✨ Funcionalidades

- **URL única**: aceite qualquer URL copiada da Copart (página de busca ou página de lote).
- **Paginação automática**: percorre todas as páginas de resultados até atingir o limite solicitado.
- **Detalhes completos do veículo**: ano, marca, modelo, VIN, valores, status de venda, danos, localização e muito mais.
- **Dados dinâmicos**: coleta o status em tempo real do leilão a partir do endpoint `dynamicLotDetails`.
- **Ficha técnica e danos**: recupera equipamentos, opções de fábrica e relatório de danos sempre que disponíveis.
- **Saída estruturada**: cada item inclui mais de 200 campos brutos provenientes da Copart, facilitando integrações com planilhas, BI e ERPs.

## ⚙️ Entrada

Definida em [`input_schema.json`](./input_schema.json).

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `startUrl` | string | ✅ | URL completa da Copart (busca ou lote). |
| `maxItems` | integer | ❌ | Máximo de itens a coletar. Deixe vazio para coletar todos (usuários gratuitos devem informar até 100). |

### Exemplos

**Busca complexa**
```json
{
  "startUrl": "https://www.copart.com/lotSearchResults?free=true&query=&qId=d5d10d65-6c05-49ed-b7a7-1a520774e2df-1759444780483&index=undefined&searchCriteria=%7B%22query%22:%5B%22*%22%5D,%22filter%22:%7B%22TITL%22:%5B%22title_group_code:TITLEGROUP_J%22%5D%7D,%22searchName%22:%22%22,%22watchListOnly%22:false,%22freeFormSearch%22:false%7D",
  "maxItems": 3
}
```

**Lote único**
```json
{
  "startUrl": "https://www.copart.com.br/lot/84926025/clean-title-2022-chevrolet-trailblazer-rs-fl-miami-south"
}
```

## 📤 Saída

Cada item do dataset contém:

- Campos principais (`lot_number`, `year`, `make`, `model`, `current_bid`, `auction_date`, `sale_status`, etc.).
- URLs das imagens em diferentes resoluções.
- Listas completas de danos (`damage_details`).
- `dynamic_lot_details` com o status em tempo real do leilão.
- `build_sheet` com ficha técnica e equipamentos originais.
- Objetos brutos retornados pelos endpoints da Copart (`lot_details`, `search_result`, etc.).

O schema exibido no console é configurado em [`dataset_schema.json`](./dataset_schema.json) e pode ser exportado em JSON, CSV, Excel, XML ou HTML.

## 🚀 Como usar

1. Crie uma conta gratuita na [Apify](https://console.apify.com/).
2. Faça o deploy deste ator ou rode localmente com `apify run`.
3. Copie qualquer URL de busca ou lote da Copart Brasil.
4. Cole a URL no campo `startUrl` e, se desejar, limite os resultados com `maxItems`.
5. Inicie a execução e acompanhe os logs em tempo real.
6. Quando terminar, baixe o dataset no formato desejado.

## 🔌 Integração via API

Use o [Apify API Client](https://docs.apify.com/api/client) em Node.js ou Python para automatizar execuções, agendar coletas e integrar com outras ferramentas (Make, Zapier, Google Sheets, etc.).

## ⚠️ Limitações

- A Copart pode alterar os endpoints ou exigir novos cookies; o ator implementa múltiplos fallbacks, mas ajustes podem ser necessários.
- Requisições grandes estão sujeitas a limites de taxa da Copart; o ator aplica atrasos e tratamento de erros.
- Alguns campos podem não estar presentes em todos os lotes por dependerem da disponibilidade do site.

## 🛠️ Desenvolvimento

Execute localmente:
```bash
npm install
npm run start
```

Em seguida informe um `INPUT.json` com os parâmetros desejados e rode `apify run`.

---
Criado para automatizar a prospecção de veículos em leilão na Copart Brasil com precisão e rapidez.
