const menu = document.querySelector('.menu-button');
const nav = document.querySelector('#navigation');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menú');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus();}});
const booking=document.querySelector('#booking');
const service=document.querySelector('#service');
let trigger;
function openBooking(button,choice){trigger=button;service.value=choice||'Primera evaluación';closeMenu();booking.showModal();}
document.querySelectorAll('[data-book],.service-book').forEach(button=>button.addEventListener('click',()=>openBooking(button,button.dataset.service)));
document.querySelector('.close-dialog').addEventListener('click',()=>booking.close());
booking.addEventListener('click',event=>{if(event.target===booking){const r=booking.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)booking.close();}});
booking.addEventListener('close',()=>trigger?.focus());
document.querySelector('#booking-form').addEventListener('submit',event=>{event.preventDefault();const message=`Hola, Aquazul. Me interesa ${service.value.toLowerCase()}. Quisiera información para coordinar una cita.`;window.open('https://wa.me/18097707289?text='+encodeURIComponent(message),'_blank','noopener,noreferrer');});
document.querySelector('#year').textContent=new Date().getFullYear();
const grid=document.querySelector('.service-grid');
const cards=[...grid.querySelectorAll('.service-card')];
const explorer=document.createElement('div');explorer.className='treatment-explorer';
const diamond=document.createElement('div');diamond.className='diamond';diamond.setAttribute('role','group');diamond.setAttribute('aria-label','Selecciona un tratamiento');
const detail=document.createElement('div');detail.className='treatment-detail';detail.id='treatment-detail';
const detailBody=document.createElement('div');detailBody.setAttribute('aria-live','polite');detailBody.setAttribute('aria-atomic','true');
const title=document.createElement('h3');const description=document.createElement('p');detailBody.append(title,description);
const consult=document.createElement('button');consult.className='button';consult.textContent='Consultar tratamiento ↗';consult.addEventListener('click',()=>openBooking(consult,title.textContent));
const controls=document.createElement('div');controls.className='explorer-controls';
const previous=document.createElement('button');previous.type='button';previous.textContent='←';previous.setAttribute('aria-label','Tratamiento anterior');
const next=document.createElement('button');next.type='button';next.textContent='→';next.setAttribute('aria-label','Tratamiento siguiente');
const count=document.createElement('span');controls.append(previous,count,next);detail.append(detailBody,consult,controls);
let active=0;
const selectors=cards.map((card,index)=>{const button=document.createElement('button');button.type='button';button.className='diamond-item';button.setAttribute('aria-controls','treatment-detail');button.append(card.querySelector('svg').cloneNode(true));const label=document.createElement('span');label.textContent=card.querySelector('h3').textContent;button.append(label);button.addEventListener('click',()=>select(index));diamond.append(button);return button;});
const center=document.createElement('span');center.className='diamond-center';center.textContent='aquazul';center.setAttribute('aria-hidden','true');diamond.append(center);
function select(index){active=(index+cards.length)%cards.length;selectors.forEach((b,i)=>{b.dataset.position=String((i-active+cards.length)%cards.length);b.setAttribute('aria-pressed',String(i===active));});title.textContent=cards[active].querySelector('h3').textContent;description.textContent=cards[active].querySelector('strong').textContent+' '+cards[active].querySelector('p').textContent;count.textContent=`${active+1} / ${cards.length}`;}
previous.addEventListener('click',()=>select(active-1));next.addEventListener('click',()=>select(active+1));
diamond.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();select(active+(e.key==='ArrowRight'?1:-1));selectors[active].focus();}});
explorer.append(diamond,detail);grid.replaceWith(explorer);select(0);
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
if(!reduced.matches&&'IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;observer.unobserve(entry.target);const heading=entry.target;const original=heading.innerHTML;const accessible=document.createElement('span');accessible.className='visually-hidden';accessible.textContent=heading.textContent;const visual=document.createElement('span');visual.setAttribute('aria-hidden','true');visual.innerHTML=original;heading.replaceChildren(accessible,visual);const walker=document.createTreeWalker(visual,NodeFilter.SHOW_TEXT);const letters=[];const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(node=>{const fragment=document.createDocumentFragment();for(const character of node.textContent){const letter=document.createElement('span');letter.textContent=character;letter.style.visibility='hidden';letters.push(letter);fragment.append(letter);}node.replaceWith(fragment);});let start;function reveal(now){start??=now;const limit=reduced.matches?letters.length:Math.ceil((now-start)/22);letters.forEach((letter,i)=>{if(i<limit)letter.style.visibility='visible';});if(limit<letters.length)requestAnimationFrame(reveal);else heading.innerHTML=original;}requestAnimationFrame(reveal);});},{threshold:.25});document.querySelectorAll('h1,h2,.steps h3,.team h3').forEach(h=>observer.observe(h));}
