# Guia de Instalação

Este guia fornece instruções detalhadas para instalar e configurar o InfraWatch em diferentes ambientes.

## Pré-requisitos

### Sistema Operacional
- **Linux**: Ubuntu 20.04+ / CentOS 8+ / RHEL 8+
- **Windows**: Windows Server 2019+
- **macOS**: macOS 11+ (desenvolvimento)

### Software Necessário

=== "Backend"
    - **Node.js**: 18.x ou superior
    - **npm/yarn**: Gerenciador de pacotes
    - **PostgreSQL**: 13+ (dados relacionais)
    - **Redis**: 6+ (cache e sessões)

=== "Frontend"
    - **Node.js**: 18.x ou superior
    - **React**: 18+ (incluído no projeto)
    - **Navegador**: Chrome 90+, Firefox 88+, Safari 14+

=== "Agentes"
    - **Python**: 3.8+ (agentes de monitoramento)
    - **pip**: Gerenciador de pacotes Python

### Hardware Mínimo

| Componente | Desenvolvimento | Produção |
|------------|----------------|----------|
| **CPU** | 2 cores | 4+ cores |
| **RAM** | 4 GB | 8+ GB |
| **Disco** | 20 GB | 100+ GB SSD |
| **Rede** | 100 Mbps | 1 Gbps |

## Instalação Rápida

### 1. Clone o Repositório

```bash
git clone https://github.com/mariosalembe23/infrawatch.git
cd infrawatch
```

### 2. Configuração do Backend

```bash
# Navegar para o diretório da API
cd api

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
```

### 3. Configuração do Banco de Dados

```bash
# Criar banco de dados PostgreSQL
createdb infrawatch

# Executar migrações
npm run migrate

# Popular dados iniciais (opcional)
npm run seed
```

### 4. Configuração do Frontend

```bash
# Navegar para o frontend
cd ../frontend/infrawatch

# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env.local
```

### 5. Iniciar os Serviços

=== "Desenvolvimento"
    ```bash
    # Terminal 1 - Backend
    cd api
    npm run dev
    
    # Terminal 2 - Frontend
    cd frontend/infrawatch
    npm run dev
    ```

=== "Produção"
    ```bash
    # Build do frontend
    cd frontend/infrawatch
    npm run build
    
    # Iniciar backend
    cd ../../api
    npm run start
    ```

## Configuração Detalhada

### Variáveis de Ambiente - Backend

```bash title="api/.env"
# Banco de Dados
DATABASE_URL=postgresql://user:password@localhost:5432/infrawatch
REDIS_URL=redis://localhost:6379

# Aplicação
NODE_ENV=production
PORT=3001
JWT_SECRET=your-super-secret-key

# Notificações
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Monitoramento
MONITORING_INTERVAL=30000
MAX_CONCURRENT_CHECKS=100
```

### Variáveis de Ambiente - Frontend

```bash title="frontend/infrawatch/.env.local"
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
NEXT_PUBLIC_APP_NAME=InfraWatch
```

### Configuração do PostgreSQL

```sql
-- Criar usuário e banco
CREATE USER infrawatch WITH PASSWORD 'secure_password';
CREATE DATABASE infrawatch OWNER infrawatch;
GRANT ALL PRIVILEGES ON DATABASE infrawatch TO infrawatch;

-- Configurações de performance
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
```

## Instalação com Docker

### Docker Compose

```yaml title="docker-compose.yml"
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: infrawatch
      POSTGRES_USER: infrawatch
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./api
    environment:
      DATABASE_URL: postgresql://infrawatch:secure_password@postgres:5432/infrawatch
      REDIS_URL: redis://redis:6379
    ports:
      - "3001:3001"
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./frontend/infrawatch
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Executar com Docker

```bash
# Iniciar todos os serviços
docker-compose up -d

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f
```

## Configuração dos Agentes

### Instalação do Agente Python

```bash
# Navegar para o diretório dos agentes
cd agents/server

# Instalar dependências
pip install -r requirements.txt

# Configurar agente
cp config.example.py config.py
```

### Configuração do Agente

```python title="agents/server/config.py"
# Configurações do servidor
API_URL = "http://localhost:3001"
API_KEY = "your-api-key"

# Configurações de monitoramento
CHECK_INTERVAL = 30  # segundos
TIMEOUT = 10  # segundos

# Serviços a monitorar
SERVICES = [
    {
        "name": "Web Server",
        "type": "http",
        "url": "https://example.com",
        "expected_status": 200
    },
    {
        "name": "Database",
        "type": "tcp",
        "host": "localhost",
        "port": 5432
    }
]
```

### Executar Agente

```bash
# Executar manualmente
python monitor.py

# Instalar como serviço (Linux)
sudo python installer.py --install

# Verificar status do serviço
sudo systemctl status infrawatch-agent
```

## Configuração de Segurança

### SSL/TLS

```nginx title="/etc/nginx/sites-available/infrawatch"
server {
    listen 443 ssl http2;
    server_name infrawatch.yourdomain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Firewall

```bash
# Ubuntu/Debian
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# CentOS/RHEL
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## Verificação da Instalação

### Testes de Conectividade

```bash
# Verificar backend
curl http://localhost:3001/health

# Verificar frontend
curl http://localhost:3000

# Verificar banco de dados
psql -h localhost -U infrawatch -d infrawatch -c "SELECT version();"
```

### Dashboard de Status

Acesse `http://localhost:3000` e verifique:

- Login funcional
- Dashboard carregando
- Dados de monitoramento aparecendo
- Notificações funcionando

## Solução de Problemas

### Problemas Comuns

!!! warning "Erro de Conexão com Banco"
    ```bash
    # Verificar se PostgreSQL está rodando
    sudo systemctl status postgresql
    
    # Verificar conectividade
    pg_isready -h localhost -p 5432
    ```

!!! warning "Frontend não carrega"
    ```bash
    # Verificar se o build foi feito
    cd frontend/infrawatch
    npm run build
    
    # Verificar variáveis de ambiente
    cat .env.local
    ```

!!! warning "Agente não conecta"
    ```bash
    # Verificar configuração
    python -c "import config; print(config.API_URL)"
    
    # Testar conectividade
    curl -X POST http://localhost:3001/api/agents/heartbeat
    ```

### Logs e Debugging

```bash
# Logs do backend
tail -f api/logs/app.log

# Logs do frontend (desenvolvimento)
npm run dev

# Logs do sistema (Linux)
sudo journalctl -u infrawatch-agent -f
```

## Próximos Passos

Após a instalação bem-sucedida:

1. Leia a [Arquitetura](arquitetura.md) do sistema
2. Configure usuários e permissões
3. Adicione seus primeiros serviços para monitoramento
4. Personalize dashboards e alertas
5. Configure notificações

---

!!! success "Instalação Concluída!"
    Parabéns! O InfraWatch está instalado e pronto para uso. Para suporte adicional, consulte nossa [FAQ](faq.md) ou entre em contato conosco.