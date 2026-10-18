const TTL_MS = 60 * 60 * 1000;

export interface StarStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/** `https://github.com/owner/repo` -> `owner/repo` (null when it is not a GitHub repository address). */
export function repoFromUrl(url: string): string | null {
  const match = /^https?:\/\/github\.com\/([^/\s]+)\/([^/\s#?]+?)(?:\.git)?\/?$/.exec(url.trim());
  return match ? `${match[1]}/${match[2]}` : null;
}

/** 604 -> "604", 1250 -> "1.2k", 15300 -> "15k". */
export function formatStars(count: number): string {
  if (!Number.isFinite(count) || count < 0) return '';
  if (count < 1000) return String(Math.floor(count));
  const thousands = count / 1000;
  return `${thousands < 10 ? Math.floor(thousands * 10) / 10 : Math.floor(thousands)}k`;
}

function read(storage: StarStorage, key: string): {count: number; at: number} | null {
  try {
    const raw = storage.getItem(key);
    const value = raw ? JSON.parse(raw) : null;
    return value && Number.isFinite(value.count) && Number.isFinite(value.at) ? value : null;
  } catch {
    return null;
  }
}

/** The star count of a repository, cached for an hour; a failed request falls back to the last known count. */
export async function fetchStars(
  repo: string,
  storage: StarStorage,
  now: number = Date.now(),
  request: typeof fetch = fetch,
): Promise<number | null> {
  const key = `ngmd-stars:${repo}`;
  const cached = read(storage, key);
  if (cached && now - cached.at < TTL_MS) return cached.count;
  try {
    const response = await request(`https://api.github.com/repos/${repo}`, {
      headers: {Accept: 'application/vnd.github+json'},
    });
    if (!response.ok) return cached?.count ?? null;
    const {stargazers_count: count} = await response.json();
    if (!Number.isFinite(count)) return cached?.count ?? null;
    try {
      storage.setItem(key, JSON.stringify({count, at: now}));
    } catch {
      /* storage unavailable: the count is still shown */
    }
    return count;
  } catch {
    return cached?.count ?? null;
  }
}
