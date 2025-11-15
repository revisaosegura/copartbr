# API de Inventário Copart Brasil (Baseada em CSV)

Esta API em Flask serve o inventário de veículos da Copart Brasil, processando um arquivo CSV fornecido manualmente e servindo os dados em formato JSON.

## Arquivos Adicionados

*   `app.py`: O código-fonte da API Flask.
*   `csv_processor.py`: Script que lê o arquivo CSV, processa e salva o inventário em `copart_inventory.json`.

## Fluxo de Trabalho

1.  **Obtenção do CSV:** O usuário deve baixar o arquivo CSV de inventário da Copart diariamente.
2.  **Substituição:** O novo CSV deve ser colocado no mesmo diretório dos scripts, com o nome especificado em `csv_processor.py` (padrão: `LotSearchresults_2025November15.csv`).
3.  **Processamento Agendado:** Um cron job deve executar o `csv_processor.py` diariamente (ex: às 00:00h) para gerar o `copart_inventory.json` atualizado.
4.  **Serviço da API:** O `app.py` (rodando continuamente) serve o conteúdo do `copart_inventory.json` através do endpoint `/inventory`.

## Configuração e Uso

1.  **Dependências:** Python 3, Flask, Pandas.
    ```bash
    pip install Flask pandas
    ```
2.  **Execução do Processador (Cron Job):**
    ```bash
    python3 csv_processor.py
    ```
3.  **Execução da API (Produção):**
    ```bash
    # Recomenda-se o uso de um servidor WSGI como Gunicorn
    gunicorn -w 4 -b 0.0.0.0:5000 app:app
    ```
4.  **Endpoints:**
    *   `/inventory`: Retorna o inventário completo com metadados.
    *   `/`: Retorna o status da API.
