import crypto from 'node:crypto';

const WEBSOCKET_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

export function createHandshakeAcceptValue(key) {
  return crypto.createHash('sha1').update(`${key}${WEBSOCKET_GUID}`).digest('base64');
}

export function encodeTextFrame(text) {
  const payload = Buffer.from(text);

  if (payload.length < 126) {
    return Buffer.concat([Buffer.from([0x81, payload.length]), payload]);
  }

  if (payload.length < 65536) {
    const header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 126;
    header.writeUInt16BE(payload.length, 2);
    return Buffer.concat([header, payload]);
  }

  const header = Buffer.alloc(10);
  header[0] = 0x81;
  header[1] = 127;
  header.writeBigUInt64BE(BigInt(payload.length), 2);
  return Buffer.concat([header, payload]);
}

export function decodeFrames(buffer) {
  const frames = [];
  let offset = 0;

  while (offset + 2 <= buffer.length) {
    const firstByte = buffer[offset];
    const secondByte = buffer[offset + 1];
    const isMasked = (secondByte & 0x80) !== 0;
    let payloadLength = secondByte & 0x7f;
    let headerLength = 2;

    if (payloadLength === 126) {
      if (offset + 4 > buffer.length) break;
      payloadLength = buffer.readUInt16BE(offset + 2);
      headerLength = 4;
    } else if (payloadLength === 127) {
      if (offset + 10 > buffer.length) break;
      payloadLength = Number(buffer.readBigUInt64BE(offset + 2));
      headerLength = 10;
    }

    const maskLength = isMasked ? 4 : 0;
    const frameLength = headerLength + maskLength + payloadLength;

    if (offset + frameLength > buffer.length) break;

    const payloadOffset = offset + headerLength + maskLength;
    const payload = Buffer.from(buffer.subarray(payloadOffset, payloadOffset + payloadLength));

    if (isMasked) {
      const mask = buffer.subarray(offset + headerLength, offset + headerLength + 4);
      for (let index = 0; index < payload.length; index += 1) {
        payload[index] ^= mask[index % 4];
      }
    }

    frames.push({
      fin: (firstByte & 0x80) !== 0,
      opcode: firstByte & 0x0f,
      payload
    });

    offset += frameLength;
  }

  return {
    frames,
    remainder: buffer.subarray(offset)
  };
}

export function parseClientMessage(rawMessage) {
  const message = JSON.parse(rawMessage);

  if (message.type === 'input') {
    if (typeof message.data !== 'string') {
      throw new Error('Terminal input messages require a string payload.');
    }

    return { type: 'input', data: message.data };
  }

  if (message.type === 'resize') {
    if (!Number.isInteger(message.cols) || !Number.isInteger(message.rows) || message.cols < 1 || message.rows < 1) {
      throw new Error('Terminal resize messages require positive integers for cols and rows.');
    }

    return { type: 'resize', cols: message.cols, rows: message.rows };
  }

  if (message.type === 'shutdown') {
    return { type: 'shutdown' };
  }

  throw new Error(`Unsupported message type: ${message.type}`);
}
