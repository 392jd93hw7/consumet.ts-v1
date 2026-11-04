import { getLanguage, hianime } from './_lib/hianime';
import { createGetHandler, requiredQueryParam } from './_lib/http';

export default createGetHandler(async req => {
  const episodeId = requiredQueryParam(req, 'id', 'episodeId');
  const subOrDub = getLanguage(req, true);
  const servers = await hianime.fetchEpisodeServers(episodeId, subOrDub);

  return {
    episodeId,
    subOrDub,
    servers,
  };
});
