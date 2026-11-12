(() => {
  const header = [0xf0, 0, 0x20, 0x3c, 0x10, 0];
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  function pack(body) {
    const wire = [...header];
    for (let offset = 0; offset < body.length; offset += 7) {
      const group = body.subarray(offset, offset + 7);
      let mask = 0;
      group.forEach((byte, i) => { mask |= (byte >> 7) << (6 - i); });
      wire.push(mask, ...group.map(byte => byte & 127));
    }
    return [...wire, 0xf7];
  }

  function unpack(wire) {
    if (wire.length < 8 || wire[wire.length - 1] !== 0xf7 ||
        !header.every((byte, i) => wire[i] === byte)) return [];
    const body = [];
    for (let offset = 6; offset < wire.length - 1; offset += 8) {
      for (let j = 1; j <= 7 && offset + j < wire.length - 1; j++) {
        body.push(wire[offset + j] | (((wire[offset] >> (7 - j)) & 1) << 7));
      }
    }
    return body;
  }

  function blockPayload(block, offset) {
    let crc = 0;
    for (const byte of block) {
      crc ^= byte;
      for (let bit = 0; bit < 8; bit++) {
        crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
      }
    }
    const payload = new Uint8Array(12 + block.length);
    const view = new DataView(payload.buffer);
    view.setUint32(0, ~crc);
    view.setUint32(4, block.length);
    view.setUint32(8, offset);
    payload.set(block, 12);
    return payload;
  }

  async function upload(bytes, input, output, build, status, isCurrent) {
    let sequence = 0;
    async function request(kind, payload = []) {
      await sleep(50);
      const seq = ++sequence;
      const body = Uint8Array.of(seq >> 8, seq & 255, 0, 0, kind, ...payload);
      let timer;
      let receive;
      try {
        return await new Promise((resolve, reject) => {
          receive = event => {
            const reply = unpack(event.data);
            if (reply[2] === seq >> 8 && reply[3] === (seq & 255) &&
                reply[4] === (kind | 128)) resolve(reply);
          };
          input.addEventListener('midimessage', receive);
          timer = setTimeout(() => reject(new Error('Device reply timed out.')), 10000);
          output.send(pack(body));
        });
      } finally {
        clearTimeout(timer);
        input.removeEventListener('midimessage', receive);
      }
    }

    const identity = await request(1);
    const version = await request(2);
    if (identity[5] !== 27 || !String.fromCharCode(...version.slice(10)).startsWith('NEXT V')) {
      throw new Error('An existing Redux installation is required for USB updating.');
    }
    const runtime = await request(5);
    if (runtime.length !== 37) throw new Error('Redux did not report its playback state.');
    const state = new DataView(Uint8Array.from(runtime.slice(5)).buffer);
    if (state.getUint32(8) || state.getUint32(12) || state.getUint32(16) !== 3 || state.getUint32(20)) {
      throw new Error('Stop playback and wait for the Cycles to return to its normal screen.');
    }
    const usb = await request(0x67,[0,0]);
    if (usb.length !== 37 || new DataView(Uint8Array.from(usb.slice(5)).buffer).getUint32(4) !== 0) {
      throw new Error('Switch Settings → Device → USB Mode to MIDI ONLY and apply it.');
    }
    if (!isCurrent()) throw new Error('Selection changed. Build it before flashing.');
    if (!window.confirm('Install Redux ' + build + '? Save your edits and stop playback first. The Cycles will reboot.')) {
      status.textContent = 'Update cancelled.';
      return false;
    }
    const start = new Uint8Array(11);
    new DataView(start.buffer).setUint32(0, bytes.length, true);
    start.set([115, 121, 115, 101, 120, 0, 1], 4);
    if ((await request(0x50, start))[5] !== 0) throw new Error('The device rejected update start.');
    for (let offset = 0; offset < bytes.length; offset += 2048) {
      const block = bytes.subarray(offset, offset + 2048);
      const end = offset + block.length;
      const reply = await request(0x51, blockPayload(block, offset));
      if (reply.length !== 10 || reply[9] !== Number(end === bytes.length)) {
        throw new Error('Device rejected the block at byte ' + offset + '.');
      }
      status.textContent = 'Uploading ' + Math.floor(100 * end / bytes.length) + '%';
    }
    status.textContent = 'Upload acknowledged. Keep the Cycles powered on while it verifies, installs, and restarts.';
    return true;
  }

  window.installReduxCustomFirmware = async ({url, sha256, build, status, isCurrent}) => {
    let input;
    let output;
    try {
      status.textContent = 'Connecting to Redux…';
      const midi = await navigator.requestMIDIAccess({sysex: true});
      const connected = port => port.name === 'Supermodel Next' && port.state === 'connected';
      const inputs = [...midi.inputs.values()].filter(connected);
      const outputs = [...midi.outputs.values()].filter(connected);
      if (inputs.length !== 1 || outputs.length !== 1) {
        throw new Error('Connect one Cycles running Redux over USB MIDI.');
      }
      [input] = inputs;
      [output] = outputs;
      await Promise.all([input.open(), output.open()]);
      const response = await fetch(url, {cache: 'no-store'});
      if (!response.ok) throw new Error('Custom firmware download failed.');
      const bytes = new Uint8Array(await response.arrayBuffer());
      const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
      const actual = Array.from(digest, byte => byte.toString(16).padStart(2, '0')).join('');
      if (actual !== sha256) throw new Error('Custom firmware checksum mismatch.');
      return await upload(bytes, input, output, build, status, isCurrent);
    } finally {
      await Promise.allSettled([input?.close(), output?.close()]);
    }
  };
})();
