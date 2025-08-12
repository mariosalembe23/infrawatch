import os
import shutil
import subprocess
import sys
import _removeService
import tkinter as tk
from tkinter import simpledialog, messagebox

DEST_DIR = "/opt/infra_watch"
SERVICE_NAME = "infra_watch"
MONITOR_SCRIPT_NAME = "monitor.py"

service_content = f"""
[Unit]
Description=Infra-Watch Monitor
After=network.target

[Service]
StandardOutput=journal
StandardError=journal
Environment=TERM=xterm
ExecStart=/usr/bin/python3 {DEST_DIR}/{MONITOR_SCRIPT_NAME}
Restart=always
User=root

[Install]
WantedBy=multi-user.target
"""

def get_resource_path(relative_path):
    """Retorna o caminho correto do arquivo, mesmo dentro do executável PyInstaller."""
    if hasattr(sys, '_MEIPASS'):
        return os.path.join(sys._MEIPASS, relative_path)
    return os.path.abspath(relative_path)

source = get_resource_path("monitor.py")
dest = "/opt/infra_watch/monitor.py"

def ensure_root():
    if os.geteuid() != 0:
        messagebox.showerror("Acesso Negado", "Você precisa executar o script como root.")
        sys.exit(1)

def copy_file_script():
    os.makedirs(DEST_DIR, exist_ok=True)
    shutil.copyfile(source, dest)

def create_service():
    copy_file_script()
    service_path = f"/etc/systemd/system/{SERVICE_NAME}.service"
    with open(service_path, "w") as f:
        f.write(service_content)

    os.chmod(os.path.join(DEST_DIR, MONITOR_SCRIPT_NAME), 0o755)

    subprocess.run(["systemctl", "daemon-reload"])
    subprocess.run(["systemctl", "enable", SERVICE_NAME])
    subprocess.run(["systemctl", "start", SERVICE_NAME])

    status = subprocess.run(["systemctl", "status", SERVICE_NAME], capture_output=True, text=True)
    if "active (running)" in status.stdout:
        messagebox.showinfo("Servico Criado", "Servico criado com sucesso!")
        return True
    else:
        messagebox.showerror("Erro ao iniciar o serviço", "Ocorreu um erro ao iniciar service")
        return False

if __name__ == "__main__":
    ensure_root()
    if len(sys.argv) != 2:
        print("Uso:")
        print("  sudo ./infra_installer install   # Para instalar o serviço")
        print("  sudo ./infra_installer remove    # Para remover o serviço")
        sys.exit(1)

    action = sys.argv[1].lower()
    if action == "install":
        create_service()
    elif action == "remove":
        _removeService.remove_service()
    else:
       sys.exit(1)
