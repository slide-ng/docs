import {fetchStars, formatStars, repoFromUrl, type StarStorage} from './github-stars';

function memory(): StarStorage & {data: Record<string, string>} {
  const data: Record<string, string> = {};
  return {data, getItem: (k) => data[k] ?? null, setItem: (k, v) => void (data[k] = v)};
}

const reply = (body: unknown, ok = true) =>
  (() => Promise.resolve({ok, json: () => Promise.resolve(body)})) as unknown as typeof fetch;

describe('repoFromUrl', () => {
  it('reads owner and repository from a GitHub address', () => {
    expect(repoFromUrl('https://github.com/slide-ng/slide.ng')).toBe('slide-ng/slide.ng');
    expect(repoFromUrl('https://github.com/slide-ng/docs.git')).toBe('slide-ng/docs');
    expect(repoFromUrl('https://example.com/slide-ng/docs')).toBeNull();
  });
});

describe('formatStars', () => {
  it('shortens large counts', () => {
    expect(formatStars(604)).toBe('604');
    expect(formatStars(1250)).toBe('1.2k');
    expect(formatStars(15300)).toBe('15k');
    expect(formatStars(-1)).toBe('');
  });
});

describe('fetchStars', () => {
  it('fetches and caches the count for an hour', async () => {
    const storage = memory();
    expect(await fetchStars('a/b', storage, 1000, reply({stargazers_count: 604}))).toBe(604);
    const fail = (() => Promise.reject(new Error('offline'))) as unknown as typeof fetch;
    expect(await fetchStars('a/b', storage, 1000 + 60_000, fail)).toBe(604);
  });

  it('falls back to the last known count when the request fails', async () => {
    const storage = memory();
    await fetchStars('a/b', storage, 0, reply({stargazers_count: 7}));
    const later = 2 * 60 * 60 * 1000;
    expect(await fetchStars('a/b', storage, later, reply({}, false))).toBe(7);
  });

  it('returns null with nothing cached and a failed request', async () => {
    expect(await fetchStars('a/b', memory(), 0, reply({}, false))).toBeNull();
  });
});
