'use strict';
const categories=[
 {id:'machines',title:'Machines',icon:'◈',side:'left',summary:'36 machines · two use your WAV files',items:[['punch','PUNCH','12 models'],['tiny','TINY','52 percussion models by Glycinate'],['sy-toy','SY TOY','Toy percussion'],['cp-vintage','CP VINTAGE','Clap'],['sy-bits','SY BITS','Digital oscillator'],['sy-swarm','SY SWARM','Swarm oscillator'],['wave','WAVE','Morph the built-in 16-frame wavetable'],['midi-out','MIDI OUT','Silent MIDI track with USB and DIN routing'],['elder','ELDER','Synth'],['acid','ACID','Bass'],['estus','ESTUS','8 engines'],['retrosyn','RETROSYN','Synth'],['shadow','SHADOW','Synth'],['speak','SPEAK','128 words'],['t9-bd','T9 BD','Kick'],['t9-sd','T9 SD','Snare'],['t9-hh','T9 HAT','Closed and open hats, crash and ride WAVs'],['t9-cy','T9 CYMBAL','Crash and ride WAVs'],['t9-rc','T9 RIM / CLAP','Percussion'],['t9-tom','T9 TOM','Tom'],['stock-kick','KICK','Stock engine'],['sdvintage','SD VINTAGE','Snare'],['ring','RING','Ring modulation'],['stock-metal','METAL','Stock engine'],['stock-tone','TONE','Stock engine'],['stock-snare','SNARE','Stock engine'],['stock-perc','PERC','Stock engine'],['stock-chord','CHORD','Stock engine'],['md-b2','TRX-B2','Bass drum'],['md-sd','TRX-SD','Snare'],['md-ch','TRX-CH','Closed hat'],['macro','MACRO','47 models'],['plaits','GLADES','24 Plaits models · in development',false],['lofi','LOFI','Worn keys · tape drift · crush · dust'],['hex','HEX','Reed ensemble · drifting pads · low-cost DSP'],['dx7','LEGACY','32 DX7 voices'],['sample-wizard','SAMPLE WIZARD','Forward one-shot · saved sample reload']]},
 {id:'sequencing',title:'Sequencing',icon:'▥',side:'left',summary:'Patterns with a personality',items:[['groove','Groove Templates','FUNC + Swing · timing and accents'],['genie','Sequence Genie','Generator'],['song','Song mode','32 rows / repeats / track mutes'],['track-swap','Track Swap','Exchange tracks while stopped'],['pattern-latch','Pattern latch','Double PATTERN / BACK exits'],['direct-jump','Direct Pattern Jump','Global JUMP · FUNC + pattern trig'],['fill2','Fill 2','Hold PAGE, then FUNC · PAGE first + TRACK latches'],['trig-preview','Trig preview','Hold step + PAGE · stopped'],['trig-select','Trig selection','TRACK + PAGE · groups across pages']],preview:'genie'},
 {id:'performance',title:'Performance',icon:'⌁',side:'left',summary:'Happy accidents, on demand',items:[['arpeggiator','Arpeggiator','Five directions / added octaves'],['scramble','Scramble','Randomize'],['control-all','CTRL-ALL selection & latch','Double TRACK / BACK undo'],['control-mode','CTRL-ALL Control Mode','TRACK + SETTINGS · Relative / Absolute'],['latching-mute','Latching mute','Global MUTE > LTC · TRACK + FUNC'],['mute-solo','Solo','FUNC + pad · restore previous mutes'],['hold-mute','Hold Mute','Hold a pad during playback to mute until release'],['live-mute','Live Mute','Mute also applies to pads, keyboard and MIDI'],['quantized-mute','Quantized mute / solo','Global QNTM · pattern fractions'],['chord-strum','Strum','Track · −80 to +80 ms'],['chord-keys','CHORDKEYS','Diatonic trig chords and saved harmony'],['page-length','Page Length','1–16 active steps per physical page'],['page-warp','Warp','Preserve page duration when shortened']],preview:'scramble'},
 {id:'effects',title:'Effects',icon:'≋',side:'right',summary:'Six independent algorithms',items:[['reverb','REVERB','Native 48 kHz'],['delay','DELAY','Echo'],['ping','PING PONG','Stereo echo'],['hall','HALL','Reverb'],['chorus1','CHORUS 1','Modulation'],['chorus2','CHORUS 2','Modulation'],['master-retrig','Master retrig','TRACK + RETRIG · double-tap to latch']]},
 {id:'modulation',title:'Modulation',icon:'∿',side:'right',summary:'Clock, LFO 1 and velocity are core',items:[['lfo-amount','LFO Amount','RETRIG + LFO SPEED · selected slot'],['lfo2','LFO 2','Independent track modulation'],['lfo3','LFO 3','Independent track modulation'],['lfo4','LFO 4','Independent track modulation · PAGE switches slots'],['scale-lock','Scale Lock','19 scales'],['track-filter','Track filter','12 dB · Lo/Hi · envelope'],['sidechain','Sidechain','Per-source target checkboxes']]},
 {id:'connectivity',title:'Audio & Display',icon:'⌘',side:'right',summary:'Output, display and USB',items:[['silent-browse','Silent machine browsing','STK / SIL · DATA confirms'],['silent-track','Silent track selection','STK / SIL · select without audition'],['screen-invert','Screen inversion','Reg / Inv'],['midi-thru-both','MIDI OUT + THRU','Adds BOTH to MIDI Ports'],['usb6','6-channel USB audio','Packed 24-bit · V245 queue recovery'],['usb16','16-channel USB audio','Packed 24-bit · V245 queue recovery']],preview:'settings'}
];
categories.find(c=>c.id==='performance').items.push(['keyboard-return','Held-note return','Global · Retrig / Legato']);
categories.find(c=>c.id==='effects').items.push(['delay-notes','Delay Notes','Note divisions and triplet timing'],['repeat-fx-hold','Repeat FX Hold','Pause FX while master repeat plays']);
categories.find(c=>c.id==='modulation').items.push(['track-envelope','Track Attack / Release','MACHINES + DECAY / SETTINGS + DECAY'],['lfo-polarity','LFO polarity','Bipolar / Unipolar'],['sample-pitch','Sample pitch algorithms','Sample Wizard · SETTINGS + PITCH']);
const machineIDs=categories.find(c=>c.id==='machines').items.map(x=>x[0]);
const fxIDs=['delay','ping','hall','chorus1','chorus2','reverb'];
const wizardOptions=['sample-pitch','sample-stretch','sample-wavetable','sample-pluck'];
categories.find(c=>c.id==='modulation').items.push(
 ['sample-stretch','Stretch','Time-stretch mode'],
 ['sample-wavetable','Wavetable','Sample-based oscillator'],
 ['sample-pluck','Pluck','Sample, noise or click exciter']);
