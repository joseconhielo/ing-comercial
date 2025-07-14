// script.js
(function () {
  const courses = [...document.querySelectorAll('.course')];
  const courseMap = new Map();

  // Restaurar cursos aprobados desde localStorage
  const saved = JSON.parse(localStorage.getItem('mallaStates') || '{}');

  courses.forEach(el => {
    const id = el.id;
    const prereqList = (el.dataset.prereqs || '').split(',').map(s => s.trim()).filter(Boolean);
    courseMap.set(id, { el, prereqList });
    if (saved[id]) {
      el.classList.add('approved');
    }
  });

  function updateLocks() {
    courseMap.forEach(({ el, prereqList }) => {
      if (el.classList.contains('approved')) {
        el.classList.remove('locked');
        el.setAttribute('aria-disabled', 'false');
        return;
      }
      const met = prereqList.every(pr => document.getElementById(pr)?.classList.contains('approved'));
      if (met) {
        el.classList.remove('locked');
        el.setAttribute('aria-disabled', 'false');
      } else {
        el.classList.add('locked');
        el.setAttribute('aria-disabled', 'true');
      }
    });
  }

  updateLocks();

  courses.forEach(el => {
    el.addEventListener('click', () => {
      if (el.classList.contains('locked') || el.classList.contains('approved')) return;
      el.classList.add('approved');
      saved[el.id] = true;
      localStorage.setItem('mallaStates', JSON.stringify(saved));
      updateLocks();
    });
  });
})();
