import type { DiscoverySource } from './types';

const USER_AGENT = 'DAP Database Discovery Watch (+https://github.com/jreqtech/dap-database)';

export async function fetchSource(source: DiscoverySource, timeoutMs = 15_000): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(source.url, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}
