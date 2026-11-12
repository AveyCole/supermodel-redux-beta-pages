# Redux controls: current experimental workbench

V267 adds native Machine CC70 selection. V266 adds Note, Chance and Swing MIDI input controls. V265 adds Pitch and FX MIDI input controls. V264 retains V263 Slice controls, V262 Wizard modes, V261 stock FUNC choices,
V260 fine pitch, V259 quantize and V258 continuous master repeat. This guide
covers the recently qualified controls; the full parity checklist remains at
http://127.0.0.1:8899/parity.html.

## Sample Wizard

- **FUNC + MACHINES:** open the sample browser. Trig keys audition the highlighted
  file before confirming, including during playback. DATA chooses it; BACK leaves.
- **Hold SETTINGS + press MACHINES:** open the selected Wizard track's mode menu.
  Choose Forward, Loop, Slice or Granular with DATA and turn DATA to edit.
- **Granular:** synth controls read Pitch, Decay, Position, Size, Density and Spray.
  Grain Setup offers Window, Direction and Freeze.
- **Slice:** choose Slice Setup to set the slice count and keyboard bank. The
  sixteen trig keys play that bank outside grid recording and in Slice Setup.
  FUNC temporarily selects the next bank, wrapping after slices 49–64.
  BACK while editing the slice count restores its previous boundaries. UNDO CUTS
  restores the captured boundaries after committing the count edit.
- **V264 sample-selection locks:** in grid recording, hold the desired step(s)
  and open FUNC + MACHINES. The header reads SAMPLE P-LOCK. Browse normally and
  press DATA: this assigns the selected file to those steps while retaining the
  track's ordinary sample and other parameters. Unlocked notes use the ordinary
  sample. Deleting a trig clears its sample reference along with its other locks.
- Explicit parameter locks remain active for the sounding loop. CTRL-ALL changes
  the underlying base and unlocked controls; a sample-selection lock alone does
  not lock all of that sample's other parameters.
- Sample identities, mode, options, slice boundaries and per-step references are
  saved with the pattern. Reloading missing PCM runs while playback is stopped;
  cache/loading limits and invalid or changed files can still prevent a load.

Stretch, Pluck, Wavetable, waveform/marker editing, resampling/export, truncation
with undo, and alternate pitch algorithms are separate remaining work. The pitch
algorithms requested for SETTINGS + PITCH are queued, not yet implemented.

## Recent stock controls

- Turn PITCH for fine adjustments; FUNC + PITCH snaps by semitones.
- FUNC + the synth controls uses native stock jump choices on stock machines.
  Named choices, including CHORD shapes, show names instead of numeric indices.
- FUNC + PUNCH opens Quantize: Global, selected Track, Apply and Live Rec.
  Menu, zero/full timing and persistence tests passed. Exact intermediate Global
  and Track amount combination remains under native comparison.
- BACK restores the start of the active parameter gesture. Fractional pitch locks,
  held-step edits and CTRL-ALL pitch changes use the same undo path.

## MIDI input additions in V265–V266

Settings → MIDI → IN CHAN includes T1–T6, FX IN, AUTO IN and PCH IN.
FX IN defaults to channel 7 and supports OFF or channels 1–16. Its setting saves
with global preferences. RCV CC and input-port filters also apply to FX controls.

| MIDI CC | Control |
| --- | --- |
| 3 | Track pad/default note, 0–127; existing trig notes stay intact |
| 14 | Track Chance, 0–100% (higher values cap at 100) |
| 15 | Track Swing, raw 0–30 maps to 50–80% (higher values cap at 80%) |
| 65 | Track Pitch; stock engines keep their stock pitch limits |
| 85 | Delay Time |
| 86 | Delay Feedback |
| 87 | Reverb Size |
| 88 | Reverb Tone |

Note, Chance and Swing use the track or Auto input channel. They respect RCV CC
and the selected input ports. They change track defaults without rewriting existing
trig notes, p-locks or explicit trig conditions.

