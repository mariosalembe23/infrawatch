# InfraWatch API by akupesa (Crusaiders Team)

import os
import asyncio
import logging
import psycopg2
from ping3 import ping
from fastapi import FastAPI
from fastapi import WebSocket
from pydantic import BaseModel

app = FastAPI(title="InfraWatch API")

class ServiceStatus(BaseModel):
	id: int
	name: str
	status: str
	latency: float = None

def get_service_status(service_id: int):
	if service_id == 1:
		latency = ping("8.8.8.8") # simulação de um ping para o Google DNS
		status = "up" if latency else "down"
		return ServiceStatus(id = 1,
		       name = "Google DNS", 
		       status = status, 
		       latency = latency)
	return ServiceStatus(id = service_id, name = "Unknown", status = "down")

# Simulação de um serviço desconhecido
@app.get("/services/{service_id}", response_model=ServiceStatus)
async def read_service_status(service_id: int):
	status = get_service_status(service_id)
	conn = psycopg2.connect("dbname = infrawatch user = akupesa password = 'Anderson26$'")
	cur = conn.cursor()
	cur.execute("INSERT INTO services (id, name, Last_status, latency) VALUES (%s, %s, %s, %s) ON CONFLICT (id) DO UPDATE SET Last_status = %s, latency = %s",
	     (status.id, status.name, status.status, status.latency, status.status, status.latency))
	conn.commit()
	cur.close()
	conn.close()
	return status

#
@app.get("/services/", response_model = list[ServiceStatus])
async def read_all_services():
	conn = psycopg2.connect("dbname = infrawatch user = akupesa password = 'Anderson26$'")
	cur = conn.cursor()
	cur.execute("SELECT id, name, last_status FROM services")
	rows = cur.fetchall()
	services = [ServiceStatus(id = row[0], name = row[1], status = row[2]) for row in rows]
	cur.close
	conn.close
	return services

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await check_services()
        await websocket.send_json([s.dict() for s in data])
        await asyncio.sleep(5)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def check_services():
    tasks = [get_service_status(i) for i in range(1, 4)]
    return await asyncio.gather(*tasks)


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port, reload=True)