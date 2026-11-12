'use strict';

const firmwareFile = document.getElementById('firmware-file');
const flash = document.getElementById('flash-firmware');
const status = document.getElementById('device-status');
const supported = window.isSecureContext && typeof navigator.requestMIDIAccess === 'function';

function refreshFirmware() {
  flash.disabled = !supported || !firmwareFile.files.length;
  status.textContent = supported ? '' : 'Open this page in Chrome or Edge for USB MIDI flashing.';
}

firmwareFile.addEventListener('change', refreshFirmware);
flash.addEventListener('click', async () => {
  const file = firmwareFile.files[0];
  if (!file || flash.disabled) return;
  flash.disabled = true;
  firmwareFile.disabled = true;
  let url;
  try {
    if (!file.name.toLowerCase().endsWith('.syx') || file.size < 256 || file.size > 2600000) {
      throw new Error('Choose a compiled Redux .syx file.');
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (bytes[0] !== 240 || bytes[1] !== 0 || bytes[2] !== 32 || bytes[3] !== 60 || bytes.at(-1) !== 247) {
      throw new Error('The file does not have an Elektron SysEx envelope.');
    }
    const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
    const sha256 = Array.from(digest, b => b.toString(16).padStart(2, '0')).join('');
    document.getElementById('custom-hash').textContent = sha256;
    url = URL.createObjectURL(file);
    await window.installReduxCustomFirmware({
      url, sha256, build: file.name, status, isCurrent: () => firmwareFile.files[0] === file,
    });
  } catch (error) {
    status.textContent = error.message;
  } finally {
    if (url) URL.revokeObjectURL(url);
    firmwareFile.disabled = false;
    flash.disabled = !supported || !firmwareFile.files.length;
  }
});
refreshFirmware();

