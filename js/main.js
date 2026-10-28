
"use strict";

(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const STUDIO_WHATSAPP = "918310873925";

  const header = $("#site-header");
  const menuToggle = $("#menu-toggle");
  const nav = $("#primary-nav");
  const backdrop = $("#booking-modal");
  const modal = $(".booking-modal");
  const form = $("#booking-form");
  const packageSelect = $("#client-package");
  const shootDate = $("#shoot-date");
  const hourSelect = $("#shoot-hour");
  const minuteSelect = $("#shoot-minute");
  const periodSelect = $("#shoot-period");
  const successPanel = $("#booking-success");
  const whatsappLink = $("#whatsapp-link");

  if (
    !header || !menuToggle || !nav || !backdrop || !modal ||
    !form || !packageSelect || !shootDate || !hourSelect ||
    !minuteSelect || !periodSelect || !successPanel || !whatsappLink
  ) {
    console.error(
      "Shoot by Swaruu: a required HTML element is missing. " +
      "Check index.html against the new code."
    );
    return;
  }

  let previouslyFocused = null;

  function localDate(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function formatDate(dateString) {
    if (!dateString) return "Choose a date";

    return new Date(`${dateString}T12:00:00`).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }

  function rupees(value) {
    return `₹${Number(value).toLocaleString("en-IN")}`;
  }

  function selectedPackage() {
    return packageSelect.selectedOptions[0];
  }

  function selectedAddons() {
    return $$('input[name="addons"]:checked', form);
  }

  function selectedTime() {
    return `${hourSelect.value}:${minuteSelect.value} ${periodSelect.value}`;
  }

  // Live package and add-on estimate.
  function updateEstimate() {
    const option = selectedPackage();
    if (!option) return;

    const basePrice = Number(option.dataset.price || 0);
    const addons = selectedAddons();

    const addonTotal = addons.reduce((sum, item) => {
      return sum + Number(item.dataset.price || 0);
    }, 0);

    const hasVariablePrice = addons.some(item => {
      return item.dataset.variable === "true";
    });

    $("#summary-package").textContent = option.textContent.trim();

    $("#summary-date").textContent =
      `${formatDate(shootDate.value)} · ${selectedTime()}`;

    $("#summary-price").textContent =
      `${rupees(basePrice + addonTotal)}${hasVariablePrice ? "+" : ""}`;
  }

  // Mobile menu.
  function closeMenu() {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    nav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  function openMenu() {
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation");
    nav.classList.add("is-open");
    document.body.classList.add("menu-open");
  }

  menuToggle.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") === "true";
    open ? closeMenu() : openMenu();
  });

  $$(".primary-nav a", nav).forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 850) closeMenu();
  });

  // Header appearance after scrolling.
  function updateHeader() {
    header.classList.toggle("scrolled", window.scrollY > 10);
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  // Portfolio filters.
  const filterButtons = $$(".filter-button");
  const portfolioCards = $$(".portfolio-card");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter || "all";

      filterButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      portfolioCards.forEach(card => {
        const show = filter === "all" || card.dataset.category === filter;
        card.hidden = !show;
      });
    });
  });

  // Booking modal.
  function openBooking(packageKey) {
    previouslyFocused = document.activeElement;

    const optionExists = [...packageSelect.options].some(
      option => option.value === packageKey
    );

    if (packageKey && optionExists) {
      packageSelect.value = packageKey;
    }

    form.hidden = false;
    successPanel.hidden = true;

    backdrop.classList.add("open");
    backdrop.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    closeMenu();
    updateEstimate();

    window.setTimeout(() => $("#client-name")?.focus(), 60);
  }

  function closeBooking() {
    backdrop.classList.remove("open");
    backdrop.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (previouslyFocused && typeof previouslyFocused.focus === "function") {
      previouslyFocused.focus();
    }
  }

  $$("[data-book]").forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      openBooking(button.dataset.book);
    });
  });

  $$("[data-close-modal]").forEach(button => {
    button.addEventListener("click", closeBooking);
  });

  backdrop.addEventListener("click", event => {
    if (event.target === backdrop) closeBooking();
  });

  $("#edit-booking")?.addEventListener("click", () => {
    successPanel.hidden = true;
    form.hidden = false;
    updateEstimate();
    $("#client-name")?.focus();
  });

  // Keyboard support: Escape closes, Tab stays inside the open modal.
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeMenu();

      if (backdrop.classList.contains("open")) {
        closeBooking();
      }
    }

    if (
      event.key !== "Tab" ||
      !backdrop.classList.contains("open")
    ) return;

    const focusable = $$(
      'a[href], button:not([disabled]), input:not([disabled]), ' +
      'select:not([disabled]), textarea:not([disabled])',
      modal
    ).filter(element => !element.closest("[hidden]"));

    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  // Refresh the estimate when the customer changes anything.
  [
    packageSelect,
    shootDate,
    hourSelect,
    minuteSelect,
    periodSelect
  ].forEach(control => {
    control.addEventListener("change", updateEstimate);
  });

  $$('input[name="addons"]', form).forEach(input => {
    input.addEventListener("change", updateEstimate);
  });

  // Date picker must not allow dates earlier than today.
  function refreshMinimumDate() {
    shootDate.min = localDate();
  }

  refreshMinimumDate();

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) refreshMinimumDate();
  });

  // Generate a WhatsApp booking request.
  form.addEventListener("submit", event => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const date = String(data.get("date") || "");

    if (date < localDate()) {
      shootDate.setCustomValidity(
        "Choose today or a future date."
      );
      shootDate.reportValidity();
      shootDate.setCustomValidity("");
      return;
    }

    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const shootType = String(data.get("shootType") || "");
    const location = String(data.get("location") || "").trim();
    const mapLink = String(data.get("mapLink") || "").trim();
    const brief = String(data.get("message") || "").trim();

    const packageOption = selectedPackage();
    const packageName = packageOption.textContent.trim();
    const basePrice = Number(packageOption.dataset.price || 0);
    const addons = selectedAddons();

    const addonLines = addons.length
      ? addons.map(item => {
          const price = Number(item.dataset.price || 0);
          const isHourly = item.dataset.variable === "true";

          return `${item.value} — ${rupees(price)}${isHourly ? " per hour; actual amount to be confirmed" : ""}`;
        })
      : ["None"];

    const addonTotal = addons.reduce((sum, item) => {
      return sum + Number(item.dataset.price || 0);
    }, 0);

    const requiresQuote = addons.some(item => {
      return item.dataset.variable === "true";
    });

    const estimate = `${rupees(basePrice + addonTotal)}${requiresQuote ? "+" : ""}`;

    const lines = [
      "*NEW SHOOT REQUEST — SHOOT BY SWARUU*",
      "",
      `*Name / business:* ${name}`,
      `*Client WhatsApp:* ${phone}`,
      `*Package:* ${packageName}`,
      `*Shoot type:* ${shootType}`,
      `*Preferred date:* ${formatDate(date)}`,
      `*Preferred time:* ${selectedTime()}`,
      `*Location:* ${location}`
    ];

    if (mapLink) {
      lines.push(`*Google Maps link:* ${mapLink}`);
    }

    lines.push(
      `*Add-ons:* ${addonLines.join("; ")}`,
      `*Estimated total:* ${estimate}`,
      `*Creative brief:* ${brief || "Not provided"}`,
      "",
      "Please confirm availability, final pricing and delivery timeline. " +
      "This is a booking request, not a confirmed reservation."
    );

    whatsappLink.href =
      `https://wa.me/${STUDIO_WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`;

    $("#success-summary").textContent =
      `Your ${packageName} request for ${formatDate(date)} at ${selectedTime()} ` +
      "is ready. Open WhatsApp to review and send it to the studio. " +
      "The shoot is not confirmed until the studio replies.";

    form.hidden = true;
    successPanel.hidden = false;

    $(".booking-success h3")?.focus();
  });

  // Current year in the footer.
  const year = $("#current-year");
  if (year) year.textContent = new Date().getFullYear();

  updateEstimate();
})();
