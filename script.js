/* ========================================
   都城グルメ応援プロジェクト
======================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- ヘッダー：スクロールで背景 ---------- */
  const header = document.getElementById('header');
  const onScrollHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 60);
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- モバイルメニュー ---------- */
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.querySelector('.header__nav');
  menuBtn.addEventListener('click', () => {
    nav.classList.toggle('is-open');
    header.classList.toggle('is-menu-open');
  });
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      header.classList.remove('is-menu-open');
    });
  });

  /* ---------- スクロールフェードイン ---------- */
  const reveals = document.querySelectorAll('.reveal');
  // 同一セクション内の連続要素に遅延を付与（順に立ち上がる）
  document.querySelectorAll('.about__grid, .flow__grid, .hero__btns').forEach(group => {
    [...group.children].forEach((child, i) => {
      if (child.classList.contains('reveal')) child.dataset.delay = Math.min(i, 2);
    });
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- パララックス ---------- */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ticking = false;

  const updateParallax = () => {
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      const rect = el.parentElement.getBoundingClientRect();
      // 要素が画面内にあるときだけ計算
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const offset = (rect.top - window.innerHeight / 2) * -speed;
        el.style.transform = `translate3d(0, ${offset * 0.18}px, 0)`;
      }
    });
    ticking = false;
  };

  if (!reduceMotion) {
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
    updateParallax();
  }
});
