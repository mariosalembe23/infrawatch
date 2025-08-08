#!/bin/bash

echo "Encontrando e parando os processos relacionados a 'infra-wat'..."
# Encontra os PIDs dos processos que contêm 'infra-wat' e os armazena em uma variável
PIDS=$(pgrep -f "infra-wat")

# Verifica se algum PID foi encontrado
if [ -z "$PIDS" ]; then
    echo "Nenhum processo 'infra-wat' encontrado. Ignorando esta etapa."
else
    echo "Processos encontrados: $PIDS"
    # Tenta terminar os processos normalmente
    kill $PIDS

    # Dá um tempo para os processos encerrarem
    sleep 5

    # Verifica se os processos ainda estão rodando
    PIDS_RESTANTES=$(pgrep -f "infra-wat")
    if [ -n "$PIDS_RESTANTES" ]; then
        echo "Alguns processos ainda estão rodando. Tentando encerrar de forma forçada..."
        # Encerra os processos de forma forçada
        kill -9 $PIDS_RESTANTES
        sleep 5
    fi
fi

echo "Tentando remover o diretório 'dist'..."
# Remove o diretório 'dist' e seu conteúdo de forma recursiva e forçada
rm -rf dist

# Verifica se o diretório foi removido com sucesso
if [ ! -d "dist" ]; then
    echo "Diretório 'dist' removido com sucesso."
else
    echo "Erro: Não foi possível remover o diretório 'dist'. Verifique manualmente."
fi