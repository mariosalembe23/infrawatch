import os
import logging
import psycopg2
import requests
from fastapi import status
from fastapi import Depends
from fastapi import FastAPI
from fastapi import WebSocket
from pydantic import BaseModel
from datetime import timedelta
from fastapi import HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from .infra_security import(
	User,
	get_current_user,
	authenticate_user,
	create_access_token,
	get_current_sudo_user,
	ACCESS_TOKEN_EXPIRE_MINUTES
)
from .infra_websocket import websocket_endpoint
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated = "auto")

app = FastAPI(title = "InfraWatch API")

class ServiceStatus(BaseModel):
	id: int
	name: str
	status: str
	latency: float = None

class ServiceCreate(BaseModel):
	id: int
	name: str
	endpoint: str
	check_interval: int

def get_service_status(service_id: int):
	if service_id == 1:
		try:
			response = requests.get("https://8.8.8.8", timeout = 5)
			latency = response.elapsed.total_seconds()
			status = "up" if response.status_code == 200 else "down"
		except requests.RequestsException:
			latency = None
			status = "down"
		return ServiceStatus(id = 1, name = "Google DNS", status = status, latency = latency)


# Rotas principais
@app.get("/")
async def root():
	return {"message": "Bem-vindo à API InfraWatch! Faça login em /token para acessar recursos."}

@app.post("/users/", response_model=User)
async def create_user(user: User, current_user: User = Depends(get_current_sudo_user)):
	hashed = pwd_context.hash(user.password)  # Usar password
	query = "INSERT INTO users (username, hashed_password, role) VALUES (%s, %s, %s) RETURNING id"
	with psycopg2.connect("host=localhost dbname=infrawatch user=akupesa password='Anderson26$'") as conn:
		with conn.cursor() as cur:
			cur.execute(query, (user.username, hashed, user.role))
			id = cur.fetchone()[0]
	return User(id=id, username=user.username, role=user.role)  # Retornar com id


@app.post("/services/", response_model=ServiceStatus)
async def create_service(service: ServiceCreate, current_user: User = Depends(get_current_sudo_user)):
	query = "INSERT INTO services (id, name, endpoint, check_interval, last_status) VALUES (%s, %s, %s, %s, 'pending') ON CONFLICT (id) DO UPDATE SET name = %s, endpoint = %s, check_interval = %s"
	with psycopg2.connect("host=localhost dbname=infrawatch user=akupesa password='Anderson26$'") as conn:
		with conn.cursor() as cur:
			cur.execute(query, (service.id, service.name, service.endpoint, service.check_interval, service.name, service.endpoint, service.check_interval))
			conn.commit()
	return ServiceStatus(id=service.id, name=service.name, status="pending")


@app.get("/services/{service_id}", response_model = ServiceStatus)
async def read_service_status(service_id: int, current_user: User = Depends(get_current_user)):
	status = get_service_status(service_id)
	try:
		with psycopg2.connect(os.environ.get("DATABASE_URL", "dbname=infrawatch user=akupesa password='Anderson26$'")) as conn:
			with conn.cursor() as cur:
				cur.execute(
					"INSERT INTO services (id, name, last_status, latency, last_update) VALUES (%s, %s, %s, %s, CURRENT_TIMESTAMP) "
                			"ON CONFLICT (id) DO UPDATE SET last_status = %s, latency = %s, last_update = CURRENT_TIMESTAMP",
                			(status.id, status.name, status.status, status.latency, status.status, status.latency)
				)
				conn.commit()
	except Exception as e:
		logging.error(f"Erro ao conectar ao banco: {e}")
		raise
	return status

@app.post("/permissions/", response_model=dict)
async def create_permission(perm: dict, current_user: User = Depends(get_current_sudo_user)):
	query = "INSERT INTO permissions (user_id, service_id, access_level) VALUES (%s, %s, %s)"
	with psycopg2.connect("host=localhost dbname=infrawatch user=akupesa password='Anderson26$'") as conn:
		with conn.cursor() as cur:
			cur.execute(query, (perm["user_id"], perm["service_id"], perm["access_level"]))
			conn.commit()
	return {"message": "Permissão criada"}

@app.get("/services/", response_model = list[ServiceStatus])
async def read_all_services(current_user: User = Depends(get_current_sudo_user)):
	services = []
	try:
		with psycopg2.connect(os.environ.get("DATABASE_URL", "dbname=infrawatch user=akupesa password='Anderson26$'")) as conn:
			with conn.cursor() as cur:
				cur.execute("SELECT id, name, last_status FROM services")
				rows = cur.fetchall()
				services = [ServiceStatus(id = row[0], name = row[1], status = row[2]) for row in rows]
	except Exception as e:
		logging.error(f"Erro ao consultar serviços: {e}")
		raise
	return services

@app.post("/alerts/", response_model=dict)
async def create_alert(alert: dict, current_user: User = Depends(get_current_user)):
	query = "INSERT INTO alerts (service_id, status, message) VALUES (%s, %s, %s)"
	with psycopg2.connect("host=localhost dbname=infrawatch user=akupesa password='Anderson26$'") as conn:
		with conn.cursor() as cur:
			cur.execute(query, (alert["service_id"], alert["status"], alert["message"]))
			conn.commit()
	return {"message": "Alerta criado"}

@app.post("/metrics/", response_model=dict)
async def log_metrics(metric: dict, current_user: User = Depends(get_current_user)):
	query = "INSERT INTO metrics (timestamp, service_id, cpu, memory, latency, uptime_percentage) VALUES (NOW(), %s, %s, %s, %s, %s)"
	with psycopg2.connect("host=localhost dbname=infrawatch user=akupesa password='Anderson26$'") as conn:
		with conn.cursor() as cur:
			cur.execute(query, (metric["service_id"], metric["cpu"], metric["memory"], metric["latency"], metric["uptime_percentage"]))
			conn.commit()
	return {"message": "Métrica registrada"}

# Rota WebSocket
@app.websocket("/ws")
async def websocket_route(websocket: WebSocket):
	await websocket_endpoint(websocket)

# Configuração de logging
logging.basicConfig(level = logging.INFO)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
	import uvicorn
	port = int(os.environ.get("PORT", 8000))
	uvicorn.run(app, host = "0.0.0.0", port = port, reload = True)