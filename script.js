function updateFooterYear() {
  const year = new Date().getFullYear();
  document.querySelectorAll('.js-current-year').forEach(el => {
    el.textContent = year;
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateFooterYear);
} else {
  updateFooterYear();
}
