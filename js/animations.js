
"use strict";

(() => {
  const revealItems = document.querySelectorAll(".reveal");
  const navigationLinks = [
    ...document.querySelectorAll(".primary-nav .nav-link")
  ];

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Enable the reveal styles only after this script is running.
  document.documentElement.classList.add("js");

  // Keep all content visible if animation isn't supported or is disabled.
  if (
    reduceMotion ||
    !("IntersectionObserver" in window)
  ) {
    revealItems.forEach(item => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -25px 0px"
      }
    );

    revealItems.forEach(item => revealObserver.observe(item));
  }

  // Map the Home link to the hero section, not the entire main element.
  const sections = navigationLinks
    .map(link => {
      const href = link.getAttribute("href");

      if (href === "#home") {
        return document.querySelector(".hero");
      }

      return href ? document.querySelector(href) : null;
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const navObserver = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (!visible.length) return;

        const activeId =
          visible[0].target.id || "home";

        navigationLinks.forEach(link => {
          const href = link.getAttribute("href");
          const matches =
            href === `#${activeId}` ||
            (activeId === "home" && href === "#home");

          link.classList.toggle("active", matches);
        });
      },
      {
        rootMargin: "-28% 0px -60% 0px",
        threshold: [0, 0.15, 0.35, 0.6]
      }
    );

    sections.forEach(section => navObserver.observe(section));
  }

  // Subtle pointer glow for desktop pointer devices only.
  // It uses a CSS custom property; there is no continuous animation loop.
  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  if (finePointer && !reduceMotion) {
    const cards = document.querySelectorAll(
      ".foundation-card, .package-card, .specialty-card"
    );

    cards.forEach(card => {
      card.addEventListener("pointermove", event => {
        const rect = card.getBoundingClientRect();

        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;

        card.style.setProperty("--pointer-x", `${x}%`);
        card.style.setProperty("--pointer-y", `${y}%`);
      });
    });
  }
})();
