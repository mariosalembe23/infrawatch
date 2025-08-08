#!/usr/bin/env python3
"""
Monitor de Armazenamento e Saúde de Discos
Utiliza psutil, smartmontools e integração com Prometheus Node Exporter
"""

import psutil
import subprocess
import json
import time
import logging
import os
import sys
from typing import Dict, List, Tuple, Optional
from datetime import datetime
from dataclasses import dataclass
from pathlib import Path

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('disk_monitor.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class DiskStats:
    """Classe para armazenar estatísticas do disco"""
    device: str
    total: int
    used: int
    free: int
    percent_used: float
    mount_point: str
    smart_status: str
    temperature: Optional[int] = None
    reallocated_sectors: Optional[int] = None
    pending_sectors: Optional[int] = None
    iops_read: Optional[float] = None
    iops_write: Optional[float] = None

class DiskMonitor:
    """Classe principal para monitoramento de discos"""
    
    def __init__(self, 
                 disk_usage_threshold: float = 85.0,
                 temperature_threshold: int = 50,
                 prometheus_textfile_path: str = "/var/lib/node_exporter/textfile_collector"):
        self.disk_usage_threshold = disk_usage_threshold
        self.temperature_threshold = temperature_threshold
        self.prometheus_path = prometheus_textfile_path
        self.previous_disk_io = {}
        
    def get_disk_usage(self) -> List[DiskStats]:
        """Obtém informações de uso de disco usando psutil"""
        disk_stats = []
        
        # Obter todas as partições montadas
        partitions = psutil.disk_partitions()
        
        for partition in partitions:
            try:
                # Pular partições virtuais ou especiais
                if partition.fstype in ['', 'squashfs', 'tmpfs', 'devtmpfs']:
                    continue
                    
                usage = psutil.disk_usage(partition.mountpoint)
                percent_used = (usage.used / usage.total) * 100
                
                # Extrair o dispositivo base (ex: /dev/sda1 -> /dev/sda)
                device_base = self._get_base_device(partition.device)
                
                disk_stat = DiskStats(
                    device=partition.device,
                    total=usage.total,
                    used=usage.used,
                    free=usage.free,
                    percent_used=percent_used,
                    mount_point=partition.mountpoint,
                    smart_status="UNKNOWN"
                )
                
                # Adicionar informações SMART
                smart_info = self.get_smart_info(device_base)
                if smart_info:
                    disk_stat.smart_status = smart_info.get('status', 'UNKNOWN')
                    disk_stat.temperature = smart_info.get('temperature')
                    disk_stat.reallocated_sectors = smart_info.get('reallocated_sectors')
                    disk_stat.pending_sectors = smart_info.get('pending_sectors')
                
                # Adicionar informações de IOPS
                iops_info = self.get_disk_iops(device_base)
                if iops_info:
                    disk_stat.iops_read = iops_info.get('read_iops')
                    disk_stat.iops_write = iops_info.get('write_iops')
                
                disk_stats.append(disk_stat)
                
            except PermissionError:
                logger.warning(f"Sem permissão para acessar {partition.mountpoint}")
                continue
            except Exception as e:
                logger.error(f"Erro ao obter informações de {partition.device}: {e}")
                continue
                
        return disk_stats
    
    def _get_base_device(self, device_path: str) -> str:
        """Extrai o dispositivo base (remove números de partição)"""
        import re
        # Remove números no final (ex: /dev/sda1 -> /dev/sda)
        base_device = re.sub(r'\d+$', '', device_path)
        return base_device
    
    def get_smart_info(self, device: str) -> Optional[Dict]:
        """Obtém informações SMART do disco usando smartmontools"""
        try:
            # Executar smartctl para obter informações SMART
            cmd = ['smartctl', '-A', '-H', '-j', device]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            
            if result.returncode in [0, 4]:  # 0=OK, 4=SMART status failed
                data = json.loads(result.stdout)
                
                smart_info = {
                    'status': 'PASSED' if data.get('smart_status', {}).get('passed', False) else 'FAILED',
                    'temperature': None,
                    'reallocated_sectors': None,
                    'pending_sectors': None
                }
                
                # Extrair temperatura
                if 'temperature' in data:
                    smart_info['temperature'] = data['temperature'].get('current', None)
                
                # Extrair atributos críticos
                ata_attributes = data.get('ata_smart_attributes', {}).get('table', [])
                for attr in ata_attributes:
                    attr_id = attr.get('id')
                    raw_value = attr.get('raw', {}).get('value', 0)
                    
                    if attr_id == 5:  # Reallocated Sectors Count
                        smart_info['reallocated_sectors'] = raw_value
                    elif attr_id == 197:  # Current Pending Sector Count
                        smart_info['pending_sectors'] = raw_value
                    elif attr_id == 194:  # Temperature
                        smart_info['temperature'] = raw_value
                
                return smart_info
                
        except subprocess.TimeoutExpired:
            logger.error(f"Timeout ao executar smartctl em {device}")
        except subprocess.CalledProcessError as e:
            logger.error(f"Erro ao executar smartctl em {device}: {e}")
        except json.JSONDecodeError as e:
            logger.error(f"Erro ao decodificar JSON do smartctl: {e}")
        except FileNotFoundError:
            logger.warning("smartctl não encontrado. Instale smartmontools.")
        except Exception as e:
            logger.error(f"Erro inesperado ao obter SMART info: {e}")
            
        return None
    
    def get_disk_iops(self, device: str) -> Optional[Dict]:
        """Calcula IOPS baseado em estatísticas do sistema"""
        try:
            device_name = os.path.basename(device)
            current_time = time.time()
            
            # Obter estatísticas atuais
            disk_io = psutil.disk_io_counters(perdisk=True)
            
            if device_name not in disk_io:
                return None
            
            current_stats = disk_io[device_name]
            
            # Calcular IOPS se tivermos dados anteriores
            if device_name in self.previous_disk_io:
                prev_stats, prev_time = self.previous_disk_io[device_name]
                time_diff = current_time - prev_time
                
                if time_diff > 0:
                    read_iops = (current_stats.read_count - prev_stats.read_count) / time_diff
                    write_iops = (current_stats.write_count - prev_stats.write_count) / time_diff
                    
                    # Armazenar dados atuais para próxima iteração
                    self.previous_disk_io[device_name] = (current_stats, current_time)
                    
                    return {
                        'read_iops': max(0, read_iops),
                        'write_iops': max(0, write_iops)
                    }
            
            # Armazenar dados para primeira iteração
            self.previous_disk_io[device_name] = (current_stats, current_time)
            return {'read_iops': 0, 'write_iops': 0}
            
        except Exception as e:
            logger.error(f"Erro ao calcular IOPS para {device}: {e}")
            return None
    
    def check_disk_health(self, disk_stats: List[DiskStats]) -> List[str]:
        """Verifica a saúde dos discos e retorna lista de alertas"""
        alerts = []
        
        for disk in disk_stats:
            # Verificar uso de espaço
            if disk.percent_used >= self.disk_usage_threshold:
                alerts.append(
                    f"CRÍTICO: Disco {disk.device} ({disk.mount_point}) "
                    f"está {disk.percent_used:.1f}% cheio"
                )
            
            # Verificar status SMART
            if disk.smart_status == "FAILED":
                alerts.append(
                    f"CRÍTICO: Disco {disk.device} falhou no teste SMART"
                )
            
            # Verificar temperatura
            if disk.temperature and disk.temperature >= self.temperature_threshold:
                alerts.append(
                    f"AVISO: Disco {disk.device} está a {disk.temperature}°C "
                    f"(acima do limite de {self.temperature_threshold}°C)"
                )
            
            # Verificar setores realocados
            if disk.reallocated_sectors and disk.reallocated_sectors > 0:
                alerts.append(
                    f"AVISO: Disco {disk.device} possui {disk.reallocated_sectors} "
                    f"setores realocados"
                )
            
            # Verificar setores pendentes
            if disk.pending_sectors and disk.pending_sectors > 0:
                alerts.append(
                    f"AVISO: Disco {disk.device} possui {disk.pending_sectors} "
                    f"setores pendentes"
                )
        
        return alerts
    
    def export_prometheus_metrics(self, disk_stats: List[DiskStats]):
        """Exporta métricas para o Prometheus Node Exporter"""
        try:
            if not os.path.exists(self.prometheus_path):
                os.makedirs(self.prometheus_path, exist_ok=True)
            
            metrics_file = os.path.join(self.prometheus_path, "disk_monitor.prom")
            
            with open(metrics_file, 'w') as f:
                f.write("# HELP disk_usage_bytes Uso de espaço em disco em bytes\n")
                f.write("# TYPE disk_usage_bytes gauge\n")
                
                f.write("# HELP disk_usage_percent Percentual de uso do disco\n")
                f.write("# TYPE disk_usage_percent gauge\n")
                
                f.write("# HELP disk_smart_status Status SMART do disco (1=OK, 0=FAILED)\n")
                f.write("# TYPE disk_smart_status gauge\n")
                
                f.write("# HELP disk_temperature_celsius Temperatura do disco em Celsius\n")
                f.write("# TYPE disk_temperature_celsius gauge\n")
                
                f.write("# HELP disk_reallocated_sectors Número de setores realocados\n")
                f.write("# TYPE disk_reallocated_sectors gauge\n")
                
                f.write("# HELP disk_iops_read IOPS de leitura do disco\n")
                f.write("# TYPE disk_iops_read gauge\n")
                
                f.write("# HELP disk_iops_write IOPS de escrita do disco\n")
                f.write("# TYPE disk_iops_write gauge\n")
                
                for disk in disk_stats:
                    labels = f'device="{disk.device}",mountpoint="{disk.mount_point}"'
                    
                    # Métricas de uso
                    f.write(f'disk_usage_bytes{{type="total",{labels}}} {disk.total}\n')
                    f.write(f'disk_usage_bytes{{type="used",{labels}}} {disk.used}\n')
                    f.write(f'disk_usage_bytes{{type="free",{labels}}} {disk.free}\n')
                    f.write(f'disk_usage_percent{{{labels}}} {disk.percent_used}\n')
                    
                    # Status SMART
                    smart_value = 1 if disk.smart_status == "PASSED" else 0
                    f.write(f'disk_smart_status{{{labels}}} {smart_value}\n')
                    
                    # Métricas opcionais
                    if disk.temperature is not None:
                        f.write(f'disk_temperature_celsius{{{labels}}} {disk.temperature}\n')
                    
                    if disk.reallocated_sectors is not None:
                        f.write(f'disk_reallocated_sectors{{{labels}}} {disk.reallocated_sectors}\n')
                    
                    if disk.iops_read is not None:
                        f.write(f'disk_iops_read{{{labels}}} {disk.iops_read}\n')
                    
                    if disk.iops_write is not None:
                        f.write(f'disk_iops_write{{{labels}}} {disk.iops_write}\n')
            
            logger.info(f"Métricas exportadas para {metrics_file}")
            
        except Exception as e:
            logger.error(f"Erro ao exportar métricas do Prometheus: {e}")
    
    def run_check(self):
        """Executa uma verificação completa dos discos"""
        logger.info("Iniciando verificação de discos...")
        
        # Obter estatísticas dos discos
        disk_stats = self.get_disk_usage()
        
        if not disk_stats:
            logger.warning("Nenhum disco encontrado para monitoramento")
            return
        
        # Verificar saúde dos discos
        alerts = self.check_disk_health(disk_stats)
        
        # Log das estatísticas
        for disk in disk_stats:
            logger.info(
                f"Disco {disk.device} ({disk.mount_point}): "
                f"{disk.percent_used:.1f}% usado, "
                f"SMART: {disk.smart_status}"
                f"{f', Temp: {disk.temperature}°C' if disk.temperature else ''}"
                f"{f', IOPS R/W: {disk.iops_read:.1f}/{disk.iops_write:.1f}' if disk.iops_read is not None else ''}"
            )
        
        # Log dos alertas
        if alerts:
            for alert in alerts:
                logger.warning(alert)
        else:
            logger.info("Todos os discos estão saudáveis")
        
        # Exportar métricas para Prometheus
        self.export_prometheus_metrics(disk_stats)
        
        return disk_stats, alerts

def main():
    """Função principal"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Monitor de Armazenamento e Saúde de Discos")
    parser.add_argument("--threshold", type=float, default=85.0, 
                       help="Limite de uso de disco em percentual (padrão: 85)")
    parser.add_argument("--temp-threshold", type=int, default=50,
                       help="Limite de temperatura em Celsius (padrão: 50)")
    parser.add_argument("--prometheus-path", default="/var/lib/node_exporter/textfile_collector",
                       help="Caminho para exportação das métricas do Prometheus")
    parser.add_argument("--interval", type=int, default=60,
                       help="Intervalo entre verificações em segundos (0 = apenas uma vez)")
    parser.add_argument("--daemon", action="store_true",
                       help="Executar como daemon (loop contínuo)")
    
    args = parser.parse_args()
    
    # Verificar se está executando como root (necessário para SMART)
    if os.geteuid() != 0:
        logger.warning("Execute como root para obter informações SMART completas")
    
    monitor = DiskMonitor(
        disk_usage_threshold=args.threshold,
        temperature_threshold=args.temp_threshold,
        prometheus_textfile_path=args.prometheus_path
    )
    
    try:
        if args.daemon or args.interval > 0:
            logger.info(f"Iniciando monitoramento contínuo (intervalo: {args.interval}s)")
            while True:
                monitor.run_check()
                if args.interval > 0:
                    time.sleep(args.interval)
                else:
                    break
        else:
            monitor.run_check()
    
    except KeyboardInterrupt:
        logger.info("Monitoramento interrompido pelo usuário")
    except Exception as e:
        logger.error(f"Erro fatal: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
