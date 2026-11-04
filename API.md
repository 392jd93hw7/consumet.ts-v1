# consumet.ts Vercel REST API

The Vercel deployment exposes the Hianime anime provider through serverless HTTP functions. The API does not re-enable Hianime in the library's public provider registry.

Base URL: the Vercel deployment URL.

## Response format

Successful requests return:

```json
{
  "success": true,
  "data": {}
}
```

Errors return `success: false`, an error message, and an appropriate HTTP status. Responses include permissive CORS headers for browser and mobile clients. Only GET and OPTIONS are accepted.

## Endpoints

| Method | Endpoint | Required query | Purpose |
| --- | --- | --- | --- |
| GET | `/api/health` | — | API status and route list |
| GET | `/api/search` | `q` (or `query`) | Search anime; optional `page` |
| GET | `/api/info` | `id` | Full anime information |
| GET | `/api/episodes` | `id` | Episode count and episode list |
| GET | `/api/servers` | `id` (or `episodeId`) | Available episode servers; optional `subOrDub=sub\|dub\|both` |
| GET | `/api/watch` | `id` (or `episodeId`) | Extract sources; optional `server=vidcloud\|vidstreaming\|streamsb\|streamtape` and `subOrDub=sub\|dub` |

### Examples

```text
/api/search?q=solo-leveling&page=1
/api/info?id=solo-leveling
/api/episodes?id=solo-leveling
/api/servers?id=EPISODE_ID&subOrDub=sub
/api/watch?id=EPISODE_ID&server=vidcloud&subOrDub=sub
```

The `id` for the servers and watch endpoints is an episode ID returned in the `episodes` array, not the anime's top-level ID.

## Operational notes

- Upstream provider availability, rate limits, and anti-bot responses can affect results.
- Video source URLs and subtitle availability are controlled by the upstream provider and its extractors.
- The current public provider registry remains unchanged; these API routes instantiate Hianime directly.
- Do not assume that an extracted stream URL is a permanent URL. Resolve it when playback starts.
