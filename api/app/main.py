# InfraWatch API by akupesa (Crusaiders Team)

import os
import asyncio
import logging
import psycopg2
import requests
from ping3 import ping
from fastapi import FastAPI
from fastapi import WebSocket
from pydantic import BaseModel

app = FastAPI(title="InfraWatch API")

@app.get("/")
async def root():
	return {"message": "Bem-vindo à API InfraWatch! Use /services/{id} para verificar o status de serviços."}
	print()
	
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
		return ServiceStatus(id = 1,
		       name = "Google DNS", 
		       status = status, 
		       latency = latency)
	return ServiceStatus(id = service_id, name = "Unknown", status = "down")

@app.get("/services/{service_id}", response_model=ServiceStatus)
async def read_service_status(service_id: int):
	status = get_service_status(service_id)
	try:
		with psycopg2.connect(os.environ.get("DATABASE_URL", "dbname=infrawatch user=akupesa password='Anderson26$'")) as conn:
			with conn.cursor() as cur:
				cur.execute(
					"INSERT INTO services (id, name, Last_status, latency) VALUES (%s, %s, %s, %s) "
					"ON CONFLICT (id) DO UPDATE SET Last_status = %s, latency = %s",
	     				(status.id, status.name, status.status, status.latency, status.status, status.latency)
					)
				conn.commit()
	except Exception as e:
		logging.error(f"Erro ao conectar ao banco: {e}")
		raise
	return status

@app.get("/services/", response_model = list[ServiceStatus])
async def read_all_services():
	services = []
	try:
		with psycopg2.connect(os.environ.get("DATABASE_URL", "dbname=infrawatch user=akupesa password='Anderson26$'")) as conn:
			with conn.cursor() as cur:
				cur.execute("SELECT id, name, last_status FROM services")
				rows = cur.fetchall()
				services = [ServiceStatus(id=row[0], name=row[1], status=row[2]) for row in rows]
	except Exception as e:
		logging.error(f"Erro ao consultar serviços: {e}")
		raise
	return services
	

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def check_services():
    tasks = [get_service_status(i) for i in range(1, 4)]
    return await asyncio.gather(*tasks)

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port, reload=True)