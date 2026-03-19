import test from 'node:test';
import assert from 'node:assert/strict';
import { getTerminalStatusLabel, getTerminalWebSocketUrl } from '../src/live-terminal.js';

test('getTerminalWebSocketUrl uses ws for http pages', () => {
  const url = getTerminalWebSocketUrl({
    protocol: 'http:',
    host: 'localhost:4173'
  });

  assert.equal(url, 'ws://localhost:4173/ws/live-terminal');
});

test('getTerminalWebSocketUrl uses wss for https pages', () => {
  const url = getTerminalWebSocketUrl({
    protocol: 'https:',
    host: 'demo.example.com'
  });

  assert.equal(url, 'wss://demo.example.com/ws/live-terminal');
});

test('getTerminalStatusLabel returns presenter guidance for open sessions', () => {
  assert.equal(getTerminalStatusLabel('ready'), 'Connected to a real shell. Type `codex` to begin.');
  assert.equal(getTerminalStatusLabel('connecting'), 'Connecting to your local shell...');
  assert.equal(getTerminalStatusLabel('closed'), 'Session closed. Reopen the modal or retry to start a fresh shell.');
});
