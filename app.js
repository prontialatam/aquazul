const menu = document.querySelector('.menu-button');
const nav = document.querySelector('#navigation');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label',aqText.openMenu);}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?aqText.closeMenu:aqText.openMenu);});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus();}});
const booking=document.querySelector('#booking');
const service=document.querySelector('#service');
let trigger;
function openBooking(button,choice){trigger=button;service.value=choice||aqText.firstVisit;closeMenu();booking.showModal();}
document.querySelectorAll('[data-book],.service-book').forEach(button=>button.addEventListener('click',()=>openBooking(button,button.dataset.service)));
document.querySelector('.close-dialog').addEventListener('click',()=>booking.close());
booking.addEventListener('click',event=>{if(event.target===booking){const r=booking.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)booking.close();}});
booking.addEventListener('close',()=>trigger?.focus());
document.querySelector('#booking-form').addEventListener('submit',event=>{event.preventDefault();const message=aqEnglish?`Hello, Aquazul. I am interested in ${service.value.toLowerCase()}. I would like information to arrange an appointment.`:`Hola, Aquazul. Me interesa ${service.value.toLowerCase()}. Quisiera información para coordinar una cita.`;window.open('https://wa.me/18097707289?text='+encodeURIComponent(message),'_blank','noopener,noreferrer');});
document.querySelector('#year').textContent=new Date().getFullYear();
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
if(!reduced.matches&&'IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;observer.unobserve(entry.target);const heading=entry.target;const original=heading.innerHTML;const accessible=document.createElement('span');accessible.className='visually-hidden';accessible.textContent=heading.textContent;const visual=document.createElement('span');visual.setAttribute('aria-hidden','true');visual.innerHTML=original;heading.replaceChildren(accessible,visual);const walker=document.createTreeWalker(visual,NodeFilter.SHOW_TEXT);const letters=[];const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(node=>{const fragment=document.createDocumentFragment();for(const character of node.textContent){const letter=document.createElement('span');letter.textContent=character;letter.style.visibility='hidden';letters.push(letter);fragment.append(letter);}node.replaceWith(fragment);});let start;function reveal(now){start??=now;const limit=reduced.matches?letters.length:Math.ceil((now-start)/22);letters.forEach((letter,i)=>{if(i<limit)letter.style.visibility='visible';});if(limit<letters.length)requestAnimationFrame(reveal);else heading.innerHTML=original;}requestAnimationFrame(reveal);});},{threshold:.25});document.querySelectorAll('h1,h2,.steps h3,.team h3').forEach(h=>observer.observe(h));}
