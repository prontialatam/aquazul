const imagingStudies=[{"id": "tomografia", "title": "Tomografía dental 3D", "short": "Tomografía 3D", "copy": "Una perspectiva tridimensional para complementar la evaluación de tu odontólogo.", "detail": "Consulta la disponibilidad del estudio indicado en tu orden y los requisitos antes de tu visita."}, {"id": "escaner", "title": "Escáner intraoral", "short": "Escáner intraoral", "copy": "Una mirada digital de tu sonrisa.", "detail": "Consulta con el equipo cómo coordinar el escaneo solicitado por tu odontólogo."}, {"id": "radiografias", "title": "Radiografías panorámicas, carpal y de ATM", "short": "Panorámica · Carpal · ATM", "copy": "Diferentes estudios, en un mismo lugar.", "detail": "Indica al equipo cuál de estas radiografías aparece en tu orden para coordinar el estudio correspondiente."}, {"id": "lateral", "title": "Lateral de cráneo", "short": "Lateral de cráneo", "copy": "Otra perspectiva para tu valoración.", "detail": "Comparte con el equipo el nombre del estudio solicitado por tu odontólogo y consulta la preparación necesaria."}];
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
if (!motionPreference.matches && 'IntersectionObserver' in window) {
  const sections = document.querySelectorAll('main > section:not(.hero) > .wrap,main > section.wrap');
  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible'); reveal.unobserve(entry.target);
  }), {threshold: 0, rootMargin: '0px 0px -35px 0px'});
  sections.forEach(section => {section.classList.add('motion-reveal'); reveal.observe(section);});
}
