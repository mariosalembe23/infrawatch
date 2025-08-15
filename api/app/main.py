import os
import aiohttp
import asyncio
import logging
import psycopg2
import requests
from ping3 import ping
from fastapi import FastAPI
from fastapi import WebSocket
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="InfraWatch API")

# Configurar CORS se necessário
app.add_middleware(
    CORSMiddleware,
    allow_headers = ["*"],
    allow_methods = ["*"],
    allow_origins = ["*"],
    allow_credentials = True,
)

@app.get("/")
async def root():
    return {"message": "Bem-vindo à API InfraWatch! Use /services/{id} para verificar o status de serviços."}
    
class ServiceStatus(BaseModel):
    id: int
    name: str
    status: str
    latency: float = None

def get_service_status(service_id: int):
    #Função síncrona para verificar status do serviço
    if service_id == 1:
        try:
            response = requests.get("https://www.google.com", timeout = 5)
            latency = response.elapsed.total_seconds()
            status = "up" if response.status_code == 200 else "down"
        except requests.RequestException:
            latency = None
            status = "down"
        return ServiceStatus(id = 1, name = "Google", status = status, latency = latency)
    
    elif service_id == 2:
        try:
            # Exemplo: verificar outro serviço
            latency_result = ping('8.8.8.8', timeout = 5)
            if latency_result is not None:
                status = "up"
                latency = latency_result
            else:
                status = "down"
                latency = None
        except Exception:
            status = "down"
            latency = None
        return ServiceStatus(id = 2, name = "Google DNS", status = status, latency = latency)
    
    elif service_id == 3:
        try:
            response = requests.get("https://httpbin.org/status/200", timeout = 5)
            latency = response.elapsed.total_seconds()
            status = "up" if response.status_code == 200 else "down"
        except requests.RequestException:
            latency = None
            status = "down"
        return ServiceStatus(id = 3, name = "HTTPBin", status = status, latency = latency)
    
    return ServiceStatus(id = service_id, name = "Unknown", status = "down")

async def get_service_status_async(service_id: int):
    #Versão assíncrona para verificar status do serviço
    if service_id == 1:
        try:
            async with aiohttp.ClientSession() as session:
                start_time = asyncio.get_event_loop().time()
                async with session.get("https://www.google.com", timeout = aiohttp.ClientTimeout(total = 5)) as response:
                    latency = asyncio.get_event_loop().time() - start_time
                    status = "up" if response.status == 200 else "down"
        except Exception:
            latency = None
            status = "down"
        return ServiceStatus(id = 1, name = "Google", status = status, latency = latency)
    
    elif service_id == 2:
        try:
            # Executar ping de forma assíncrona
            loop = asyncio.get_event_loop()
            latency_result = await loop.run_in_executor(None, ping, '8.8.8.8', 5)
            if latency_result is not None:
                status = "up"
                latency = latency_result
            else:
                status = "down"
                latency = None
        except Exception:
            status = "down"
            latency = None
        return ServiceStatus(id = 2, name = "Google DNS", status = status, latency = latency)
    
    elif service_id == 3:
        try:
            async with aiohttp.ClientSession() as session:
                start_time = asyncio.get_event_loop().time()
                async with session.get("https://httpbin.org/status/200", timeout = aiohttp.ClientTimeout(total = 5)) as response:
                    latency = asyncio.get_event_loop().time() - start_time
                    status = "up" if response.status == 200 else "down"
        except Exception:
            latency = None
            status = "down"
        return ServiceStatus(id = 3, name = "HTTPBin", status = status, latency = latency)
    
    return ServiceStatus(id = service_id, name = "Unknown", status = "down")

@app.get("/services/{service_id}", response_model = ServiceStatus)
async def read_service_status(service_id: int):
    status = get_service_status(service_id)
    try:
        with psycopg2.connect(os.environ.get("DATABASE_URL", "dbname=infrawatch user=akupesa password='Anderson26$'")) as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO services (id, name, last_status, latency) VALUES (%s, %s, %s, %s) "
                    "ON CONFLICT (id) DO UPDATE SET last_status = %s, latency = %s",
                    (status.id, status.name, status.status, status.latency, status.status, status.latency)
                )
                conn.commit()
    except Exception as e:
        logging.error(f"Erro ao conectar ao banco: {e}")
        raise
    return status

@app.get("/services/", response_model=list[ServiceStatus])
async def read_all_services():
    services = []
    try:
        with psycopg2.connect(os.environ.get("DATABASE_URL", "dbname=infrawatch user=akupesa password='Anderson26$'")) as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT id, name, last_status, latency FROM services")
                rows = cur.fetchall()
                services = [ServiceStatus(id = row[0], name = row[1], status = row[2], latency = row[3]) for row in rows]
    except Exception as e:
        logging.error(f"Erro ao consultar serviços: {e}")
        raise
    return services
    
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Usar a função assíncrona correta
            services = await check_services_async()
            
            # Converter para dicionários
            data_to_send = []
            for service in services:
                if isinstance(service, ServiceStatus):
                    data_to_send.append({
                        "id": service.id,
                        "name": service.name,
                        "status": service.status,
                        "latency": service.latency
                    })
            
            if not data_to_send:
                logging.warning("Nenhum serviço retornou dados válidos.")
            
            await websocket.send_json(data_to_send)
            await asyncio.sleep(5)
            
    except Exception as e:
        logging.error(f"Erro no WebSocket: {e}")
    finally:
        try:
            await websocket.close()
        except:
            pass

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def check_services_async():
    #Verificar serviços de forma assíncrona
    tasks = []
    for i in range(1, 4):  # Verificar serviços 1, 2, 3
        tasks.append(get_service_status_async(i))
    
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    # Filtrar apenas os resultados válidos
    valid_results = []
    for result in results:
        if isinstance(result, ServiceStatus):
            valid_results.append(result)
        elif isinstance(result, Exception):
            logging.error(f"Erro ao verificar serviço: {result}")
    
    return valid_results

def check_services():
    #Função síncrona para verificar serviços (usada nos endpoints HTTP)
    services = []
    for i in range(1, 4):
        try:
            service = get_service_status(i)
            services.append(service)
        except Exception as e:
            logging.error(f"Erro ao verificar serviço {i}: {e}")
    return services

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host = "0.0.0.0", port = port, reload = True)