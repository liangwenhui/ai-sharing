import path from 'node:path';

export function resolvePreviewAssetPath({ distDir, requestPath }) {
  const normalizedRequestPath = decodeURIComponent(requestPath ?? '/');

  if (normalizedRequestPath === '/' || !path.extname(normalizedRequestPath)) {
    return path.join(distDir, 'index.html');
  }

  const resolvedPath = path.resolve(distDir, `.${normalizedRequestPath}`);
  const normalizedDistDir = path.resolve(distDir);

  if (resolvedPath !== normalizedDistDir && !resolvedPath.startsWith(`${normalizedDistDir}${path.sep}`)) {
    throw new Error('Requested asset resolves outside the dist directory.');
  }

  return resolvedPath;
}
