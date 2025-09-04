interface Metrics {
  serverId: string;
  name_server: string;
  version: string;
  interfaces_active: string;
  interfaces_inactive: string;
  interfaces_total: string;
  battery_level: string;
  battery_plugged: string;
  cpu_frequency: string;
  cpu_temperature: string;
  cpu_usage: string;
  disk_space_available: string;
  disk_space_size: string;
  disk_space_used: string;
  fisical_nucleos: string;
  last_boot: string;
  logical_nucleos: string;
  ram_usage_available: string;
  ram_usage_used: string;
  ram_usage_total: string;
  receiveData: string;
  sendData: string;
  swap_usage_available: string;
  swap_usage_used: string;
  swap_usage_total: string;
  services: string;
}

export interface ServerProps {
  id: string;
  created_at: string;
  servername: string;
  username: string;
  userId: string;
  server_idenfier: string;
  toggle: boolean;
  workspaceId: string;
  time_ms: number;
  is_busy: boolean;
  last_metrics: Metrics;
}
