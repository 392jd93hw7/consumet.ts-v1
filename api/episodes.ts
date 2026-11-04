import { hianime } from './_lib/hianime';
import { createGetHandler, requiredQueryParam } from './_lib/http';

export default createGetHandler(async req => {
  const id = requiredQueryParam(req, 'id');
  const info = await hianime.fetchAnimeInfo(id);

  return {
    animeId: info.id,
    title: info.title,
    totalEpisodes: info.totalEpisodes ?? info.episodes?.length ?? 0,
    episodes: info.episodes ?? [],
  };
});
