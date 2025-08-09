#!/usr/bin/env python3
"""
InfraWatch - Agente de Monitoramento Contínuo
Monitora hosts usando SNMP, Ping e Nmap
"""

import json
import time
import subprocess
import logging
import threading
from datetime import datetime, timedelta
from pathlib import Path
from dataclasses import dataclass, asdict
from typing import Dict, List, Optional, Any
import socket

# Configuração do logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('infrawatch_agent.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('InfraWatch')

@dataclass
class MonitoringConfig:
    """Configuração do agente de monitoramento"""
    host: str
    ping_interval: int = 30  # segundos
    snmp_interval: int = 60  # segundos
    nmap_interval: int = 300  # segundos (5 minutos)
    snmp_community: str = "public"
    snmp_port: int = 161
    output_dir: str = "monitoring_data"
    max_retries: int = 3
    timeout: int = 10

@dataclass
class PingResult:
    """Resultado do ping"""
    timestamp: str
    host: str
    online: bool
    response_time: Optional[float] = None
    packet_loss: Optional[float] = None
    error: Optional[str] = None

@dataclass
class SNMPResult:
    """Resultado da coleta SNMP"""
    timestamp: str
    host: str
    success: bool
    uptime: Optional[str] = None
    interfaces: Optional[List[Dict]] = None
    system_info: Optional[Dict] = None
    error: Optional[str] = None

@dataclass
class NmapResult:
    """Resultado do scan Nmap"""
    timestamp: str
    host: str
    success: bool
    open_ports: Optional[List[Dict]] = None
    services: Optional[List[Dict]] = None
    os_info: Optional[str] = None
    error: Optional[str] = None

class PingMonitor:
    """Monitor de conectividade usando ping"""
    
    def __init__(self, config: MonitoringConfig):
        self.config = config
        self.logger = logging.getLogger('InfraWatch.Ping')
    
    def ping_host(self) -> PingResult:
        """Executa ping no host"""
        timestamp = datetime.now().isoformat()
        
        try:
            # Comando ping (adaptado para Linux/Windows)
            import platform
            if platform.system().lower() == "windows":
                cmd = ["ping", "-n", "4", self.config.host]
            else:
                cmd = ["ping", "-c", "4", self.config.host]
            
            result = subprocess.run(
                cmd, 
                capture_output=True, 
                text=True, 
                timeout=self.config.timeout
            )
            
            if result.returncode == 0:
                # Parse da saída do ping para extrair tempo de resposta
                output = result.stdout
                response_time = self._parse_ping_time(output)
                packet_loss = self._parse_packet_loss(output)
                
                self.logger.info(f"Ping para {self.config.host}: OK ({response_time}ms)")
                return PingResult(
                    timestamp=timestamp,
                    host=self.config.host,
                    online=True,
                    response_time=response_time,
                    packet_loss=packet_loss
                )
            else:
                self.logger.warning(f"Ping para {self.config.host}: FALHOU")
                return PingResult(
                    timestamp=timestamp,
                    host=self.config.host,
                    online=False,
                    error=result.stderr
                )
                
        except subprocess.TimeoutExpired:
            self.logger.error(f"Ping para {self.config.host}: TIMEOUT")
            return PingResult(
                timestamp=timestamp,
                host=self.config.host,
                online=False,
                error="Timeout"
            )
        except Exception as e:
            self.logger.error(f"Erro no ping para {self.config.host}: {e}")
            return PingResult(
                timestamp=timestamp,
                host=self.config.host,
                online=False,
                error=str(e)
            )
    
    def _parse_ping_time(self, output: str) -> Optional[float]:
        """Extrai o tempo de resposta da saída do ping"""
        try:
            import re
            # Pattern para tempo de resposta (funciona para pt/en)
            pattern = r'time[=<](\d+\.?\d*)ms'
            matches = re.findall(pattern, output, re.IGNORECASE)
            if matches:
                return float(matches[0])
        except:
            pass
        return None
    
    def _parse_packet_loss(self, output: str) -> Optional[float]:
        """Extrai a perda de pacotes da saída do ping"""
        try:
            import re
            # Pattern para perda de pacotes
            pattern = r'(\d+)% packet loss|(\d+)% de perda'
            match = re.search(pattern, output, re.IGNORECASE)
            if match:
                return float(match.group(1) or match.group(2))
        except:
            pass
        return None

