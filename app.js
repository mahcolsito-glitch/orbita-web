(() => {
'use strict';
const config = window.ORBITA_CONFIG || {};
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const nav = document.querySelector('#navigation');
const toggle = document.querySelector('.menu-toggle');
const setMenu = open => { toggle.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); };
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
nav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); toggle.focus(); } });
document.addEventListener('click', event => { if (!event.target.closest('.header')) setMenu(false); });
matchMedia('(min-width: 761px)').addEventListener('change', e => { if (e.matches) setMenu(false); });
const dimensions = [
{ name:'Strategy / Estrategia', title:'Primero entendemos. Después decidimos.', text:'Conocemos tu negocio, tu audiencia y tu recorrido de compra. Definimos objetivos, prioridades y una hoja de ruta compartida.', items:['Diagnóstico del ecosistema','Objetivos comerciales acordados','Prioridades y hoja de ruta'], connection:'La estrategia orienta la marca, los canales y las campañas. El feedback comercial vuelve a ajustar las prioridades.' },
{ name:'Brand / Marca', title:'Una identidad que sostiene tu dirección.', text:'Fortalecemos lo que tu marca representa: su posicionamiento, su mensaje y su universo visual. Revisamos su identidad cuando el negocio necesita una transformación.', items:['Posicionamiento y mensajes clave','Lineamientos visuales','Coherencia entre canales'], connection:'La identidad guía el contenido, la experiencia web y las piezas de campaña. Cada punto de contacto expresa la misma marca.' },
{ name:'Presence / Presencia', title:'Cada punto de contacto cuenta.', text:'Desarrollamos los canales donde tu marca se encuentra con las personas, con una identidad compartida y un siguiente paso claro.', items:['Redes, web, ecommerce y Tiendanube','Contenido, fotografía y video','Eventos y automatizaciones acordadas'], connection:'La presencia recibe el tráfico de las campañas y facilita la consulta o la compra. Las fricciones detectadas orientan nuevas mejoras.' },
{ name:'Growth / Crecimiento', title:'Generar atención. Activar oportunidades.', text:'Conectamos campañas y contenidos con objetivos comerciales. La activación considera tanto a la audiencia como el recorrido que puede sostener el negocio.', items:['Meta Ads y Google Ads','Adquisición y generación de demanda','Lanzamientos, seguimiento y ajustes'], connection:'Las campañas se nutren de la marca y el contenido, llevan personas a los canales y permiten aprender de la calidad de las oportunidades.' },
{ name:'Conversion / Conversión', title:'Del interés a una oportunidad concreta.', text:'Definimos criterios de calificación y derivamos contactos con intención de compra a tu WhatsApp, equipo comercial o web.', items:['Recorrido y criterios de calificación','Derivación con información relevante','Feedback del equipo comercial'], connection:'La información de las consultas y del avance hacia la compra vuelve a la estrategia. Cuando participa tu equipo, la atención y el cierre quedan a su cargo.' }
];
const tabs = [...document.querySelectorAll('[data-dimension]')];
const panel = document.querySelector('#dimension-panel');
function activate(index, focus=false) {
 const data = dimensions[index];
 tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
 panel.setAttribute('aria-labelledby', tabs[index].id);
 panel.querySelector('.panel-count').textContent = `0${index+1} / 05`;
 panel.querySelector('.panel-label').textContent = data.name;
 panel.querySelector('h3').textContent = data.title;
 panel.querySelector(':scope > p').textContent = data.text;
 panel.querySelector('ul').replaceChildren(...data.items.map(text => { const li=document.createElement('li'); li.textContent=text; return li; }));
 panel.querySelector('.panel-connection p').textContent = data.connection;
 if (focus) tabs[index].focus();
}
tabs.forEach((tab,index) => {
 tab.addEventListener('click', () => activate(index));
 tab.addEventListener('keydown', event => {
  let next;
  if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next=(index+1)%tabs.length;
  if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next=(index+tabs.length-1)%tabs.length;
  if (event.key === 'Home') next=0;
  if (event.key === 'End') next=tabs.length-1;
  if (next !== undefined) { event.preventDefault(); activate(next,true); }
 });
});
const safeURL = value => { try { const url=new URL(value); return /^https?:$/.test(url.protocol) ? url.href : ''; } catch { return ''; } };
const localImage = value => typeof value==='string' && /^(assets\/[\w\-./]+\.(webp|png|jpg|jpeg|avif))$/i.test(value) && !value.includes('..') ? value : '';
const dialog=document.querySelector('#contact-dialog');
const email=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.CONTACT_EMAIL || '') ? config.CONTACT_EMAIL : '';
function pending(channel) {
 document.querySelector('#dialog-description').textContent = channel==='calendar' ? 'La agenda de reuniones estará disponible próximamente.' : 'Nuestro canal de WhatsApp estará disponible próximamente.';
 const alternative=document.querySelector('#dialog-alternative');
 alternative.hidden=!email;
 if (email) alternative.href=`mailto:${email}`;
 dialog.showModal();
}
const calendar=safeURL(config.CALENDAR_URL);
document.querySelectorAll('[data-calendar]').forEach(link => {
 if(calendar) { link.href=calendar; link.target='_blank'; link.rel='noopener noreferrer'; }
 else link.addEventListener('click',event => { event.preventDefault(); pending('calendar'); });
});
const whatsapp=document.querySelector('[data-whatsapp]');
const number=String(config.WHATSAPP_NUMBER || '').replace(/\D/g,'');
if (number.length >= 8 && number.length <=15) { whatsapp.href=`https://wa.me/${number}?text=${encodeURIComponent(config.WHATSAPP_MESSAGE || 'Hola, me gustaría conversar con Orbita.')}`; whatsapp.target='_blank'; whatsapp.rel='noopener noreferrer'; }
else whatsapp.addEventListener('click',event => { event.preventDefault(); pending('whatsapp'); });
document.querySelectorAll('.dialog-close,.dialog-dismiss').forEach(button => button.addEventListener('click',()=>dialog.close()));
dialog.addEventListener('click',event => { if(event.target===dialog) { const rect=dialog.getBoundingClientRect(); if(event.clientX<rect.left || event.clientX>rect.right || event.clientY<rect.top || event.clientY>rect.bottom) dialog.close(); } });
const clients=Array.isArray(config.CLIENTS) ? config.CLIENTS.filter(client=>client.name && localImage(client.logo)) : [];
if (clients.length) {
 document.querySelector('#clients-title').textContent='Ellos ya expandieron su órbita. ¿Qué estás esperando?';
 document.querySelector('#clients-note').textContent='Marcas que confiaron en Orbita para conectar su ecosistema digital.';
 const group=document.createElement('div');group.className='logo-group';
 const count=Math.max(5,clients.length);
 for(let i=0;i<count;i++) {
  const client=clients[i%clients.length], url=safeURL(client.url);
  const item=document.createElement(url ? 'a':'span');item.className='client-logo';
  if(url) {item.href=url;item.target='_blank';item.rel='noopener noreferrer';}
  const image=document.createElement('img');image.src=client.logo;image.alt=client.name;image.width=160;image.height=70;image.loading='lazy';item.append(image);group.append(item);
 }
 const clone=group.cloneNode(true);clone.setAttribute('aria-hidden','true');clone.querySelectorAll('a').forEach(a=>a.tabIndex=-1);
 document.querySelector('#client-track').replaceChildren(group,clone);
 document.querySelector('.marquee').setAttribute('aria-label','Empresas que confiaron en Orbita');
}
const marquee=document.querySelector('.marquee');
const pause=document.querySelector('#marquee-toggle');
pause.addEventListener('click',()=> { const paused=marquee.classList.toggle('paused');pause.setAttribute('aria-pressed',String(paused));pause.textContent=paused?'Reanudar movimiento':'Pausar movimiento'; });
const syncMotion=()=> { pause.hidden=reduced.matches; };syncMotion();reduced.addEventListener('change',syncMotion);
const team=Array.isArray(config.TEAM) ? config.TEAM.filter(member=>member.name && member.role) : [];
if(team.length) {
 document.querySelector('#team-note').hidden=true;
 const cards=team.map((member,index)=> {
  const article=document.createElement('article');article.className='team-card';
  const photo=localImage(member.photo);
  if(photo) { const image=document.createElement('img');image.className='portrait';image.src=photo;image.alt=`${member.name}, ${member.role}`;image.width=640;image.height=720;image.loading='lazy';article.append(image); }
  else { const placeholder=document.createElement('div');placeholder.className='portrait-placeholder';const n=document.createElement('span');n.textContent=String(index+1).padStart(2,'0');const text=document.createElement('p');text.textContent='Fotografía por incorporar';placeholder.append(n,text);article.append(placeholder); }
  [['h3',member.name],['p',member.role],['p',member.description],['span',member.specialty]].forEach(([tag,text])=>{if(text){const item=document.createElement(tag);item.textContent=text;if(tag==='span')item.className='specialty';if(text===member.description)item.className='description';article.append(item);}});
  const url=safeURL(member.linkedin);if(url){const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=`LinkedIn de ${member.name}`;article.append(a);}
  return article;
 });document.querySelector('#team-grid').replaceChildren(...cards);
}
if ('IntersectionObserver' in window) {
 document.documentElement.classList.add('js');
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=> {if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}}),{threshold:.12});
 document.querySelectorAll('.reveal').forEach(item=>observer.observe(item));
 const connectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('is-connected',entry.isIntersecting)),{threshold:.25});connectionObserver.observe(document.querySelector('[data-connect]'));
}
const progress=document.querySelector('.reading-progress');let scheduled=false;
function updateScroll() {
 const max=document.documentElement.scrollHeight-innerHeight;
 progress.style.transform=`scaleX(${max>0 ? Math.min(1,scrollY/max):0})`;
 const visible=scrollY>180;whatsapp.classList.toggle('visible',visible);whatsapp.setAttribute('aria-hidden',String(!visible));whatsapp.tabIndex=visible?0:-1;
 scheduled=false;
}
addEventListener('scroll',()=> {if(!scheduled){scheduled=true;requestAnimationFrame(updateScroll);}},{passive:true});addEventListener('resize',updateScroll);updateScroll();
document.querySelector('#year').textContent=new Date().getFullYear();
})();
