const imagingStudies=[{"id": "tomografia", "title": "Tomografía dental 3D", "short": "Tomografía 3D", "copy": "Una perspectiva tridimensional para complementar la evaluación de tu odontólogo.", "detail": "Consulta la disponibilidad del estudio indicado en tu orden y los requisitos antes de tu visita."}, {"id": "escaner", "title": "Escáner intraoral", "short": "Escáner intraoral", "copy": "Una mirada digital de tu sonrisa.", "detail": "Consulta con el equipo cómo coordinar el escaneo solicitado por tu odontólogo."}, {"id": "radiografias", "title": "Radiografías panorámicas, carpal y de ATM", "short": "Panorámica · Carpal · ATM", "copy": "Diferentes estudios, en un mismo lugar.", "detail": "Indica al equipo cuál de estas radiografías aparece en tu orden para coordinar el estudio correspondiente."}, {"id": "lateral", "title": "Lateral de cráneo", "short": "Lateral de cráneo", "copy": "Otra perspectiva para tu valoración.", "detail": "Comparte con el equipo el nombre del estudio solicitado por tu odontólogo y consulta la preparación necesaria."}];
const demoConversation=[["Luis", "Hola, soy Luis. Me gustaría agendar una valoración de ortodoncia y saber cuánto cuesta el tratamiento."], ["Agente IA", "¡Hola, Luis! Con gusto te oriento. El primer paso es una valoración con el equipo de ortodoncia para conocer tus necesidades."], ["Luis", "Me interesan los brackets. ¿Pueden darme un presupuesto antes de decidir?"], ["Agente IA", "Sí, puedes solicitar un presupuesto. El equipo define el plan y su costo después de evaluarte; también puedes consultar el precio de la valoración antes de reservar."], ["Luis", "Perfecto. Preferiría una cita por la tarde. ¿Qué necesito llevar?"], ["Agente IA", "Le indicaremos al equipo tu preferencia. Ellos confirmarán los horarios disponibles y si debes llevar estudios previos."], ["Luis", "Muy bien, quiero coordinar la valoración y recibir la información del presupuesto."], ["Agente IA", "El siguiente paso es escribir al equipo por WhatsApp. Allí podrán confirmar contigo la fecha, los requisitos y el costo de la valoración. ¡Será un gusto acompañarte!"]];
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const photoDialog = document.querySelector('#photo-dialog');
let photoTrigger;
document.querySelectorAll('[data-photo]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    photoTrigger = link;
    const full = document.querySelector('#photo-full');
    full.src = link.href;
    full.alt = link.dataset.caption;
    document.querySelector('#photo-caption').textContent = link.dataset.caption;
    photoDialog.showModal();
  });
});
photoDialog.querySelector('.photo-close').addEventListener('click', () => photoDialog.close());
photoDialog.addEventListener('close', () => photoTrigger?.focus());
photoDialog.addEventListener('click', event => {
  if (event.target !== photoDialog) return;
  const bounds = photoDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) photoDialog.close();
});
const studyTiles = [...document.querySelectorAll('[data-study]')];
let selectedStudy = 0;
function chooseStudy(index) {
  selectedStudy = (index + imagingStudies.length) % imagingStudies.length;
  const study = imagingStudies[selectedStudy];
  studyTiles.forEach((tile, i) => tile.setAttribute('aria-pressed', String(i === selectedStudy)));
  document.querySelector('#study-index').textContent = `0${selectedStudy + 1} / 04`;
  document.querySelector('#study-title').textContent = study.title;
  document.querySelector('#study-copy').textContent = study.copy;
  document.querySelector('#study-description').textContent = study.detail;
  document.querySelector('#study-contact').href = 'https://wa.me/18097707289?text=' + encodeURIComponent(`Hola, quisiera información sobre ${study.title.toLowerCase()} en Aqua Imágenes.`);
  const panel = document.querySelector('.study-description');
  panel.classList.remove('refresh');
  requestAnimationFrame(() => panel.classList.add('refresh'));
}
studyTiles.forEach((tile, index) => tile.addEventListener('click', () => chooseStudy(index)));
document.querySelector('#study-prev').addEventListener('click', () => chooseStudy(selectedStudy - 1));
document.querySelector('#study-next').addEventListener('click', () => chooseStudy(selectedStudy + 1));
document.querySelector('.study-grid').addEventListener('keydown', event => {
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  let next = selectedStudy + (['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 1);
  if (event.key === 'Home') next = 0;
  if (event.key === 'End') next = studyTiles.length - 1;
  chooseStudy(next);
  studyTiles[selectedStudy].focus();
});
const reviewTrack = document.querySelector('#review-track');
const reviewSlides = [...reviewTrack.children];
const reviewCounter = document.querySelector('#review-counter');
let reviewIndex = 0;
function showReview(index) {
  reviewIndex = (index + reviewSlides.length) % reviewSlides.length;
  const offset = reviewSlides[reviewIndex].offsetLeft - reviewSlides[0].offsetLeft;
  reviewTrack.scrollTo({left: offset, behavior: motionPreference.matches ? 'instant' : 'smooth'});
  reviewCounter.textContent = `${reviewIndex + 1} / ${reviewSlides.length}`;
}
document.querySelector('#review-prev').addEventListener('click', () => showReview(reviewIndex - 1));
document.querySelector('#review-next').addEventListener('click', () => showReview(reviewIndex + 1));
reviewTrack.addEventListener('keydown', event => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  showReview(reviewIndex + (event.key === 'ArrowRight' ? 1 : -1));
});
let reviewScrollTimer;
reviewTrack.addEventListener('scroll', () => {
  clearTimeout(reviewScrollTimer);
  reviewScrollTimer = setTimeout(() => {
    const max = reviewTrack.scrollWidth - reviewTrack.clientWidth;
    if (reviewTrack.scrollLeft >= max - 2) reviewIndex = reviewSlides.length - 1;
    else reviewIndex = reviewSlides.reduce((best, slide, i) => Math.abs(slide.offsetLeft - reviewSlides[0].offsetLeft - reviewTrack.scrollLeft) < Math.abs(reviewSlides[best].offsetLeft - reviewSlides[0].offsetLeft - reviewTrack.scrollLeft) ? i : best, 0);
    reviewCounter.textContent = `${reviewIndex + 1} / ${reviewSlides.length}`;
  }, 130);
}, {passive: true});
const visual = document.querySelector('#chat-visual');
const viewport = document.querySelector('#chat-viewport');
const announcer = document.querySelector('#chat-announcer');
const toggle = document.querySelector('#chat-toggle');
const restart = document.querySelector('#chat-restart');
const progress = document.querySelector('#chat-progress');
let messageIndex = 0;
let characterIndex = 0;
let running = false;
let started = false;
let inView = false;
let timer;
let currentMessage;
let currentText;
function updateChatControl() {
  const finished = messageIndex >= demoConversation.length;
  toggle.textContent = finished ? 'Completada' : running ? 'Pausar' : started ? 'Continuar' : 'Reproducir';
  toggle.disabled = finished;
  progress.textContent = `${messageIndex} / ${demoConversation.length} mensajes`;
}
function addMessage(index, complete = false) {
  visual.querySelector('.chat-welcome')?.remove();
  const [who, text] = demoConversation[index];
  const bubble = document.createElement('div');
  bubble.className = 'chat-message' + (who === 'Luis' ? ' patient' : '');
  const label = document.createElement('span');
  label.className = 'message-name'; label.textContent = who;
  const body = document.createElement('p');
  body.textContent = complete ? text : '';
  if (!complete) body.className = 'message-typing';
  const time = document.createElement('span');
  time.className = 'message-time'; time.textContent = `10:0${Math.floor(index / 2)} · ejemplo`;
  bubble.append(label, body, time); visual.append(bubble);
  return {bubble, body};
}
function announce(index) {
  const item = document.createElement('p');
  item.textContent = demoConversation[index].join(': ');
  announcer.append(item);
}
function followChat(wasNearBottom) {
  if (wasNearBottom) viewport.scrollTop = viewport.scrollHeight;
}
function tick() {
  if (!running || !inView || document.hidden) return;
  if (messageIndex >= demoConversation.length) { running = false; updateChatControl(); return; }
  const nearBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 90;
  if (!currentMessage) {
    const message = addMessage(messageIndex);
    currentMessage = message.bubble; currentText = message.body;
  }
  const text = demoConversation[messageIndex][1];
  characterIndex++;
  currentText.textContent = text.slice(0, characterIndex);
  followChat(nearBottom);
  if (characterIndex >= text.length) {
    currentText.classList.remove('message-typing');
    announce(messageIndex);
    messageIndex++; characterIndex = 0; currentMessage = null;
    updateChatControl();
    timer = setTimeout(tick, 650);
  } else timer = setTimeout(tick, 20);
}
function setRunning(value) {
  clearTimeout(timer); running = value;
  if (running) { started = true; tick(); }
  updateChatControl();
}
function showCompleteConversation() {
  clearTimeout(timer); running = false; started = true;
  visual.replaceChildren(); announcer.replaceChildren();
  demoConversation.forEach((_, index) => addMessage(index, true));
  messageIndex = demoConversation.length; characterIndex = 0; currentMessage = null;
  viewport.scrollTop = 0; updateChatControl();
}
toggle.addEventListener('click', () => setRunning(!running));
restart.addEventListener('click', () => {
  clearTimeout(timer); visual.replaceChildren(); announcer.replaceChildren();
  messageIndex = 0; characterIndex = 0; currentMessage = null; viewport.scrollTop = 0;
  if (motionPreference.matches) showCompleteConversation();
  else setRunning(true);
});
if (motionPreference.matches || !('IntersectionObserver' in window)) showCompleteConversation();
else {
  const chatObserver = new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
    clearTimeout(timer);
    if (inView && !started) setRunning(true);
    else if (inView && running) tick();
  }, {threshold: .2});
  chatObserver.observe(document.querySelector('.chat-demo'));
}
document.addEventListener('visibilitychange', () => {
  clearTimeout(timer);
  if (!document.hidden && running && inView) tick();
});
motionPreference.addEventListener('change', event => {
  if (event.matches) showCompleteConversation();
});
if (!motionPreference.matches && 'IntersectionObserver' in window) {
  const sections = document.querySelectorAll('main > section:not(.hero) > .wrap,main > section.wrap');
  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible'); reveal.unobserve(entry.target);
  }), {threshold: 0, rootMargin: '0px 0px -35px 0px'});
  sections.forEach(section => {section.classList.add('motion-reveal'); reveal.observe(section);});
}
