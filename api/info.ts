import { hianime } from './_lib/hianime';
import { createGetHandler, requiredQueryParam } from './_lib/http';

export default createGetHandler(async req => {
  const id = requiredQueryParam(req, 'id');
  return hianime.fetchAnimeInfo(id);
});
