import AnimeUnity from '../../src/providers/anime/animeunity';

jest.setTimeout(120000);

const animeunity = new AnimeUnity();

test('Search: returns a filled array of anime list', async () => {
  const data = await animeunity.search('Dandadan');
  expect(data.results).not.toEqual([]);
});

test('fetchAnimeInfo: returns a filled array of anime list', async () => {
  const data = await animeunity.fetchAnimeInfo('6723-dan-da-dan-2-ita');
  expect(data.episodes).not.toEqual([]);
});

test('fetchEpisodeSources: returns a filled array of anime list', async () => {
  const data = await animeunity.fetchEpisodeSources('6723-dan-da-dan-2-ita');
  expect(data.sources).not.toEqual([]);
});
