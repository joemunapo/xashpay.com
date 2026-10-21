import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../public/', import.meta.url));
const pages = ['index.html', 'app-privacy/index.html', 'delete-app-account/index.html'];

test('all pages have working local links, assets and anchors', async () => {
  for (const page of pages) {
    const html = await readFile(path.join(root, page), 'utf8');
    assert.match(html, /<html lang="en">/);
    assert.match(html, /name="viewport"/);
    assert.match(html, /support@xashpay\.com/);
    assert.match(html, /\/images\/xashpay-logo\.svg/);
    assert.doesNotMatch(html, /<script|href="#"/);
    for (const [, reference] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
      const url = new URL(reference, `https://xashpay.com/${page}`);
      if (url.origin !== 'https://xashpay.com') continue;
      let target = path.join(root, decodeURIComponent(url.pathname));
      assert.ok(target.startsWith(root));
      if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
      assert.ok((await stat(target)).isFile(), reference);
      if (url.hash) {
        assert.ok((await readFile(target, 'utf8')).includes(`id="${url.hash.slice(1)}"`), reference);
      }
    }
  }
});

test('policies explain cancellation and retained records', async () => {
  for (const page of pages.slice(1)) {
    const html = await readFile(path.join(root, page), 'utf8');
    assert.match(html, /com\.xashpay\.app/);
    assert.match(html, /30.day/);
    assert.match(html, /Signing back in/);
    assert.match(html, /financial/i);
    assert.match(html, /support@xashpay\.com/);
    assert.match(html, /PIN/);
  }
});

test('stylesheet fonts exist and include licences', async () => {
  const css = await readFile(path.join(root, 'css/site.css'), 'utf8');
  for (const [, asset] of css.matchAll(/url\('([^']+)'\)/g)) {
    assert.ok((await stat(path.join(root, asset))).isFile());
  }
  for (const licence of ['OFL-BricolageGrotesque.txt', 'OFL-PublicSans.txt']) {
    assert.match(await readFile(path.join(root, 'fonts', licence), 'utf8'), /SIL OPEN FONT LICENSE/);
  }
});