class SNMPMonitor:
    """Monitor SNMP para coleta de métricas"""
    
    # OIDs comuns
    OID_SYSTEM_UPTIME = "1.3.6.1.2.1.1.3.0"
    OID_SYSTEM_DESC = "1.3.6.1.2.1.1.1.0"
    OID_SYSTEM_NAME = "1.3.6.1.2.1.1.5.0"
    OID_IF_TABLE = "1.3.6.1.2.1.2.2.1"
    
    def __init__(self, config: MonitoringConfig):
        self.config = config
        self.logger = logging.getLogger('InfraWatch.SNMP')
    
    def collect_metrics(self) -> SNMPResult:
        """Coleta métricas SNMP do host"""
        timestamp = datetime.now().isoformat()
        
        try:
            # Verifica se snmpwalk está disponível
            result = subprocess.run(
                ["which", "snmpwalk"], 
                capture_output=True, 
                text=True
            )
            
            if result.returncode != 0:
                # Fallback: usar socket raw para SNMP básico
                return self._collect_basic_snmp(timestamp)
            
            # Coleta uptime
            uptime = self._get_snmp_value(self.OID_SYSTEM_UPTIME)
            
            # Coleta informações do sistema
            system_desc = self._get_snmp_value(self.OID_SYSTEM_DESC)
            system_name = self._get_snmp_value(self.OID_SYSTEM_NAME)
            
            # Coleta interfaces (simplificado)
            interfaces = self._get_interfaces_info()
            
            system_info = {
                "description": system_desc,
                "name": system_name
            }
            
            self.logger.info(f"SNMP coleta para {self.config.host}: OK")
            return SNMPResult(
                timestamp=timestamp,
                host=self.config.host,
                success=True,
                uptime=uptime,
                interfaces=interfaces,
                system_info=system_info
            )
            
        except Exception as e:
            self.logger.error(f"Erro SNMP para {self.config.host}: {e}")
            return SNMPResult(
                timestamp=timestamp,
                host=self.config.host,
                success=False,
                error=str(e)
            )
    
    def _get_snmp_value(self, oid: str) -> Optional[str]:
        """Obtém valor SNMP usando snmpwalk"""
        try:
            cmd = [
                "snmpwalk",
                "-v2c",
                "-c", self.config.snmp_community,
                f"{self.config.host}:{self.config.snmp_port}",
                oid
            ]
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=self.config.timeout
            )
            
            if result.returncode == 0:
                # Parse do resultado
                output = result.stdout.strip()
                if "=" in output:
                    return output.split("=", 1)[1].strip()
            
        except Exception as e:
            self.logger.debug(f"Erro ao obter OID {oid}: {e}")
        
        return None
    
    def _get_interfaces_info(self) -> List[Dict]:
        """Coleta informações básicas das interfaces"""
        interfaces = []
        try:
            # Simplified interface collection
            # Em produção, você coletaria OIDs específicos das interfaces
            interfaces.append({
                "index": 1,
                "name": "Interface simulada",
                "status": "up",
                "speed": "1000000000"  # 1Gbps
            })
        except Exception as e:
            self.logger.debug(f"Erro ao coletar interfaces: {e}")
        
        return interfaces
    
    def _collect_basic_snmp(self, timestamp: str) -> SNMPResult:
        """Coleta SNMP básica sem snmpwalk (simulação)"""
        try:
            # Verifica se a porta SNMP está aberta
            sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            sock.settimeout(self.config.timeout)
            result = sock.connect_ex((self.config.host, self.config.snmp_port))
            sock.close()
            
            if result == 0:
                self.logger.info(f"Porta SNMP {self.config.snmp_port} acessível em {self.config.host}")
                return SNMPResult(
                    timestamp=timestamp,
                    host=self.config.host,
                    success=True,
                    uptime="Disponível (simulado)",
                    interfaces=[{"index": 1, "name": "Simulado", "status": "unknown"}],
                    system_info={"description": "SNMP básico disponível"}
                )
            else:
                return SNMPResult(
                    timestamp=timestamp,
                    host=self.config.host,
                    success=False,
                    error="Porta SNMP não acessível"
                )
                
        except Exception as e:
            return SNMPResult(
                timestamp=timestamp,
                host=self.config.host,
                success=False,
                error=str(e)
            )

