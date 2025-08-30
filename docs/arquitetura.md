# Arquitetura do Sistema

O sistema é composto por quatro grandes componentes:

## 1. Frontend (React)
- Dashboard principal com visão global.
- Indicadores em tempo real (status, uptime, alertas).
- Páginas de relatórios SLA.
- Gestão de perfis e permissões.

## 2. Backend (Node.js / Laravel / Python)
- Coleta e monitoramento (polling, webhook, ping).
- Motor de regras e alertas.
- Registro e tratamento de logs.
- API de integração com sistemas externos.

## 3. Banco de Dados
- Relacional: configuração, usuários, permissões.
- Temporal: métricas históricas (uptime/downtime).

## 4. Sistema de Notificações
- Integração com e-mail, WhatsApp, Telegram, Slack.
- Regras de escalonamento por criticidade.

## Estrutura de pastas (exemplo)
```
src/
  frontend/
  backend/
  database/
  notifications/
```
