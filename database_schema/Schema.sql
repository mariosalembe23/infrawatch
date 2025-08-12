[SERVER]
name_server 
version
last_boot
fisical_nucleos
logical_nucleos
cpu_usage
cpu_frequency
ram_usage {
    "total": "",
    "used": "",
    "available": ""
}
swap_usage {
    "total": "",
    "used": "",
    "available": ""
}
sendData
receiveData
activated_interfaces
cpu_temperature
battery {
    "level": "",
    "plugged": ""
}

[NETWORK]
description {
    "model": "",
    "firmware": "",
    "manufacturer": ""
}
configuration_name
interface_name
status(up, down)
receive_data
send_data
package_errors
configured_speed
cpu_usage
memmory_usage {
    "total": "",
    "available": ""
}
temperature
{
  "description": {
    "model": "Cisco Catalyst 2960X-48FPS-L",
    "firmware": "15.2(7)E4",
    "manufacturer": "Cisco Systems"
  },
  "configuration_name": "SW-CORE-01",
  "uptime": "11 days 20:28:20",
  "location": "Data Center - Rack 3",
  "status": "operational",
  "interfaces": [
    {
      "interface_name": "GigabitEthernet1/0/1",
      "status": "up",
      "receive_data_bytes": 452938420,
      "send_data_bytes": 298204512,
      "package_errors": 12,
      "configured_speed_bps": 1000000000
    },
    {
      "interface_name": "GigabitEthernet1/0/2",
      "status": "down",
      "receive_data_bytes": 0,
      "send_data_bytes": 0,
      "package_errors": 0,
      "configured_speed_bps": 1000000000
    }
  ],
  "cpu_usage_percent": 23,
  "memory_usage": {
    "total_kb": 1023772,
    "available_kb": 894832
  },
  "temperature": {
    "value_celsius": 41,
    "status": "ok"
  },
  "arp_table": [
    {
      "ip": "192.168.1.10",
      "mac": "00:1A:2B:3C:4D:5E",
      "type": "dynamic"
    }
  ]
}


[ENDPOINTS]
{
  "endpoint": "https://example.com",
  "ping": {
    "status": "reachable",
    "latency_avg_ms": 14.12,
    "packet_loss_percent": 0
  },
  "http": {
    "status": "up",
    "http_code": 200,
    "response_time_seconds": 0.234,
    "response_size_bytes": 1256
  }
}