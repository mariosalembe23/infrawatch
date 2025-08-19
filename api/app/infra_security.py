import os
import logging
import psycopg2
from jose import JWTError, jwt
from pydantic import BaseModel
from datetime import datetime, timedelta
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import FastAPI

app = FastAPI()

SECRET_KEY = "cavalo_maluco"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class User(BaseModel):
	username: str
	role: str  # "sudo" ou "user"
	password: str

class TokenData(BaseModel):
	username: str | None = None
	role: str | None = None
	password: str | None = None

pwd_context = CryptContext(schemes = ["argon2"], deprecated = "auto")

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
	query = "SELECT username, hashed_password, role FROM users WHERE username = %s"
	with psycopg2.connect(os.environ.get("DATABASE_URL", "host=localhost dbname=infrawatch user=akupesa password='Anderson26$'")) as conn:
		with conn.cursor() as cur:
			cur.execute(query, (form_data.username,))
			user_data = cur.fetchone()
			if not user_data or not pwd_context.verify(form_data.password, user_data[1]):
				raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuário ou senha incorretos", headers={"WWW-Authenticate": "Bearer"})
			user = User(username=user_data[0], role=user_data[2])
			access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
			access_token = create_access_token(data={"sub": user.username, "role": user.role}, expires_delta=access_token_expires)
			return {"access_token": access_token, "token_type": "bearer"}

oauth2_scheme = OAuth2PasswordBearer(tokenUrl = "token")

def verify_password(plain_password, hashed_password):
	return pwd_context.verify(plain_password, hashed_password)

def get_user(username: str):
	query = "SELECT username, role FROM users WHERE username = %s"
	try:
		with psycopg2.connect(os.environ.get("DATABASE_URL", "host=localhost dbname=infrawatch user=akupesa password='Anderson26$'")) as conn:
			with conn.cursor() as cur:
				cur.execute(query, (username,))
				user_data = cur.fetchone()
			if user_data:
				return User(username=user_data[0], role=user_data[1])
			return None
	except Exception as e:
		logging.error(f"Erro ao buscar usuário no banco: {str(e)}")
	return None

def authenticate_user(username: str, password: str):
	user = get_user(username)
	if not user or not pwd_context.verify(password, get_hashed_password(username)):
		return False
	return user

def get_hashed_password(username: str):
	query = "SELECT hashed_password FROM users WHERE username = %s"
	try:
		with psycopg2.connect(os.environ.get("DATABASE_URL", "host=localhost dbname=infrawatch user=akupesa password='Anderson26$'")) as conn:
			with conn.cursor() as cur:
				cur.execute(query, (username,))
				result = cur.fetchone()
				return result[0] if result else None
	except Exception as e:
		logging.error(f"Erro ao buscar hashed_password: {str(e)}")
		return None

def create_access_token(data: dict, expires_delta: timedelta | None = None):
	to_encode = data.copy()
	if expires_delta:
		expire = datetime.utcnow() + expires_delta
	else:
		expire = datetime.utcnow() + timedelta(minutes = 15)
	to_encode.update({"exp": expire})
	encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm = ALGORITHM)
	return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
	credentials_exception = HTTPException(
		status_code = status.HTTP_401_UNAUTHORIZED,
		detail = "Credenciais Inválidas!",
		headers = {"WWW-Authenticate": "Bearer"},
	)
	try:
		payload = jwt.decode(token, SECRET_KEY, algorithms = [ALGORITHM])
		username: str = payload.get("sub")
		role: str = payload.get("role")
		if username is None or role is None:
			raise credentials_exception
		token_data = TokenData(username = username, role = role)
	except JWTError:
		raise credentials_exception
	user = get_user(username = token_data.username)
	if user is None:
		raise credentials_exception
	return user

async def get_current_sudo_user(current_user: User = Depends(get_current_user)):
	if current_user.role != "sudo":
		raise HTTPException(
        	status_code=status.HTTP_403_FORBIDDEN,
        	detail = "Acesso negado. Recurso negado por não ser um Administrador.",
        	headers = {"Location": "/login"},  # Deve redirecionar para o login, acho eu, não sou um gênio.
        )
	return current_user