import { Arg, Query, Resolver, Int, Authorized } from 'type-graphql';
import { ILike } from 'typeorm';

import { Log } from '../entities/log.entity';
import { LogsResponse } from '../types/log.type';
import { UserRole } from '../entities/user.entity';

@Resolver()
export class LogResolver {
  @Authorized([UserRole.ADMIN])
  @Query(() => LogsResponse)
  async getLogs(
    @Arg('limit', () => Int, { nullable: true }) limit?: number,
    @Arg('offset', () => Int, { nullable: true }) offset?: number,
    @Arg('search', { nullable: true }) search?: string,
  ): Promise<LogsResponse> {
    try {
      const whereClause = search ? { titre: ILike(`%${search}%`) } : {};

      const [logs, total] = await Log.findAndCount({
        where: whereClause,
        order: { createAt: 'DESC' },
        take: limit,
        skip: offset,
      });

      return {
        logs,
        total,
      };
    } catch (error) {
      console.error('Error fetching logs:', error);
      throw new Error('Failed to fetch logs');
    }
  }

  @Authorized([UserRole.ADMIN])
  @Query(() => Log, { nullable: true })
  async getLogById(@Arg('id') id: string): Promise<Log | null> {
    try {
      return await Log.findOne({ where: { id } });
    } catch (error) {
      console.error('Error fetching log by ID:', error);
      throw new Error('Failed to fetch log');
    }
  }
}
