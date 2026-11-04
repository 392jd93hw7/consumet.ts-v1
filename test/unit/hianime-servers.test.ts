import type { AxiosAdapter } from 'axios';

import Hianime from '../../src/providers/anime/hianime';
import { StreamingServers, SubOrSub } from '../../src/models';

const serverHtml = `
  <div class="ps_-block ps_-block-sub servers-sub">
    <div class="ps__-list">
      <div class="server-item" data-server-id="1" data-id="rapidcloud-id">RapidCloud</div>
      <div class="server-item" data-server-id="4" data-id="vidstreaming-id">VidStreaming</div>
    </div>
  </div>
  <div class="ps_-block ps_-block-sub servers-dub">
    <div class="ps__-list">
      <div class="server-item" data-server-id="5" data-id="streamsb-id">StreamSB</div>
    </div>
  </div>
  <div class="ps_-block ps_-block-sub servers-raw">
    <div class="ps__-list">
      <div class="server-item" data-server-id="3" data-id="streamtape-id">StreamTape</div>
    </div>
  </div>
`;

const createAdapter = (html: string = serverHtml, failServerIds: string[] = []): AxiosAdapter =>
  async config => {
    if (config.url?.endsWith('/ajax/v2/episode/servers')) {
      return {
        data: { html },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }

    const requestUrl = new URL(config.url ?? 'https://hianime.to/');
    const serverId = requestUrl.searchParams.get('id') ?? '';

    if (failServerIds.includes(serverId)) {
      throw new Error(`Unable to resolve server ${serverId}`);
    }

    return {
      data: { link: `https://embed.example/${serverId}` },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  };

describe('Hianime.fetchEpisodeServers', () => {
  it('returns the available sub servers with resolved embed URLs', async () => {
    const hianime = new Hianime(undefined, createAdapter());

    const servers = await hianime.fetchEpisodeServers('overlord$episode$123');

    expect(servers).toEqual([
      { name: StreamingServers.VidCloud, url: 'https://embed.example/rapidcloud-id' },
      { name: StreamingServers.VidStreaming, url: 'https://embed.example/vidstreaming-id' },
    ]);
  });

  it('returns only dub servers when DUB is requested', async () => {
    const hianime = new Hianime(undefined, createAdapter());

    const servers = await hianime.fetchEpisodeServers('overlord$episode$123', SubOrSub.DUB);

    expect(servers).toEqual([
      { name: StreamingServers.StreamSB, url: 'https://embed.example/streamsb-id' },
    ]);
  });

  it('combines sub and dub servers when BOTH is requested', async () => {
    const hianime = new Hianime(undefined, createAdapter());

    const servers = await hianime.fetchEpisodeServers('overlord$episode$123', SubOrSub.BOTH);

    expect(servers).toHaveLength(3);
    expect(servers.map(server => server.name)).toEqual([
      StreamingServers.VidCloud,
      StreamingServers.VidStreaming,
      StreamingServers.StreamSB,
    ]);
  });

  it('falls back to raw servers when the requested language has none', async () => {
    const hianime = new Hianime(
      undefined,
      createAdapter('<div class="ps_-block ps_-block-sub servers-raw"><div class="ps__-list"><div class="server-item" data-server-id="3" data-id="streamtape-id">StreamTape</div></div></div>'),
    );

    const servers = await hianime.fetchEpisodeServers('https://hianime.to/watch/overlord?ep=123');

    expect(servers).toEqual([
      { name: StreamingServers.StreamTape, url: 'https://embed.example/streamtape-id' },
    ]);
  });

  it('keeps working when one server fails to resolve', async () => {
    const hianime = new Hianime(undefined, createAdapter(serverHtml, ['rapidcloud-id']));

    const servers = await hianime.fetchEpisodeServers('overlord$episode$123');

    expect(servers).toEqual([
      { name: StreamingServers.VidStreaming, url: 'https://embed.example/vidstreaming-id' },
    ]);
  });

  it('rejects episode IDs without an episode number', async () => {
    const hianime = new Hianime(undefined, createAdapter());

    await expect(hianime.fetchEpisodeServers('overlord')).rejects.toThrow('Invalid episode id');
  });
});