The four FX messages use the configured FX IN channel. This does not yet complete
MIDI output, DIN integration, or the remaining stock MIDI messages.
Mapping reference: [Elektron OS1.13 manual, Appendix A](https://www.elektron.se/wp-content/uploads/2024/10/Model-Cycles-User-Manual_ENG_OS1.13_241030.pdf).

## Optional master retrig

Hold TRACK + RETRIG and a trig key to choose its repeat division. Hold TRACK and
quickly double-tap RETRIG to latch the controls on screen; division keys remain
momentary. While the controls are latched, FUNC + a division trig pins the repeat.
Tap that same trig again to release it. RETRIG, BACK or STOP exits the controls.
A pinned repeat keeps running until released, rather than ending after one bar.

## Qualification

These new paths passed compiled ColdFire full-image emulator tests. Hardware
upload/restart verification is separate from hearing a sound or confirming a
physical gesture. User listening/interaction confirmation remains pending for
V263/V264/V265/V266/V267/V268. User confirmed the V258 repeat behavior and V260 pitch controls.
The MIDI-only boot default remains in use; 2/6/16-channel USB audio qualification
and complete stock/Supermodel parity are still tracked separately.

## Machine selection MIDI in V267

CC70 uses the track or Auto input channel: 0 KICK, 1 SNARE, 2 METAL,
3 PERC, 4 TONE, 5 CHORD. Values 6–127 select CHORD as on stock.
The mapping uses permanent engine IDs, regardless of custom menu order.
If an engine was excluded from your build, its request leaves the current
machine intact. RCV CC and input-port filters apply. This does not add a
MIDI selector for the additional machines or complete MIDI output parity.

## LFO MIDI in V268

These messages address LFO1 on the routed track, including the Auto channel.
They do not follow the visible LFO2/3/4 page or expand through CTRL-ALL.
RCV CC and input-port filters apply.

| CC | Control | Values |
| --- | --- | --- |
| 102 | Speed | 0–127 maps to -64–63 |
| 103 | Multiplier | 0–11 free, 12–23 tempo-sync; higher values cap at23 |
| 105 | Destination | Native choice numbering, listed below |
| 106 | Waveform | 0 TRI, 1 SIN, 2 SQR, 3 SAW, 4 ENV, 5 RMP, 6 RND; higher values cap at6 |
| 107 | Start Phase | 0–127 |
| 108 | Reset | 0 FREE, 1 TRIG; higher trigger modes remain unsupported |

Destination CC105: 0–9 NONE, 10 PITCH, 11 COLOR, 12 SHAPE, 13 SWEEP,
14 CONTOUR, 15 PAN, 16 GATE, 17 FINE, 18 DECAY, 19 DIST,
20 DELAY, 21 REVERB, 22–127 PUNCH. This numbering differs from the menu order.

NONE is also available at the end of the destination menu for each included
LFO. It keeps Depth intact and disables that LFO's modulation mask and routes.
Existing projects and ordinary destinations keep their behavior.

CC104 Fade and CC109/110 precise Depth are still pending. Unsupported messages
leave the current settings intact. Project document/omission tests passed;
new MIDI controls still need user hardware interaction confirmation.

## Private V269 / V270 test builds

These additions are in the private comparison files, ahead of the flasher's
qualified V268 base. Neither private file has been uploaded automatically.

V269 adds precise LFO1 depth through CC109 and CC110. CC109 sets the whole
depth (-64 through +63) and clears the fraction. CC110 sets its fractional
part in 1/128 increments, clamped at +63. The exact depth is retained when
saving a pattern; the normal display still shows tenths.

V270 includes V269 and adds **FDE** under **FUNC + LFO**, for each included LFO.
Turn DATA to select FDE, click DATA to edit, and turn to change it. Zero turns
Fade off; negative values fade the modulation in and positive values fade it
out. Each new note restarts Fade. With RST off, the LFO phase keeps running.
CC104 controls LFO1 Fade on the routed track: 64 = off, 0–63 = fade in,
65–127 = fade out. Other LFO slots and CTRL-ALL peers remain independent.

These controls, saved-pattern records, omission handling and retained audio/
retrig behavior passed compiled-image tests. Hardware confirmation is pending.

## Private V271: Wizard pitch character

V271 retains V270 and adds the optional `sample-pitch` module, which requires
Sample Wizard. On the selected Wizard track, hold **SETTINGS** and turn
**PITCH** to open/change PITCH ALGO. DATA turns also select; click DATA to
accept. BACK restores the pre-edit choice; a further BACK closes the page.
The combo changes the algorithm, keeping the note's pitch unchanged.

| Choice | Playback |
| --- | --- |
| CLASSIC | Existing sound: linear ordinary playback, raw grains. Default. |
| CUBIC | Limited four-point interpolation; smoother fractional positions, more CPU. |
| RAW | Direct frame reads; cheaper, rougher fractional ordinary playback. |

RAW grains already behave like CLASSIC grains. All choices keep the same
playback rate, length, slice boundaries and loop timing. They change resampling
character; they do not preserve duration when transposing. CUBIC is not a
band-limited pitch shifter. Exact whole-frame playback uses the existing fast
reader for every choice.

Choices save per track in the pattern's existing sample settings, alongside
slice banks. Builds omitting the module ignore/preserve the saved choice.
Hardware listening confirmation is pending.

## Private V272: LFO trigger modes

V272 retains V271. **FUNC + LFO → RST** now shows a named choice:
click DATA to edit and turn DATA to select. PAGE selects another included
LFO slot. Each track/slot saves its own mode.

| RST | Behavior |
| --- | --- |
| FREE | Keep phase running across notes. |
| TRIG | Restart from SPH at each note. |
| HOLD | Sample the running waveform at each note and hold its value. |
| ONE | Restart from SPH, run to a full-cycle boundary, then hold the native terminal value. |
| HALF | Restart from SPH, run to the half-cycle boundary, then hold the native terminal value. |

The held modes keep their internal phase clock running. Fade and Depth still
affect their output. ENV uses a full one-shot even if HOLD or HALF is selected.
The native controller's first-tick completion guard is retained, including
reverse speed and nonzero SPH. Existing FREE/TRIG values are unchanged.

**CC108 = 0/1/2/3/4** selects these modes for LFO1 on the routed track;
other values leave it unchanged. RCV CC/input-port filtering still applies.
Native preset import now accepts all five modes.

Older Redux builds read extended modes as TRIG and preserve their companion
records. Returning to V272 restores the extended choice; an older build's
explicit change to FREE takes priority. Hardware confirmation is pending.

## Private V273: native quantize correction

V273 retains V272 and corrects intermediate **FUNC + PUNCH** quantize amounts.
The stronger Global/Track amount wins, as before. Live playback now retains
fractional nudge precision until the event deadline, rather than rounding to
whole nudge units first. The original stored nudges remain unchanged.

APPLY uses the native fixed-point rounding when committing corrected nudges,
then clears Global and Track amounts. Its signed rounding can give slightly
different early/late results; this matches the measured native operation.
Zero-amount tracks keep the existing raw timing path. Existing projects and
settings use the same saved format. Hardware timing confirmation is pending.

## Private V274: optional LFO polarity

V274 retains V273 and adds **FUNC + LFO → POL → BIP / UNI**. Click DATA
to edit, turn to select. PAGE selects another included LFO slot. The choice
saves independently for every track and slot; **BIP is the default**.

BIP keeps the existing bipolar waveform. UNI offsets it to the positive range;
negative Depth reverses its direction. Fade also scales this offset, so a
completed fade-out leaves no modulation. ENV and the held terminal values use
the same polarity conversion. Zero Depth remains inactive in either mode.

The `lfo-polarity` module is optional. Omitting it removes its helper and menu
row, plays in BIP, and preserves saved polarity records for a later build that
includes it. Precise MIDI Depth changes and panel Depth edits retain POL.
HOLD + RND now samples a fresh random value on each note even at zero Speed.
Compiled-image tests pass; hardware listening confirmation is pending.

## Private V275: save checksum efficiency

V275 retains V274 and removes redundant staging copies in the native file
checksum pass. Checksums, project format, full allocation/reference audit,
journal commit, readback and recovery remain unchanged. Measured emulated
instruction count for streaming 1,536 bytes fell 28.8%; overall hardware save
duration has not yet been measured. V274 remains installed.

## Private V277: storage I/O comparison

Retains V275 features. Storage audit, creation and update/load use a private
10 MHz operating-clock comparison (previously 2.5 MHz); identification, bus
width, timing mode, capacity, file format and recovery checks are unchanged.
The build records storage-phase durations for read-only USB diagnostics.
Hardware save-time improvement must be measured; a 4x bus clock does not
imply a 4x reduction in total save time.

## Private V280: envelope and held-note return

With the optional `track-envelope` module:

- Hold MACHINES and turn DECAY to edit the selected track's Attack.
- Hold SETTINGS and turn DECAY to edit its Release.
- DATA edits/confirms the displayed setting; BACK restores the value from
  before the current edit and leaves the display open. A further BACK closes it.
- Attack OFF and Release STOCK retain the machine's existing envelope. A
  positive Release fades an otherwise held voice after note-off; it cannot
  extend a sound that finishes naturally first.

Both values belong to the pattern, follow Track Swap and track presets, and
save with the project. Omitting the module removes its audio/UI code while
preserving its saved optional record for a later build.

With the optional `keyboard-return` module, Settings → Global → NOTE RETURN
selects RETRIG or LEGATO. Hold one trig-keyboard note, play a second, then
release the second: RETRIG restarts the returned note; LEGATO changes pitch
without restarting the currently held voice's envelope. New key presses still
trigger normally. Arpeggiated notes and sample-slice changes retain their own
note-trigger behavior. This Global choice saves across power cycles.

V280 also removes exact identity envelope scaling from sustained sample loops
and added engines, and redundant full-wet master-repeat arithmetic. Audio,
repeat history and envelope state match the retained reference in software
tests. These savings do not establish that hardware deadlines are eliminated.

## Private V285: filter control synchronization

Filter edits now send absolute targets for each affected track. Previously,
fast knob events could overlap pattern publication and leave the audio cutoff
different from the displayed cutoff. The reproduced case showed CUTOFF64/OFF
on screen while the DSP remained at60 and continued filtering.

The fix preserves CTRL-ALL offsets, undo and active p-lock priority. Centering
the base cutoff retires the filter when no note-owned filter lock keeps it
active. This addresses a demonstrated state bug; remaining active-load limits
still require hardware testing. The private diagnostic helper can read actual
filter state without adding audio-interrupt bookkeeping.
# Private V293: repeat FX Hold

When the optional `repeat-fx-hold` module is included, engaging a master-repeat division fades the delay and reverb returns out and pauses their processing. FX resume with a fade-in when repeating and its release fade finish. Repeat sounds dry during the hold; live synths, filters and sequencing continue. Opening or latching the repeat controls alone keeps FX running. This private candidate requires hardware validation.

# Private V295: protection before rendering

The voice governor can now decline live-source work before rendering when measured costs predict that the block will not fit. Newly cut sources use a short fade, kept valid for the main mix, sends and USB paths. Already captured master-repeat audio continues through the mixer even when its live source is cut. Normal playback is unchanged when estimated work fits. This is an experimental protection policy and still requires hardware validation.


## Private V297 captured-repeat CPU update

The controls are unchanged. Opening the repeat latch alone still does no history recording (V296). Once an actual repeat loop is fully captured, V297 stops writing unheard history. Eligible RING and Sample Wizard voices advance their source state without generating unheard PCM. Active filters, envelopes, sidechain processing, changed controls and unsupported source states use the regular render path. Releasing repeat resumes normal source rendering and the existing FX return fade.

The six-voice emulator comparison used two Wizard tracks and four RING tracks, triggered by the actual sequencer with long gates: 47.1% fewer bank-render instructions during captured repeat. That is not an overall hardware CPU percentage. Ordinary playback PCM matched V296 exactly. The frozen loop no longer includes the old live low-nine-bit residual. Hardware combined-load qualification remains open.

## Private V298 sampler CPU update

Controls and audio-quality settings are unchanged. Sample Wizard now produces its mono stem, governor stereo level key and main output in one pass. Sample p-locks, main-output mute independence, USB stems, stereo FX sends and protective fades are retained. The exact linked two-Wizard/filter/native-FX comparison used 2.3% fewer bank instructions; the six-source captured-repeat comparison used another 5.0% fewer than V297. These are emulator measurements, with hardware stress qualification still open. RING state-only advancement also retains all four contour ranges.

## Private V299 PLAY pause/resume

Press PLAY during playback to pause the sequence. Press PLAY again to continue
from the paused position. The PLAY lamp blinks while paused. Live notes and FX
tails remain available. STOP ends playback; PLAY after STOP starts from the
beginning. A second STOP clears sounding voices and FX tails. Incoming MIDI
Start still starts from the beginning.

REC + PLAY resumes a paused sequence into live recording. Song playback pauses
and resumes within its current row. Required transport behavior is included in
every Redux configuration; it does not require an optional module.

V300 extends the same PLAY pause/resume behavior to Sample Wizard's sample
browser. While paused, trig keys can still audition the highlighted sample;
auditioning does not replace the track's sample. DATA confirms the selection.

## CPU diagnostics

Enable **DX** in Settings → Global. Hold **SETTINGS** and press **BACK** to open the live CPU page. PLAY, STOP and knob turns still work. Press **PAGE** for the eight most recent voice cuts, **DATA** to clear the peak and counters, or tap **BACK** twice to exit. **FADE** identifies a measured-load governor cut and **DROP** identifies a master-repeat admission cut. The load percentage compares render time with one audio block. Queue misses count output deadlines the buffered renderer could not cover.

## Optional Sample Wizard modes

On a Sample Wizard track, hold **SETTINGS** and press **MACHINES** to choose the playback mode. The flasher can include **Stretch**, **Wavetable**, and **Pluck** independently. Hold **SETTINGS** and press **PUNCH** for the current mode’s setup, where supported.

**Pluck** uses COLOR for Strike Position, SHAPE for Strike Length, SWEEP for Tone, and CONTOUR for Feedback. Its setup selects Sample, Noise, or Click excitation and String or Drum response. Noise and Click can play with an empty sample slot.

## Audio settings

**HP MAX** sets the analog headphone ceiling. **MAIN VOLUME** controls the codec in 39 steps. Both settings are stored globally. **INT OUT** under **Audio Out** offers **OFF**, **AUT**, and **ON**. AUT mutes internal sound on the analog outputs while both directions of USB audio are active. USB capture stays available in all three modes. **USB GAIN** adjusts computer playback into the analog outputs from 0 to +18 dB.

## Physical MIDI input

Use **Settings → MIDI → Ports → INP FROM**. **MID** uses the physical MIDI input, **USB** uses USB, **M+U** enables both, and **OFF** disables new incoming events. DIN receive is part of the core workflow in V351. Emulator checks cover the UART and routing. Physical cable and clock tests are pending.

## Physical MIDI output

Use **Settings → MIDI → Ports → OUT TO** and choose **OFF**, **MID**, **USB** or **M+U**. This routes per-track MOUT notes and outgoing pattern program changes. Clock and encoder CC remain USB-only in V352. Physical DIN testing is pending.

## Live Mute

Select **Live Mute** under Performance in the builder. Muted tracks suppress new notes from the pads, trig keyboard, USB and DIN. A held note still receives its release. Quantized mute uses the currently applied mute state.

## CHORDKEYS

Select **CHORD** and enable its **CHORDKEYS** sub-option in the builder. On a CHORD track, open **Settings → Track → Chord Keys**. Turn **Keys** on and set **Root**, **Mode** and the extensions for **I–VII**. Outside grid recording, play the 16 trigs. With a trig held, pads 1–6 retrigger a 9th, 11th, 13th, suspended seventh, parallel major/minor or secondary dominant. In grid recording, hold a note trig and press the same pads to toggle a harmony lock. COLOR selects the harmony palette and SHAPE selects the voicing. Save the project to keep the settings and locks.

With Chord Keys enabled, use **TRACK + pad** to change tracks. Hold a harmony pad across multiple trig presses to apply it to each chord. Chord names appear below the transport status, above the CHORD icon. Enable the track’s MOUT and set MIDI OUT TO to send chord notes on USB or DIN.

## Fill 2

Select **Fill 2** in Sequencing. Hold **PAGE**, then also hold **FUNC** to switch to Fill 2. Releasing FUNC restores Fill 1. FIL2 and NOT FIL2 appear after FILL and NOT FILL in the trig condition list.

## Delay Notes

Select **Delay Notes** with DELAY, PING PONG, or both. Turn **DELAY TIME** to see straight, dotted and triplet values at musical positions. Other positions show numbers. Existing saved delay-time values still load.

## CTRL-ALL Control Mode

With Control Mode installed, hold **TRACK** and tap **SETTINGS** to switch between Relative and Absolute. Relative preserves each track’s offset. Absolute copies the edited value of the selected track to the participating tracks. If the selected track is excluded, the lowest-numbered participating track provides the value. In Trig Select, Absolute group edits use the first selected trig. The mode saves with global preferences.

### Latching Fill

Hold **PAGE** first, tap **TRACK**, then release PAGE. Hold FUNC to use Fill 2 while the latch is on. Repeat PAGE first + TRACK to clear the latch. Holding TRACK first and pressing PAGE still opens Trig Select when installed.

### Machine cost ratings

More stars means higher peak instruction cost in the matched one-voice V363 emulator test. The rating compares the default sounds of the included engines with FX and filters off. Engine models and parameter settings can change the cost.

### MIDI OUT/THRU

In **Settings → MIDI → Ports**, press DATA on **OUT/THRU** to cycle modes. **OUT** sends the Cycles’ MIDI, **THRU** forwards DIN input, and **BOTH** does both. Select **MIDI OUT + THRU** in the flasher to include BOTH. **OUT TO** still controls where the Cycles sends its own MIDI.

### LFO Amount

Select **LFO Amount** in the flasher. Hold **RETRIG** and turn **LFO SPEED** to scale the selected LFO slot. 127 uses full depth, 0 applies no modulation. BACK undoes the active Amount edit. The amount saves with the pattern. In grid recording, hold a trig as well to lock its Amount. BACK restores its previous lock or inheritance. Choose **LFO1 AMT** as an LFO or PAD/VEL destination to modulate LFO 1 Amount. LFO routes use the previous audio block. Velocity uses the current note.

### Groove Templates

Select **Groove Templates** in the flasher. Hold **FUNC** and turn **SWING** to choose Swing, Boom Bap, Disco, Reggae, Bongo, Caixixi, Highlife or Kuduro. In a template, SWING sets the selected track’s strength. At zero strength the track plays straight, with its own Nudge settings. BACK undoes the active edit. The template saves with the pattern. Tables by PPPCCC/gialloinfuso under the MIT license.

### Humanize

Hold **SETTINGS** and turn **SWING** for timing. Hold **MACHINES** and turn **SWING** for velocity. Both settings save with the pattern and follow Track Swap. For grouped timing, hold **SETTINGS** first, then **TRACK**, and turn **SWING**.

### Project restore and preset audition

Redux reopens the last project you successfully loaded or saved. Save project edits before powering off.

With playback stopped, **FUNC + MACHINES** opens sound presets on a synth track. Highlight a sound and tap the selected track's pad to hear a dry preview. **DATA** loads it. **BACK** leaves the preview without changing the track.

### Sound Library

With playback stopped, hold **TRACK** and press **MACHINES**. Select **Save Preset** or **Load Preset** and choose a numbered slot. When saving, enter a name and confirm the slot. Loading keeps the track's existing sequence and locks. The library's physical storage test is pending.
