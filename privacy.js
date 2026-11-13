(() => {
  'use strict';
  const config = window.aquazulAnalytics;
  if (!config?.enabled || !/^G-[A-Z0-9]+$/.test(config.measurementId) || !config.hosts.includes(location.hostname)) return;
  const id = config.measurementId;
  const key = 'aquazul_privacy';
  const version = config.policyVersion;
  const en = document.documentElement.lang === 'en';
  const copy = en ? {
    title: 'Your privacy choices', description: 'With your permission, Google Analytics measures website visits and general contact clicks. We do not send messages, appointment reasons or clinical documents.',
    accept: 'Accept analytics', reject: 'Reject analytics', configure: 'Settings', cookies: 'Cookies and technologies', privacy: 'Privacy policy',
    close: 'Close settings', necessary: 'Necessary technologies', necessaryText: 'Website delivery, security and saving this choice. Always active.', analytics: 'Optional analytics', analyticsText: 'Google Analytics measures visits and general interaction. Advertising features are disabled.',
    save: 'Save preferences', saved: 'Your privacy preferences have been saved.', withdrawal: 'You can withdraw permission here at any time. Withdrawal stops future collection; it does not erase data already received by Google.'
  } : {
    title: 'Tus preferencias de privacidad', description: 'Con tu permiso, Google Analytics mide las visitas a la web y los clics generales de contacto. No enviamos mensajes, motivos de cita ni documentos clínicos.',
    accept: 'Aceptar analítica', reject: 'Rechazar analítica', configure: 'Configurar', cookies: 'Cookies y tecnologías', privacy: 'Política de privacidad',
    close: 'Cerrar preferencias', necessary: 'Tecnologías necesarias', necessaryText: 'Entrega de la web, seguridad y conservación de esta elección. Siempre activas.', analytics: 'Analítica opcional', analyticsText: 'Google Analytics mide visitas e interacción general. Las funciones publicitarias están desactivadas.',
    save: 'Guardar preferencias', saved: 'Tus preferencias de privacidad se han guardado.', withdrawal: 'Puedes retirar el permiso aquí cuando quieras. La retirada detiene la recogida futura; no borra los datos ya recibidos por Google.'
  };
  const base = en ? '/en/legal/' : '/legal/';
  let choice;
  let loaded = false;
  let loadScript;
  let expiresTimer;
  let focusReturn;
  const disable = () => { window['ga-disable-' + id] = true; };
  function clearAnalyticsCookies() {
    document.cookie.split(';').forEach(entry => {
      const name = entry.trim().split('=')[0];
      if (!/^_ga(?:_|$)/.test(name)) return;
      for (const domain of ['', location.hostname, '.' + location.hostname]) {
        document.cookie = name + '=; Max-Age=0; Path=/; SameSite=Lax' + (domain ? '; Domain=' + domain : '');
      }
    });
  }
  function readChoice() {
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      if (saved && saved.version === version && typeof saved.analytics === 'boolean' && Number.isFinite(saved.updatedAt) && Number.isFinite(saved.expiresAt) && saved.updatedAt <= Date.now() && saved.expiresAt > Date.now() && saved.expiresAt - saved.updatedAt <= 185 * 86400000) return saved;
      localStorage.removeItem(key);
    } catch (_) { /* Storage may be unavailable; retain the current-page choice only. */ }
    return null;
  }
  function persist(analytics) {
    const date = new Date();
    const expiry = new Date(date);
    expiry.setMonth(expiry.getMonth() + config.consentMonths);
    choice = {version, analytics, updatedAt: date.getTime(), expiresAt: expiry.getTime()};
    try { localStorage.setItem(key, JSON.stringify(choice)); } catch (_) {}
  }
  function safeReferrer() {
    try {
      const url = new URL(document.referrer);
      const known = ['www.google.com','www.google.es','www.google.com.do','www.bing.com','duckduckgo.com','www.facebook.com','m.facebook.com','l.facebook.com','www.instagram.com','l.instagram.com','t.co','www.youtube.com'];
      return url.protocol === 'https:' && known.includes(url.hostname) ? url.origin + '/' : '';
    } catch (_) { return ''; }
  }
  function startAnalytics() {
    if (loaded || !choice?.analytics || choice.expiresAt <= Date.now()) return;
    loaded = true;
    window['ga-disable-' + id] = false;
    window.dataLayer = window.dataLayer || [];
    const tag = function () { window.dataLayer.push(arguments); };
    window.gtag = tag;
    tag('consent', 'default', {analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'});
    tag('consent', 'update', {analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'});
    const page = {page_location: location.origin + (en ? '/en/' : '/'), page_title: 'Aquazul', page_referrer: safeReferrer(), language: en ? 'en' : 'es'};
    tag('js', new Date());
    tag('set', 'ads_data_redaction', true);
    tag('set', 'url_passthrough', false);
    tag('set', page);
    tag('config', id, {...page, send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, cookie_domain: location.hostname, cookie_expires: 180 * 86400, cookie_update: false});
    tag('event', 'page_view', page);
    loadScript = document.createElement('script');
    loadScript.async = true;
    loadScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    loadScript.referrerPolicy = 'origin';
    document.head.append(loadScript);
    clearTimeout(expiresTimer);
    function expire() {
      const remaining = choice.expiresAt - Date.now();
      if (remaining > 0) { expiresTimer = setTimeout(expire, Math.min(remaining, 2147483647)); return; }
      disable(); clearAnalyticsCookies(); location.reload();
    }
    expire();
  }
  function stopAnalytics() {
    disable();
    clearTimeout(expiresTimer);
    clearAnalyticsCookies();
    loadScript?.remove();
    // A reload removes already-executed vendor code and its timers as well.
    if (loaded) location.reload();
  }
  const region = document.createElement('section');
  region.className = 'privacy-banner';
  region.setAttribute('role', 'region');
  region.setAttribute('aria-labelledby', 'privacy-banner-title');
  region.innerHTML = '<h2 id="privacy-banner-title">' + copy.title + '</h2><p>' + copy.description + '</p><p class="privacy-links"><a href="' + base + 'cookies.html">' + copy.cookies + '</a><a href="' + base + 'privacidad.html">' + copy.privacy + '</a></p><div class="privacy-actions"><button type="button" data-privacy-accept>' + copy.accept + '</button><button type="button" data-privacy-reject>' + copy.reject + '</button><button type="button" data-privacy-configure>' + copy.configure + '</button></div>';
  const panel = document.createElement('dialog');
  panel.className = 'privacy-panel';
  panel.id = 'privacy-preferences';
  panel.setAttribute('aria-labelledby', 'privacy-panel-title');
  panel.innerHTML = '<button class="privacy-close" type="button" aria-label="' + copy.close + '">×</button><h2 id="privacy-panel-title">' + copy.title + '</h2><p><strong>' + copy.necessary + '</strong><br>' + copy.necessaryText + '</p><label class="privacy-category"><input type="checkbox" id="privacy-analytics"><span><strong>' + copy.analytics + '</strong><br>' + copy.analyticsText + '</span></label><p>' + copy.withdrawal + '</p><p class="privacy-links"><a href="' + base + 'cookies.html">' + copy.cookies + '</a></p><div class="privacy-actions"><button type="button" data-privacy-save>' + copy.save + '</button><button type="button" data-privacy-reject>' + copy.reject + '</button></div>';
  const status = document.createElement('p');
  status.className = 'visually-hidden';
  status.setAttribute('role', 'status');
  document.body.append(region, panel, status);
  const checkbox = panel.querySelector('input');
  function showPreferences(event) {
    focusReturn = event?.currentTarget || document.activeElement;
    checkbox.checked = Boolean(choice?.analytics);
    panel.showModal();
  }
  function save(analytics) {
    persist(analytics);
    region.hidden = true;
    if (panel.open) panel.close();
    status.textContent = copy.saved;
    if (analytics) startAnalytics();
    else stopAnalytics();
  }
  document.querySelectorAll('[data-privacy-accept]').forEach(button => button.addEventListener('click', () => save(true)));
  document.querySelectorAll('[data-privacy-reject]').forEach(button => button.addEventListener('click', () => save(false)));
  document.querySelectorAll('[data-privacy-configure]').forEach(button => button.addEventListener('click', showPreferences));
  document.querySelectorAll('[data-privacy-settings]').forEach(button => {button.hidden = false; button.addEventListener('click', showPreferences);});
  panel.querySelector('[data-privacy-save]').addEventListener('click', () => save(checkbox.checked));
  panel.querySelector('.privacy-close').addEventListener('click', () => panel.close());
  panel.addEventListener('close', () => focusReturn?.focus());
  panel.addEventListener('click', event => {
    if (event.target !== panel) return;
    const rect = panel.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) panel.close();
  });
  document.addEventListener('click', event => {
    if (!choice?.analytics || choice.expiresAt <= Date.now() || !loaded) return;
    const link = event.target.closest('a[href]');
    const href = link?.getAttribute('href') || '';
    const channel = /^https:\/\/wa\.me\//.test(href) ? 'whatsapp' : href.startsWith('tel:') ? 'phone' : href.startsWith('mailto:') ? 'email' : '';
    if (channel) window.gtag('event', 'contact_click', {channel});
  }, {capture: true});
  document.querySelector('#booking-form')?.addEventListener('submit', () => {
    if (choice?.analytics && choice.expiresAt > Date.now() && loaded) window.gtag('event', 'contact_click', {channel: 'whatsapp'});
  }, {capture: true});
  window.addEventListener('storage', event => {
    if (event.key !== key) return;
    choice = readChoice();
    region.hidden = Boolean(choice);
    if (choice?.analytics) startAnalytics();
    else stopAnalytics();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) return;
    choice = readChoice();
    region.hidden = Boolean(choice);
    if (!choice?.analytics) stopAnalytics();
  });
  choice = readChoice();
  region.hidden = Boolean(choice);
  if (choice?.analytics) startAnalytics();
  else stopAnalytics();
})();
