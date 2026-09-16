import 'dotenv/config';
import express from 'express';
import fetch from 'node-fetch';
import { SocksProxyAgent } from 'socks-proxy-agent';

const {
  PORT = 13001,
  SOCKS_PROXY_URL = 'socks5://127.0.0.1:8888',
} = process.env;

const proxyUrl = SOCKS_PROXY_URL.replace(/^socks5:\/\//i, 'socks5h://');
const proxyAgent = new SocksProxyAgent(proxyUrl);
const app = express();

app.use(express.json({ limit: '2mb' }));
app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/v1', async (req, res) => {
  const upstreamHeaders = {
    'content-type': req.get('content-type') || 'application/json',
  };
  const authorization = req.get('authorization');
  if (authorization) upstreamHeaders.authorization = authorization;
  const httpReferer = req.get('http-referer');
  if (httpReferer) upstreamHeaders['http-referer'] = httpReferer;
  const xTitle = req.get('x-title');
  if (xTitle) upstreamHeaders['x-title'] = xTitle;

  try {
    const upstream = await fetch(`https://openrouter.ai/api/v1${req.originalUrl.slice('/api/v1'.length)}`, {
      method: req.method,
      headers: upstreamHeaders,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body),
      agent: proxyAgent,
    });

    res.status(upstream.status);
    const contentType = upstream.headers.get('content-type');
    if (contentType) res.set('content-type', contentType);
    return res.send(Buffer.from(await upstream.arrayBuffer()));
  } catch (error) {
    console.error('[OpenRouter relay] Upstream request failed:', error.message);
    return res.status(502).json({ error: { message: 'OpenRouter upstream is unavailable.' } });
  }
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`[OpenRouter relay] Listening on 127.0.0.1:${PORT}`);
});
