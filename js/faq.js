// FAQ

  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const faqItem = button.closest('.faq-item');
      const answer = button.nextElementSibling;
      const icon = button.querySelector('svg');

      // затваряне на другите
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
          item.classList.remove('active');
          item.querySelector('.faq-answer').classList.add('hidden');
          item.querySelector('svg').classList.remove('svg-active');
        }
      });

      // превключване на текущия
      faqItem.classList.toggle('active');
      answer.classList.toggle('hidden');
      icon.classList.toggle('svg-active');
    });
  });