# Instalação

## Pré-requisitos
- Node.js >= 18 (para backend em Node)
- NPM ou Yarn
- Banco de dados relacional (ex: PostgreSQL, MySQL)
- Banco de séries temporais (ex: InfluxDB ou TimescaleDB)

## Passos
```bash
# Clonar o repositório
git clone https://github.com/mariosalembe23/infrawatch.git
cd infrawatch

# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
```

## Configuração
- Criar arquivo `.env` com as variáveis:
  - `DB_HOST`, `DB_USER`, `DB_PASS`
  - `INFLUXDB_URL`
  - `SMTP_SERVER` (para envio de alertas)
