/**
 * Blog Framework Core Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Accessibility for details disclosure elements
  document.querySelectorAll('details.disclosure').forEach((details) => {
    const summary = details.querySelector('summary');
    if (summary) {
      details.addEventListener('toggle', () => {
        summary.setAttribute('aria-expanded', String(details.open));
      });
    }
  });

  // Close mobile details dropdown when clicking outside
  document.addEventListener('click', (e) => {
    document.querySelectorAll('header details.disclosure[open]').forEach((openDetails) => {
      if (!openDetails.contains(e.target)) {
        openDetails.removeAttribute('open');
        const summary = openDetails.querySelector('summary');
        if (summary) summary.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // 2. Back to Top Button
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    const checkScroll = () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.remove('hidden');
        backToTopBtn.classList.add('flex');
        backToTopBtn.style.opacity = '1';
      } else {
        backToTopBtn.style.opacity = '0';
        setTimeout(() => {
          if (window.scrollY <= 400) {
            backToTopBtn.classList.remove('flex');
            backToTopBtn.classList.add('hidden');
          }
        }, 200);
      }
    };
    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 3. Copy Code / Copy Text Button
  document.querySelectorAll('.copy-code').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const code = btn.getAttribute('data-code');
      if (!code) return;

      try {
        await navigator.clipboard.writeText(code);
      } catch (err) {
        // Fallback for older browsers or restricted contexts
        const textarea = document.createElement('textarea');
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      const textEl = btn.querySelector('.copy-code-text');
      const copyIcon = btn.querySelector('.copy-icon-copy');
      const checkIcon = btn.querySelector('.copy-icon-check');
      const originalText = textEl ? textEl.textContent : code;
      const originalLabel = btn.getAttribute('aria-label') || '';

      if (textEl) textEl.textContent = '已复制';
      if (copyIcon) copyIcon.classList.add('hidden');
      if (checkIcon) checkIcon.classList.remove('hidden');
      btn.setAttribute('aria-label', '已复制');

      setTimeout(() => {
        if (textEl) textEl.textContent = originalText;
        if (copyIcon) copyIcon.classList.remove('hidden');
        if (checkIcon) checkIcon.classList.add('hidden');
        btn.setAttribute('aria-label', originalLabel);
      }, 1500);
    });
  });

  // 4. Category Filter & Search on Blog List
  const categoryNav = document.querySelector('nav[aria-label="分类"]');
  const articleGrid = document.querySelector('[data-article-grid]');
  const searchInput = document.getElementById('article-search');

  if (categoryNav && articleGrid) {
    const filterButtons = Array.from(categoryNav.querySelectorAll('a[data-category], button[data-category]'));
    const articles = Array.from(articleGrid.querySelectorAll('[data-category]'));
    let currentCategory = 'all';
    let searchQuery = '';

    const activeClasses = ['rounded-full', 'bg-accent', 'px-4', 'py-1.5', 'text-sm', 'font-medium', 'text-paper'];
    const inactiveClasses = ['rounded-full', 'border', 'border-ink/15', 'px-4', 'py-1.5', 'text-sm', 'text-ink/70', 'transition-colors', 'hover:border-ink/30', 'hover:text-ink'];

    const filterArticles = () => {
      let visibleCount = 0;
      articles.forEach((card) => {
        const matchesCategory = currentCategory === 'all' || card.dataset.category === currentCategory;
        const textContent = card.textContent.toLowerCase();
        const matchesSearch = !searchQuery || textContent.includes(searchQuery);

        if (matchesCategory && matchesSearch) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Handle empty state
      let emptyMsg = document.getElementById('no-articles-found');
      if (visibleCount === 0) {
        if (!emptyMsg) {
          emptyMsg = document.createElement('div');
          emptyMsg.id = 'no-articles-found';
          emptyMsg.className = 'col-span-full py-16 text-center text-ink/60';
          emptyMsg.innerHTML = '<p class="text-base font-medium">暂无匹配的文章</p><p class="mt-1 text-sm">尝试清除筛选或搜索其他关键词</p>';
          articleGrid.appendChild(emptyMsg);
        }
        emptyMsg.style.display = 'block';
      } else if (emptyMsg) {
        emptyMsg.style.display = 'none';
      }
    };

    filterButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        currentCategory = btn.dataset.category;

        filterButtons.forEach((b) => {
          b.classList.remove(...activeClasses, ...inactiveClasses);
          b.classList.add(...(b === btn ? activeClasses : inactiveClasses));
        });

        filterArticles();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        filterArticles();
      });
    }
  }

  // 5. Table of Contents & Category Jump Scrollspy
  const tocNav = document.querySelector('nav[aria-label="文章目录"], nav[aria-label="FAQ 分类跳转"]');
  if (tocNav) {
    const targets = Array.from(document.querySelectorAll('.article-content h2[id], .article-content h3[id], section[id]'));
    const tocLinks = Array.from(tocNav.querySelectorAll('a[href^="#"]'));

    if (targets.length > 0 && tocLinks.length > 0) {
      const linkMap = new Map();
      tocLinks.forEach((link) => {
        const hash = link.getAttribute('href').slice(1);
        linkMap.set(hash, link);
      });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = entry.target.getAttribute('id');
              tocLinks.forEach((l) => l.classList.remove('is-active'));
              const activeLink = linkMap.get(id);
              if (activeLink) {
                activeLink.classList.add('is-active');
              }
            }
          });
        },
        { rootMargin: '-90px 0px -70% 0px', threshold: 0 }
      );

      targets.forEach((el) => observer.observe(el));
    }
  }
});
