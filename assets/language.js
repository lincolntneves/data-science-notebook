'use strict';
document.querySelectorAll('.language a').forEach(link => {
  link.addEventListener('click', () => {
    link.hash = location.hash;
  });
});
