import { getLanguage, getStreamingServer, hianime } from './_lib/hianime';
import { createGetHandler, requiredQueryParam } from './_lib/http';

export default createGetHandler(async req => {
  const episodeId = requiredQueryParam(req, 'id', 'episodeId');
  const subOrDub = getLanguage(req);
  const server = getStreamingServer(req);
  const sources = await hianime.fetchEpisodeSources(episodeId, server, subOrDub);

  return {
    episodeId,
    server,
    subOrDub,
    ...sources,
  };
});
