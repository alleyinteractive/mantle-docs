import type { Config, Context } from '@netlify/edge-functions';

function acceptQuality(accept: string, mediaType: string): number {
  if (!accept) return 0;
  const [mainType] = mediaType.split('/');
  let bestSpecificity = 0;
  let quality = 0;

  for (const raw of accept.split(',')) {
    const parts = raw.trim().split(';').map((s) => s.trim());
    const type = parts.shift()?.toLowerCase();
    if (!type) continue;

    let specificity = 0;
    if (type === mediaType) specificity = 3;
    else if (type === `${mainType}/*`) specificity = 2;
    else if (type === '*/*') specificity = 1;
    else continue;

    if (specificity < bestSpecificity) continue;

    let q = 1;
    for (const p of parts) {
      const [k, v] = p.split('=').map((s) => s.trim());
      if (k === 'q') {
        const n = parseFloat(v);
        if (!Number.isNaN(n)) q = n;
      }
    }

    if (specificity > bestSpecificity || q > quality) {
      bestSpecificity = specificity;
      quality = q;
    }
  }
  return quality;
}

function withVary(response: Response): Response {
  response.headers.append('Vary', 'Accept');
  return response;
}

export default async (request: Request, context: Context): Promise<Response> => {
  const url = new URL(request.url);

  if (/\.[a-z0-9]+$/i.test(url.pathname)) {
    return withVary(await context.next());
  }

  const accept = request.headers.get('accept') ?? '';
  const htmlQ = acceptQuality(accept, 'text/html');
  const plainQ = acceptQuality(accept, 'text/plain');
  const markdownQ = acceptQuality(accept, 'text/markdown');

  if (Math.max(plainQ, markdownQ) <= htmlQ) {
    return withVary(await context.next());
  }

  const mdUrl = new URL(url);
  mdUrl.pathname = `${url.pathname.replace(/\/$/, '')}.md`;

  try {
    const mdResponse = await fetch(new Request(mdUrl.toString(), {
      method: request.method,
      headers: request.headers,
      redirect: 'manual',
    }));

    if (mdResponse.ok) {
      const headers = new Headers(mdResponse.headers);
      headers.append('Vary', 'Accept');
      return new Response(mdResponse.body, {
        status: mdResponse.status,
        statusText: mdResponse.statusText,
        headers,
      });
    }
  } catch {
    // fall through to original
  }

  return withVary(await context.next());
};

export const config: Config = {
  path: '/*',
  cache: 'manual',
};
