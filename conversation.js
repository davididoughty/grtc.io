
(()=>{
'use strict';
const cfg=window.GRTC_CONFIG||{}, el=id=>document.getElementById(id);
const qs=[
{id:'need',title:'What brings you here?',help:'Choose the closest fit. No technical explanation needed.',options:["Something isn't working","I'm planning something new","I'd like a second opinion","I want to simplify","I'm exploring possibilities","Something else"]},
{id:'place',title:'Where does this fit?',help:'This helps us understand the environment.',options:['Home or personal','Home office','Small business','Medium-sized business','Large organization','Community or nonprofit','Something else']},
{id:'goals',title:'What would success look like?',help:'Select up to three.',multi:true,options:['More reliable','Simpler to manage','Better connected','Stronger online presence','Ready for growth','More secure and resilient','Less time or money spent','Something else']},
{id:'stage',title:'Where are you in the process?',help:"It's fine to be exploring.",options:['Just thinking about it','Researching options','Ready to plan','Ready to begin','Something needs attention soon']},
{id:'details',title:'Anything else we should know?',help:'A few words are enough. This is optional.',text:true},
{id:'contact',title:'How should we reach you?',help:'Last step. We only need your name and email.',contact:true}
];
let step=0;const answers={};
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function save(){
const q=qs[step];
if(q.text)answers.details=el('details').value;
if(q.contact)for(const id of ['fullName','email','org','reply','phone'])answers[id]=el(id).value.trim();
if(q.options&&el('other'))answers[q.id+'Other']=el('other').value.trim();
}
function render(){
const q=qs[step];
el('counter').textContent=`Step ${step+1} of ${qs.length}`;
el('phase').textContent=['Your starting point','Your environment','Your priorities','Your timing','Additional context','Your details'][step];
el('bar').style.width=((step+1)/qs.length*100)+'%';
let html=`<div class="fade"><h2>${escapeHtml(q.title)}</h2><p style="color:var(--muted)">${escapeHtml(q.help)}</p>`;
if(q.options){
 html+='<div class="options">';
 q.options.forEach(o=>{
 const checked=q.multi?(answers[q.id]||[]).includes(o):answers[q.id]===o;
 html+=`<label class="option"><input type="${q.multi?'checkbox':'radio'}" name="choice" value="${escapeHtml(o)}" ${checked?'checked':''}><span>${escapeHtml(o)}</span></label>`;
 });
 html+='</div>';
 const other=q.multi?(answers[q.id]||[]).includes('Something else'):answers[q.id]==='Something else';
 if(other)html+=`<div class="field"><label for="other">In your own words</label><input id="other" maxlength="350" value="${escapeHtml(answers[q.id+'Other']||'')}" placeholder="Tell us a little more"></div>`;
}else if(q.text){
 html+=`<div class="field"><label for="details">Additional context (optional)</label><textarea id="details" maxlength="2500" placeholder="What are you trying to change?">${escapeHtml(answers.details||'')}</textarea></div>`;
}else{
 for(const [id,label,type,required] of [['fullName','Your name','text',true],['email','Email address','email',true],['org','Organization (optional)','text',false],['phone','Phone (optional)','tel',false]]){
 html+=`<div class="field"><label for="${id}">${label}${required?' *':''}</label><input id="${id}" type="${type}" ${required?'required':''} maxlength="250" value="${escapeHtml(answers[id]||'')}"></div>`;
 }
 html+=`<div class="field"><label for="reply">Preferred reply</label><select id="reply"><option value="Email" ${answers.reply!=='Phone'?'selected':''}>Email</option><option value="Phone" ${answers.reply==='Phone'?'selected':''}>Phone</option></select></div>`;
 html+='<p style="font-size:.8rem;color:var(--muted)">Please do not include passwords or sensitive account information.</p>';
}
el('question').innerHTML=html+'</div>';
el('back').disabled=step===0;
el('next').textContent=step===5?'Review my message →':'Next →';
el('question').querySelectorAll('input[name=choice]').forEach(input=>input.addEventListener('change',()=>{
 if(q.multi){
  const picked=[...el('question').querySelectorAll('input[name=choice]:checked')].map(x=>x.value);
  if(picked.length>3){input.checked=false;return;}
  answers[q.id]=picked;
 }else answers[q.id]=input.value;
 render();
}));
}
function check(){
const q=qs[step];save();
if(q.contact){
 for(const id of ['fullName','email']){const node=el(id);if(!node.checkValidity()||!node.value.trim()){node.reportValidity();node.focus();return false;}}
 if(answers.reply==='Phone'&&!answers.phone){alert('Please enter a phone number or choose email as your preferred reply.');return false;}
}else if(q.options&&!(q.multi?(answers[q.id]||[]).length:answers[q.id])){alert('Please select an answer.');return false;}
return true;
}
function describe(id){
const val=answers[id];const text=Array.isArray(val)?val.join(', '):(val||'Not specified');
return text+(answers[id+'Other']?' ('+answers[id+'Other']+')':'');
}
function review(){
el('subject').value='GRTC conversation | '+(answers.need||'New inquiry');
el('message').value=`Hello GRTC,

My name is ${answers.fullName}${answers.org?' and I am reaching out from '+answers.org:''}. I would like to start a conversation.

WHAT BRINGS ME HERE
${describe('need')}

MY ENVIRONMENT
${describe('place')}

WHAT I WOULD LIKE TO ACCOMPLISH
${describe('goals')}

WHERE I AM IN THE PROCESS
${describe('stage')}

ADDITIONAL CONTEXT
${answers.details?.trim()||'No additional details yet.'}

HOW TO REACH ME
Preferred method: ${answers.reply||'Email'}
Email: ${answers.email}
${answers.phone?'Phone: '+answers.phone+'\n':''}
I would appreciate your thoughts on a sensible next step.

Thank you,
${answers.fullName}`;
el('question').classList.add('hidden');el('navigation').classList.add('hidden');el('review').classList.remove('hidden');
el('counter').textContent='Review & send';el('phase').textContent='Your introduction';el('bar').style.width='100%';
const formReady=/^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+$/.test(cfg.formEndpoint||'');
const emailReady=/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cfg.recipientEmail||'');
el('sendForm').disabled=!formReady;el('sendEmail').disabled=!emailReady;
el('status').textContent=(!formReady||!emailReady)?'Before launch: configure your verified recipient email and Formspree endpoint in config.js.':'';
}
el('next').addEventListener('click',()=>{if(!check())return;if(step===5)review();else{step++;render();}});
el('back').addEventListener('click',()=>{if(step){save();step--;render();}});
el('edit').addEventListener('click',()=>{el('review').classList.add('hidden');el('question').classList.remove('hidden');el('navigation').classList.remove('hidden');render();});
el('copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(el('subject').value+'\n\n'+el('message').value);el('status').textContent='Copied to clipboard.';}catch{el('message').select();el('status').textContent='Select and copy the message above.';}});
el('sendEmail').addEventListener('click',()=>{
if(!cfg.recipientEmail)return;
const url='mailto:'+encodeURIComponent(cfg.recipientEmail)+'?subject='+encodeURIComponent(el('subject').value)+'&body='+encodeURIComponent(el('message').value);
if(url.length>1900)el('status').textContent='Long messages may be truncated by some email apps. Use Copy message if needed.';
location.href=url;
});
el('sendForm').addEventListener('click',async()=>{
if(!cfg.formEndpoint)return;
const btn=el('sendForm');btn.disabled=true;btn.textContent='Sending…';el('status').textContent='';
try{
const response=await fetch(cfg.formEndpoint,{method:'POST',headers:{'Accept':'application/json','Content-Type':'application/json'},body:JSON.stringify({name:answers.fullName,email:answers.email,organization:answers.org||'',phone:answers.phone||'',preferred_reply:answers.reply||'Email',subject:el('subject').value,message:el('message').value})});
if(!response.ok)throw Error('Form provider did not accept submission');
btn.textContent='Message sent';el('sendEmail').disabled=true;el('status').textContent='Your message has been submitted. Thank you.';
}catch{btn.disabled=false;btn.textContent='Try sending again';el('status').textContent='We could not confirm delivery. Please use the email option or copy the message.';}
});
render();
})();
