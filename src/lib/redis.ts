import { Redis } from 'ioredis';

const getRedisURL = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }
  throw new Error('REDIS_URL not defined.');
};

export const redis = new Redis(getRedisURL());

export async function setLargeDataInRedis(
  keyBase: string,
  data: any,
  chunkSizeBytes: number = 1024 * 900,
  expiration: number = 60 * 60 * 24,
) {
  // 900KB
  const serializedData = JSON.stringify(data);
  const buffer = Buffer.from(serializedData, 'utf-8');

  const numChunks = Math.ceil(buffer.length / chunkSizeBytes);

  for (let i = 0; i < numChunks; i++) {
    const chunkStart = i * chunkSizeBytes;
    const chunkEnd = chunkStart + chunkSizeBytes;
    const dataChunk = buffer.slice(chunkStart, chunkEnd).toString('utf-8');

    const chunkKey = `${keyBase}:chunk:${i}`;
    await redis.set(chunkKey, dataChunk, 'EX', expiration);
  }

  await redis.set(
    `${keyBase}:metadata`,
    JSON.stringify({ chunks: numChunks }),
    'EX',
    expiration,
  );
}

export async function getLargeDataFromRedis(keyBase: string): Promise<any> {
  const metadataStr = await redis.get(`${keyBase}:metadata`);
  if (!metadataStr) return null;
  
  const { chunks } = JSON.parse(metadataStr);
  let serializedData = '';

  for (let i = 0; i < chunks; i++) {
      const chunkKey = `${keyBase}:chunk:${i}`;
      const dataChunk = await redis.get(chunkKey);
      serializedData += dataChunk;
  }

  return JSON.parse(serializedData);
}