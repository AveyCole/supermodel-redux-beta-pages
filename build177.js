'use strict';
const workbenchRevision='V479';
let buildJob=null,buildSignature=null,buildBusy=false,localCanFlash=false;
const buildButton=document.getElementById('build-firmware');
const flashButton=document.getElementById('flash-firmware');
const downloadButton=document.getElementById('download-custom');
const buildMessage=document.getElementById('build-message');
const buildLog=document.getElementById('build-log');
function selectionSignature(){const c=configuration();return JSON.stringify([c.machines,c.effects,c.features,samplePayload909()]);}
function currentBuild(){
 const result=buildJob?.result?.configuration;
 if(!result||buildJob.result.firmware_revision!==workbenchRevision||buildSignature!==selectionSignature()||!['ready','uploaded','installed'].includes(buildJob.state))return false;
 const selection=configuration();
 const same=key=>JSON.stringify(result[key])===JSON.stringify(selection[key]);
 const sameModules=key=>JSON.stringify([...result[key]].sort())===JSON.stringify([...selection[key]].sort());
 return same('machines')&&sameModules('effects')&&sameModules('features');
}
function invalidateBuild(){
 if(buildSignature&&buildSignature!==selectionSignature()){
  flashButton.disabled=true;downloadButton.hidden=true;
  if(!buildBusy)buildMessage.textContent='Selection changed. Build this configuration to continue.';
 }
}
document.addEventListener('redux-config-change',invalidateBuild);
async function api(path,body){
 const response=await fetch(path,body===undefined?{cache:'no-store'}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 const value=await response.json();if(!response.ok)throw new Error(value.error||'The local workbench could not complete the request.');return value;
}
function showJob(job){
 buildJob=job;buildLog.textContent=job.log||'';
 const valid=currentBuild();flashButton.disabled=!valid||!localCanFlash||buildBusy;
 downloadButton.hidden=!valid;
 if(valid){
  downloadButton.href='/api/firmware/'+job.id;
  const result=job.result;
  buildMessage.textContent=job.state==='installed'?'Installed. Cycles restarted and answered over USB.':job.state==='uploaded'?'Upload accepted. Keep power on while the device finishes restarting.':`Ready: ${result.configuration.machines.length} machines · ${Math.round(result.bytes/1024)} KiB. Your chosen order is compiled into this file.`;
  document.getElementById('custom-hash').textContent=result.sha256;
  const src='/api/screen/'+job.id;
  device.show('capture:'+src);document.getElementById('screen-caption').textContent='Your compiled machine selector · actual emulator capture';
  document.getElementById('large-screen').src=src;document.getElementById('large-caption').textContent='Your compiled machine selector';
 }else if(job.state==='failed'){
  const failure=job.log?.split('\n').find(line=>line.includes('error:')||line.startsWith('AssertionError'));
  buildMessage.textContent=failure||job.error||'Build or upload failed. See details below.';
 }
 else if(job.state==='flashing')buildMessage.textContent='Uploading to Cycles. Keep power and USB connected.';
 else if(job.state==='verifying')buildMessage.textContent='Upload complete. Waiting for Cycles to restart and reconnect…';
 else buildMessage.textContent=job.state==='queued'?'Your build is queued.':'Compiling and testing your configuration…';
}
async function pollJob(id){
 for(;;){
  const job=await api('/api/jobs/'+id);showJob(job);
  if(['ready','uploaded','installed','failed'].includes(job.state))return job;
  await new Promise(resolve=>setTimeout(resolve,1000));
 }
}
buildButton.onclick=async()=>{
 if(buildBusy)return;
 if(!requiredSamples909()){buildMessage.textContent='Add the WAV files shown for the selected 909 machines.';return;}
 buildBusy=true;buildButton.disabled=true;flashButton.disabled=true;downloadButton.hidden=true;
 buildJob=null;buildSignature=selectionSignature();document.getElementById('custom-hash').textContent='';buildMessage.textContent='Starting your build…';
 let problem=null;
 try{const job=await api('/api/build',{configuration:configuration(),samples909:samplePayload909()});showJob(job);await pollJob(job.id);}
 catch(error){problem=error.message;}
 finally{buildBusy=false;buildButton.disabled=false;if(buildJob)showJob(buildJob);invalidateBuild();if(problem)buildMessage.textContent=problem;}
};
flashButton.onclick=async()=>{
 if(!currentBuild()||buildBusy||!localCanFlash)return;
 const job=buildJob;
 buildBusy=true;buildButton.disabled=true;flashButton.disabled=true;
 try{
  const status=await api('/api/device');
  document.getElementById('device-status').textContent=status.reason;
  if(!status.ready){buildMessage.textContent=status.reason;return;}
  if (!window.confirm('Install this '+workbenchRevision+' build? Save your edits, stop playback, and select MIDI ONLY before continuing. The Cycles will reboot.')) {
   buildMessage.textContent='Update cancelled.';
   return;
  }
  const upload=await api('/api/flash/'+job.id,{flash:true});
  showJob(upload);
  await pollJob(upload.id);
 }catch(error){
  buildMessage.textContent=error.message;
 }finally{
  buildBusy=false;buildButton.disabled=false;
  flashButton.disabled=!currentBuild()||!localCanFlash;
  invalidateBuild();
 }
};
async function configureFlash(){
 const label=document.getElementById('device-status');
 if(localCanFlash){
  try{label.textContent=(await api('/api/device')).reason;}
  catch(error){label.textContent=error.message;}
 }else label.textContent='Start the local V479 workbench to build and flash.';
 flashButton.disabled=!currentBuild()||!localCanFlash||buildBusy;
}
(async()=>{
 try{const status=await api('/api/catalog');if(status.version!==workbenchRevision)throw new Error('Start the V479 local workbench service.');localCanFlash=true;buildButton.disabled=false;buildMessage.textContent='Choose your machines and order, then build your firmware.';}
 catch(error){buildButton.disabled=true;buildMessage.textContent=error.message;}
 configureFlash();
})();
