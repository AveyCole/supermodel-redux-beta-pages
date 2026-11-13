/* Browser upload for artifacts returned by a hosted Redux compiler. */
'use strict';

const status = document.getElementById('device-status');
const buildButton = document.getElementById('build-firmware');
const flashButton = document.getElementById('flash-firmware');
const download = document.getElementById('download-custom');
const hash = document.getElementById('custom-hash');
const browserMidi = window.isSecureContext && typeof navigator.requestMIDIAccess === 'function';
const compilerOrigin = 'https://supermodel-redux-beta.c4r3ful-cr34tur3.chatgpt.site';
let revision;
let ready;
let busy = false;

function selection() {
  return {configuration: configuration(), samples909: samplePayload909()};
}

async function api(path, body) {
  const res = await fetch(new URL(path, compilerOrigin), body ? {
    method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body),
  } : {cache: 'no-store'});
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Compiler request failed.');
  return data;
}

function updateActions() {
  const current = ready?.signature === JSON.stringify(selection());
  flashButton.disabled = busy || !current || !browserMidi;
  download.hidden = !current;
  hash.textContent = current ? ready.report.sha256 : '';
  buildButton.disabled = busy || !revision;
}

document.addEventListener('redux-config-change', updateActions);
buildButton.addEventListener('click', async () => {
  if (busy || !revision) return;
  if (!requiredSamples909()) {
    status.textContent = 'Add the WAV files for the selected 909 machines.';
    return;
  }
  const payload = selection();
  const signature = JSON.stringify(payload);
  ready = undefined;
  busy = true;
  updateActions();
  try {
    const job = await api('/api/build', payload);
    if (!/^[a-f0-9]{32}$/.test(job.id)) throw new Error('Invalid build ID.');
    status.textContent = 'Queued for GitHub Actions. This can take several minutes…';
    const expires = Date.now() + 45 * 60 * 1000;
    while (Date.now() < expires) {
      const current = await api('/api/jobs/' + job.id);
      if (current.state === 'failed') throw new Error(current.error || 'Firmware build failed.');
      if (current.state === 'ready') {
        const report = current.result;
        if (report.firmware_revision !== revision || !/^[a-f0-9]{64}$/.test(report.sha256)) {
          throw new Error('Unexpected firmware revision or checksum.');
        }
        const selected = payload.configuration;
        const same = key => {
          const actual = report.configuration[key];
          if (!Array.isArray(actual)) return false;
          return key === 'machines' ? JSON.stringify(actual) === JSON.stringify(selected[key]) :
            JSON.stringify([...actual].sort()) === JSON.stringify([...selected[key]].sort());
        };
        if (!['machines','features','effects'].every(same)) throw new Error('Firmware selection changed.');
        const url = new URL('/api/firmware/' + job.id, compilerOrigin).href;
        ready = {signature, report, url};
        download.href = url;
        status.textContent = browserMidi ? 'Firmware ready. Connect your Cycles over USB MIDI to flash.' :
          'Firmware ready. Download it or open this picker in Chrome or Edge to flash.';
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    throw new Error('Firmware build timed out.');
  } catch (error) {
    status.textContent = error.message;
  } finally {
    busy = false;
    updateActions();
  }
});

flashButton.addEventListener('click', async () => {
  if (flashButton.disabled || !ready) return;
  const chosen = ready;
  busy = true;
  updateActions();
  try {
    await window.installReduxCustomFirmware({
      url: chosen.url, sha256: chosen.report.sha256, build: revision, status,
      isCurrent: () => chosen.signature === JSON.stringify(selection()),
    });
  } catch (error) {
    status.textContent = error.message;
  } finally {
    busy = false;
    updateActions();
  }
});

api('/api/catalog').then(catalog => {
  revision = catalog.version;
  document.getElementById('build-message').textContent = 'Choose your modules and build your firmware.';
  updateActions();
}).catch(error => {
  status.textContent = error.message;
});

