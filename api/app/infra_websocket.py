import asyncio
import logging
import requests
from fastapi import WebSocket
from pydantic import BaseModel

class ServiceStatus(BaseModel):
	id: int
	name: str
	status: str
	latency: float = None

def get_service_status(service_id: int):
	if service_id == 1:
		try:
			response = requests.get("https://8.8.8.8", timeout = 5)
			latency = response.elapsed.total_seconds()
			status = "up" if response.status_code == 200 else "down"
		except requests.RequestException:
			latency = None
			status = "down"
		return ServiceStatus(id = 1, name = "Google DNS", status = status, latency = latency)
	# return ServiceStatus(id = service_id, name = "Unknown", status = "down")
	elif service_id == 2:
		try:
			response = requests.get("https://httpbin.org/status/200", timeout = 5)
			latency = response.elapsed.total_seconds()
			status = "up" if response.status_code == 200 else "down"
		except requests.RequestException:
			latency = None
			status = "down"
		return ServiceStatus(id = 2, name = "HTTPBin", status = status, latency = latency)

	elif service_id == 3:
		try:
			response = requests.get("https://api.github.com", timeout = 5)
			latency = response.elapsed.total_seconds()
			status = "up" if response.status_code == 200 else "down"
		except requests.RequestException:
			latency = None
			status = "down"
		return ServiceStatus(id = 3, name = "GitHub API", status = status, latency = latency)

async def check_services():
	services = []
    
	for service_id in range(1, 4):
		try:
			service = get_service_status(service_id)
			if service and isinstance(service, ServiceStatus):
				services.append(service)
				logging.info(f"Serviço {service_id} verificado: {service.name} - {service.status}")
		except Exception as e:
			logging.error(f"Erro ao verificar serviço {service_id}: {e}")
	return services

async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    logging.info("WebSocket conectado")
    
    try:
        while True:
            # Verificar serviços
            services = await check_services()
            
            # Converter para dicionários
            data_to_send = []
            for service in services:
                if isinstance(service, ServiceStatus):
                    try:
                        # Conversão manual para evitar problemas com .dict()
                        service_data = {
                            "id": service.id,
                            "name": service.name,
                            "status": service.status,
                            "latency": service.latency
                        }
                        data_to_send.append(service_data)
                        logging.debug(f"Serviço convertido: {service_data}")
                    except Exception as e:
                        logging.error(f"Erro ao converter serviço {service}: {e}")
                else:
                    logging.warning(f"Serviço inválido ignorado: {service}")
            
            if not data_to_send:
                logging.warning("Nenhum dado válido para enviar.")
                # Enviar dados vazios para manter a conexão
                data_to_send = []
            
            # Enviar dados via WebSocket
            await websocket.send_json(data_to_send)
            logging.debug(f"Dados enviados: {len(data_to_send)} serviços")
            
            # Aguardar 5 segundos antes da próxima verificação
            await asyncio.sleep(5)
            
    except Exception as e:
        logging.error(f"Erro no WebSocket: {e}")
    finally:
        try:
            await websocket.close()
            logging.info("WebSocket desconectado")
        except:
            pass