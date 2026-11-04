import GetComics from '../../src/providers/comics/getComics';

jest.setTimeout(120000);

const comics = new GetComics();

test('GetComics returns the correct page and is not empty', async () => {
  const data = await comics.search('adam', 2);
  expect(data.hasNextPage).toEqual(true);
});
