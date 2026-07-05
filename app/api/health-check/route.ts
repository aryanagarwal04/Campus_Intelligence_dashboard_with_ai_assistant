import { HEALTH_URLS } from '@/lib/gemini';

export const runtime = 'nodejs';
export const maxDuration = 15;

async function pingService(
  key: string,
  config: { label: string; icon: string; url: string }
): Promise<{
  service: string;
  label: string;
  icon: string;
  status: 'online' | 'offline';
  responseTime: number;
  lastChecked: string;
  error?: string;
}> {
  const start = Date.now();
  try {
    const res = await fetch(config.url, {
      signal: AbortSignal.timeout(5000),
      headers: { 'Content-Type': 'application/json' },
    });

    const responseTime = Date.now() - start;

    if (!res.ok) {
      return {
        service: key,
        label: config.label,
        icon: config.icon,
        status: 'offline',
        responseTime,
        lastChecked: new Date().toISOString(),
        error: `HTTP ${res.status}`,
      };
    }

    return {
      service: key,
      label: config.label,
      icon: config.icon,
      status: 'online',
      responseTime,
      lastChecked: new Date().toISOString(),
    };
  } catch (err: unknown) {
    const responseTime = Date.now() - start;
    const message = err instanceof Error ? err.message : 'Connection failed';
    return {
      service: key,
      label: config.label,
      icon: config.icon,
      status: 'offline',
      responseTime,
      lastChecked: new Date().toISOString(),
      error: message,
    };
  }
}

export async function GET() {
  const results = await Promise.all(
    Object.entries(HEALTH_URLS).map(([key, config]) => pingService(key, config))
  );

  const allOperational = results.every((r) => r.status === 'online');

  return Response.json({
    services: results,
    allOperational,
    checkedAt: new Date().toISOString(),
  });
}
