"use strict";

/* =========================================
   SHOOT BY SWARUU
   Animation Controller
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    // Enable CSS scroll-reveal animations safely
    document.documentElement.classList.add("js-ready");

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    /* =====================================
       SCROLL REVEAL
    ===================================== */

    const revealElements = document.querySelectorAll(".reveal");

    if (reducedMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach((element) => {
            element.classList.add("visible", "is-visible");
        });
    } else {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("visible", "is-visible");
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -30px 0px"
            }
        );

        revealElements.forEach((element) => {
            const parent = element.parentElement;

            // Stagger elements that share the same parent
            const siblings = parent
                ? Array.from(parent.children).filter((child) =>
                      child.classList.contains("reveal")
                  )
                : [];

            const siblingIndex = siblings.indexOf(element);

            element.style.transitionDelay =
                `${Math.max(0, siblingIndex) * 65}ms`;

            revealObserver.observe(element);
        });
    }

    /* =====================================
       HOVER TILT (DESKTOP POINTERS ONLY)
    ===================================== */

    const finePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    if (!reducedMotion && finePointer) {
        const tiltCards = document.querySelectorAll(
            "[data-tilt], .portfolio-card, .service-card, .gallery-card"
        );

        tiltCards.forEach((card) => {
            card.addEventListener("pointermove", (event) => {
                const rect = card.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateY = ((x - centerX) / centerX) * 2.5;
                const rotateX = ((centerY - y) / centerY) * 2.5;

                card.style.transform =
                    `perspective(950px) ` +
                    `rotateX(${rotateX.toFixed(2)}deg) ` +
                    `rotateY(${rotateY.toFixed(2)}deg) ` +
                    `translateY(-5px)`;
            });

            card.addEventListener("pointerleave", () => {
                card.style.transform = "";
            });
        });

        /* =====================================
           HERO PARALLAX
        ===================================== */

        const heroVisual = document.querySelector("[data-parallax]");
        const heroWrap = heroVisual?.querySelector(".hero-image-wrap");

        if (heroVisual && heroWrap) {
            heroVisual.addEventListener("pointermove", (event) => {
                const rect = heroVisual.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width - 0.5;
                const y = (event.clientY - rect.top) / rect.height - 0.5;

                heroWrap.style.transform =
                    `rotateY(${(-x * 5).toFixed(2)}deg) ` +
                    `rotateX(${(y * 5).toFixed(2)}deg) ` +
                    `translateY(-4px)`;
            });

            heroVisual.addEventListener("pointerleave", () => {
                heroWrap.style.transform = "";
            });
        }
    }

    /* =====================================
       PAUSE MARQUEE WHEN HIDDEN
    ===================================== */

    const marquee = document.querySelector(".marquee-track");

    document.addEventListener("visibilitychange", () => {
        if (!marquee || reducedMotion) return;
        marquee.style.animationPlayState =
            document.hidden ? "paused" : "running";
    });
});