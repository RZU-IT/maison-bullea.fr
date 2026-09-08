"use strict";

document.documentElement.classList.add("js");

const select = (selector, parent = document) => parent.querySelector(selector);
const selectAll = (selector, parent = document) => [
  ...parent.querySelectorAll(selector),
];
const mobileMenuQuery = window.matchMedia("(max-width: 850px)");
const reducedMotionQuery = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

const products = [
  {
    name: "Nuage de Rose",
    ingredients: "Rose, argile blanche, beurre de karité",
    description: "Savon floral rose pastel avec motifs nuageux.",
    price: 8.9,
    image: "assets/images/savon_nuage_rose_web.jpg",
  },
  {
    name: "Océan Turquoise",
    ingredients: "Spiruline, sel marin, aloe vera",
    description: "Savon bleu extravagant inspiré des vagues.",
    price: 9.5,
    image: "assets/images/savon_ocean_turquoise_web.jpg",
  },
  {
    name: "Jardin Secret",
    ingredients: "Menthe, verveine, huile d’olive",
    description: "Savon vert frais, très végétal et lumineux.",
    price: 8.5,
    image: "assets/images/savon_jardin_secret_web.jpg",
  },
  {
    name: "Licorne Gourmande",
    ingredients: "Vanille, coco, mica rose",
    description: "Savon pop avec couleurs bonbon et paillettes.",
    price: 10.2,
    image: "assets/images/savon_licorne_web.jpg",
  },
  {
    name: "Rêve Tropical",
    ingredients: "Mangue, coco, calendula",
    description: "Savon solaire jaune et vert pour voyager.",
    price: 9.2,
    image: "assets/images/savon_tropical_web.jpg",
  },
  {
    name: "Perle d’Agen",
    ingredients: "Miel, prune, avoine",
    description: "Clin d’œil local chic, doux et doré.",
    price: 10.8,
    image: "assets/images/savon_perle_agen_web.jpg",
  },
];

let revealObserver;
let bubbleParticles = [];
let menuInteractionTimer = 0;
let audioContext;

function setMenuState(open) {
  const button = select("#hamburger");
  const navigation = select("#navLinks");

  if (!button || !navigation) return;

  window.clearTimeout(menuInteractionTimer);
  navigation.classList.remove("interactive");
  button.classList.toggle("active", open);
  navigation.classList.toggle("open", open);

  if (open) {
    menuInteractionTimer = window.setTimeout(
      () => navigation.classList.add("interactive"),
      520,
    );
  }
  document.body.classList.toggle("menu-open", open);
  button.setAttribute("aria-expanded", String(open));
  button.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
}

function placeMobileMenu() {
  const navigation = select("#navLinks");
  const navbar = select("#navbar") || select(".navbar");

  if (!navigation || !navbar) return;

  if (mobileMenuQuery.matches) {
    if (navigation.parentElement !== document.body)
      document.body.append(navigation);
    return;
  }

  if (navigation.parentElement !== navbar) navbar.append(navigation);
  setMenuState(false);
}

function initNavigation() {
  const button = select("#hamburger");
  const navigation = select("#navLinks");
  const navbar = select("#navbar");

  if (!button || !navigation) return;

  if (location.pathname.endsWith("boutique.html")) navbar?.classList.add("solid");

  placeMobileMenu();
  mobileMenuQuery.addEventListener("change", placeMobileMenu);

  button.addEventListener("click", () => {
    setMenuState(button.getAttribute("aria-expanded") !== "true");
  });

  selectAll("a", navigation).forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuState(false);
  });
}

function playPopSound() {
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(180, now);
    oscillator.frequency.exponentialRampToValueAtTime(68, now + 0.13);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(520, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.18);
  } catch {}
}

function burst(x, y, amount = 10) {
  for (let index = 0; index < amount; index += 1) {
    bubbleParticles.push({
      x,
      y,
      velocityX: (Math.random() - 0.5) * 3,
      velocityY: (Math.random() - 0.5) * 3,
      radius: 1.5 + Math.random() * 3,
      life: 1,
    });
  }
}

function createDoorConfetti(button) {
  const bounds = button.getBoundingClientRect();
  const centerX = bounds.left + bounds.width / 2;
  const centerY = bounds.top + bounds.height * 0.62;

  for (let index = 0; index < 34; index += 1) {
    const particle = document.createElement("span");
    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 230;
    const size = index % 3 ? 7 + Math.random() * 24 : 8 + Math.random() * 16;

    particle.className =
      index % 2 ? "door-pop bubble-pop" : "door-pop sparkle-pop";
    particle.style.cssText = [
      `left:${centerX}px`,
      `top:${centerY}px`,
      `width:${size}px`,
      `height:${size}px`,
      `--tx:${Math.cos(angle) * distance}px`,
      `--ty:${Math.sin(angle) * distance - 30}px`,
      `--rot:${Math.random() * 260 - 130}deg`,
      `--delay:${Math.random() * 80}ms`,
    ].join(";");

    document.body.append(particle);
    window.setTimeout(() => particle.remove(), 1200);
  }
}

