import { hianime } from './_lib/hianime';
import { ApiError, createGetHandler, queryParam } from './_lib/http';

export default createGetHandler(async req => {
  const query = queryParam(req, 'q', 'query');
  if (!query) throw new ApiError('Missing required query parameter: q');

  const rawPage = queryParam(req, 'page') ?? '1';
  const page = Number(rawPage);
  if (!Number.isInteger(page) || page < 1) {
    throw new ApiError('page must be a positive integer.');
  }

  return hianime.search(query, page);
});