class NmapMonitor:
    """Monitor Nmap para descoberta de portas e serviços"""
    
    def __init__(self, config: MonitoringConfig):
        self.config = config
        self.logger = logging.getLogger('InfraWatch.Nmap')
    
    def scan_host(self) -> NmapResult:
        """Executa scan Nmap no host"""
        timestamp = datetime.now().isoformat()
        
        try:
            # Verifica se nmap está disponível
            result = subprocess.run(
                ["which", "nmap"], 
                capture_output=True, 
                text=True
            )
            
            if result.returncode != 0:
                return self._basic_port_scan(timestamp)
            
            # Scan básico com Nmap
            cmd = [
                "nmap",
                "-sS",  # SYN scan
                "-O",   # OS detection
                "-sV",  # Version detection
                "--top-ports", "1000",
                "-T4",  # Timing template
                self.config.host
            ]
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=120  # Timeout maior para Nmap
            )
            
            if result.returncode == 0:
                ports, services, os_info = self._parse_nmap_output(result.stdout)
                
                self.logger.info(f"Nmap scan para {self.config.host}: {len(ports)} portas abertas")
                return NmapResult(
                    timestamp=timestamp,
                    host=self.config.host,
                    success=True,
                    open_ports=ports,
                    services=services,
                    os_info=os_info
                )
            else:
                return NmapResult(
                    timestamp=timestamp,
                    host=self.config.host,
                    success=False,
                    error=result.stderr
                )
                
        except subprocess.TimeoutExpired:
            self.logger.error(f"Nmap scan para {self.config.host}: TIMEOUT")
            return NmapResult(
                timestamp=timestamp,
                host=self.config.host,
                success=False,
                error="Timeout durante scan"
            )
        except Exception as e:
            self.logger.error(f"Erro Nmap para {self.config.host}: {e}")
            return NmapResult(
                timestamp=timestamp,
                host=self.config.host,
                success=False,
                error=str(e)
            )
    
    def _parse_nmap_output(self, output: str) -> tuple:
        """Parse da saída do Nmap"""
        ports = []
        services = []
        os_info = None
        
        try:
            lines = output.split('\n')
            
            for line in lines:
                line = line.strip()
                
                # Portas abertas
                if "/tcp" in line and "open" in line:
                    parts = line.split()
                    if len(parts) >= 3:
                        port_proto = parts[0]
                        state = parts[1]
                        service = parts[2] if len(parts) > 2 else "unknown"
                        
                        port_num = port_proto.split('/')[0]
                        
                        ports.append({
                            "port": int(port_num),
                            "protocol": "tcp",
                            "state": state
                        })
                        
                        services.append({
                            "port": int(port_num),
                            "service": service,
                            "version": parts[3] if len(parts) > 3 else None
                        })
                
                # Informações do OS
                if "OS details:" in line:
                    os_info = line.replace("OS details:", "").strip()
                elif "Aggressive OS guesses:" in line:
                    os_info = line.replace("Aggressive OS guesses:", "").strip()
        
        except Exception as e:
            self.logger.debug(f"Erro ao fazer parse do Nmap: {e}")
        
        return ports, services, os_info
    
    def _basic_port_scan(self, timestamp: str) -> NmapResult:
        """Scan básico de portas sem Nmap"""
        common_ports = [22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 161, 162]
        open_ports = []
        
        try:
            for port in common_ports:
                try:
                    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                    sock.settimeout(2)
                    result = sock.connect_ex((self.config.host, port))
                    sock.close()
                    
                    if result == 0:
                        open_ports.append({
                            "port": port,
                            "protocol": "tcp",
                            "state": "open"
                        })
                        
                except Exception:
                    continue
            
            self.logger.info(f"Scan básico para {self.config.host}: {len(open_ports)} portas abertas")
            return NmapResult(
                timestamp=timestamp,
                host=self.config.host,
                success=True,
                open_ports=open_ports,
                services=[],
                os_info="Scan básico (sem Nmap)"
            )
            
        except Exception as e:
            return NmapResult(
                timestamp=timestamp,
                host=self.config.host,
                success=False,
                error=str(e)
            )

class DataManager:
    """Gerenciador de dados - salva resultados em JSON"""
    
    def __init__(self, output_dir: str):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        self.logger = logging.getLogger('InfraWatch.DataManager')
    
    def save_result(self, result_type: str, result: Any, host: str):
        """Salva resultado em arquivo JSON"""
        try:
            date_str = datetime.now().strftime("%Y%m%d")
            filename = f"{host}_{result_type}_{date_str}.json"
            filepath = self.output_dir / filename
            
            # Carrega dados existentes ou cria nova lista
            data = []
            if filepath.exists():
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                except json.JSONDecodeError:
                    data = []
            
            # Adiciona novo resultado
            data.append(asdict(result))
            
            # Salva dados atualizados
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            self.logger.debug(f"Resultado {result_type} salvo para {host}")
            
        except Exception as e:
            self.logger.error(f"Erro ao salvar resultado {result_type}: {e}")
    
    def get_summary(self, host: str, hours: int = 24) -> Dict:
        """Gera resumo dos dados das últimas N horas"""
        try:
            cutoff_time = datetime.now() - timedelta(hours=hours)
            summary = {
                "host": host,
                "period_hours": hours,
                "last_update": datetime.now().isoformat(),
                "ping": {"total": 0, "success": 0, "avg_response_time": None},
                "snmp": {"total": 0, "success": 0},
                "nmap": {"total": 0, "success": 0, "unique_ports": 0}
            }
            
            # Análise dos dados de ping, SNMP e Nmap
            # (implementação simplificada - em produção seria mais completa)
            
            return summary
            
        except Exception as e:
            self.logger.error(f"Erro ao gerar resumo: {e}")
            return {}