function initIntro() {
  const intro = select("#intro");
  const button = select("#enterSite");

  if (!intro || !button) {
    document.body.classList.remove("intro-active");
    return;
  }

  const replayRequested =
    new URLSearchParams(window.location.search).get("intro") === "1";

  if (replayRequested) {
    sessionStorage.removeItem("entered-bullea");
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.hash,
    );
  }

  if (!replayRequested && sessionStorage.getItem("entered-bullea")) {
    intro.hidden = true;
    document.body.classList.remove("intro-active");
    return;
  }

  button.focus();

  button.addEventListener(
    "click",
    () => {
      const transitionDelay = 620;
      const completionDelay = 1220;

      button.disabled = true;
      button.classList.add("open");
      createDoorConfetti(button);
      burst(window.innerWidth / 2, window.innerHeight / 2, 34);

      window.setTimeout(() => intro.classList.add("entering"), transitionDelay);
      window.setTimeout(() => {
        intro.hidden = true;
        document.body.classList.remove("intro-active");
        sessionStorage.setItem("entered-bullea", "1");
        select("#top")?.focus({ preventScroll: true });
      }, completionDelay);
    },
    { once: true },
  );
}

function observeRevealElements(parent = document) {
  const elements = selectAll(".reveal:not(.visible)", parent);

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("visible"));
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );
  }

  elements.forEach((element) => revealObserver.observe(element));
}

function resetHeroPosition(hero) {
  hero.style.setProperty("--hero-bg-x", "0px");
  hero.style.setProperty("--hero-bg-y", "0px");
  hero.style.setProperty("--hero-copy-x", "0px");
  hero.style.setProperty("--hero-copy-y", "0px");
}

function initHeroParallax() {
  const hero = select(".hero");

  if (!hero) return;

  const reset = () => {
    hero.style.setProperty("--hero-bg-x", "0px");
    hero.style.setProperty("--hero-bg-y", "0px");
    hero.style.setProperty("--hero-copy-x", "0px");
    hero.style.setProperty("--hero-copy-y", "0px");
  };

  let raf = 0;
  let lastEvent = null;

  const moveHero = (event) => {
    if (reducedMotionQuery.matches) return;

    lastEvent = event;
    if (raf) return;

    raf = window.requestAnimationFrame(() => {
      raf = 0;
      const e = lastEvent;
      const rect = hero.getBoundingClientRect();

      if (
        !e ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom ||
        e.clientX < rect.left ||
        e.clientX > rect.right
      ) {
        reset();
        return;
      }

      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      hero.style.setProperty("--hero-bg-x", `${x * -58}px`);
      hero.style.setProperty("--hero-bg-y", `${y * -38}px`);
      hero.style.setProperty("--hero-copy-x", `${x * 18}px`);
      hero.style.setProperty("--hero-copy-y", `${y * 12}px`);
      hero.classList.add("hero-parallax-ready");
    });
  };

  document.addEventListener("mousemove", moveHero, { passive: true });
  document.addEventListener("pointermove", moveHero, { passive: true });
  document.addEventListener("mouseleave", reset);
  hero.addEventListener("mouseleave", reset);
  reducedMotionQuery.addEventListener("change", reset);
}

function initTiltCards() {
  selectAll("[data-tilt]").forEach((card) => {
    let animationFrame = 0;

    card.addEventListener("pointermove", (event) => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);

      animationFrame = window.requestAnimationFrame(() => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        card.style.transform = `rotateY(${x * 8}deg) rotateX(${y * -8}deg)`;
      });
    });

    card.addEventListener("pointerleave", () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      card.style.removeProperty("transform");
    });
  });
}

