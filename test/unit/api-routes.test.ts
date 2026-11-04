import type { ApiRequest, ApiResponse } from '../../api/_lib/http';
import { ApiError, createGetHandler } from '../../api/_lib/http';
import health from '../../api/health';
import search from '../../api/search';

interface ResponseState {
  statusCode: number;
  body?: unknown;
  headers: Record<string, string>;
  ended: boolean;
}

function createResponse(): { response: ApiResponse; state: ResponseState } {
  const state: ResponseState = {
    statusCode: 200,
    headers: {},
    ended: false,
  };

  const response: ApiResponse = {
    setHeader(name, value) {
      state.headers[name] = value;
    },
    status(code) {
      state.statusCode = code;
      return response;
    },
    json(body) {
      state.body = body;
    },
    end() {
      state.ended = true;
    },
  };

  return { response, state };
}

describe('Vercel API HTTP helpers', () => {
  it('returns a consistent JSON response for GET requests', async () => {
    const handler = createGetHandler(async () => ({ status: 'ok' }));
    const { response, state } = createResponse();

    await handler({ method: 'GET' }, response);

    expect(state.statusCode).toBe(200);
    expect(state.body).toEqual({ success: true, data: { status: 'ok' } });
    expect(state.headers['Access-Control-Allow-Origin']).toBe('*');
    expect(state.headers['Cache-Control']).toBe('no-store');
  });

  it('answers CORS preflight requests without running the action', async () => {
    const action = jest.fn().mockResolvedValue({ status: 'ok' });
    const handler = createGetHandler(action);
    const { response, state } = createResponse();

    await handler({ method: 'OPTIONS' }, response);

    expect(state.statusCode).toBe(204);
    expect(state.ended).toBe(true);
    expect(action).not.toHaveBeenCalled();
  });

  it('rejects methods other than GET and OPTIONS', async () => {
    const handler = createGetHandler(async () => ({ status: 'ok' }));
    const { response, state } = createResponse();

    await handler({ method: 'POST' }, response);

    expect(state.statusCode).toBe(405);
    expect(state.body).toEqual({
      success: false,
      error: 'Method not allowed. Use GET.',
    });
    expect(state.headers.Allow).toBe('GET, OPTIONS');
  });

  it('returns the status code from an ApiError', async () => {
    const handler = createGetHandler(async () => {
      throw new ApiError('Invalid input', 422);
    });
    const { response, state } = createResponse();

    await handler({ method: 'GET' }, response);

    expect(state.statusCode).toBe(422);
    expect(state.body).toEqual({ success: false, error: 'Invalid input' });
  });
});

describe('Vercel API routes', () => {
  it('exposes health information without calling a scraper', async () => {
    const { response, state } = createResponse();

    await health({ method: 'GET' }, response);

    expect(state.statusCode).toBe(200);
    expect(state.body).toMatchObject({
      success: true,
      data: {
        status: 'ok',
        animeProvider: 'hianime',
      },
    });
  });

  it('returns a clear validation error when search query is missing', async () => {
    const { response, state } = createResponse();

    await search({ method: 'GET', query: {} } as ApiRequest, response);

    expect(state.statusCode).toBe(400);
    expect(state.body).toEqual({
      success: false,
      error: 'Missing required query parameter: q',
    });
  });
});
