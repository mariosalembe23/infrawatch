import time
import platform
import psutil
import datetime
import json
import os
import multiprocessing  # Para compatibilidade com PyInstaller, se necessário

info = {
    "name_server": "",
    "version": "",
    "lastBoot": "",
    "fisicalNucleus": "",
    "logicalNucleus": "",
    "cpuUsage": "",
    "cpuFrequency": "",
    "ramUsage": {
        "total": "",
        "used": "",
        "available": ""
    },
    "swapUsage": {
        "total": "",
        "used": "",
        "available": ""
    },
    "sentData": "",
    "receivedData": "",
    "activeInterfaces": "",
    "cpuTemperature": "",
    "battery": {
        "level": "",
        "plugged": ""
    }
}

log_dir = os.path.join(os.path.expanduser("~"), "Documents", "infra", "infra_watch")
if not os.path.exists(log_dir):
    os.makedirs(log_dir, exist_ok=True)
log_path = os.path.join(log_dir, "log.txt")

def get_size(bytes, suffix="B"):
    factor = 1024
    for unit in ["", "K", "M", "G", "T"]:
        if bytes < factor:
            return f"{bytes:.2f} {unit}{suffix}"
        bytes /= factor

def get_system_info():
    system = platform.system()
    version = platform.version()
    release = platform.release()
    info["name_server"] = system
    info["version"] = version + " " + release
    boot_time = datetime.datetime.fromtimestamp(psutil.boot_time())
    uptime = datetime.datetime.now() - boot_time
    info["lastBoot"] = str(uptime).split('.')[0]
    physical_cores = psutil.cpu_count(logical=False)
    total_cores = psutil.cpu_count(logical=True)
    info["fisicalNucleus"] = physical_cores
    info["logicalNucleus"] = total_cores
    cpu_percentages = psutil.cpu_percent(percpu=True, interval=1)
    totalUse = sum(cpu_percentages)
    info["cpuUsage"] = totalUse / len(cpu_percentages)
    freq = psutil.cpu_freq()
    if freq:
        info["cpuFrequency"] = f"{freq.current:.2f} MHz"
    virtual_mem = psutil.virtual_memory()
    info["ramTotal"]["total"] = get_size(virtual_mem.total)
    info["ramTotal"]["used"] = get_size(virtual_mem.used)
    info["ramTotal"]["available"] = get_size(virtual_mem.available)
    swap = psutil.swap_memory()
    info["swapUsage"]["total"] = get_size(swap.total)
    info["swapUsage"]["used"] = get_size(swap.used)
    info["swapUsage"]["available"] = get_size(swap.free)
    net_io = psutil.net_io_counters()
    info["sentData"] = get_size(net_io.bytes_sent)
    info["receivedData"] = get_size(net_io.bytes_recv)
    interfaces = psutil.net_if_addrs()
    active_interfaces = [iface for iface in interfaces if interfaces[iface]]
    info["activeInterfaces"] = len(active_interfaces)
    try:
        temps = psutil.sensors_temperatures()
        if temps:
            for entries in temps.items():
                for entry in entries[1]:
                    if entry.label == 'Package id 0':
                        info["cpuTemperature"] = f"{entry.current}°C"
                        break
        else:
            info["cpuTemperature"] = "N/A"
    except AttributeError:
        info["cpuTemperature"] = "N/S"
    battery = psutil.sensors_battery()
    if battery:
        info["battery"]["level"] = f"{battery.percent}%"
        info["battery"]["plugged"] = "Sim" if battery.power_plugged else "Não"
    else:
        info["battery"]["level"] = "N/A"
        info["battery"]["plugged"] = "N/A"
    
    with open(log_path, "a") as f:
        f.write(f"{datetime.datetime.now()}\n")
        json.dump(info, f, indent=4, ensure_ascii=False)
        f.write("\n\n")

if __name__ == "__main__":
    multiprocessing.freeze_support()  # Para compatibilidade com PyInstaller, se necessário
    while True:
        get_system_info()
        time.sleep(60)