function initAtelierViewer() {
  const viewer = select("#atelierViewer");
  const windowElement = select(".atelier-window", viewer || document);

  if (!viewer || !windowElement) return;

  let dragging = false;
  let dragStart = 0;
  let initialScroll = 0;
  let panFrame = 0;
  let panDirection = 0;

  const stopPanning = () => {
    panDirection = 0;
    if (panFrame) window.cancelAnimationFrame(panFrame);
    panFrame = 0;
  };

  const pan = () => {
    if (!panDirection) return;
    windowElement.scrollLeft += panDirection * 16;
    panFrame = window.requestAnimationFrame(pan);
  };

  selectAll("[data-pan]", viewer).forEach((button) => {
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      stopPanning();
      panDirection = Number(button.dataset.pan);
      pan();
    });

    ["pointerup", "pointerleave", "pointercancel", "blur"].forEach(
      (eventName) => {
        button.addEventListener(eventName, stopPanning);
      },
    );
  });

  windowElement.addEventListener("pointerdown", (event) => {
    dragging = true;
    dragStart = event.clientX;
    initialScroll = windowElement.scrollLeft;
    windowElement.setPointerCapture(event.pointerId);
  });

  windowElement.addEventListener("pointermove", (event) => {
    if (dragging)
      windowElement.scrollLeft = initialScroll - (event.clientX - dragStart);
  });

  ["pointerup", "pointercancel"].forEach((eventName) => {
    windowElement.addEventListener(eventName, () => {
      dragging = false;
    });
  });

  windowElement.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    windowElement.scrollBy({
      left: event.key === "ArrowLeft" ? -140 : 140,
      behavior: reducedMotionQuery.matches ? "auto" : "smooth",
    });
  });
}

function initProductDeck() {
  const deck = select("#cardDeck");
  const previewImage = select("#deckPreviewImg");
  const previewTitle = select("#deckPreviewTitle");
  const previewText = select("#deckPreviewText");

  if (!deck || !previewImage || !previewTitle || !previewText) return;

  const cards = selectAll(".deck-card", deck);

  const updateMobilePositions = (activeIndex) => {
    cards.forEach((item, index) => {
      item.classList.remove("mobile-left", "mobile-center", "mobile-right");
      if (index === activeIndex) {
        item.classList.add("mobile-center");
      } else if ((index + 1) % cards.length === activeIndex) {
        item.classList.add("mobile-left");
      } else {
        item.classList.add("mobile-right");
      }
    });
  };

  cards.forEach((card, index) => {
    if (card.classList.contains("active")) updateMobilePositions(index);

    card.addEventListener("click", () => {
      cards.forEach((item) => {
        const selected = item === card;
        item.classList.toggle("active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });

      updateMobilePositions(index);
      previewImage.src = card.dataset.img;
      previewImage.alt = `Savon ${card.dataset.title}`;
      previewTitle.textContent = card.dataset.title;
      previewText.textContent = card.dataset.text;

      deck.classList.remove("picked");
      window.requestAnimationFrame(() => deck.classList.add("picked"));
    });
  });
}

function productCard(product, index) {
  const article = document.createElement("article");
  article.className = `shop-card reveal${index >= 3 ? " mobile-extra" : ""}`;
  article.innerHTML = `
    <div class="product-art">
      <img src="${product.image}" alt="Savon ${product.name}" width="600" height="600" loading="lazy" decoding="async">
    </div>
    <h2 class="shop-card-title">${product.name}</h2>
    <p>${product.description}</p>
    <p><strong>Ingrédients :</strong> ${product.ingredients}</p>
    <span class="price">${product.price.toFixed(2)} €</span>
    <button class="btn primary" type="button" data-product="${index}">Vue rapide</button>
  `;
  return article;
}

function renderShop() {
  const grid = select("#shopGrid");

  if (!grid) return;

  const fragment = document.createDocumentFragment();
  products.forEach((product, index) =>
    fragment.append(productCard(product, index)),
  );
  grid.replaceChildren(fragment);
  observeRevealElements(grid);
}

function initShopToggle() {
  const grid = select("#shopGrid");
  const button = select("#shopToggle");

  if (!grid || !button) return;

  button.addEventListener("click", () => {
    const expanded = !grid.classList.contains("expanded");
    grid.classList.toggle("expanded", expanded);
    button.setAttribute("aria-expanded", String(expanded));
    button.textContent = expanded
      ? "Masquer les 3 derniers savons"
      : "Afficher les 3 autres savons";
  });
}

function initProductModal() {
  const modal = select("#modal");
  const modalBody = select("#modalBody");
  const closeButton = select("#modalClose");

  if (!modal || !modalBody || !closeButton) return;

  let trigger = null;

  const closeModal = () => {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    trigger?.focus();
  };

  const openModal = (product, button) => {
    trigger = button;
    modalBody.innerHTML = `
      <h2 id="modalTitle">${product.name}</h2>
      <div class="product-art">
        <img src="${product.image}" alt="Savon ${product.name}" width="600" height="600">
      </div>
      <p>${product.description}</p>
      <p><strong>Ingrédients :</strong> ${product.ingredients}</p>
      <p class="price">${product.price.toFixed(2)} € — produit fictif</p>
      <button class="btn primary" type="button" data-close-modal>Fermer</button>
    `;
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    select("[data-close-modal]", modalBody)?.focus();
  };

  document.addEventListener("click", (event) => {
    const button =
      event.target instanceof Element
        ? event.target.closest("[data-product]")
        : null;
    if (!button) return;
    openModal(products[Number(button.dataset.product)], button);
  });

  closeButton.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (
      event.target === modal ||
      (event.target instanceof Element &&
        event.target.closest("[data-close-modal]"))
    ) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("show")) return;

    if (event.key === "Escape") {
      closeModal();
      return;
    }

    if (event.key !== "Tab") return;

    const focusableElements = selectAll(
      'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      modal,
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!firstElement || !lastElement) return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });
}

