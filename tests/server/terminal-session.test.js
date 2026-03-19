import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {
  buildPtyHostCommand,
  normalizePtyHostArgs,
  resolveShellCommand
} from '../../server/terminal-session.js';

test('resolveShellCommand prefers /bin/zsh -l on macOS when available', () => {
  const command = resolveShellCommand({
    platform: 'darwin',
    env: { SHELL: '/bin/bash' },
    existsSync: (targetPath) => targetPath === '/bin/zsh'
  });

  assert.deepEqual(command, {
    file: '/bin/zsh',
    args: ['-l']
  });
});

test('resolveShellCommand falls back to the configured shell when zsh is unavailable', () => {
  const command = resolveShellCommand({
    platform: 'linux',
    env: { SHELL: '/usr/local/bin/fish' },
    existsSync: (targetPath) => targetPath === '/usr/local/bin/fish'
  });

  assert.deepEqual(command, {
    file: '/usr/local/bin/fish',
    args: []
  });
});

test('resolveShellCommand falls back to bash login shell and then sh', () => {
  const bashCommand = resolveShellCommand({
    platform: 'linux',
    env: {},
    existsSync: (targetPath) => targetPath === '/bin/bash'
  });

  assert.deepEqual(bashCommand, {
    file: '/bin/bash',
    args: ['-l']
  });

  const shCommand = resolveShellCommand({
    platform: 'linux',
    env: {},
    existsSync: () => false
  });

  assert.deepEqual(shCommand, {
    file: '/bin/sh',
    args: []
  });
});

test('buildPtyHostCommand wires the Python bridge with shell and cwd arguments', () => {
  const repoRoot = '/repo/root';
  const command = buildPtyHostCommand({
    pythonExecutable: 'python3',
    rootDir: repoRoot,
    shellCommand: {
      file: '/bin/zsh',
      args: ['-l']
    },
    cols: 132,
    rows: 40
  });

  assert.equal(command.file, 'python3');
  assert.equal(command.args[0], path.join(repoRoot, 'server', 'pty-host.py'));
  assert.deepEqual(command.args.slice(1), [
    '--cwd',
    repoRoot,
    '--shell',
    '/bin/zsh',
    '--shell-arg',
    '-l',
    '--cols',
    '132',
    '--rows',
    '40'
  ]);
});

test('normalizePtyHostArgs preserves shell flags that start with a dash', () => {
  const normalizedArgs = normalizePtyHostArgs([
    '/repo/server/pty-host.py',
    '--cwd',
    '/repo',
    '--shell',
    '/bin/zsh',
    '--shell-arg',
    '-l',
    '--cols',
    '120',
    '--rows',
    '32'
  ]);

  assert.deepEqual(normalizedArgs, [
    '/repo/server/pty-host.py',
    '--cwd',
    '/repo',
    '--shell',
    '/bin/zsh',
    '--shell-arg=-l',
    '--cols',
    '120',
    '--rows',
    '32'
  ]);
});
