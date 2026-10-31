(function () {
  'use strict';

  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.site-nav');
  if (menuButton && menu) {
    function closeMenu() {
      menu.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
    }
    menuButton.addEventListener('click', function () {
      const open = menu.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menu.classList.contains('is-open')) {
        const focusWasInside = menu.contains(document.activeElement);
        closeMenu();
        if (focusWasInside) menuButton.focus();
      }
    });
  }

  const sticky = document.querySelector('.sticky-cta');
  const hero = document.querySelector('.hero, .page-hero');
  if (sticky && hero) {
    function setSticky(show) {
      sticky.classList.toggle('is-visible', show);
      document.body.classList.toggle('has-sticky', show && window.matchMedia('(max-width: 760px)').matches);
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        setSticky(!entries[0].isIntersecting);
      }, { threshold: 0 }).observe(hero);
    } else {
      window.addEventListener('scroll', function () {
        setSticky(window.scrollY > hero.offsetHeight);
      }, { passive: true });
    }
  }

  document.querySelectorAll('.filter-bar').forEach(function (bar) {
    const buttons = [...bar.querySelectorAll('button[data-filter]')];
    const cards = [...document.querySelectorAll('[data-categories]')];
    const status = document.querySelector('.filter-status');
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        const filter = button.dataset.filter;
        buttons.forEach(function (item) {
          item.setAttribute('aria-pressed', String(item === button));
        });
        let visible = 0;
        cards.forEach(function (card) {
          const tags = (card.dataset.categories || '').split(' ');
          const show = filter === 'todos' || tags.includes(filter);
          card.hidden = !show;
          if (show) visible++;
        });
        if (status) status.textContent = `${visible} projeto${visible === 1 ? '' : 's'} exibido${visible === 1 ? '' : 's'}.`;
      });
    });
  });

  // Campanhas só aparecem durante o período definido, no fuso da BBE.
  document.querySelectorAll('[data-campaign-start][data-campaign-end]').forEach(function (campaign) {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map(function (part) { return [part.type, part.value]; }));
    const today = values.year + '-' + values.month + '-' + values.day;
    campaign.hidden = !(today >= campaign.dataset.campaignStart && today <= campaign.dataset.campaignEnd);
    const fallback = document.querySelector('[data-campaign-fallback]');
    if (fallback) fallback.hidden = !campaign.hidden;
  });
})();
