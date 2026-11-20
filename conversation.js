/* GRTC guided conversation.
   Builds a message in the visitor's browser, then hands it to the visitor's own
   email (app, Gmail or Outlook) addressed to GRTC. Nothing is sent or stored by
   this website. */
(()=>{
'use strict';
const cfg=window.GRTC_CONFIG||{};
const TO=/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cfg.recipientEmail||'')?cfg.recipientEmail:'david@grtc.io';
const el=id=>document.getElementById(id);
const qs=[
{id:'need',title:'What brings you here?',help:'Choose the closest fit. No technical explanation needed.',options:["Something isn't working","I'm planning something new","I'd like a second opinion","I want to simplify","I'm exploring possibilities","Something else"]},
{id:'place',title:'Where does this fit?',help:'This helps us understand the environment.',options:['Home or personal','Home office','Small business','Medium-sized business','Large organization','Community or nonprofit','Something else']},
{id:'goals',title:'What would success look like?',help:'Select up to three.',multi:true,options:['More reliable','Simpler to manage','Better connected','Stronger online presence','Ready for growth','More secure and resilient','Less time or money spent','Something else']},
{id:'stage',title:'Where are you in the process?',help:"It's fine to be exploring.",options:['Just thinking about it','Researching options','Ready to plan','Ready to begin','Something needs attention soon']},
{id:'details',title:'Anything else we should know?',help:'A few words are enough. This is optional.',text:true},
{id:'contact',title:'Almost done.',help:'Just your name. Your email address comes with the message when you send it from your own email.',contact:true}
];
const PHASES=['Your starting point','Your environment','Your priorities','Your timing','Additional context','Your details'];
let step=0;const answers={};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function say(msg){el('status').textContent=msg;}
function save(){
 const q=qs[step];
 if(q.text)answers.details=el('details').value;
 if(q.contact)for(const id of ['fullName','org','reply','phone'])answers[id]=el(id).value.trim();
 if(q.options&&el('other'))answers[q.id+'Other']=el('other').value.trim();
}
function render(){
 const q=qs[step];
 el('counter').textContent=`Step ${step+1} of ${qs.length}`;
 el('phase').textContent=PHASES[step];
 el('bar').style.width=((step+1)/qs.length*100)+'%';
 let html=`<div class="fade"><h2>${esc(q.title)}</h2><p style="color:var(--muted)">${esc(q.help)}</p>`;
 if(q.options){
  html+='<div class="options">';
  q.options.forEach(o=>{
   const checked=q.multi?(answers[q.id]||[]).includes(o):answers[q.id]===o;
   html+=`<label class="option"><input type="${q.multi?'checkbox':'radio'}" name="choice" value="${esc(o)}" ${checked?'checked':''}><span>${esc(o)}</span></label>`;
  });
  html+='</div>';
  const other=q.multi?(answers[q.id]||[]).includes('Something else'):answers[q.id]==='Something else';
  if(other)html+=`<div class="field"><label for="other">In your own words</label><input id="other" maxlength="350" value="${esc(answers[q.id+'Other']||'')}" placeholder="Tell us a little more"></div>`;
 }else if(q.text){
  html+=`<div class="field"><label for="details">Additional context (optional)</label><textarea id="details" maxlength="2500" placeholder="What are you trying to change?">${esc(answers.details||'')}</textarea></div>`;
 }else{
  html+=`<div class="field"><label for="fullName">Your name *</label><input id="fullName" required maxlength="120" autocomplete="name" value="${esc(answers.fullName||'')}"></div>`;
  html+=`<div class="field"><label for="org">Organization (optional)</label><input id="org" maxlength="160" autocomplete="organization" value="${esc(answers.org||'')}"></div>`;
  html+=`<div class="field"><label for="reply">How should we reply?</label><select id="reply"><option value="Email" ${answers.reply!=='Phone'?'selected':''}>Email (reply to my message)</option><option value="Phone" ${answers.reply==='Phone'?'selected':''}>Phone call</option></select></div>`;
  html+=`<div class="field"><label for="phone">Phone (optional unless you prefer a call)</label><input id="phone" type="tel" maxlength="40" autocomplete="tel" value="${esc(answers.phone||'')}"></div>`;
  html+='<p style="font-size:.85rem;color:var(--muted)">Please do not include passwords or account numbers.</p>';
 }
 el('question').innerHTML=html+'</div>';
 el('back').disabled=step===0;
 el('next').textContent=step===qs.length-1?'Prepare my message →':'Next →';
 el('question').querySelectorAll('input[name=choice]').forEach(input=>input.addEventListener('change',()=>{
  if(q.multi){
   const picked=[...el('question').querySelectorAll('input[name=choice]:checked')].map(x=>x.value);
   if(picked.length>3){input.checked=false;return;}
   answers[q.id]=picked;
  }else answers[q.id]=input.value;
  render();
 }));
 const first=el('question').querySelector('input,textarea,select');
 if(first&&step>0)first.focus({preventScroll:true});
}
function check(){
 const q=qs[step];save();
 if(q.contact){
  const n=el('fullName');
  if(!n.value.trim()){n.reportValidity();n.focus();return false;}
  if(answers.reply==='Phone'&&!answers.phone){const p=el('phone');p.setCustomValidity('Add a phone number, or choose email.');p.reportValidity();p.setCustomValidity('');p.focus();return false;}
 }else if(q.options&&!(q.multi?(answers[q.id]||[]).length:answers[q.id])){
  say('Please choose an answer to continue.');return false;
 }
 say('');return true;
}
function describe(id){
 const v=answers[id];const t=Array.isArray(v)?v.join(', '):(v||'Not specified');
 return t+(answers[id+'Other']?' ('+answers[id+'Other']+')':'');
}
function compose(){
 el('subject').value='GRTC conversation | '+(answers.need==='Something else'&&answers.needOther?answers.needOther:(answers.need||'New inquiry'));
 const reply=answers.reply==='Phone'?`Please call me${answers.phone?' at '+answers.phone:''}.`:'Please reply to this email.';
 el('message').value=`Hello David,

My name is ${answers.fullName}${answers.org?' from '+answers.org:''}, and I'd like to start a conversation.

WHAT BRINGS ME HERE
${describe('need')}

MY ENVIRONMENT
${describe('place')}

WHAT SUCCESS LOOKS LIKE
${describe('goals')}

WHERE I AM IN THE PROCESS
${describe('stage')}

ADDITIONAL CONTEXT
${answers.details?.trim()||'Nothing more yet.'}

HOW TO REACH ME
${reply}${answers.phone&&answers.reply!=='Phone'?'\nPhone: '+answers.phone:''}

Thank you,
${answers.fullName}`;
 el('question').classList.add('hidden');el('navigation').classList.add('hidden');el('review').classList.remove('hidden');
 el('counter').textContent='Ready to send';el('phase').textContent='Your message';el('bar').style.width='100%';
 el('toAddress').textContent=TO;
 say('');el('review').querySelector('h2').focus();
}
const enc=encodeURIComponent;
const subj=()=>el('subject').value, body=()=>el('message').value;
el('next').addEventListener('click',()=>{if(!check())return;if(step===qs.length-1)compose();else{step++;render();}});
el('back').addEventListener('click',()=>{if(step){save();step--;render();}});
el('edit').addEventListener('click',()=>{el('review').classList.add('hidden');el('question').classList.remove('hidden');el('navigation').classList.remove('hidden');render();});
el('sendEmail').addEventListener('click',()=>{
 location.href='mailto:'+TO+'?subject='+enc(subj())+'&body='+enc(body());
 say('Your email app should open with the message ready. Review it, then press Send. If nothing opened, use Gmail, Outlook or Copy below.');
});
el('gmail').addEventListener('click',e=>{e.currentTarget.href='https://mail.google.com/mail/?view=cm&fs=1&to='+enc(TO)+'&su='+enc(subj())+'&body='+enc(body());});
el('outlook').addEventListener('click',e=>{e.currentTarget.href='https://outlook.live.com/mail/0/deeplink/compose?to='+enc(TO)+'&subject='+enc(subj())+'&body='+enc(body());});
el('copy').addEventListener('click',async()=>{
 const text=`To: ${TO}\nSubject: ${subj()}\n\n${body()}`;
 try{await navigator.clipboard.writeText(text);say(`Copied. Paste it into a new email to ${TO}.`);}
 catch{el('message').select();say(`Select the message above and copy it into a new email to ${TO}.`);}
});
render();
})();
