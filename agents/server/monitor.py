import time
import platform
import psutil
import datetime
import pprint
import os

info = {
    "name_server" : "",
    "version" : "",
    "lastBoot" : "",
    "fisicalNucleus": "",
    "logicalNucleus": "",
    "cpuUsage": "",
    "cpuFrequency": "",
    "ramTotal": {
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

def get_system_info():
    # Sistema
    system = platform.system()
    version = platform.version()
    release = platform.release()

    info["name_server"] = system
    info["version"] = version + " " + release

    # Tempo desde o último boot
    boot_time = datetime.datetime.fromtimestamp(psutil.boot_time())
    uptime = datetime.datetime.now() - boot_time
    info["lastBoot"] = str(uptime).split('.')[0]

    # Núcleos
    physical_cores = psutil.cpu_count(logical=False)
    total_cores = psutil.cpu_count(logical=True)
    info["fisicalNucleus"] = physical_cores
    info["logicalNucleus"] = total_cores

    # Uso da CPU por núcleo
    cpu_percentages = psutil.cpu_percent(percpu=True, interval=1)
    totalUse = 0;
    for i, perc in enumerate(cpu_percentages):
        totalUse += perc
    info["cpuUsage"] = totalUse / len(cpu_percentages)

    # Frequência atual da CPU
    freq = psutil.cpu_freq()
    if freq:
        info["cpuFrequency"] = f"{freq.current:.2f} MHz"

    # Memória RAM
    virtual_mem = psutil.virtual_memory()
    info["ramTotal"]["total"] = get_size(virtual_mem.total)
    info["ramTotal"]["used"] = get_size(virtual_mem.used)
    info["ramTotal"]["available"] = get_size(virtual_mem.available)

    # Memória Swap
    swap = psutil.swap_memory()
    info["swapUsage"]["total"] = get_size(swap.total)
    info["swapUsage"]["used"] = get_size(swap.used)
    info["swapUsage"]["available"] = get_size(swap.free)

    # Interfaces de rede
    net_io = psutil.net_io_counters()
    info["sentData"] = get_size(net_io.bytes_sent)
    info["receivedData"] = get_size(net_io.bytes_recv)

    interfaces = psutil.net_if_addrs()
    active_interfaces = [iface for iface in interfaces if interfaces[iface]]
    info["activeInterfaces"] = len(active_interfaces)

    # Temperatura da CPU (se suportado)
    try:
        temps = psutil.sensors_temperatures()
        if temps:
            for entries in temps.items():
                for entry in entries:
                    if entry.label == 'Package id 0':
                        info["cpuTemperature"] = f"{entry.current}°C"
                        break 
        else:
            info["cpuTemperature"] = "N/A" # Não Disponível
    except AttributeError:
        info["cpuTemperature"] = "N/S" # Não Suportado

    battery = psutil.sensors_battery()
    if battery:
        info["battery"]["level"] = f"{battery.percent}%"
        info["battery"]["plugged"] = "Sim" if battery.power_plugged else "Não"
    else:
        info["battery"]["level"] = "N/A" # Não Disponível
        info["battery"]["plugged"] = "N/A" # Não Disponível

    pprint.pprint(info)

def get_size(bytes, suffix="B"):
    """
    Escala os bytes para KB, MB, GB etc.
    """
    factor = 1024
    for unit in ["", "K", "M", "G", "T"]:
        if bytes < factor:
            return f"{bytes:.2f} {unit}{suffix}"
        bytes /= factor

if __name__ == "__main__":
    while True:
        os.system("cls" if os.name == "nt" else "clear")
        get_system_info()
        time.sleep(60)
