(() => {
  'use strict';

  const header = document.getElementById('header');
  const nav = document.getElementById('mainNav');
  const navToggle = document.getElementById('navToggle');
  const backToTop = document.getElementById('backToTop');

  // Mobile navigation
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Tutup navigasi' : 'Buka navigasi');
      navToggle.innerHTML = isOpen ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-list"></i>';
    });

    nav.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Buka navigasi');
        navToggle.innerHTML = '<i class="bi bi-list"></i>';
      });
    });
  }

  // Header shadow and back-to-top visibility
  const onScroll = () => {
    const scrolled = window.scrollY > 24;
    if (header) header.classList.toggle('scrolled', scrolled);
    if (backToTop) backToTop.classList.toggle('show', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Highlight the current navigation section
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.main-nav a[href^="#"]'));
  if ('IntersectionObserver' in window && sections.length && navLinks.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach((section) => observer.observe(section));
  }

  // Filter menu cards
  const filterButtons = document.querySelectorAll('.filter-btn');
  const menuCards = document.querySelectorAll('.menu-col');
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((item) => item.classList.toggle('active', item === button));
      menuCards.forEach((card) => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !show);
      });
    });
  });

  // Prepare a WhatsApp order message. This does not confirm the order by itself.
  const orderForm = document.getElementById('orderForm');
  const feedback = document.getElementById('formFeedback');
  if (orderForm) {
    orderForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!orderForm.reportValidity()) return;

      const product = document.getElementById('orderProduct').value;
      const size = document.getElementById('orderSize').value;
      const quantity = Number(document.getElementById('orderQty').value);
      const name = document.getElementById('orderName').value.trim();
      const note = document.getElementById('orderNote').value.trim();

      if (!product || !name || !Number.isInteger(quantity) || quantity < 1 || quantity > 30) {
        if (feedback) feedback.textContent = 'Periksa kembali menu, nama, dan jumlah pesanan (1–30).';
        return;
      }

      const isDrink = product === 'Es Coklat' || product === 'Hot Coklat';
      const message = [
        'Halo Es Coklat Impian Alun-Alun Kidul, saya ingin bertanya/memesan:',
        '',
        `Nama: ${name}`,
        `Menu: ${product}`,
        `Ukuran: ${isDrink ? size : 'Tidak berlaku'}`,
        `Jumlah: ${quantity}`,
        `Catatan: ${note || '-'}`,
        '',
        'Mohon info ketersediaan dan total harganya. Terima kasih.'
      ].join('\n');

      const whatsappUrl = `https://wa.me/6281215337129?text=${encodeURIComponent(message)}`;
      const opened = window.open(whatsappUrl, '_blank');
      if (opened) opened.opener = null;
      if (!opened && feedback) {
        feedback.textContent = 'Pop-up tertahan browser. Salin pesan secara manual atau izinkan pembukaan tab WhatsApp.';
      } else if (feedback) {
        feedback.textContent = 'Pesan WhatsApp telah disiapkan. Periksa kembali lalu kirim ke gerai untuk konfirmasi.';
        feedback.style.color = '#64805a';
      }
    });
  }

  const year = document.getElementById('currentYear');
  if (year) year.textContent = String(new Date().getFullYear());
})();
