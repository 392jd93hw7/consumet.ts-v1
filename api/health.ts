import { createGetHandler } from './_lib/http';

export default createGetHandler(async () => ({
  name: 'consumet.ts-v1',
  version: '1.8.8',
  status: 'ok',
  animeProvider: 'hianime',
  endpoints: [
    '/api/search?q=one-piece',
    '/api/info?id=one-piece',
    '/api/episodes?id=one-piece',
    '/api/servers?id=EPISODE_ID&subOrDub=sub',
    '/api/watch?id=EPISODE_ID&server=vidcloud&subOrDub=sub',
  ],
}));
