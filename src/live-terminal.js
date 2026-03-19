const STATUS_LABELS = {
  connecting: 'Connecting to your local shell...',
  ready: 'Connected to a real shell. Type `codex` to begin.',
  closed: 'Session closed. Reopen the modal or retry to start a fresh shell.',
  error: 'Unable to connect to the local shell bridge. Check the dev server and retry.'
};

export function getTerminalWebSocketUrl(locationLike = window.location) {
  const protocol = locationLike.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${locationLike.host}/ws/live-terminal`;
}

export function getTerminalStatusLabel(status) {
  return STATUS_LABELS[status] ?? STATUS_LABELS.error;
}

async function loadTerminalDependencies() {
  const [{ Terminal }, { FitAddon }] = await Promise.all([
    import('@xterm/xterm'),
    import('@xterm/addon-fit')
  ]);

  return { Terminal, FitAddon };
}

export function createLiveTerminalController({
  modal,
  openers = [],
  closers = [],
  retryButton,
  statusNode,
  viewport
}) {
  if (!modal || !statusNode || !viewport) {
    return {
      close() {},
      isOpen() {
        return false;
      },
      open() {}
    };
  }

  let terminal = null;
  let fitAddon = null;
  let terminalCleanup = null;
  let socket = null;
  let terminalLoadPromise = null;
  let resizeFrame = 0;

  function isOpen() {
    return modal.classList.contains('is-open');
  }

  function setStatus(status) {
    statusNode.textContent = getTerminalStatusLabel(status);
    if (retryButton) {
      retryButton.hidden = status !== 'closed' && status !== 'error';
    }
  }

  function writeSystemLine(message) {
    if (!terminal) return;
    terminal.write(`\r\n${message}\r\n`);
  }

  function disposeTerminal() {
    terminalCleanup?.();
    terminalCleanup = null;
    terminal = null;
    fitAddon = null;
    viewport.textContent = '';
  }

  function closeSocket() {
    if (!socket) return;

    const currentSocket = socket;
    socket = null;

    if (currentSocket.readyState === WebSocket.OPEN || currentSocket.readyState === WebSocket.CONNECTING) {
      currentSocket.close();
    }
  }

  function syncTerminalSize() {
    if (!terminal || !fitAddon) return;

    fitAddon.fit();

    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'resize', cols: terminal.cols, rows: terminal.rows }));
    }
  }

  function requestResizeSync() {
    if (!isOpen()) return;
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(syncTerminalSize);
  }

  async function createTerminal() {
    if (!terminalLoadPromise) {
      terminalLoadPromise = loadTerminalDependencies();
    }

    const { Terminal, FitAddon } = await terminalLoadPromise;

    viewport.textContent = '';

    terminal = new Terminal({
      convertEol: true,
      cursorBlink: true,
      fontFamily: 'IBM Plex Mono, SFMono-Regular, monospace',
      fontSize: 15,
      theme: {
        background: '#08111f',
        foreground: '#f4fbff',
        cursor: '#78f6ff',
        selectionBackground: 'rgba(120, 246, 255, 0.24)'
      }
    });

    fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.open(viewport);
    fitAddon.fit();
    terminal.focus();

    const dataSubscription = terminal.onData((data) => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'input', data }));
      }
    });

    terminalCleanup = () => dataSubscription.dispose();
  }

  async function connect() {
    setStatus('connecting');
    closeSocket();
    disposeTerminal();

    try {
      await createTerminal();
    } catch (error) {
      setStatus('error');
      viewport.textContent = 'Failed to load terminal UI.';
      console.error(error);
      return;
    }

    const nextSocket = new WebSocket(getTerminalWebSocketUrl(window.location));
    socket = nextSocket;

    nextSocket.addEventListener('open', () => {
      if (socket !== nextSocket) return;
      setStatus('ready');
      syncTerminalSize();
    });

    nextSocket.addEventListener('message', (event) => {
      if (socket !== nextSocket || !terminal) return;

      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'output' && typeof payload.data === 'string') {
          terminal.write(payload.data);
        }
        if (payload.type === 'status' && typeof payload.status === 'string') {
          setStatus(payload.status);
        }
        return;
      } catch {
        terminal.write(String(event.data));
      }
    });

    nextSocket.addEventListener('close', () => {
      if (socket !== nextSocket) return;
      socket = null;
      if (!isOpen()) return;
      setStatus('closed');
      writeSystemLine('[Shell session closed]');
    });

    nextSocket.addEventListener('error', () => {
      if (socket !== nextSocket) return;
      setStatus('error');
      writeSystemLine('[Connection error]');
    });
  }

  function open() {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('has-live-terminal-modal');
    void connect();
  }

  function close() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('has-live-terminal-modal');
    window.cancelAnimationFrame(resizeFrame);
    closeSocket();
    disposeTerminal();
    setStatus('closed');
  }

  openers.forEach((opener) => {
    opener.addEventListener('click', open);
    opener.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });
  });

  closers.forEach((closer) => {
    closer.addEventListener('click', close);
  });

  retryButton?.addEventListener('click', () => {
    void connect();
  });

  window.addEventListener('resize', requestResizeSync);

  return { close, isOpen, open };
}
