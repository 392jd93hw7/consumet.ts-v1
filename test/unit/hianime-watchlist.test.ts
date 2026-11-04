import type { AxiosAdapter } from 'axios';

import Hianime from '../../src/providers/anime/hianime';
import { WatchListType } from '../../src/models';

const createAdapter = (requestUrls: string[]): AxiosAdapter => async config => {
  const url = config.url ?? '';
  requestUrls.push(url);

  return {
    data: url.includes('/ajax/login-state') ? { is_login: true } : '<html><body></body></html>',
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  };
};

describe('Hianime.fetchWatchList', () => {
  it.each([
    [WatchListType.WATCHING, 1],
    [WatchListType.ONHOLD, 2],
    [WatchListType.PLAN_TO_WATCH, 3],
    [WatchListType.DROPPED, 4],
    [WatchListType.COMPLETED, 5],
  ])('maps %s to upstream type %i', async (listType, expectedType) => {
    const requestUrls: string[] = [];
    const hianime = new Hianime(undefined, createAdapter(requestUrls));

    await hianime.fetchWatchList('test-session', 2, listType);

    const watchListUrl = requestUrls.find(url => url.includes('/user/watch-list'));
    expect(watchListUrl).toContain(`page=2&type=${expectedType}`);
  });

  it('does not add a type filter when no list category is selected', async () => {
    const requestUrls: string[] = [];
    const hianime = new Hianime(undefined, createAdapter(requestUrls));

    await hianime.fetchWatchList('test-session');

    const watchListUrl = requestUrls.find(url => url.includes('/user/watch-list'));
    expect(watchListUrl).toContain('page=1');
    expect(watchListUrl).not.toContain('type=');
  });

  it('does not add a type filter for the NONE category', async () => {
    const requestUrls: string[] = [];
    const hianime = new Hianime(undefined, createAdapter(requestUrls));

    await hianime.fetchWatchList('test-session', 1, WatchListType.NONE);

    const watchListUrl = requestUrls.find(url => url.includes('/user/watch-list'));
    expect(watchListUrl).toContain('page=1');
    expect(watchListUrl).not.toContain('type=');
  });
});
