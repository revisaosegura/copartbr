from flask import Flask, jsonify
import json
import os
import time

app = Flask(__name__)

INVENTORY_FILE = "copart_inventory.json"

def load_inventory():
    """Carrega o inventário do arquivo JSON."""
    if not os.path.exists(INVENTORY_FILE):
        return {"error": "Inventário não encontrado. O arquivo copart_inventory.json deve ser gerado antes de iniciar a API."}, 404
    
    try:
        with open(INVENTORY_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            
            # Obtém o timestamp da última modificação do arquivo
            last_updated_timestamp = os.path.getmtime(INVENTORY_FILE)
            last_updated_readable = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(last_updated_timestamp))
            
            # Adiciona metadados
            metadata = {
                "last_updated": last_updated_readable,
                "total_vehicles": len(data),
                "source": "CSV fornecido pelo usuário"
            }
            return {"metadata": metadata, "inventory": data}, 200
    except Exception as e:
        return {"error": f"Erro ao carregar o inventário: {str(e)}"}, 500

@app.route('/inventory', methods=['GET'])
def get_inventory():
    """Endpoint para retornar o inventário de veículos."""
    data, status_code = load_inventory()
    return jsonify(data), status_code

@app.route('/', methods=['GET'])
def home():
    """Endpoint de boas-vindas."""
    data, status_code = load_inventory()
    
    return jsonify({
        "message": "API de Inventário Copart Brasil",
        "status": "Rodando",
        "inventory_status": f"Total de veículos: {data['metadata']['total_vehicles'] if status_code == 200 else 'Erro'}",
        "last_updated": data['metadata']['last_updated'] if status_code == 200 else 'N/A',
        "endpoint": "/inventory"
    }), 200

if __name__ == '__main__':
    # Em um ambiente de produção, o servidor seria iniciado com um WSGI como Gunicorn.
    # Para fins de teste e demonstração, usaremos o servidor de desenvolvimento do Flask.
    host = os.environ.get('FLASK_HOST', '0.0.0.0')
    port = int(os.environ.get('PORT', 5000))
    app.run(host=host, port=port)