function initDemoForm() {
  const form = select("#contactForm");
  const status = select("#contactStatus");

  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    status.hidden = false;
    status.focus({ preventScroll: true });
  });

  form.addEventListener("input", () => {
    status.hidden = true;
  });
}

function initBubbles() {
  const canvas = select("#bubble-canvas");
  const context = canvas?.getContext("2d");

  if (!canvas || !context) {
    if (canvas) canvas.hidden = true;
    return;
  }

  const bubbles = [];
  let width = window.innerWidth;
  let height = window.innerHeight;
  let animationFrame = 0;

  const bubbleTotal = () => (window.innerWidth <= 700 ? 12 : 18);

  const createBubble = () => ({
    x: Math.random() * width,
    y: height + 20 + Math.random() * 100,
    radius: 8 + Math.random() * 16,
    speed: 0.28 + Math.random() * 0.38,
    drift: (Math.random() - 0.5) * 0.18,
  });

  const resize = () => {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  };

  const synchronizeBubbleCount = () => {
    while (bubbles.length > bubbleTotal()) bubbles.pop();
    while (bubbles.length < bubbleTotal()) bubbles.push(createBubble());
  };

  const drawBubble = (bubble) => {
    const gradient = context.createRadialGradient(
      bubble.x - bubble.radius * 0.3,
      bubble.y - bubble.radius * 0.35,
      1,
      bubble.x,
      bubble.y,
      bubble.radius,
    );

    gradient.addColorStop(0, "rgba(255,255,255,.82)");
    gradient.addColorStop(0.55, "rgba(171,229,255,.24)");
    gradient.addColorStop(1, "rgba(255,170,215,.08)");

    context.beginPath();
    context.fillStyle = gradient;
    context.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = "rgba(255,255,255,.62)";
    context.lineWidth = 1;
    context.stroke();
  };

  const drawParticles = () => {
    bubbleParticles = bubbleParticles.filter((particle) => particle.life > 0);

    bubbleParticles.forEach((particle) => {
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;
      particle.life -= 0.05;
      context.globalAlpha = Math.max(0, particle.life);
      context.fillStyle = "rgba(255,255,255,.9)";
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    });

    context.globalAlpha = 1;
  };

  const draw = () => {
    context.clearRect(0, 0, width, height);
    synchronizeBubbleCount();

    bubbles.forEach((bubble) => {
      bubble.y -= bubble.speed;
      bubble.x += bubble.drift;
      if (bubble.y < bubble.radius * -2) Object.assign(bubble, createBubble());
      drawBubble(bubble);
    });

    drawParticles();
    animationFrame = window.requestAnimationFrame(draw);
  };

  resize();
  synchronizeBubbleCount();
  bubbles.forEach((bubble) => {
    bubble.y = Math.random() * height;
  });

  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("click", (event) => {
    if (
      event.target instanceof Element &&
      event.target.closest("a,button,input,textarea,label")
    )
      return;

    let index = -1;

    for (
      let bubbleIndex = bubbles.length - 1;
      bubbleIndex >= 0;
      bubbleIndex -= 1
    ) {
      const bubble = bubbles[bubbleIndex];
      const distance = Math.hypot(
        event.clientX - bubble.x,
        event.clientY - bubble.y,
      );

      if (distance < bubble.radius + 10) {
        index = bubbleIndex;
        break;
      }
    }

    if (index < 0) return;

    const [bubble] = bubbles.splice(index, 1);
    playPopSound();
    burst(bubble.x, bubble.y);
    window.setTimeout(synchronizeBubbleCount, 500);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && animationFrame) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    } else if (!document.hidden && !animationFrame) {
      draw();
    }
  });

  draw();
}

function init() {
  initNavigation();
  initIntro();
  observeRevealElements();
  initHeroParallax();
  initTiltCards();
  initAtelierViewer();
  initProductDeck();
  renderShop();
  initShopToggle();
  initProductModal();
  initDemoForm();
  initBubbles();
}

function startWhenReady() {
  if (document.querySelector("[data-include]")) {
    document.addEventListener("includes:ready", init, { once: true });
    return;
  }

  init();
}

document.addEventListener("DOMContentLoaded", startWhenReady);

// Copyright RZU Informatique
