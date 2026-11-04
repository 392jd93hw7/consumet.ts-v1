import {
  ANIME,
  BOOKS,
  COMICS,
  LIGHT_NOVELS,
  MANGA,
  MOVIES,
  META,
  NEWS,
  PROVIDERS_LIST,
} from '../../src';

type ProviderConstructor = new () => {
  toString: {
    classPath: string;
  };
};

type ProviderInstance = {
  toString: {
    classPath: string;
  };
};

const categories: Array<{
  name: string;
  exports: object;
  registry: ProviderInstance[];
}> = [
  { name: 'ANIME', exports: ANIME, registry: PROVIDERS_LIST.ANIME },
  { name: 'BOOKS', exports: BOOKS, registry: PROVIDERS_LIST.BOOKS },
  { name: 'COMICS', exports: COMICS, registry: PROVIDERS_LIST.COMICS },
  { name: 'LIGHT_NOVELS', exports: LIGHT_NOVELS, registry: PROVIDERS_LIST.LIGHT_NOVELS },
  { name: 'MANGA', exports: MANGA, registry: PROVIDERS_LIST.MANGA },
  { name: 'MOVIES', exports: MOVIES, registry: PROVIDERS_LIST.MOVIES },
  { name: 'META', exports: META, registry: PROVIDERS_LIST.META },
  { name: 'NEWS', exports: NEWS, registry: PROVIDERS_LIST.NEWS },
];

describe('public provider API', () => {
  test.each(categories)('$name exports match the provider registry', ({ exports, registry }) => {
    const exportedClassPaths = Object.values(exports)
      .map(Provider => new (Provider as ProviderConstructor)().toString.classPath)
      .sort();

    const registeredClassPaths = registry
      .map(provider => provider.toString.classPath)
      .sort();

    expect(registeredClassPaths).toEqual(exportedClassPaths);
  });
});
