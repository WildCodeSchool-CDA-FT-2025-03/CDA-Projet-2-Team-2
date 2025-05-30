import { Log } from '../entities/log.entity';

export default async function log(
  message: string,
  metadata: Record<string, string | number | boolean>,
): Promise<Log> {
  try {
    const newLog = new Log();
    newLog.titre = message;
    newLog.metadata = metadata;

    return await newLog.save();
  } catch (error) {
    console.error('Failed to create log entry:', error);
    throw error;
  }
}
