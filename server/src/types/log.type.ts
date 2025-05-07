import { Field, Int, ObjectType } from 'type-graphql';
import { Log } from '../entities/log.entity';

@ObjectType()
export class LogsResponse {
  @Field(() => [Log])
  logs: Log[];

  @Field(() => Int)
  total: number;
}

export type LogMetadata = Record<string, string | number | boolean>;
