const aqEnglish = document.documentElement.lang === 'en';
const aqAssets = new URL('assets/', document.currentScript.src).href;
const aqText = aqEnglish ? {
  openMenu: 'Open menu', closeMenu: 'Close menu', firstVisit: 'First assessment',
  play: 'Play', pause: 'Pause', resume: 'Resume slideshow', pauseCarousel: 'Pause slideshow'
} : {
  openMenu: 'Abrir menú', closeMenu: 'Cerrar menú', firstVisit: 'Primera evaluación',
  play: 'Reproducir', pause: 'Pausar', resume: 'Reanudar carrusel', pauseCarousel: 'Pausar carrusel'
};
const aqStudiesEN = [
  {title: '3D CBCT Scan', copy: 'A three-dimensional view that complements the assessment requested by your dentist.', detail: 'Check the requirements for your requested study with our team before your visit.', image: 'tomografia.webp'},
  {title: 'Digital Panoramic X-ray', copy: 'An overview of the teeth and maxillofacial structures in a single study.', detail: "Share your dentist's referral to confirm the requested study.", image: 'radiografias.webp'},
  {title: 'Lateral Cephalometric X-ray', copy: 'A side-view projection used when your dentist needs to assess craniofacial relationships.', detail: 'Our team will explain how to arrange the study and what to bring.', image: 'lateral.webp'},
  {title: 'AP/PA X-rays', copy: 'Projections from different directions according to the requested assessment.', detail: 'Confirm with our team which projection is specified on your referral.', image: 'radiografias.webp'},
  {title: 'Hand and Wrist X-ray', copy: 'A study of the hand that may support certain growth assessments.', detail: "Check your professional's instructions with our team before visiting.", image: 'radiografias.webp'},
  {title: 'Digital Models and Available Additional Services', copy: 'Digital records and other resources that may support diagnosis and planning.', detail: 'Ask about availability and the type of record you need.', image: 'escaner.webp'},
  {title: 'Radiology Reports', copy: 'Documentation of findings from the studies performed, where applicable.', detail: 'Ask our team about the scope of the report and its delivery time.', image: 'radiografias.webp'}
];
function syncLanguageLinks() {
  document.querySelectorAll('.language-switch a').forEach(link => {
    const target = new URL(link.href);
    target.hash = location.hash;
    link.href = target.href;
  });
}
syncLanguageLinks();
addEventListener('hashchange', syncLanguageLinks);
