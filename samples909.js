'use strict';
const slots909=[
 ['ch','Closed hi-hat',['t9-hh']],['oh','Open hi-hat',['t9-hh']],
 ['crash','Crash',['t9-hh','t9-cy']],['ride','Ride',['t9-hh','t9-cy']]
];
const assets909=new Map();
const samplePanel909=document.getElementById('samples909');
const activeSlots909=()=>slots909.filter(([, ,machines])=>machines.some(id=>selected.has(id)));
const requiredSamples909=()=>activeSlots909().every(([id])=>assets909.has(id));
function samplePayload909(){
 return Object.fromEntries(activeSlots909().map(([id])=>[id,assets909.get(id)?.payload]));
}
function refreshSamplePanel909(){
 const active=new Set(activeSlots909().map(([id])=>id));
 samplePanel909.hidden=!active.size;
 for(const row of samplePanel909.querySelectorAll('[data-slot]'))row.hidden=!active.has(row.dataset.slot);
}
for(const [id,title] of slots909){
 const row=document.createElement('div');
 row.dataset.slot=id;
 row.className='sample-drop909';
 const label=document.createElement('label');
 label.textContent=title;
 const input=document.createElement('input');
 input.type='file';
 input.accept='.wav,audio/wav,audio/wave,audio/x-wav';
 input.setAttribute('aria-label',title+' WAV file');
 const status=document.createElement('small');
 status.setAttribute('role','status');
 status.textContent='Drop a WAV or choose a file';
 const remove=document.createElement('button');
 remove.type='button';
 remove.textContent='Remove';
 remove.setAttribute('aria-label','Remove '+title+' WAV');
 remove.hidden=true;
 let attempt=0;
 function update(){
  document.dispatchEvent(new Event('redux-config-change'));
 }
 async function choose(file){
  if(!file)return;
  const current=++attempt;
  status.textContent='Encoding WAV…';
  remove.hidden=true;
  assets909.delete(id);
  update();
  try{
   if(file.size>16*1024*1024)throw new Error('Choose a WAV smaller than 16 MiB.');
   const audio=MC909Samples.encode(new Uint8Array(await file.arrayBuffer()));
   if(audio.frames<2 || audio.data.length>180000)throw new Error('Choose a shorter hit.');
   if(current!==attempt)return;
   let binary='';
   for(let offset=0;offset<audio.data.length;offset+=8192){
    binary+=String.fromCharCode(...audio.data.subarray(offset,offset+8192));
   }
   assets909.set(id,{payload:{frames:audio.frames,data:btoa(binary)}});
   status.textContent=file.name+' · '+audio.seconds.toFixed(2)+' s';
   remove.hidden=false;
  }catch(error){
   if(current===attempt)status.textContent=error.message;
  }finally{
   if(current===attempt){input.value='';update();}
  }
 }
 input.onchange=()=>choose(input.files[0]);
 remove.onclick=()=>{
  attempt++;
  assets909.delete(id);
  input.value='';
  status.textContent='Drop a WAV or choose a file';
  remove.hidden=true;
  update();
 };
 row.addEventListener('dragover',event=>event.preventDefault());
 row.addEventListener('drop',event=>{
  event.preventDefault();
  choose(event.dataTransfer.files[0]);
 });
 label.append(input);
 row.append(label,status,remove);
 samplePanel909.append(row);
}
document.addEventListener('redux-config-change',refreshSamplePanel909);
refreshSamplePanel909();
