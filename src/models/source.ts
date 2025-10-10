export type SourceType = 'rss' | 'twitter' | 'github' | 'web';

export interface Source {
  id: string;
  name: string;
  url: string;
  type: SourceType;
  active: boolean;
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
  fetchIntervalMinutes?: number;
  etag?: string | null;
  lastFetchedAt?: string | null; // ISO date string
}

function isValidUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function generateId(): string {
  // deterministic 8-char base36 id
  const rand = Math.floor(Math.random() * Math.pow(36, 8));
  return 'src_' + rand.toString(36).padStart(8, '0').slice(0, 8);
}

export function createSource(input: Omit<Source, 'id' | 'createdAt' | 'updatedAt'>): Source {
  if (!input.name || input.name.trim().length === 0) {
    throw new Error('name is required');
  }
  if (!isValidUrl(input.url)) {
    throw new Error('url must be http/https');
  }
  const now = new Date().toISOString();
  return {
    id: generateId(),
    name: input.name,
    url: input.url,
    type: input.type,
    active: input.active,
    fetchIntervalMinutes: input.fetchIntervalMinutes ?? 60,
    etag: input.etag ?? null,
    lastFetchedAt: input.lastFetchedAt ?? null,
    createdAt: now,
    updatedAt: undefined,
  };
}
