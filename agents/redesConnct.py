import asyncio
import socket
import time
import subprocess
import platform
import json
from datetime import datetime
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, asdict
import concurrent.futures
import re


@dataclass
class NetworkResult:
    """Estrutura para armazenar resultados do monitoramento"""
    host: str
    timestamp: str
    ping_status: bool
    avg_latency: Optional[float]
    packet_loss: Optional[float]
    open_ports: List[int]
    error_message: Optional[str]


class NetworkMonitoringAgent:
    """Agente de monitoramento de rede"""
    
    def __init__(self, timeout: int = 5, ping_count: int = 4):
        """
        Inicializa o agente de monitoramento
        
        Args:
            timeout: Timeout para conexões em segundos
            ping_count: Número de pings para teste
        """
        self.timeout = timeout
        self.ping_count = ping_count
        self.system = platform.system().lower()
    
    async def monitor_host(self, host: str, ports: List[int] = None) -> NetworkResult:
        """
        Monitora um host específico
        
        Args:
            host: Host/IP para monitorar
            ports: Lista de portas para verificar (padrão: portas comuns)
            
        Returns:
            NetworkResult com todos os dados coletados
        """
        if ports is None:
            ports = [22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 3389, 5432, 3306]
        
        timestamp = datetime.now().isoformat()
        
        try:
            # Executar verificações em paralelo
            ping_task = self._check_ping(host)
            ports_task = self._scan_ports(host, ports)
            
            # Aguardar resultados
            ping_result, open_ports = await asyncio.gather(ping_task, ports_task)
            
            return NetworkResult(
                host=host,
                timestamp=timestamp,
                ping_status=ping_result['status'],
                avg_latency=ping_result['latency'],
                packet_loss=ping_result['packet_loss'],
                open_ports=open_ports,
                error_message=None
            )
            
        except Exception as e:
            return NetworkResult(
                host=host,
                timestamp=timestamp,
                ping_status=False,
                avg_latency=None,
                packet_loss=100.0,
                open_ports=[],
                error_message=str(e)
            )
    
    async def _check_ping(self, host: str) -> Dict:
        """
        Executa teste de ping
        
        Args:
            host: Host para fazer ping
            
        Returns:
            Dict com status, latência média e perda de pacotes
        """
        try:
            # Comando ping baseado no sistema operacional
            if self.system == 'windows':
                cmd = ['ping', '-n', str(self.ping_count), host]
            else:
                cmd = ['ping', '-c', str(self.ping_count), host]
            
            # Executar comando ping
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await asyncio.wait_for(
                process.communicate(), 
                timeout=self.timeout * 2
            )
            
            if process.returncode == 0:
                output = stdout.decode('utf-8', errors='ignore')
                return self._parse_ping_output(output)
            else:
                return {'status': False, 'latency': None, 'packet_loss': 100.0}
                
        except asyncio.TimeoutError:
            return {'status': False, 'latency': None, 'packet_loss': 100.0}
        except Exception as e:
            print(f"Erro no ping para {host}: {e}")
            return {'status': False, 'latency': None, 'packet_loss': 100.0}
    
    def _parse_ping_output(self, output: str) -> Dict:
        """
        Analisa a saída do comando ping
        
        Args:
            output: Saída do comando ping
            
        Returns:
            Dict com métricas extraídas
        """
        try:
            # Padrões regex para diferentes sistemas
            if self.system == 'windows':
                # Windows ping output parsing
                loss_pattern = r'(\d+)% loss'
                time_pattern = r'Average = (\d+)ms'
            else:
                # Linux/Unix ping output parsing
                loss_pattern = r'(\d+(?:\.\d+)?)% packet loss'
                time_pattern = r'rtt min/avg/max/mdev = [\d.]+/([\d.]+)/'
            
            # Extrair perda de pacotes
            loss_match = re.search(loss_pattern, output)
            packet_loss = float(loss_match.group(1)) if loss_match else 0.0
            
            # Extrair latência média
            time_match = re.search(time_pattern, output)
            avg_latency = float(time_match.group(1)) if time_match else None
            
            # Se conseguiu ping, status é True
            status = packet_loss < 100.0
            
            return {
                'status': status,
                'latency': avg_latency,
                'packet_loss': packet_loss
            }
            
        except Exception as e:
            print(f"Erro ao analisar output do ping: {e}")
            return {'status': False, 'latency': None, 'packet_loss': 100.0}
    
    async def _scan_ports(self, host: str, ports: List[int]) -> List[int]:
        """
        Verifica portas abertas usando TCP connect
        
        Args:
            host: Host para verificar
            ports: Lista de portas para testar
            
        Returns:
            Lista de portas abertas
        """
        open_ports = []
        
        # Limitar concorrência para não sobrecarregar
        semaphore = asyncio.Semaphore(50)
        
        async def check_port(port: int) -> Optional[int]:
            async with semaphore:
                try:
                    # Tentar conectar na porta
                    _, writer = await asyncio.wait_for(
                        asyncio.open_connection(host, port),
                        timeout=self.timeout
                    )
                    writer.close()
                    await writer.wait_closed()
                    return port
                except:
                    return None
        
        # Executar verificações em paralelo
        tasks = [check_port(port) for port in ports]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Coletar portas abertas
        for result in results:
            if isinstance(result, int):
                open_ports.append(result)
        
        return sorted(open_ports)
    
    async def monitor_multiple_hosts(self, hosts: List[str], ports: List[int] = None) -> List[NetworkResult]:
        """
        Monitora múltiplos hosts em paralelo
        
        Args:
            hosts: Lista de hosts para monitorar
            ports: Portas para verificar em cada host
            
        Returns:
            Lista de NetworkResult para cada host
        """
        tasks = [self.monitor_host(host, ports) for host in hosts]
        return await asyncio.gather(*tasks)
    
    def to_json(self, results: List[NetworkResult]) -> str:
        """
        Converte resultados para JSON
        
        Args:
            results: Lista de NetworkResult
            
        Returns:
            String JSON formatada
        """
        data = [asdict(result) for result in results]
        return json.dumps(data, indent=2, ensure_ascii=False)
    
    def to_csv(self, results: List[NetworkResult]) -> str:
        """
        Converte resultados para CSV
        
        Args:
            results: Lista de NetworkResult
            
        Returns:
            String CSV formatada
        """
        if not results:
            return ""
        
        # Header CSV
        header = "Host,Timestamp,Ping_Status,Avg_Latency_ms,Packet_Loss_%,Open_Ports,Error_Message\n"
        
        # Linhas de dados
        lines = []
        for result in results:
            open_ports_str = ";".join(map(str, result.open_ports))
            line = f"{result.host},{result.timestamp},{result.ping_status},{result.avg_latency},{result.packet_loss},\"{open_ports_str}\",{result.error_message or ''}\n"
            lines.append(line)
        
        return header + "".join(lines)