categories.find(c=>c.id==='connectivity').items.push(['cpu-page','CPU diagnostics','Global DX ? SETTINGS + BACK']);
const featureIDs=[...wizardOptions,'cpu-page','delay-notes','repeat-fx-hold','keyboard-return','track-envelope','lfo-polarity','master-retrig','scramble','groove','genie','scale-lock','screen-invert','arpeggiator','sidechain','control-all','control-mode','track-swap','song','silent-browse','silent-track','pattern-latch','direct-jump','latching-mute','mute-solo','hold-mute','live-mute','quantized-mute','trig-preview','trig-select','fill2','chord-strum','chord-keys','page-length','page-warp','track-filter','lfo-amount','lfo2','lfo3','lfo4','midi-thru-both','usb6','usb16'];
const assetMachines909=new Set(['t9-hh','t9-cy']);
const defaults=[...categories.find(c=>c.id==='machines').items.filter(x=>x[3]!==false).map(x=>x[0]),...fxIDs,...featureIDs];
const available=new Set([...defaults,...assetMachines909]);
let selected=new Set(defaults.filter(id=>!assetMachines909.has(id)));
try{const saved=JSON.parse(localStorage.getItem('supermodel-redux-unified-config-v1'));if(Array.isArray(saved))selected=new Set(saved.filter(x=>available.has(x)));}catch{}
let machineOrder=[...machineIDs],draggedMachine=null;
try{const saved=JSON.parse(localStorage.getItem('supermodel-redux-unified-order-v1'));if(Array.isArray(saved)&&new Set(saved).size===saved.length&&saved.every(x=>machineIDs.includes(x)))machineOrder=[...saved,...machineIDs.filter(x=>!saved.includes(x))];}catch{}
function applyMachineOrder(){
 const body=document.getElementById('options-machines');
 const rows=new Map([...body.querySelectorAll('[data-machine-row]')].map(row=>[row.dataset.machineRow,row]));
 for(const id of machineOrder)body.append(rows.get(id));
 try{localStorage.setItem('supermodel-redux-unified-order-v1',JSON.stringify(machineOrder));}catch{}
 document.dispatchEvent(new Event('redux-config-change'));document.getElementById('announcement').textContent='Machine order: '+machineOrder.filter(x=>selected.has(x)).join(', ');
}
function moveMachine(id,target,after=false){
 if(id===target||!machineIDs.includes(id)||!machineIDs.includes(target))return;
 machineOrder=machineOrder.filter(x=>x!==id);machineOrder.splice(machineOrder.indexOf(target)+(after?1:0),0,id);applyMachineOrder();
}
const screens={machines:['assets/unified-machine-menu.png','Combined REDUX machine selector · emulator capture'],sequencing:['assets/v73-genie-menu.png','V73 · Sequence Genie · actual emulator capture'],performance:['assets/scramble.png','Scramble · actual device artwork'],effects:['assets/v73-audio-out-menu.png','V73 · Audio Out · actual emulator capture'],modulation:['assets/v83-sidechain.png','V83 · Sidechain targets · actual emulator capture'],connectivity:['assets/v73-settings-root.png','V73 Settings · actual emulator capture'],settings:['assets/v73-settings-root.png','V73 Settings · Project / MIDI / Audio / System'],genie:['assets/v73-genie-intro.png','V73 · Sequence Genie intro · actual emulator capture'],scramble:['assets/scramble.png','Scramble · actual device artwork']};
let currentScreen='machines';
const device=MCDevice.render(document.getElementById('device'),{seq:false,lcd:'capture:assets/unified-machine-menu.png'});
function showScreen(id){currentScreen=id;const [src,caption]=screens[id];device.show('capture:'+src);document.getElementById('screen-caption').textContent=caption;document.getElementById('large-screen').src=src;document.getElementById('large-caption').textContent=caption;document.getElementById('screen-title').textContent=id==='genie'?'Sequence Genie':id==='scramble'?'Scramble':'Device screen';}
function counts(){return {machines:machineIDs.filter(x=>selected.has(x)).length,fx:fxIDs.filter(x=>selected.has(x)).length,features:featureIDs.filter(x=>selected.has(x)).length};}
function update(){for(const [child,parent] of [['lfo3','lfo2'],['lfo4','lfo3']]){const row=document.getElementById('module-'+child);const allowed=selected.has(parent);if(!allowed)selected.delete(child);if(row){row.disabled=!allowed;row.parentElement.hidden=!allowed;row.parentElement.classList.add('sub-option');if(child==='lfo4')row.parentElement.style.marginLeft='40px';}}const warp=document.getElementById('module-page-warp');const pages=selected.has('page-length');if(!pages)selected.delete('page-warp');if(warp){warp.disabled=!pages;warp.parentElement.hidden=!pages;}const strum=document.getElementById('module-chord-strum');const chord=selected.has('stock-chord');if(!chord)selected.delete('chord-strum');if(strum){strum.disabled=!chord;strum.parentElement.hidden=!chord;}const keys=document.getElementById('module-chord-keys');if(!chord)selected.delete('chord-keys');if(keys){keys.disabled=!chord;keys.parentElement.hidden=!chord;}const solo=document.getElementById('module-mute-solo');const parent=selected.has('latching-mute');if(!parent)selected.delete('mute-solo');if(solo){solo.disabled=!parent;solo.parentElement.hidden=!parent;solo.parentElement.classList.add('sub-option');}document.dispatchEvent(new Event('redux-config-change'));const c=counts();document.getElementById('machine-count').textContent=c.machines;document.getElementById('fx-count').textContent=c.fx;document.getElementById('feature-count').textContent=c.features;document.getElementById('feature-word').textContent=c.features===1?'add-on':'add-ons';for(const input of document.querySelectorAll('input[data-module]'))input.checked=selected.has(input.dataset.module);try{localStorage.setItem('supermodel-redux-unified-config-v1',JSON.stringify([...selected]));}catch{}document.getElementById('announcement').textContent=`${c.machines} machines, ${c.fx} FX and ${c.features} add-ons selected.`;}
for(const category of categories){
 const card=document.createElement('article');card.className='category'+(category.id==='machines'?' active':'');
 const heading=document.createElement('button');heading.type='button';heading.className='category-heading';heading.setAttribute('aria-expanded','true');heading.setAttribute('aria-controls','options-'+category.id);
 heading.innerHTML=`<span class="category-icon" aria-hidden="true">${category.icon}</span><span><span class="category-title">${category.title}</span><span class="category-summary">${category.summary}</span></span><span class="category-caret" aria-hidden="true">−</span>`;
 const body=document.createElement('div');body.className='category-body';body.id='options-'+category.id;
 if(category.id==='machines'){const hint=document.createElement('p');hint.className='category-note';hint.textContent='Drag the grips or use arrow keys to set device menu order. More stars means higher default-voice cost in the emulator.';body.append(hint);}
 for(const [id,name,detail,enabled=true] of category.items){
  const label=document.createElement('div');label.className='option'+(!enabled?' disabled':'');
  const input=document.createElement('input');input.type='checkbox';input.id='module-'+id;input.dataset.module=id;input.disabled=!enabled;input.setAttribute('aria-label',name);
  input.addEventListener('change',()=>{if(input.checked)selected.add(id);else selected.delete(id);update();showScreen(category.id);});
  const title=document.createElement('label');title.htmlFor=input.id;title.className='option-name';title.textContent=name;
  const small=document.createElement('small');small.textContent=detail;
  if(category.id==='machines'){
   const cost=window.reduxMachineCosts?.[id];
   if(cost){
    const rating=document.createElement('span');
    rating.className='machine-cost';
    rating.setAttribute('role','img');
    rating.setAttribute('aria-label',`Relative voice cost ${cost.stars} out of 5`);
    rating.title=`${cost.instructions.toLocaleString()} peak instructions above idle, one default voice in the emulator`;
    rating.textContent='★'.repeat(cost.stars)+'☆'.repeat(5-cost.stars);
    small.append(rating);
   }
  }
  label.append(input,title,small);
  if(category.id==='machines'){
   label.dataset.machineRow=id;label.draggable=true;
   const grip=document.createElement('button');grip.type='button';grip.draggable=true;grip.className='order-handle';grip.textContent='⠿';grip.setAttribute('aria-label','Reorder '+name);grip.title='Drag to reorder, or use the up/down arrow keys';
   grip.addEventListener('keydown',event=>{if(event.key!=='ArrowUp'&&event.key!=='ArrowDown')return;event.preventDefault();const at=machineOrder.indexOf(id),next=at+(event.key==='ArrowUp'?-1:1);if(next<0||next>=machineOrder.length)return;moveMachine(id,machineOrder[next],event.key==='ArrowDown');grip.focus();});
   label.addEventListener('dragstart',event=>{if(event.target.tagName==='INPUT'){event.preventDefault();return;}draggedMachine=id;event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',id);label.classList.add('dragging');});
   label.addEventListener('dragover',event=>{if(!draggedMachine||draggedMachine===id)return;event.preventDefault();event.dataTransfer.dropEffect='move';label.dataset.dropPosition=event.clientY>label.getBoundingClientRect().top+label.offsetHeight/2?'after':'before';});
   label.addEventListener('dragleave',()=>delete label.dataset.dropPosition);
   label.addEventListener('drop',event=>{event.preventDefault();const after=label.dataset.dropPosition==='after';delete label.dataset.dropPosition;if(draggedMachine)moveMachine(draggedMachine,id,after);draggedMachine=null;});
   label.addEventListener('dragend',()=>{draggedMachine=null;document.querySelectorAll('[data-machine-row]').forEach(row=>{row.classList.remove('dragging');delete row.dataset.dropPosition;});});
   label.append(grip);
  }
  body.append(label);
 }
 if(category.preview){const preview=document.createElement('button');preview.type='button';preview.className='preview-link';preview.textContent=category.preview==='genie'?'Preview Genie intro ↗':category.preview==='settings'?'Preview Settings ↗':'Preview Scramble screen ↗';preview.onclick=()=>{showScreen(category.preview);document.getElementById('screen-dialog').showModal();};body.append(preview);}
 heading.onclick=()=>{const open=heading.getAttribute('aria-expanded')==='true';heading.setAttribute('aria-expanded',String(!open));body.hidden=open;heading.querySelector('.category-caret').textContent=open?'+':'−';document.querySelectorAll('.category').forEach(x=>x.classList.remove('active'));card.classList.add('active');showScreen(category.id);};card.append(heading,body);document.getElementById(category.side+'-categories').append(card);
}
applyMachineOrder();
const warpRow=document.getElementById('module-page-warp').parentElement;warpRow.classList.add('sub-option');document.getElementById('module-page-length').parentElement.after(warpRow);
const strumRow=document.getElementById('module-chord-strum').parentElement;
strumRow.classList.add('sub-option','machine-child');
document.querySelector('[data-machine-row="stock-chord"]').append(strumRow);
const chordKeysRow=document.getElementById('module-chord-keys').parentElement;
chordKeysRow.classList.add('sub-option');
document.querySelector('[data-machine-row="stock-chord"]').append(chordKeysRow);
for(const id of wizardOptions){
 const row=document.getElementById('module-'+id).parentElement;
 row.classList.add('sub-option','machine-child');
 document.querySelector('[data-machine-row="sample-wizard"]').append(row);
}
const holdRow=document.getElementById('module-repeat-fx-hold').parentElement;
holdRow.classList.add('sub-option');document.getElementById('module-master-retrig').parentElement.after(holdRow);
const controlModeRow=document.getElementById('module-control-mode').parentElement;
controlModeRow.classList.add('sub-option');
document.getElementById('module-control-all').parentElement.after(controlModeRow);
const priorUpdate296=update;
update=function(){
 for(const [child,parent] of [...wizardOptions.map(id=>[id,'sample-wizard']),['repeat-fx-hold','master-retrig'],['control-mode','control-all']]){
  const input=document.getElementById('module-'+child);
  const allowed=selected.has(parent)&&(child!=='repeat-fx-hold'||fxIDs.some(id=>selected.has(id)));
  if(!allowed)selected.delete(child);input.disabled=!allowed;input.parentElement.hidden=!allowed;
 }
 const delayNotes=document.getElementById('module-delay-notes');
 const delayEnabled=selected.has('delay')||selected.has('ping');
 if(!delayEnabled)selected.delete('delay-notes');
 delayNotes.disabled=!delayEnabled;
 delayNotes.parentElement.hidden=!delayEnabled;
 priorUpdate296();
};

document.getElementById('reset').onclick=()=>{selected=new Set(defaults.filter(id=>!assetMachines909.has(id)));machineOrder=[...machineIDs];applyMachineOrder();update();showScreen('machines');};
document.getElementById('review').onclick=()=>{const c=counts();document.getElementById('review-description').textContent=`${c.machines} machines, ${c.fx} FX algorithms, ${c.features} add-ons. Core workflow is mandatory; full stock parity is still in development.`;const list=document.getElementById('review-list');list.replaceChildren();for(const id of [...configuration().machines,...configuration().effects,...configuration().features]){const item=categories.flatMap(c=>c.items).find(x=>x[0]===id);const li=document.createElement('li');li.textContent=item[1];list.append(li);}if(!c.machines){const li=document.createElement('li');li.textContent='No machines · silent core, no hidden engine';list.append(li);}document.getElementById('review-dialog').showModal();};
function configuration(){return {schema:'supermodel-next-config/v2',target:'model-cycles',core:'required',machines:machineOrder.filter(x=>selected.has(x)),features:featureIDs.filter(x=>selected.has(x)),effects:fxIDs.filter(x=>selected.has(x)),state:'selection-not-compiled'};}
document.getElementById('export').onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(configuration(),null,2)+'\n'],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='supermodel-configuration.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);document.getElementById('announcement').textContent='Configuration saved. Firmware has not been compiled.';};
document.getElementById('screen-enlarge').onclick=()=>document.getElementById('screen-dialog').showModal();
document.querySelectorAll('dialog .close').forEach(button=>button.onclick=()=>button.closest('dialog').close());
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}}));
update();showScreen('machines');

const configurationFile=document.getElementById('configuration-file');
document.getElementById('load-configuration').onclick=()=>configurationFile.click();
configurationFile.addEventListener('change',async()=>{
 const file=configurationFile.files[0];
 configurationFile.value='';
 if(!file)return;
 try{
  if(file.size>65536)throw new Error('Configuration exceeds 64 KiB.');
  const config=JSON.parse(await file.text());
  if(config.schema!=='supermodel-next-config/v2'||config.target!=='model-cycles'||
     config.core!=='required'||config.state!=='selection-not-compiled'){
   throw new Error('Choose a Model:Cycles configuration JSON exported by the workbench.');
  }
  const sections=[[config.machines,machineIDs],[config.effects,fxIDs],[config.features,featureIDs]];
  if(sections.some(([ids,catalog])=>!Array.isArray(ids)||new Set(ids).size!==ids.length||
     ids.some(id=>!catalog.includes(id))))throw new Error('The configuration contains unsupported or duplicate modules.');
  selected=new Set([...config.machines,...config.effects,...config.features]);
  machineOrder=[...config.machines,...machineIDs.filter(id=>!selected.has(id))];
  applyMachineOrder();
  update();
  showScreen('machines');
 }catch(error){
  window.alert(error.message);
 }
});