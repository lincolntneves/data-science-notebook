'use strict';

for (const button of document.querySelectorAll('[data-copy-code]')) {
  const code = document.getElementById(button.dataset.copyCode);
  const status = button.parentElement.querySelector('[role="status"]');
  button.hidden = false;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(code.textContent);
      status.textContent = button.dataset.copied;
    } catch {
      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        range.selectNodeContents(code);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      status.textContent = button.dataset.manual;
    }
  });
}
