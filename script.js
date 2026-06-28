// ============================================================
// 設定
// ============================================================

/** Googleフォームの公開URL */
const FORM_URL = "https://forms.gle/WnAf2okA7beTpck98";

// ============================================================
// フォームリンクの差し替え
// ============================================================

/** [data-form-link] を持つ全リンクに FORM_URL を設定する */
function initFormLinks() {
  document.querySelectorAll("[data-form-link]").forEach((link) => {
    link.href = FORM_URL;
  });
}

// ============================================================
// ヘッダー：スクロール時のスタイル切り替え
// ============================================================

/**
 * ページトップから少しでもスクロールしたら .is-scrolled を付与し、
 * 背景色・影を強調する。
 */
function initHeader() {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  update(); // 初期状態を即時反映
  window.addEventListener("scroll", update, { passive: true });
}

// ============================================================
// Q&A：アコーディオン開閉
// ============================================================

/** .qa-question ボタンのクリックで aria-expanded を切り替える */
function initAccordion() {
  document.querySelectorAll(".qa-question").forEach((button) => {
    button.addEventListener("click", () => {
      const isOpen = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isOpen));
    });
  });
}

// ============================================================
// スクロールアニメーション（IntersectionObserver）
// ============================================================

/**
 * .reveal 要素が画面に入ったとき .is-visible を付与してフェードイン。
 * ブラウザが IntersectionObserver を未サポートの場合は即時表示にフォールバック。
 */
function initRevealAnimation() {
  const elements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );

  elements.forEach((el) => observer.observe(el));
}

// ============================================================
// ナビゲーション：スクロール位置に応じたアクティブリンク
// ============================================================

/**
 * 現在ビューポートに最も多く表示されているセクションを検出し、
 * 対応するナビリンクに .is-active を付与する。
 */
function initNavHighlight() {
  if (!("IntersectionObserver" in window)) return;

  const navLinks = Array.from(
    document.querySelectorAll(".site-nav a[href^='#']")
  );
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      const topVisible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!topVisible) return;

      const activeId = `#${topVisible.target.id}`;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === activeId);
      });
    },
    {
      rootMargin: "-35% 0px -55% 0px",
      threshold: [0.1, 0.25, 0.5],
    }
  );

  sections.forEach((section) => observer.observe(section));
}

// ============================================================
// 施策A：生徒会ポータル改造PJ 詳細パネルの開閉
// ============================================================

/**
 * 「企画書を見る」ボタンクリックで詳細パネルをスライド表示する。
 * パネル内の閉じるボタン or 背景クリックで閉じる。
 */
function initPortalProjectPanel() {
  const toggleBtn = document.querySelector(".portal-detail-btn");
  const panel     = document.getElementById("portal-project-detail");
  const closeBtn  = document.querySelector(".portal-close-btn");

  if (!toggleBtn || !panel) return;

  /** パネルを開く */
  const openPanel = () => {
    panel.setAttribute("aria-hidden", "false");
    toggleBtn.setAttribute("aria-expanded", "true");
    document.body.classList.add("panel-open");
    closeBtn?.focus();
  };

  /** パネルを閉じる */
  const closePanel = () => {
    panel.setAttribute("aria-hidden", "true");
    toggleBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("panel-open");
    toggleBtn.focus();
  };

  toggleBtn.addEventListener("click", () => {
    const isOpen = toggleBtn.getAttribute("aria-expanded") === "true";
    isOpen ? closePanel() : openPanel();
  });

  closeBtn?.addEventListener("click", closePanel);

  // パネル外（オーバーレイ）クリックで閉じる
  panel.addEventListener("click", (e) => {
    if (e.target === panel) closePanel();
  });

  // Escape キーで閉じる
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.getAttribute("aria-hidden") === "false") {
      closePanel();
    }
  });
}

// ============================================================
// エントリーポイント
// ============================================================

initFormLinks();
initHeader();
initAccordion();
initRevealAnimation();
initNavHighlight();
initPortalProjectPanel();
