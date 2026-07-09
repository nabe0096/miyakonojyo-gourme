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

  /* ---------- 動画横スクロール（ボタン） ---------- */
  const videosInner = document.querySelector('.videos__inner');
  const videosPrev = document.getElementById('videosPrev');
  const videosNext = document.getElementById('videosNext');
  let videosOffset = 0;
  const videoStep = 496;

  if (videosInner && videosPrev && videosNext) {
    const getMaxOffset = () => {
      const totalWidth = videosInner.scrollWidth / 2;
      return totalWidth;
    };
    videosPrev.addEventListener('click', () => {
      videosInner.style.transition = 'transform .5s ease';
      videosOffset = Math.max(videosOffset - videoStep, 0);
      videosInner.style.transform = `translateX(-${videosOffset}px)`;
      videosInner.style.animation = 'none';
    });
    videosNext.addEventListener('click', () => {
      videosInner.style.transition = 'transform .5s ease';
      videosOffset = Math.min(videosOffset + videoStep, getMaxOffset());
      videosInner.style.transform = `translateX(-${videosOffset}px)`;
      videosInner.style.animation = 'none';
    });
  }

  /* ---------- ポートフォリオ：ランダムスピン ---------- */
  const spinItems = () => {
    const items = [...document.querySelectorAll('.portfolio__item')];
    const uniqueCount = items.length / 2;
    const target = items[Math.floor(Math.random() * uniqueCount)];
    target.classList.add('is-spinning');
    target.querySelector('img').addEventListener('animationend', () => {
      target.classList.remove('is-spinning');
    }, { once: true });
  };
  setInterval(spinItems, 3000);

  /* ---------- 店舗シェアボタン ---------- */
  document.querySelectorAll('.store__share').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const url = `${location.origin}${location.pathname}?store=${id}`;
      navigator.clipboard.writeText(url).then(() => {
        btn.classList.add('is-copied');
        setTimeout(() => btn.classList.remove('is-copied'), 2000);
      });
    });
  });

  document.querySelectorAll('.store__card a').forEach(link => {
    link.addEventListener('click', e => e.stopPropagation());
  });

  /* ---------- URLパラメータで店舗を自動オープン ---------- */
  const urlParams = new URLSearchParams(location.search);
  const storeParam = urlParams.get('store');
  if (storeParam) {
    const target = document.querySelector(`.store__card[data-id="${storeParam}"]`) ||
                   [...document.querySelectorAll('.store__card')].find(c => c.dataset.id === storeParam);
    if (target) setTimeout(() => target.click(), 600);
  }

  /* ---------- ライトボックス変数（先に定義） ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let lightboxImages = [];
  let lightboxCurrentIndex = 0;

  const showLightbox = (index) => {
    lightboxCurrentIndex = (index + lightboxImages.length) % lightboxImages.length;
    lightboxImg.src = lightboxImages[lightboxCurrentIndex];
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = storeModal.classList.contains('is-open') ? 'hidden' : '';
  };

  /* ---------- YouTube動画ID取得 ---------- */
  const getYouTubeId = url => {
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:shorts\/|embed\/|watch\?v=))([^?&/]+)/);
    return m ? m[1] : null;
  };

  /* ---------- 動画ライトボックス ---------- */
  const videoLightbox = document.getElementById('videoLightbox');
  const videoLightboxIframe = document.getElementById('videoLightboxIframe');
  const videoLightboxClose = document.getElementById('videoLightboxClose');
  const videoLightboxOverlay = document.getElementById('videoLightboxOverlay');

  const openVideoLightbox = videoId => {
    videoLightboxIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    videoLightbox.classList.add('is-open');
  };
  const closeVideoLightbox = () => {
    videoLightbox.classList.remove('is-open');
    videoLightboxIframe.src = '';
  };
  videoLightboxClose.addEventListener('click', closeVideoLightbox);
  videoLightboxOverlay.addEventListener('click', closeVideoLightbox);

  /* ---------- 店舗モーダル ---------- */
  const storeModal = document.getElementById('storeModal');
  const storeModalName = document.getElementById('storeModalName');
  const storeModalDate = document.getElementById('storeModalDate');
  const storeModalGrid = document.getElementById('storeModalGrid');
  const storeModalClose = document.getElementById('storeModalClose');
  const storeModalOverlay = document.getElementById('storeModalOverlay');

  let storeImages = [];

  document.querySelectorAll('.store__card').forEach(card => {
    card.addEventListener('click', () => {
      if (card.dataset.comingSoon) return;
      storeImages = JSON.parse(card.dataset.images);
      storeModalName.textContent = card.dataset.store;
      storeModalDate.textContent = card.dataset.date;
      const storeModalInfo = document.getElementById('storeModalInfo');
      const addressLink = card.dataset.address
        ? `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(card.dataset.address)}" target="_blank" rel="noopener" class="store__map-link">${card.dataset.address}</a>`
        : null;
      const infoItems = [
        card.dataset.genre,
        card.dataset.price,
        card.dataset.hours ? `営業時間 ${card.dataset.hours}` : null,
        addressLink,
      ].filter(Boolean);
      storeModalInfo.innerHTML = infoItems.map(t => `<li>${t}</li>`).join('');

      const storeModalMemo = document.getElementById('storeModalMemo');
      storeModalMemo.textContent = card.dataset.memo || '';
      const storeModalCredit = document.getElementById('storeModalCredit');
      storeModalCredit.textContent = card.dataset.credit || '';
      storeModalCredit.style.display = card.dataset.credit ? '' : 'none';
      storeModalGrid.innerHTML = storeImages.map((src, i) => {
        const ytId = getYouTubeId(src);
        if (ytId) {
          return `<div class="store__modal-item store__modal-item--video" data-index="${i}" data-video-id="${ytId}"><img src="https://img.youtube.com/vi/${ytId}/hqdefault.jpg" alt=""><div class="store__play-icon"><svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg"><circle cx="22" cy="22" r="22" fill="rgba(255,255,255,0.92)"/><polygon points="17,13 17,31 33,22" fill="#333"/></svg></div></div>`;
        }
        return `<div class="store__modal-item" data-index="${i}">
          <img src="${src}" alt="">
        </div>`;
      }).join('');
      storeModal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });

  // 右クリック・長押し・ドラッグ禁止
  storeModalGrid.addEventListener('contextmenu', e => e.preventDefault());
  storeModalGrid.addEventListener('dragstart', e => e.preventDefault());
  storeModalGrid.addEventListener('touchstart', e => {
    if (e.target.tagName === 'IMG') e.preventDefault();
  }, { passive: false });

  storeModalGrid.addEventListener('click', e => {
    const item = e.target.closest('.store__modal-item');
    if (!item) return;
    if (item.dataset.videoId) {
      openVideoLightbox(item.dataset.videoId);
      return;
    }
    const imageItems = [...storeModalGrid.querySelectorAll('.store__modal-item:not(.store__modal-item--video)')];
    lightboxImages = storeImages.filter(src => !getYouTubeId(src));
    lightboxCurrentIndex = imageItems.indexOf(item);
    lightboxImg.src = lightboxImages[lightboxCurrentIndex];
    lightbox.classList.add('is-open');
  });

  const closeStoreModal = () => {
    storeModal.classList.remove('is-open');
    document.body.style.overflow = '';
  };
  storeModalClose.addEventListener('click', closeStoreModal);
  storeModalOverlay.addEventListener('click', closeStoreModal);

  /* ---------- ライトボックス ---------- */
  const getUniquePortfolioImgs = () => {
    const all = [...document.querySelectorAll('.portfolio__item img')];
    const seen = new Set();
    return all.filter(img => {
      const key = img.getAttribute('src');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  document.addEventListener('click', e => {
    const img = e.target.closest('.portfolio__item img');
    if (img) {
      const imgs = getUniquePortfolioImgs();
      lightboxImages = imgs.map(i => i.src);
      lightboxCurrentIndex = imgs.findIndex(i => i.src === img.src);
      lightboxImg.src = img.src;
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  });

  lightboxPrev.addEventListener('click', e => { e.stopPropagation(); showLightbox(lightboxCurrentIndex - 1); });
  lightboxNext.addEventListener('click', e => { e.stopPropagation(); showLightbox(lightboxCurrentIndex + 1); });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (videoLightbox.classList.contains('is-open')) { closeVideoLightbox(); return; }
      if (lightbox.classList.contains('is-open')) closeLightbox();
      else closeStoreModal();
    }
    if (e.key === 'ArrowLeft') showLightbox(lightboxCurrentIndex - 1);
    if (e.key === 'ArrowRight') showLightbox(lightboxCurrentIndex + 1);
  });
});
