import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createHandshakeAcceptValue,
  decodeFrames,
  encodeTextFrame,
  parseClientMessage
} from '../../server/websocket-protocol.js';

function createClientTextFrame(text) {
  const payload = Buffer.from(text);
  const mask = Buffer.from([1, 2, 3, 4]);
  const frame = Buffer.alloc(2 + 4 + payload.length);

  frame[0] = 0x81;
  frame[1] = 0x80 | payload.length;
  mask.copy(frame, 2);

  for (let index = 0; index < payload.length; index += 1) {
    frame[index + 6] = payload[index] ^ mask[index % 4];
  }

  return frame;
}

test('decodeFrames unwraps a masked client text frame', () => {
  const text = JSON.stringify({ type: 'input', data: 'ls\n' });
  const { frames, remainder } = decodeFrames(createClientTextFrame(text));

  assert.equal(remainder.length, 0);
  assert.equal(frames.length, 1);
  assert.equal(frames[0].opcode, 0x1);
  assert.equal(frames[0].payload.toString('utf8'), text);
});

test('decodeFrames preserves incomplete frame data for the next read', () => {
  const frame = createClientTextFrame(JSON.stringify({ type: 'shutdown' }));
  const { frames, remainder } = decodeFrames(frame.subarray(0, 5));

  assert.equal(frames.length, 0);
  assert.equal(remainder.length, 5);
});

test('encodeTextFrame creates an unmasked server text frame', () => {
  const frame = encodeTextFrame('ready');

  assert.equal(frame[0], 0x81);
  assert.equal(frame[1], 5);
  assert.equal(frame.subarray(2).toString('utf8'), 'ready');
});

test('createHandshakeAcceptValue matches the websocket RFC example', () => {
  const acceptValue = createHandshakeAcceptValue('dGhlIHNhbXBsZSBub25jZQ==');

  assert.equal(acceptValue, 's3pPLMBiTxaQ9kYGzzhZRbK+xOo=');
});

test('parseClientMessage validates supported terminal commands', () => {
  assert.deepEqual(parseClientMessage('{"type":"input","data":"pwd\\n"}'), {
    type: 'input',
    data: 'pwd\n'
  });

  assert.deepEqual(parseClientMessage('{"type":"resize","cols":120,"rows":36}'), {
    type: 'resize',
    cols: 120,
    rows: 36
  });

  assert.deepEqual(parseClientMessage('{"type":"shutdown"}'), {
    type: 'shutdown'
  });
});

test('parseClientMessage rejects malformed terminal commands', () => {
  assert.throws(() => parseClientMessage('{"type":"resize","cols":0,"rows":20}'), /positive integers/);
  assert.throws(() => parseClientMessage('{"type":"input","data":1}'), /string payload/);
  assert.throws(() => parseClientMessage('{"type":"unknown"}'), /Unsupported message type/);
});
