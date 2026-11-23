const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const nav = document.querySelector("[data-nav]");
const revealItems = document.querySelectorAll(".reveal");
const year = document.querySelector("[data-year]");

year.textContent = new Date().getFullYear();

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 18);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const closeMenu = () => {
  document.body.classList.remove("menu-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.querySelector(".sr-only").textContent = "打开菜单";
};

menuButton.addEventListener("click", () => {
  const willOpen = !document.body.classList.contains("menu-open");
  document.body.classList.toggle("menu-open", willOpen);
  menuButton.setAttribute("aria-expanded", String(willOpen));
  menuButton.querySelector(".sr-only").textContent = willOpen ? "关闭菜单" : "打开菜单";
});

nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) closeMenu();
});

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove("is-pending");
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -35px" }
  );

  revealItems.forEach((item) => {
    const isAboveFold = item.getBoundingClientRect().top < window.innerHeight * 0.92;

    if (isAboveFold) {
      item.classList.add("is-visible");
      return;
    }

    item.classList.add("is-pending");
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

window.addEventListener("load", () => {
  window.setTimeout(() => {
    revealItems.forEach((item) => {
      if (!item.classList.contains("is-visible")) return;
      item.classList.remove("is-pending");
    });
  }, 2000);
});

const lightbox = document.querySelector("[data-lightbox-dialog]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const closeButton = document.querySelector("[data-lightbox-close]");
const previousButton = document.querySelector("[data-lightbox-prev]");
const nextButton = document.querySelector("[data-lightbox-next]");
const triggers = [...document.querySelectorAll("[data-lightbox]")];
let activeImageIndex = 0;

const getTriggerImage = (trigger) =>
  trigger.dataset.full || trigger.querySelector("img")?.currentSrc || trigger.querySelector("img")?.src;

const showImage = (index) => {
  activeImageIndex = (index + triggers.length) % triggers.length;
  const trigger = triggers[activeImageIndex];
  lightboxImage.src = getTriggerImage(trigger);
  lightboxImage.alt = trigger.querySelector("img")?.alt || "放大的照片";
  lightboxCaption.textContent = trigger.dataset.caption || "";
};

const openLightbox = (trigger) => {
  showImage(triggers.indexOf(trigger));
  document.body.classList.add("lightbox-open");
  lightbox.showModal();
};

triggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    if (trigger.tagName === "A") event.preventDefault();
    openLightbox(trigger);
  });
});

closeButton.addEventListener("click", () => lightbox.close());
previousButton.addEventListener("click", () => showImage(activeImageIndex - 1));
nextButton.addEventListener("click", () => showImage(activeImageIndex + 1));

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});

lightbox.addEventListener("close", () => {
  document.body.classList.remove("lightbox-open");
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.open) return;

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    showImage(activeImageIndex - 1);
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    showImage(activeImageIndex + 1);
  }
});
