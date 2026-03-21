import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { resolvePreviewAssetPath } from '../../server/preview-assets.js';

const distDir = path.join(path.sep, 'repo', 'dist');

test('resolvePreviewAssetPath maps the root request to dist/index.html', () => {
  const assetPath = resolvePreviewAssetPath({
    distDir,
    requestPath: '/'
  });

  assert.equal(assetPath, path.join(distDir, 'index.html'));
});

test('resolvePreviewAssetPath falls back to index.html for nested deck routes', () => {
  const assetPath = resolvePreviewAssetPath({
    distDir,
    requestPath: '/slides/live-demo'
  });

  assert.equal(assetPath, path.join(distDir, 'index.html'));
});

test('resolvePreviewAssetPath keeps asset-like requests under dist', () => {
  const requestPath = '/assets/app.js';
  const assetPath = resolvePreviewAssetPath({
    distDir,
    requestPath
  });

  assert.equal(assetPath, path.resolve(distDir, `.${requestPath}`));
});

test('resolvePreviewAssetPath rejects traversal outside the dist directory', () => {
  assert.throws(() => resolvePreviewAssetPath({
    distDir,
    requestPath: '/../secrets.txt'
  }), /outside the dist directory/);
});
