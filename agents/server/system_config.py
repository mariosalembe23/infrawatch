import os
import shutil
import subprocess

MONITOR_SCRIPT_NAME = "monitor.py"  # nome do seu script de monitoramento
DEST_DIR = "/opt/infra_watch"
SERVICE_NAME = "infra_watch"

def copy_file_script():
    # Cria pasta fixa
    os.makedirs(DEST_DIR, exist_ok=True)
    # Copia script de monitoramento para local fixo
    shutil.copy(MONITOR_SCRIPT_NAME, os.path.join(DEST_DIR, MONITOR_SCRIPT_NAME))

def create_service():
    # Cria arquivo de serviço
    copy_file_script()
    service_content = f"""[Unit]
Description=Infra-Watch Monitor
After=network.target

[Service]
ExecStart=/usr/bin/python3 {DEST_DIR}/{MONITOR_SCRIPT_NAME}
Restart=always
User=root

[Install]
WantedBy=multi-user.target
"""
    service_path = f"/etc/systemd/system/{SERVICE_NAME}.service"
    with open(service_path, "w") as f:
        f.write(service_content)

    # Aplica permissões corretas
    os.chmod(os.path.join(DEST_DIR, MONITOR_SCRIPT_NAME), 0o755)

    # Ativa e inicia o serviço
    subprocess.run(["systemctl", "daemon-reload"])
    subprocess.run(["systemctl", "enable", SERVICE_NAME])
    subprocess.run(["systemctl", "start", SERVICE_NAME])
    
    # verifica se o serviço foi criado e iniciado corretamente
    status = subprocess.run(["systemctl", "status", SERVICE_NAME], capture_output=True, text=True)
    if "active (running)" not in status.stdout:
        print(f"Erro ao iniciar o serviço {SERVICE_NAME}: {status.stdout}")
        return False
        #raise Exception(f"Erro ao iniciar o serviço {SERVICE_NAME}: {status.stdout}")
    print(f"Serviço {SERVICE_NAME} instalado e iniciado.")
    return True

def remove_service():
    # Desativa e para o serviço
    subprocess.run(["systemctl", "stop", SERVICE_NAME])
    subprocess.run(["systemctl", "disable", SERVICE_NAME])
    # Remove o arquivo de serviço
    service_path = f"/etc/systemd/system/{SERVICE_NAME}.service"
    if os.path.exists(service_path):
        os.remove(service_path)
    # Remove o script de monitoramento
    monitor_script_path = os.path.join(DEST_DIR, MONITOR_SCRIPT_NAME)
    if os.path.exists(monitor_script_path):
        os.remove(monitor_script_path)
    # Remove o diretório se estiver vazio
    if not os.listdir(DEST_DIR):
        os.rmdir(DEST_DIR)
    
    # Verifica se o serviço foi removido corretamente
    status = subprocess.run(["systemctl", "status", SERVICE_NAME], capture_output=True, text=True)
    if "not-found" in status.stdout:
        print(f"Serviço {SERVICE_NAME} removido com sucesso.")
        return True
    else:
        print(f"Erro ao remover o serviço {SERVICE_NAME}: {status.stdout}")
        return False
        #raise Exception(f"Erro ao remover o serviço {SERVICE_NAME}: {status.stdout}")
    

