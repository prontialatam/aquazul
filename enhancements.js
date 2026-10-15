const imagingStudies=[{"title": "Tomografía CBCT 3D", "copy": "Una vista tridimensional que complementa la valoración indicada por tu odontólogo.", "detail": "Consulta con el equipo los requisitos del estudio solicitado antes de tu visita.", "image": "tomografia.webp"}, {"title": "Radiografía panorámica digital", "copy": "Una imagen general de dientes y estructuras maxilofaciales en un solo estudio.", "detail": "Comparte la orden de tu odontólogo para confirmar el estudio indicado.", "image": "radiografias.webp"}, {"title": "Radiografía lateral de cráneo", "copy": "Una proyección lateral utilizada cuando tu odontólogo necesita evaluar relaciones craneofaciales.", "detail": "El equipo te indicará cómo coordinarla y qué debes llevar.", "image": "lateral.webp"}, {"title": "Radiografías AP/PA", "copy": "Proyecciones desde distintas direcciones según la evaluación solicitada.", "detail": "Confirma con el equipo cuál de las proyecciones aparece en tu orden.", "image": "radiografias.webp"}, {"title": "Radiografía carpal", "copy": "Un estudio de la mano que puede apoyar determinadas evaluaciones de crecimiento.", "detail": "Consulta con el equipo las indicaciones de tu profesional antes de acudir.", "image": "radiografias.webp"}, {"title": "Modelos digitales y servicios complementarios disponibles", "copy": "Registros digitales y otros recursos que pueden apoyar el diagnóstico y la planificación.", "detail": "Pregunta por la disponibilidad y el tipo de registro que necesitas.", "image": "escaner.webp"}, {"title": "Informes radiológicos", "copy": "Documentación de los hallazgos de los estudios realizados, cuando corresponde.", "detail": "Consulta el alcance y el plazo de entrega del informe con el equipo.", "image": "radiografias.webp"}];
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const heroFrames = [...document.querySelectorAll('.hero-media .hero-image')];
if (heroFrames.length === 2) {
  let heroIndex = 0;
  let heroTimer;
  function resetHero() {
    clearInterval(heroTimer);
    heroIndex = 0;
    heroFrames.forEach((frame, index) => frame.classList.toggle('is-active', index === 0));
  }
  function startHero() {
    resetHero();
    if (motionPreference.matches || !heroFrames[1].complete || !heroFrames[1].naturalWidth) return;
    heroTimer = setInterval(() => {
      if (document.hidden) return;
      heroIndex = (heroIndex + 1) % heroFrames.length;
      heroFrames.forEach((frame, index) => frame.classList.toggle('is-active', index === heroIndex));
    }, 6200);
  }
  if (heroFrames[1].complete) startHero();
  else heroFrames[1].addEventListener('load', startHero, {once: true});
  motionPreference.addEventListener('change', startHero);
}
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
  document.querySelector('#study-index').textContent = `${String(selectedStudy + 1).padStart(2, '0')} / 07`;
  document.querySelector('#study-title').textContent = study.title;
  document.querySelector('#study-copy').textContent = study.copy;
  document.querySelector('#study-description').textContent = study.detail;
  const studyImage = document.querySelector('#study-image');
  const nextImage = `assets/${study.image}`;
  if (!studyImage.src.endsWith(nextImage)) studyImage.src = nextImage;
  studyImage.alt = `Imagen ilustrativa relacionada con ${study.title.toLowerCase()}`;
  document.querySelector('#study-contact').href = 'https://wa.me/18097707289?text=' + encodeURIComponent(`Hola, quisiera información sobre ${study.title.toLowerCase()} en Aqua Imágenes.`);
  const panel = document.querySelector('.study-description');
  panel.classList.remove('refresh');
  if (!motionPreference.matches) requestAnimationFrame(() => panel.classList.add('refresh'));
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
const techCarousel = document.querySelector('.tech-carousel');
if (techCarousel) {
  const slides = [...techCarousel.querySelectorAll('.tech-slide')];
  const dots = [...techCarousel.querySelectorAll('[data-tech-slide]')];
  const toggle = techCarousel.querySelector('#tech-toggle');
  const count = techCarousel.querySelector('#tech-count');
  let current = 0;
  let timer;
  let userPaused = false;
  let hovered = false;
  let focused = false;
  function showTech(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === current);
      slide.setAttribute('aria-hidden', String(i !== current));
    });
    dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === current)));
    count.textContent = `${String(current + 1).padStart(2, '0')} / 03`;
  }
  function syncTechTimer() {
    clearInterval(timer);
    if (userPaused || hovered || focused || document.hidden || motionPreference.matches || slides.some(slide => !slide.querySelector('img').complete || !slide.querySelector('img').naturalWidth)) return;
    timer = setInterval(() => showTech(current + 1), 5600);
  }
  slides.forEach(slide => slide.querySelector('img').addEventListener('load', syncTechTimer, {once: true}));
  dots.forEach((dot, i) => dot.addEventListener('click', () => {showTech(i); syncTechTimer();}));
  techCarousel.querySelector('#tech-prev').addEventListener('click', () => {showTech(current - 1); syncTechTimer();});
  techCarousel.querySelector('#tech-next').addEventListener('click', () => {showTech(current + 1); syncTechTimer();});
  toggle.addEventListener('click', () => {
    userPaused = !userPaused;
    toggle.textContent = userPaused ? 'Reproducir' : 'Pausar';
    toggle.setAttribute('aria-label', userPaused ? 'Reanudar carrusel' : 'Pausar carrusel');
    syncTechTimer();
  });
  techCarousel.addEventListener('mouseenter', () => {hovered = true; syncTechTimer();});
  techCarousel.addEventListener('mouseleave', () => {hovered = false; syncTechTimer();});
  techCarousel.addEventListener('focusin', () => {focused = true; syncTechTimer();});
  techCarousel.addEventListener('focusout', event => {
    if (techCarousel.contains(event.relatedTarget)) return;
    focused = false;
    syncTechTimer();
  });
  document.addEventListener('visibilitychange', syncTechTimer);
  motionPreference.addEventListener('change', syncTechTimer);
  syncTechTimer();
}
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
