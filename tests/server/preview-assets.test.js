import test from 'node:test';
import assert from 'node:assert/strict';
import { resolvePreviewAssetPath } from '../../server/preview-assets.js';

test('resolvePreviewAssetPath maps the root request to dist/index.html', () => {
  const assetPath = resolvePreviewAssetPath({
    distDir: '/repo/dist',
    requestPath: '/'
  });

  assert.equal(assetPath, '/repo/dist/index.html');
});

test('resolvePreviewAssetPath falls back to index.html for nested deck routes', () => {
  const assetPath = resolvePreviewAssetPath({
    distDir: '/repo/dist',
    requestPath: '/slides/live-demo'
  });

  assert.equal(assetPath, '/repo/dist/index.html');
});

test('resolvePreviewAssetPath keeps asset-like requests under dist', () => {
  const assetPath = resolvePreviewAssetPath({
    distDir: '/repo/dist',
    requestPath: '/assets/app.js'
  });

  assert.equal(assetPath, '/repo/dist/assets/app.js');
});

test('resolvePreviewAssetPath rejects traversal outside the dist directory', () => {
  assert.throws(() => resolvePreviewAssetPath({
    distDir: '/repo/dist',
    requestPath: '/../secrets.txt'
  }), /outside the dist directory/);
});
