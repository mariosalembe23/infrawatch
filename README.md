# INFRA-WATCH

## Overview

Sistema de monitoramento de infra-estruturas(servidores, aplicações, endpoints)

## Estrutura de pastas

`frontend` : aqui, estarão os arquivos para o frontend do projecto, todos os arquivos para o sistema de monitoramento, como a interface de usuário.

`api`: aqui, estarão os arquivos para a API do sistema, que será responsável por fazer as requisições para os servidores e aplicações.

`database_schema`: aqui, estarão os arquivos para a estrutura do banco de dados, que será responsável por orientar a estrutura dos dados.

`agents`: aqui, estarão os arquivos para os agentes de monitoramento, que serão responsáveis por enviar as informaçõe de infra-estruturas para API.

### Boas práticas & observações

Todos os pushs para o repositório devem ser nas branchs auxiliares que vocês vão criar e nunca na branch principal do projecto.
`Ex:` se você está trabalhando em uma feature, crie uma branch `com o nome da feature` e faça os commits e pushs para essa branch.

- Todas as features devem ser bem analizadas antes de serem enviadas, evitem erros para que o deploy corra bem e não interfira com o funcionamento do sistema.

- Todas as features devem ser bem documentadas, para que os outros membros do projecto possam entender como funciona a feature e como ela foi implementada.

- Os commits devem ser bem escritos, para que os outros membros do projecto possam entender o que foi feito e como foi feito.
