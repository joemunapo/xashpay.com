import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { request } from 'node:http';
import { app } from '../app.js';

let server;
let base;
before(async () => {
  server = app.listen(0);
  await new Promise(resolve => server.once('listening', resolve));
  base = `http://localhost:${server.address().port}`;
});
after(() => new Promise(resolve => server.close(resolve)));

test('home, privacy and deletion pages work without authentication', async () => {
  for (const [path, heading] of [
    ['/', 'Life, paid for.'],
    ['/app-privacy/', 'XashPay app privacy policy'],
    ['/delete-app-account/', 'Delete your XashPay account'],
  ]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.ok(html.includes(heading));
    assert.ok(html.includes('support@xashpay.com'));
    assert.ok(html.includes('/images/xashpay-logo.svg'));
    assert.match(response.headers.get('content-security-policy'), /frame-ancestors 'none'/);
  }
});

test('page links and brand assets are served with the correct content types', async () => {
  for (const [path, type] of [
    ['/css/site.css', 'text/css'],
    ['/images/xashpay-logo.svg', 'image/svg+xml'],
    ['/images/app-home.png', 'image/png'],
    ['/fonts/PublicSans-Regular.ttf', 'font/ttf'],
  ]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200);
    assert.ok(response.headers.get('content-type').includes(type));
    await response.arrayBuffer();
  }
  const response = await fetch(base + '/app-privacy?source=app', { redirect: 'manual' });
  assert.equal(response.status, 301);
  assert.equal(response.headers.get('location'), '/app-privacy/?source=app');
});

test('server does not expose repository files, API routes or escaped paths', async () => {
  for (const path of ['/server.js', '/package.json', '/.git/config', '/.env', '/api/v1/me', '/../package.json', '/%2e%2e/package.json', '/images/%2e%2e/%2e%2e/package.json']) {
    const status = await new Promise((resolve, reject) => {
      const req = request(base, { path }, response => {
        response.resume();
        resolve(response.statusCode);
      });
      req.on('error', reject);
      req.end();
    });
    assert.equal(status, 404, path);
  }
});

test('health check is public and posting to content is rejected', async () => {
  assert.equal((await fetch(base + '/up')).status, 200);
  assert.equal((await fetch(base + '/delete-app-account/', { method: 'POST' })).status, 404);
});
