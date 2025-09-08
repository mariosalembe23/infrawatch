interface LastLogs {
  endpointId: string;
  workspaceId: string;
  url: string;
  status: "UP" | "DOWN";
  statusResponse: string;
  timestamp: string;
  time_response: string;
}

export interface EndpointProps {
  id: string;
  created_at: string;
  description: string | null;
  url: string;
  workspaceId: string;
  throw_error: string[];
  access: "PUBLIC" | "PRIVATE";
  toggle: boolean;
  time_ms: number;
  identifier: string;
  last_log: LastLogs;
}
