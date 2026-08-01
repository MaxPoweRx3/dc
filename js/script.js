// Accessible menu toggle + accessible form validation with aria-live feedback
document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Menu toggle ---------- */
  const menuBtn = document.getElementById('menuBtn');
  const menu = document.getElementById('menu');

  if (menuBtn && menu) {
    function openMenu() {
      menu.classList.add('open');
      menuBtn.setAttribute('aria-expanded', 'true');
      const firstLink = menu.querySelector('a');
      if (firstLink) firstLink.focus();
    }
    function closeMenu() {
      menu.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.focus();
    }
    menuBtn.addEventListener('click', () => {
      const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
      if (expanded) closeMenu(); else openMenu();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
    });
    document.addEventListener('click', (e) => {
      if (!menu.classList.contains('open')) return;
      if (menu.contains(e.target) || menuBtn.contains(e.target)) return;
      closeMenu();
    });
  }

  /* ---------- Form validation ---------- */
  const form = document.getElementById('contactForm');
  const statusRegion = document.getElementById('formStatus');

  if (!form) return;

  function setError(input, message) {
    const err = document.getElementById('error-' + input.id);
    if (err) err.textContent = message || '';
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function clearErrors() {
    ['nombre','correo','mensaje'].forEach(id => {
      const el = document.getElementById(id);
      if (el) setError(el, '');
    });
  }

  function validate() {
    let valid = true;
    clearErrors();

    const nombre = form.nombre;
    const correo = form.correo;
    const mensaje = form.mensaje;

    if (!nombre.value.trim()) {
      setError(nombre, 'Por favor ingresa tu nombre.');
      valid = false;
    }

    if (!correo.value.trim()) {
      setError(correo, 'Por favor ingresa tu correo.');
      valid = false;
    } else {
      // simple email pattern
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(correo.value.trim())) {
        setError(correo, 'Por favor ingresa un correo válido.');
        valid = false;
      }
    }

    if (!mensaje.value.trim()) {
      setError(mensaje, 'Por favor escribe un mensaje.');
      valid = false;
    } else if (mensaje.value.trim().length < 10) {
      setError(mensaje, 'Escribe al menos 10 caracteres.');
      valid = false;
    }

    return valid;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validate()) {
      // Move focus to first invalid field
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      statusRegion.textContent = 'Hay campos con errores. Revisa los mensajes y vuelve a intentarlo.';
      return;
    }

    // If valid: simulate send (replace with real fetch to endpoint)
    statusRegion.textContent = 'Enviando...';

    // Example: simulate network request
    setTimeout(() => {
      // on success
      form.reset();
      clearErrors();
      statusRegion.textContent = 'Mensaje enviado correctamente. Gracias por contactarte.';
      // move focus to status region so screen readers announce it
      statusRegion.tabIndex = -1;
      statusRegion.focus();

      // Remove focusable attribute after announcement (cleanup)
      setTimeout(() => {
        try { statusRegion.removeAttribute('tabindex'); } catch (err) {}
      }, 1000);
    }, 750);
  });

});
