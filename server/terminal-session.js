import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { spawn } from 'node:child_process';

function isLoginShell(shellPath) {
  return /(?:^|\/)(?:bash|zsh)$/.test(shellPath);
}

export function resolveShellCommand({
  platform = process.platform,
  env = process.env,
  existsSync = fs.existsSync
} = {}) {
  if (platform === 'darwin' && existsSync('/bin/zsh')) {
    return { file: '/bin/zsh', args: ['-l'] };
  }

  if (env.SHELL && existsSync(env.SHELL)) {
    return {
      file: env.SHELL,
      args: isLoginShell(env.SHELL) ? ['-l'] : []
    };
  }

  if (existsSync('/bin/bash')) {
    return { file: '/bin/bash', args: ['-l'] };
  }

  return { file: '/bin/sh', args: [] };
}

export function buildPtyHostCommand({
  pythonExecutable = 'python3',
  rootDir,
  shellCommand,
  cols = 120,
  rows = 32
}) {
  const args = [
    path.join(rootDir, 'server', 'pty-host.py'),
    '--cwd',
    rootDir,
    '--shell',
    shellCommand.file
  ];

  shellCommand.args.forEach((value) => {
    args.push('--shell-arg', value);
  });

  args.push('--cols', String(cols), '--rows', String(rows));

  return {
    file: pythonExecutable,
    args
  };
}

export function normalizePtyHostArgs(args = []) {
  const normalizedArgs = [];

  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === '--shell-arg' && typeof args[index + 1] === 'string') {
      normalizedArgs.push(`--shell-arg=${args[index + 1]}`);
      index += 1;
      continue;
    }

    normalizedArgs.push(args[index]);
  }

  return normalizedArgs;
}

function writeHostCommand(child, command) {
  if (!child.stdin.destroyed) {
    child.stdin.write(`${JSON.stringify(command)}\n`);
  }
}

export function createTerminalSession({ rootDir, cols = 120, rows = 32, pythonExecutable = 'python3' }) {
  const shellCommand = resolveShellCommand();
  const hostCommand = buildPtyHostCommand({
    pythonExecutable,
    rootDir,
    shellCommand,
    cols,
    rows
  });

  const child = spawn(hostCommand.file, normalizePtyHostArgs(hostCommand.args), {
    cwd: rootDir,
    stdio: ['pipe', 'pipe', 'pipe'],
    env: {
      ...process.env,
      TERM: process.env.TERM || 'xterm-256color'
    }
  });

  const outputListeners = new Set();
  const statusListeners = new Set();
  const closeListeners = new Set();

  const stdoutReader = readline.createInterface({ input: child.stdout });

  function emitOutput(data) {
    outputListeners.forEach((listener) => listener(data));
  }

  function emitStatus(status) {
    statusListeners.forEach((listener) => listener(status));
  }

  function emitClose(code) {
    closeListeners.forEach((listener) => listener(code));
  }

  stdoutReader.on('line', (line) => {
    if (!line) return;

    try {
      const message = JSON.parse(line);
      if (message.type === 'output' && typeof message.data === 'string') {
        emitOutput(message.data);
      } else if (message.type === 'status' && typeof message.status === 'string') {
        emitStatus(message.status);
      }
    } catch {
      emitOutput(`${line}\n`);
    }
  });

  child.stderr.on('data', (chunk) => {
    emitOutput(chunk.toString('utf8'));
  });

  child.on('close', (code) => {
    stdoutReader.close();
    emitStatus('closed');
    emitClose(code ?? 0);
  });

  child.on('error', (error) => {
    emitOutput(`\r\n[Bridge error] ${error.message}\r\n`);
    emitStatus('error');
  });

  return {
    close() {
      if (!child.killed) {
        writeHostCommand(child, { type: 'shutdown' });
        child.stdin.end();
        setTimeout(() => {
          if (!child.killed) {
            child.kill();
          }
        }, 250);
      }
    },
    onClose(listener) {
      closeListeners.add(listener);
      return () => closeListeners.delete(listener);
    },
    onOutput(listener) {
      outputListeners.add(listener);
      return () => outputListeners.delete(listener);
    },
    onStatus(listener) {
      statusListeners.add(listener);
      return () => statusListeners.delete(listener);
    },
    resize(nextCols, nextRows) {
      writeHostCommand(child, {
        type: 'resize',
        cols: nextCols,
        rows: nextRows
      });
    },
    sendInput(data) {
      writeHostCommand(child, { type: 'input', data });
    }
  };
}
