import os
import tkinter as tk
from tkinter import simpledialog, messagebox

# Caminho onde o ID será salvo (pasta oculta no diretório do usuário)
id_file_path = os.path.expanduser("~/.my_app_id")

def save_id(user_id):
    with open(id_file_path, "w") as f:
        f.write(user_id)

def get_saved_id():
    if os.path.exists(id_file_path):
        with open(id_file_path, "r") as f:
            return f.read().strip()
    return None

def request_user_id():
    root = tk.Tk()
    root.withdraw()  # Esconde a janela principal

    user_id = simpledialog.askstring("Infra-Watch - Instalação", "Insira o Id do Agente:")
    
    if user_id:
        save_id(user_id)
        messagebox.showinfo("ID Salvo", f"ID {user_id} salvo com sucesso.")
    else:
        messagebox.showwarning("Atenção", "Nenhum ID foi inserido. O programa será encerrado.")
        exit()

def main():
    saved_id = get_saved_id()
    if saved_id:
        print(f"ID já salvo: {saved_id}")
        # Aqui você pode continuar seu programa...
    else:
        request_user_id()

if __name__ == "__main__":
    main()
