export interface ApiRequest {
  method?: string;
  query?: Record<string, string | string[] | undefined>;
}

export interface ApiResponse {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  json(body: unknown): void;
  end(): void;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 400,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function queryParam(req: ApiRequest, ...names: string[]): string | undefined {
  for (const name of names) {
    const value = req.query?.[name];
    if (typeof value === 'string' && value.trim() !== '') return value.trim();
    if (Array.isArray(value) && typeof value[0] === 'string' && value[0].trim() !== '') {
      return value[0].trim();
    }
  }
  return undefined;
}

export function requiredQueryParam(req: ApiRequest, ...names: string[]): string {
  const value = queryParam(req, ...names);
  if (!value) {
    throw new ApiError(`Missing required query parameter: ${names[0]}`);
  }
  return value;
}

export function createGetHandler(
  action: (req: ApiRequest) => Promise<unknown>,
): (req: ApiRequest, res: ApiResponse) => Promise<void> {
  return async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.setHeader('Cache-Control', 'no-store');

    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }

    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET, OPTIONS');
      res.status(405).json({
        success: false,
        error: 'Method not allowed. Use GET.',
      });
      return;
    }

    try {
      const data = await action(req);
      res.status(200).json({ success: true, data });
    } catch (error) {
      const statusCode = error instanceof ApiError ? error.statusCode : 502;
      const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
      res.status(statusCode).json({ success: false, error: message });
    }
  };
}
