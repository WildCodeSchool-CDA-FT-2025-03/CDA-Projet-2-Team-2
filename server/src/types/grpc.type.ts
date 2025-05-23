export type LogRequest = {
  titre: string;
  metadata: Record<string, string>;
};

export type LogResponse = {
  success: boolean;
  message: string;
};

export type LogEntry = {
  id: string;
  titre: string;
  metadata: Record<string, string>;
  create_at: string;
};

export type LogsResponse = {
  logs: LogEntry[];
};

export type EmptyRequest = Record<string, never>;

export type LogServiceClient = {
  CreateLog(
    request: LogRequest,
    callback: (error: Error | null, response: LogResponse) => void,
  ): void;
  GetLogs(
    request: EmptyRequest,
    callback: (error: Error | null, response: LogsResponse) => void,
  ): void;
};
