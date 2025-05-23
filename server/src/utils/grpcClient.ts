import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { LogServiceClient, LogResponse, LogsResponse } from '../types/grpc.type';

const PROTO_PATH = path.resolve(__dirname, '../../proto/log.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const logService = protoDescriptor.log as unknown as {
  LogService: new (address: string, credentials: grpc.ChannelCredentials) => LogServiceClient;
};

class GrpcClient {
  private client: LogServiceClient;

  constructor() {
    this.client = new logService.LogService('logs:50051', grpc.credentials.createInsecure());
  }

  createLog(titre: string, metadata: Record<string, string>): Promise<LogResponse> {
    return new Promise((resolve, reject) => {
      this.client.CreateLog({ titre, metadata }, (error: Error | null, response: LogResponse) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(response);
      });
    });
  }

  getLogs(): Promise<LogsResponse> {
    return new Promise((resolve, reject) => {
      this.client.GetLogs({}, (error: Error | null, response: LogsResponse) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(response);
      });
    });
  }
}

export const grpcClient = new GrpcClient();
