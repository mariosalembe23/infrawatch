interface Interface {
  id: number;
  name: string;
  speed: string;
  status: "up" | "down";
}

interface LastDevice {
  deviceId: string;
  workspaceId: string;
  cpu: string;
  device: string;
  firewall_sessions: string;
  firewall_throughput: string;
  firewall_vpn_activeTunnels: string;
  firewall_vpn_status: string;
  host: string;
  memory: string;
  printer_pagesPrinted: string;
  printer_paper: string;
  printer_toner: string;
  router_bgpPeers: string;
  router_routes: string;
  status: "UP" | "DOWN";
  switch_macTableSize: string;
  switch_vlans: string;
  sysName: string;
  timestamp: string;
  uptime: string;
}

export interface Device {
  id: string;
  created_at: string;  // ISO date string
  device_name: string;
  host: string;
  description: string;
  workspaceId: string;
  device_type: "SWITCH" | "ROUTER" | "FIREWALL" | "PRINTER"
  serverId: string;
  toggle: boolean;
  time_ms: number;
  sys_name: string;
  interfaces: Interface[];
  userId: string;
  username: string;
  last_device: LastDevice;
}
