(() => {
  const section = document.querySelector('#turismo-dental');
  if (!section) return;
  const tablist = section.querySelector('.tourism-tablist');
  const tabs = [...tablist.querySelectorAll('[data-tourism-tab]')];
  const panels = [...section.querySelectorAll('[data-tourism-panel]')];

  function selectTab(index, focus = false) {
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
      panels[i].classList.toggle('is-current', i === index);
    });
    if (focus) tabs[index].focus();
  }
  tablist.setAttribute('role', 'tablist');
  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].setAttribute('aria-labelledby', tab.id);
    tab.addEventListener('click', () => selectTab(index));
    tab.addEventListener('keydown', event => {
      const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      let next = event.key === 'ArrowRight' ? index + 1 : index - 1;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      selectTab((next + tabs.length) % tabs.length, true);
    });
  });
  selectTab(0);
  tablist.hidden = false;

  const english = document.documentElement.lang === 'en';
  const unitControls = section.querySelector('.temperature-units');
  function setUnit(unit) {
    section.querySelectorAll('[data-temperature]').forEach(element => {
      const celsius = Number(element.dataset.temperature);
      const value = unit === 'F' ? celsius * 9 / 5 + 32 : celsius;
      element.textContent = value.toLocaleString(english ? 'en-US' : 'es-DO', {
        minimumFractionDigits: 1, maximumFractionDigits: 1
      });
    });
    section.querySelectorAll('.climate-unit').forEach(label => { label.textContent = '°' + unit; });
    unitControls.querySelectorAll('button').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.temperatureUnit === unit));
    });
  }
  unitControls.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => setUnit(button.dataset.temperatureUnit));
  });
  setUnit('C');
  unitControls.hidden = false;

  const trigger = document.querySelector('#tourism-biography');
  const biography = document.querySelector('#tourism-bio');
  trigger.addEventListener('click', () => biography.showModal());
  biography.querySelector('.tourism-bio-close').addEventListener('click', () => biography.close());
  biography.addEventListener('close', () => trigger.focus());
  biography.addEventListener('click', event => {
    if (event.target !== biography) return;
    const box = biography.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right ||
        event.clientY < box.top || event.clientY > box.bottom) biography.close();
  });
})();
