# API - InfraWatch

## Autenticação
`POST /api/login`
- Body: `{ "email": "user@test.com", "senha": "123456" }`
- Resposta: `{ "token": "..." }`

## Sistemas Monitorados
`GET /api/sistemas`
- Retorna a lista de sistemas e status.

## Logs e Métricas
`GET /api/logs/:sistema`
- Retorna histórico de métricas de um sistema.

## Notificações
`POST /api/notificacoes`
- Cria nova regra de alerta.
