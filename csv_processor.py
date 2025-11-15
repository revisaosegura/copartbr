import pandas as pd
import json
import os
from datetime import datetime

CSV_FILE = "/home/ubuntu/upload/LotSearchresults_2025November15.csv"
JSON_FILE = "copart_inventory.json"

def process_csv_to_json():
    """
    Lê o arquivo CSV, processa os dados e salva em formato JSON.
    """
    if not os.path.exists(CSV_FILE):
        print(f"Erro: Arquivo CSV não encontrado em {CSV_FILE}")
        return False

    try:
        # O arquivo usa ponto e vírgula (;) como delimitador
        df = pd.read_csv(CSV_FILE, sep=';', encoding='utf-8')
        
        # Renomear colunas para nomes mais amigáveis e consistentes
        # Baseado na inspeção das primeiras linhas do CSV:
        df.columns = [
            "url_detalhe", "lot_number", "year", "make", "model", "document_status", 
            "vin", "category", "damage_type", "engine_status", "damage_severity", 
            "title_status", "seller", "fipe_value", "vehicle_yard", "auction_date", 
            "auction_yard", "sale_list_number", "lot_vaga", "current_bid", "buy_it_now_price"
        ]
        
        # Selecionar e reordenar as colunas que serão expostas na API
        df_output = df[[
            "lot_number", "year", "make", "model", "category", "damage_type", 
            "vehicle_yard", "auction_date", "current_bid", "fipe_value", "url_detalhe"
        ]].copy()
        
        # Limpeza e formatação de dados (ex: remover " BRL" do current_bid)
        df_output['current_bid'] = df_output['current_bid'].astype(str).str.replace(' BRL', '').str.strip()
        df_output['fipe_value'] = df_output['fipe_value'].astype(str).str.replace(' BRL', '').str.strip()
        
        # Converter o DataFrame para uma lista de dicionários (formato JSON)
        inventory_list = df_output.to_dict('records')
        
        # Salvar o inventário em JSON
        with open(JSON_FILE, "w", encoding="utf-8") as f:
            json.dump(inventory_list, f, ensure_ascii=False, indent=4)
            
        print(f"Inventário processado e salvo em {JSON_FILE}. Total de veículos: {len(inventory_list)}")
        return True

    except Exception as e:
        print(f"Erro durante o processamento do CSV: {e}")
        return False

if __name__ == "__main__":
    process_csv_to_json()