class InfraWatchAgent:
    """Agente principal do InfraWatch"""
    
    def __init__(self, config: MonitoringConfig):
        self.config = config
        self.ping_monitor = PingMonitor(config)
        self.snmp_monitor = SNMPMonitor(config)
        self.nmap_monitor = NmapMonitor(config)
        self.data_manager = DataManager(config.output_dir)
        self.logger = logging.getLogger('InfraWatch.Agent')
        
        self._running = False
        self._threads = []
    
    def start(self):
        """Inicia o agente de monitoramento"""
        if self._running:
            self.logger.warning("Agente já está rodando")
            return
        
        self._running = True
        self.logger.info(f"Iniciando monitoramento de {self.config.host}")
        
        # Thread para ping
        ping_thread = threading.Thread(
            target=self._ping_loop, 
            name="PingThread", 
            daemon=True
        )
        
        # Thread para SNMP
        snmp_thread = threading.Thread(
            target=self._snmp_loop, 
            name="SNMPThread", 
            daemon=True
        )
        
        # Thread para Nmap
        nmap_thread = threading.Thread(
            target=self._nmap_loop, 
            name="NmapThread", 
            daemon=True
        )
        
        self._threads = [ping_thread, snmp_thread, nmap_thread]
        
        for thread in self._threads:
            thread.start()
        
        self.logger.info("Agente InfraWatch iniciado com sucesso")
    
    def stop(self):
        """Para o agente de monitoramento"""
        self.logger.info("Parando agente InfraWatch...")
        self._running = False
        
        # Aguarda threads terminarem
        for thread in self._threads:
            if thread.is_alive():
                thread.join(timeout=5)
        
        self.logger.info("Agente InfraWatch parado")
    
    def _ping_loop(self):
        """Loop de monitoramento ping"""
        while self._running:
            try:
                result = self.ping_monitor.ping_host()
                self.data_manager.save_result("ping", result, self.config.host)
                time.sleep(self.config.ping_interval)
            except Exception as e:
                self.logger.error(f"Erro no loop de ping: {e}")
                time.sleep(10)
    
    def _snmp_loop(self):
        """Loop de monitoramento SNMP"""
        while self._running:
            try:
                result = self.snmp_monitor.collect_metrics()
                self.data_manager.save_result("snmp", result, self.config.host)
                time.sleep(self.config.snmp_interval)
            except Exception as e:
                self.logger.error(f"Erro no loop de SNMP: {e}")
                time.sleep(30)
    
    def _nmap_loop(self):
        """Loop de scan Nmap"""
        while self._running:
            try:
                result = self.nmap_monitor.scan_host()
                self.data_manager.save_result("nmap", result, self.config.host)
                time.sleep(self.config.nmap_interval)
            except Exception as e:
                self.logger.error(f"Erro no loop de Nmap: {e}")
                time.sleep(60)
    
    def get_status(self) -> Dict:
        """Retorna status atual do agente"""
        return {
            "running": self._running,
            "host": self.config.host,
            "threads_active": sum(1 for t in self._threads if t.is_alive()),
            "uptime": "Implementar contador de uptime",
            "last_update": datetime.now().isoformat()
        }

def main():
    """Função principal"""
    # Configuração exemplo
    config = MonitoringConfig(
        host="8.8.8.8",  # Google DNS para teste
        ping_interval=30,
        snmp_interval=60,
        nmap_interval=300,
        snmp_community="public",
        output_dir="monitoring_data"
    )
    
    # Cria e inicia o agente
    agent = InfraWatchAgent(config)
    
    try:
        agent.start()
        
        # Loop principal
        while True:
            time.sleep(60)
            status = agent.get_status()
            logger.info(f"Status do agente: {status}")
            
    except KeyboardInterrupt:
        logger.info("Recebido sinal de interrupção")
    finally:
        agent.stop()

if __name__ == "__main__":
    main()
