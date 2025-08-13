import subprocess
import os

SERVICE_NAME = "infra_watch"
SERVICE_PATH = f"/etc/systemd/system/{SERVICE_NAME}.service"

def stop_service():
    print(f"Parando serviço {SERVICE_NAME}...")
    result = subprocess.run(["sudo", "systemctl", "stop", SERVICE_NAME], capture_output=True, text=True)
    if result.returncode == 0:
        return True
    elif "not loaded" in result.stderr:
        print(f"Serviço {SERVICE_NAME} não está carregado, nada para parar.")
        return True  # ok, porque já está parado/não existe
    else:
        print(f"Erro ao parar serviço: {result.stderr.strip()}")
        return False


def remove_service_file():
    if os.path.exists(SERVICE_PATH):
        print(f"Removendo arquivo {SERVICE_PATH}...")
        try:
            os.remove(SERVICE_PATH)
            print("Arquivo removido com sucesso.")
            return True
        except Exception as e:
            print(f"Erro ao remover arquivo: {e}")
            return False
    else:
        print("Arquivo de serviço não existe, nada a remover.")
        return True  # porque já não existe, podemos considerar sucesso

def reload_systemd():
    print("Atualizando systemd (daemon-reload)...")
    result = subprocess.run(["sudo", "systemctl", "daemon-reload"], capture_output=True)
    if result.returncode == 0:
        return True
    else:
        print(f"Erro ao dar daemon-reload: {result.stderr.decode().strip()}")
        return False

def check_service_removed():
    print("Verificando se serviço foi removido...")
    result = subprocess.run(["systemctl", "status", SERVICE_NAME], capture_output=True, text=True)
    if "could not be found" in result.stdout or "could not be found" in result.stderr or \
   "not-found" in result.stdout or "not-found" in result.stderr:
        print(f"✅ Serviço {SERVICE_NAME} removido com sucesso.")
        return True
    else:
        print(f"❌ Serviço {SERVICE_NAME} ainda existe:\n{result.stdout}\n{result.stderr}")
        return False

def remove_service():
    if stop_service() and remove_service_file() and reload_systemd() and check_service_removed():
        return True
    else:
        return False

