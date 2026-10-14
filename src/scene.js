// Reference-based artwork and parallax; not a finished interactive 3D model.
const clamp = v => Math.max(0, Math.min(1, v));
const smooth = (a,b,v) => { const t=clamp((v-a)/(b-a)); return t*t*(3-2*t); };
let prefersStaticView=false;
export function createScene(mount,journey,reducedMotion=false) {
  const landscape=journey.querySelector('.hero-landscape');
  const copy=journey.querySelector('.hero-copy');
  const aside=journey.querySelector('.hero-aside');
  const middle=journey.querySelector('.journey-copy');
  const portal=journey.querySelector('.portal-copy');
  const toggle=journey.querySelector('.motion-toggle');
  const indicators=[...journey.querySelectorAll('[data-stage]')];
  const atmosphere=document.createElement('div');
  atmosphere.className='landscape-atmosphere';
  mount.append(atmosphere);
  let paused=reducedMotion||prefersStaticView;
  let progress=0,target=0,pointerX=0,pointerY=0,frame=0,lastTime=0,disposed=false;
  function updateScroll(){ target=paused?0:clamp(-journey.getBoundingClientRect().top/Math.max(1,journey.offsetHeight-mount.clientHeight)); }
  function draw(time){
    const reveal=smooth(.2,.65,progress),enter=smooth(.6,.98,progress),opening=1-smooth(.05,.28,progress);
    landscape.style.transformOrigin=innerWidth<701?'50% 37%':'55% 42%';
    landscape.style.transform='translate3d('+(paused?0:pointerX*4)+'px,'+(paused?0:pointerY*2-progress*16)+'px,0) scale('+(1.015+progress*.18+enter*.22)+')';
    landscape.style.filter='brightness('+(.93+reveal*.12)+')';
    landscape.style.opacity=1-smooth(.8,1,progress);
    copy.style.opacity=opening;
    copy.style.transform='translateY('+(-progress*55)+'px)';
    copy.inert=opening<.15;
    if(aside)aside.style.opacity=opening;
    middle.style.opacity=smooth(.26,.4,progress)*(1-smooth(.57,.73,progress));
    portal.style.opacity=smooth(.76,.86,progress)*(1-smooth(.96,1,progress));
    atmosphere.style.transform='translate3d('+(paused?0:Math.sin(time*.00004)*25)+'px,'+(-progress*45)+'px,0)';
    atmosphere.style.opacity=paused?.08:.08+reveal*.06;
    const stage=progress<.3?0:progress<.73?1:2;
    indicators.forEach(item=>item.classList.toggle('active',Number(item.dataset.stage)===stage));
  }
  function tick(time){
    if(disposed)return;
    frame=requestAnimationFrame(tick);
    if(paused||document.hidden||journey.getBoundingClientRect().bottom<0||time-lastTime<24)return;
    progress+=(target-progress)*(1-Math.exp(-Math.min(time-lastTime,80)/110));
    lastTime=time;draw(time);
  }
  function setPaused(value,returnToTop=false){
    const top=journey.getBoundingClientRect().top+scrollY;
    paused=value;if(!reducedMotion)prefersStaticView=value;
    journey.classList.toggle('motion-paused',value);document.body.classList.toggle('motion-limited',value);
    toggle.setAttribute('aria-pressed',String(value));
    toggle.querySelector('.motion-label').textContent=reducedMotion?'Reduced motion':value?'Enable motion':'Reduce motion';
    toggle.querySelector('.motion-icon').textContent=value?'▷':'Ⅱ';toggle.disabled=reducedMotion;
    if(value&&scrollY>top)scrollTo({top,behavior:'instant'});
    progress=0;updateScroll();draw(lastTime);
    if(returnToTop)requestAnimationFrame(()=>{if(disposed)return;scrollTo({top,behavior:'instant'});progress=target=0;draw(lastTime);});
  }
  function pointer(event){pointerX=event.clientX/innerWidth-.5;pointerY=event.clientY/innerHeight-.5;}
  const onToggle=()=>setPaused(!paused,true),onResize=()=>{updateScroll();draw(lastTime);};
  window.addEventListener('scroll',updateScroll,{passive:true});
  window.addEventListener('pointermove',pointer,{passive:true});
  window.addEventListener('resize',onResize);toggle.addEventListener('click',onToggle);
  setPaused(paused);frame=requestAnimationFrame(tick);
  return()=>{disposed=true;cancelAnimationFrame(frame);window.removeEventListener('scroll',updateScroll);window.removeEventListener('pointermove',pointer);window.removeEventListener('resize',onResize);toggle.removeEventListener('click',onToggle);atmosphere.remove();};
}