# Funções utilitárias para uso direto
async def quick_check(host: str, ports: List[int] = None) -> NetworkResult:
    """
    Verificação rápida de um host
    
    Args:
        host: Host para verificar
        ports: Portas para verificar
        
    Returns:
        NetworkResult com dados do host
    """
    agent = NetworkMonitoringAgent()
    return await agent.monitor_host(host, ports)


async def batch_check(hosts: List[str], ports: List[int] = None) -> List[NetworkResult]:
    """
    Verificação em lote de múltiplos hosts
    
    Args:
        hosts: Lista de hosts
        ports: Portas para verificar
        
    Returns:
        Lista de NetworkResult
    """
    agent = NetworkMonitoringAgent()
    return await agent.monitor_multiple_hosts(hosts, ports)


# Exemplo de uso principal
async def main():
    """Função principal de demonstração"""
    print("🚀 InfraWatch - Agente de Monitoramento de Rede")
    print("=" * 50)
    
    # Lista de hosts para testar
    test_hosts = [
        "google.com",
        "github.com", 
        "stackoverflow.com",
        "192.168.1.1",  # Gateway comum
        "8.8.8.8"       # DNS Google
    ]
    
    # Portas comuns para verificar
    common_ports = [22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 3389]
    
    print(f"📡 Monitorando {len(test_hosts)} hosts...")
    print(f"🔍 Verificando {len(common_ports)} portas por host...")
    print()
    
    # Executar monitoramento
    start_time = time.time()
    agent = NetworkMonitoringAgent(timeout=3, ping_count=3)
    results = await agent.monitor_multiple_hosts(test_hosts, common_ports)
    end_time = time.time()
    
    # Exibir resultados
    print("📊 RESULTADOS:")
    print("=" * 50)
    
    for result in results:
        print(f"🖥️  Host: {result.host}")
        print(f"   ✅ Ping: {'OK' if result.ping_status else 'FALHOU'}")
        
        if result.avg_latency:
            print(f"   ⏱️  Latência: {result.avg_latency:.1f}ms")
        
        if result.packet_loss is not None:
            print(f"   📦 Perda: {result.packet_loss:.1f}%")
        
        if result.open_ports:
            ports_str = ", ".join(map(str, result.open_ports))
            print(f"   🔓 Portas abertas: {ports_str}")
        else:
            print(f"   🔒 Nenhuma porta aberta encontrada")
        
        if result.error_message:
            print(f"   ❌ Erro: {result.error_message}")
        
        print()
    
    # Estatísticas gerais
    total_hosts = len(results)
    online_hosts = sum(1 for r in results if r.ping_status)
    avg_latencies = [r.avg_latency for r in results if r.avg_latency]
    avg_latency = sum(avg_latencies) / len(avg_latencies) if avg_latencies else 0
    
    print("📈 ESTATÍSTICAS:")
    print("=" * 30)
    print(f"⏰ Tempo total: {end_time - start_time:.2f}s")
    print(f"🖥️  Hosts online: {online_hosts}/{total_hosts}")
    print(f"⏱️  Latência média: {avg_latency:.1f}ms")
    
    # Salvar resultados em arquivos
    print("\n💾 Salvando resultados...")
    
    # JSON
    with open('network_monitoring_results.json', 'w', encoding='utf-8') as f:
        f.write(agent.to_json(results))
    print("📄 Salvo: network_monitoring_results.json")
    
    # CSV  
    with open('network_monitoring_results.csv', 'w', encoding='utf-8') as f:
        f.write(agent.to_csv(results))
    print("📊 Salvo: network_monitoring_results.csv")
    
    print("\n✅ Monitoramento concluído!")


# Executar se for chamado diretamente
if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n🛑 Monitoramento interrompido pelo usuário")
    except Exception as e:
        print(f"❌ Erro: {e}")
