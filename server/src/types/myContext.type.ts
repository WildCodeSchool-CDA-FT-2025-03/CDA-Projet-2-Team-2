import { Request, Response } from 'express';
import { User } from '../entities/user.entity';
import { LogServiceClient } from './grpc.type';

export type MyContext = {
  req: Request;
  res: Response;
  grpcClient: LogServiceClient;
  user?: User;
};
