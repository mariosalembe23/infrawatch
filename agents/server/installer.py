import os
import tkinter as tk
from tkinter import simpledialog, messagebox
import threading
import requests
import system_config
import _removeService
import sys
import shutil
# Caminho onde o ID será salvo
id_file_path = os.path.expanduser("~/.infra_watch_id")

URL = "https://onor-ebon.vercel.app/admin/invite/all"
log_dir = os.path.join(os.path.expanduser("~"), "Documents", "infra", "infra_watch")
log_path = os.path.join(log_dir, "log.txt")

def save_id(user_id):
    with open(id_file_path, "w") as f:
        f.write(user_id)

def remove_id():
    if os.path.exists(id_file_path):
        os.remove(id_file_path)
        messagebox.showinfo("ID Removido", "O ID do agente foi removido com sucesso.")
    else:
        messagebox.showwarning("Atenção", "Nenhum ID encontrado para remover.")

def get_saved_id():
    if os.path.exists(id_file_path):
        with open(id_file_path, "r") as f:
            return f.read().strip()
    return None

def show_loading_window():
    """Cria e retorna a janela de loading."""
    loading_win = tk.Toplevel()
    loading_win.title("Carregando...")
    loading_win.geometry("250x80")
    loading_win.resizable(False, False)
    tk.Label(loading_win, text="Conectando ao servidor...", font=("Arial", 10)).pack(pady=20)
    return loading_win

def make_request(loading_win, user_id, root):
    try:
        messagebox.showinfo("Infra-Watch", "Instalação iniciada. Aguarde...")
        response = requests.get(URL, timeout=10)
        if response.status_code == 200:
            if system_config.create_service():
                save_id(user_id)
                messagebox.showinfo("Infra-Watch", "Agente instalado com sucesso!")
            else:
                messagebox.showerror("Infra-Watch", "Erro ao implementar serviço.")
        else:
            messagebox.showerror("Infra-Watch", "Id inválido ou não encontrado.")
    except Exception as e:
        messagebox.showerror("Infra-Watch", f"Erro de conexão: {e}")
    finally:
        loading_win.destroy()

def request_user_id(root):
    user_id = simpledialog.askstring("Infra-Watch - Instalação", "Insira o Id do Agente:")
    if user_id:
        loading_win = show_loading_window()
        threading.Thread(
            target=make_request, args=(loading_win, user_id, root), daemon=True
        ).start()
    else:
        messagebox.showwarning("Infra-Watch", "Saindo...")
        root.destroy()
        sys.exit()

def request_remove_id(root, saved_id):
    confirm = messagebox.askyesno("Infra-Watch", f"Deseja desinstalar este agente?")
    if confirm:
        if _removeService.remove_service():
            remove_id()
            # REMOVE LOG FILE   
            if os.path.isdir(log_dir):
                shutil.rmtree(log_dir)        
            messagebox.showinfo("Infra-Watch", "Agente removido com sucesso!")
            root.destroy()  
            sys.exit()          
        else:
            messagebox.showerror("Infra-Watch", "Erro ao remover serviço.")
    else:
        messagebox.showinfo("Infra-Watch", "Agente não removido.")

def main():
    root = tk.Tk()
    root.withdraw()  # esconde a janela principal

    saved_id = get_saved_id()
    if saved_id:
        request_remove_id(root, saved_id)
    else:
        request_user_id(root)

    root.mainloop() 

if __name__ == "__main__":
    main()
