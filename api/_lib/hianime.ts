import Hianime from '../../src/providers/anime/hianime';
import { StreamingServers, SubOrSub } from '../../src/models';
import { ApiError, ApiRequest, queryParam } from './http';

export const hianime = new Hianime();

export function getLanguage(req: ApiRequest, allowBoth: boolean = false): SubOrSub {
  const language = (queryParam(req, 'subOrDub', 'type') ?? 'sub').toLowerCase();

  if (language === 'sub') return SubOrSub.SUB;
  if (language === 'dub') return SubOrSub.DUB;
  if (allowBoth && language === 'both') return SubOrSub.BOTH;

  throw new ApiError(allowBoth ? 'subOrDub must be sub, dub, or both.' : 'subOrDub must be sub or dub.');
}

export function getStreamingServer(req: ApiRequest): StreamingServers {
  const server = (queryParam(req, 'server') ?? 'vidcloud').toLowerCase();

  const servers: Record<string, StreamingServers> = {
    vidcloud: StreamingServers.VidCloud,
    vidstreaming: StreamingServers.VidStreaming,
    streamsb: StreamingServers.StreamSB,
    streamtape: StreamingServers.StreamTape,
  };

  const selected = servers[server];
  if (!selected) {
    throw new ApiError('server must be vidcloud, vidstreaming, streamsb, or streamtape.');
  }
  return selected;
}
