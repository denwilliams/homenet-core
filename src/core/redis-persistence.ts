import { injectable, inject } from 'inversify';
import * as redis from 'redis';

const KEY_PREFIX = 'homenet:';

@injectable()
export class RedisPersistence implements Homenet.IPersistence {
  private _client: redis.RedisClient;

  constructor(@inject('IConfig') config: Homenet.IConfig) {
    this._client = redis.createClient({ host: (config.redis && config.redis.host || undefined) });
  }

  get(key: string) : Promise<any> {
    return new Promise((resolve, reject) => {
      this._client.get(redisKey(key), (err, res) => {
        if (err) reject(err);
        else resolve(JSON.parse(res));
      });
    });
  }

  set(key: string, value: any) : Promise<any> {
    return new Promise((resolve, reject) => {
      this._client.set(redisKey(key), JSON.stringify(value), (err, res) => {
        if (err) reject(err);
        else resolve(value); //JSON.parse(res));
      });
    });
  }
}

function redisKey(key: string) {
  return KEY_PREFIX + key;
}