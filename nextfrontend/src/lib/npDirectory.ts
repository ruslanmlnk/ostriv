import zlib from 'node:zlib';

const CDN_VERSIONS = 'https://api.novapost.com/divisions/versions';

type Settlement = { id: number; name: string };

let cache: {
  versionUnix: number;
  settlements: Settlement[];
  loadedAt: number;
} | null = null;

function uniqSettlements(divisions: any[]): Settlement[] {
  const m = new Map<number, string>();
  for (const d of divisions) {
    const s = d?.settlement;
    if (typeof s?.id === 'number' && typeof s?.name === 'string') {
      m.set(s.id, s.name);
    }
  }
  return Array.from(m.entries()).map(([id, name]) => ({ id, name }));
}

export async function loadSettlementsUA(): Promise<Settlement[]> {
  const now = Date.now();
  if (cache && now - cache.loadedAt < 12 * 60 * 60 * 1000) return cache.settlements;

  const versionsRes = await fetch(CDN_VERSIONS, {
    headers: { 'Accept-Language': 'uk' },
    cache: 'no-store',
  });
  const versions = await versionsRes.json();

  const baseUnix = versions?.base_version?.unix_time;
  const baseUrl = versions?.base_version?.url;

  if (!baseUnix || !baseUrl) throw new Error('No base_version in divisions/versions');

  if (cache && cache.versionUnix === baseUnix) {
    cache.loadedAt = now;
    return cache.settlements;
  }

  const gzRes = await fetch(baseUrl, { cache: 'no-store' });
  const gzBuf = Buffer.from(await gzRes.arrayBuffer());

  const jsonBuf = zlib.gunzipSync(gzBuf);
  const divisions = JSON.parse(jsonBuf.toString('utf-8'));

  const settlements = uniqSettlements(Array.isArray(divisions) ? divisions : []);

  cache = { versionUnix: baseUnix, settlements, loadedAt: now };
  return settlements;
}
