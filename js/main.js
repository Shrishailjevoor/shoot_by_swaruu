"use strict";

(() => {
  // =========================================================
  // SHOOT BY SWARUU — MAIN JAVASCRIPT
  // Navigation, Portfolio, Booking, Email and WhatsApp
  // =========================================================

  // ==================== CONFIGURATION ======================

  const STUDIO_WHATSAPP = "918310873925";

  const WEB3FORMS_ACCESS_KEY =
    "e75fc203-b0e4-4f0f-88df-f0b2541c87ee";

  const STUDIO_EMAIL = "shootbyswaruu@gmail.com";

  const WEB3FORMS_ENDPOINT =
    "https://api.web3forms.com/submit";

  // ==================== DOM HELPERS ========================

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

  // ==================== PAGE ELEMENTS ======================

  const header = $("#site-header");
  const menuToggle = $("#menu-toggle");
  const nav = $("#primary-nav");

  const backdrop = $("#booking-modal");
  const modal = $(".booking-modal");
  const form = $("#booking-form");

  const packageSelect = $("#client-package");
  const shootDate = $("#shoot-date");
  const calendarButton = $("#open-calendar");

  const hourSelect = $("#shoot-hour");
  const minuteSelect = $("#shoot-minute");
  const periodSelect = $("#shoot-period");

  const successPanel = $("#booking-success");
  const whatsappLink = $("#whatsapp-link");

  if (
    !header ||
    !menuToggle ||
    !nav ||
    !backdrop ||
    !modal ||
    !form ||
    !packageSelect ||
    !shootDate ||
    !hourSelect ||
    !minuteSelect ||
    !periodSelect ||
    !successPanel ||
    !whatsappLink
  ) {
    console.error(
      "Shoot by Swaruu: A required HTML element is missing."
    );
    return;
  }

  let previouslyFocused = null;
  let submissionInProgress = false;

  // ==================== DATE FUNCTIONS =====================

  function localDate(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return year + "-" + month + "-" + day;
  }

  function formatDate(dateString) {
    if (!dateString) {
      return "Choose a date";
    }

    return new Date(dateString + "T12:00:00").toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric"
      }
    );
  }

  function rupees(value) {
    return "₹" + Number(value).toLocaleString("en-IN");
  }

  function selectedPackage() {
    return packageSelect.selectedOptions[0] || null;
  }

  function selectedAddons() {
    return $$('input[name="addons"]:checked', form);
  }

  function selectedTime() {
    return (
      hourSelect.value +
      ":" +
      minuteSelect.value +
      " " +
      periodSelect.value
    );
  }

  // ==================== PRICE CALCULATION ==================

  function calculateBooking() {
    const option = selectedPackage();

    if (!option) {
      return null;
    }

    const basePrice = Number(option.dataset.price || 0);
    const addons = selectedAddons();

    const addonTotal = addons.reduce((sum, item) => {
      return sum + Number(item.dataset.price || 0);
    }, 0);

    const requiresQuote = addons.some(item => {
      return item.dataset.variable === "true";
    });

    return {
      packageName: option.textContent.trim(),
      basePrice: basePrice,
      addonTotal: addonTotal,
      addons: addons,
      requiresQuote: requiresQuote,
      estimate:
        rupees(basePrice + addonTotal) +
        (requiresQuote ? "+" : "")
    };
  }

  function updateEstimate() {
    const booking = calculateBooking();

    if (!booking) {
      return;
    }

    const summaryPackage = $("#summary-package");
    const summaryDate = $("#summary-date");
    const summaryPrice = $("#summary-price");

    if (summaryPackage) {
      summaryPackage.textContent = booking.packageName;
    }

    if (summaryDate) {
      summaryDate.textContent =
        formatDate(shootDate.value) + " · " + selectedTime();
    }

    if (summaryPrice) {
      summaryPrice.textContent = booking.estimate;
    }
  }

  // ==================== NAVIGATION ========================

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
    const isOpen =
      menuToggle.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  $$(".primary-nav a", nav).forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 850) {
      closeMenu();
    }
  });

  function updateHeader() {
    header.classList.toggle("scrolled", window.scrollY > 10);
  }

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  // ==================== PORTFOLIO FILTERS ==================

  const filterButtons = $$(".filter-button");
  const portfolioCards = $$(".portfolio-card");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter || "all";

      filterButtons.forEach(item => {
        const isActive = item === button;

        item.classList.toggle("active", isActive);

        item.setAttribute(
          "aria-pressed",
          String(isActive)
        );
      });

      portfolioCards.forEach(card => {
        const shouldShow =
          filter === "all" ||
          card.dataset.category === filter;

        card.hidden = !shouldShow;
      });
    });
  });

  // ==================== BOOKING MODAL ======================

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

    window.setTimeout(() => {
      $("#client-name")?.focus();
    }, 60);
  }

  function closeBooking() {
    backdrop.classList.remove("open");
    backdrop.setAttribute("aria-hidden", "true");

    document.body.classList.remove("modal-open");

    if (
      previouslyFocused &&
      typeof previouslyFocused.focus === "function"
    ) {
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
    if (event.target === backdrop) {
      closeBooking();
    }
  });

  $("#edit-booking")?.addEventListener("click", () => {
    successPanel.hidden = true;
    form.hidden = false;

    updateEstimate();

    $("#client-name")?.focus();
  });

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
    ) {
      return;
    }

    const focusable = $$(
      'a[href], button:not([disabled]), ' +
      'input:not([disabled]), select:not([disabled]), ' +
      'textarea:not([disabled])',
      modal
    ).filter(element => !element.closest("[hidden]"));

    if (!focusable.length) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (
      event.shiftKey &&
      document.activeElement === first
    ) {
      event.preventDefault();
      last.focus();
    } else if (
      !event.shiftKey &&
      document.activeElement === last
    ) {
      event.preventDefault();
      first.focus();
    }
  });

  // ==================== PRICE UPDATE EVENTS ================

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

  // ==================== CALENDAR ============================

  function refreshMinimumDate() {
    shootDate.min = localDate();
  }

  refreshMinimumDate();

  calendarButton?.addEventListener("click", () => {
    refreshMinimumDate();

    try {
      if (typeof shootDate.showPicker === "function") {
        shootDate.showPicker();
      } else {
        shootDate.focus();
      }
    } catch (error) {
      shootDate.focus();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      refreshMinimumDate();
    }
  });

  // ==================== EMAIL NOTIFICATION ==================

  async function sendBookingEmail(bookingData) {
    const messageLines = [
      "NEW SHOOT BOOKING REQUEST",
      "=========================",
      "",
      "Client name: " + bookingData.name,
      "Client phone: " + bookingData.phone,
      "Client email: " + (bookingData.email || "Not provided"),
      "",
      "Package: " + bookingData.packageName,
      "Shoot type: " + bookingData.shootType,
      "",
      "Preferred date: " + bookingData.readableDate,
      "Preferred time: " + bookingData.time,
      "",
      "Location: " + bookingData.location,
      "Google Maps link: " + (bookingData.mapLink || "Not provided"),
      "",
      "Add-ons: " + bookingData.addonLines.join("; "),
      "Estimated price: " + bookingData.estimate,
      "Creative brief: " + (bookingData.brief || "Not provided"),
      "",
      "STATUS: Awaiting studio confirmation.",
      "This is a booking request, not a confirmed booking."
    ];

    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: "New Shoot Booking Request - " + bookingData.name,
      from_name: "Shoot by Swaruu Website",
      email: STUDIO_EMAIL,
      message: messageLines.join("\n")
    };

    // Include the client's email as the reply-to address
    // only when they have provided one.
    if (bookingData.email) {
      payload.replyto = bookingData.email;
    }

    const controller = new AbortController();

    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, 20000);

    let response;
    let result;

    try {
      response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      result = await response.json();
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error(
          "The email request timed out. Please try again."
        );
      }

      throw new Error(
        "Unable to connect to the email service. Check your internet connection."
      );
    } finally {
      window.clearTimeout(timeoutId);
    }

    if (!response.ok || result.success !== true) {
      console.error("Web3Forms error:", result);

      throw new Error(
        result.message || "Web3Forms rejected the submission."
      );
    }

    console.log(
      "Web3Forms accepted the booking request.",
      result
    );

    return result;
  }

  // ==================== WHATSAPP MESSAGE ====================

  function createWhatsAppMessage(bookingData) {
    const lines = [
      "*NEW SHOOT REQUEST — SHOOT BY SWARUU*",
      "",
      "*Name / business:* " + bookingData.name,
      "*Client WhatsApp:* " + bookingData.phone,
      "*Client email:* " + (bookingData.email || "Not provided"),
      "*Package:* " + bookingData.packageName,
      "*Shoot type:* " + bookingData.shootType,
      "*Preferred date:* " + bookingData.readableDate,
      "*Preferred time:* " + bookingData.time,
      "*Location:* " + bookingData.location
    ];

    if (bookingData.mapLink) {
      lines.push(
        "*Google Maps link:* " + bookingData.mapLink
      );
    }

    lines.push(
      "*Add-ons:* " + bookingData.addonLines.join("; "),
      "*Estimated total:* " + bookingData.estimate,
      "*Creative brief:* " + (bookingData.brief || "Not provided"),
      "",
      "Please confirm availability, final pricing and delivery timeline.",
      "This is a request, not a confirmed booking."
    );

    return lines.join("\n");
  }

  // ==================== ERROR MESSAGE HELPER ===============

  function showBookingError(message) {
    let errorNotice = $("#booking-email-error");

    if (!errorNotice) {
      errorNotice = document.createElement("p");
      errorNotice.id = "booking-email-error";
      errorNotice.setAttribute("role", "alert");

      errorNotice.style.marginTop = "12px";
      errorNotice.style.padding = "12px";
      errorNotice.style.borderRadius = "8px";
      errorNotice.style.background = "#fff0f0";
      errorNotice.style.color = "#a40000";

      form.appendChild(errorNotice);
    }

    errorNotice.textContent = message;
  }

  function clearBookingError() {
    $("#booking-email-error")?.remove();
  }

  // ==================== FORM SUBMISSION =====================

  form.addEventListener("submit", async event => {
    event.preventDefault();

    if (submissionInProgress) {
      return;
    }

    clearBookingError();
    refreshMinimumDate();

    if (!form.reportValidity()) {
      return;
    }

    const data = new FormData(form);

    const date = String(data.get("date") || "");

    if (!date || date < localDate()) {
      shootDate.setCustomValidity(
        "Choose today or a future date."
      );

      shootDate.reportValidity();
      shootDate.setCustomValidity("");

      return;
    }

    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();

    const shootType = String(
      data.get("shootType") || ""
    ).trim();

    const location = String(
      data.get("location") || ""
    ).trim();

    const mapLink = String(
      data.get("mapLink") || ""
    ).trim();

    const brief = String(
      data.get("message") || ""
    ).trim();

    const booking = calculateBooking();

    if (!booking) {
      showBookingError("Please select a booking package.");
      return;
    }

    const addonLines = booking.addons.length
      ? booking.addons.map(item => {
          const price = Number(item.dataset.price || 0);

          const isHourly =
            item.dataset.variable === "true";

          let line = item.value + " — " + rupees(price);

          if (isHourly) {
            line += " per hour; final amount to be confirmed";
          }

          return line;
        })
      : ["None"];

    const bookingData = {
      name: name,
      phone: phone,
      email: email,
      shootType: shootType,
      location: location,
      mapLink: mapLink,
      brief: brief,
      packageName: booking.packageName,
      readableDate: formatDate(date),
      time: selectedTime(),
      addonLines: addonLines,
      estimate: booking.estimate
    };

    // Prepare the WhatsApp link before requesting the email.
    const whatsappMessage = createWhatsAppMessage(bookingData);

    whatsappLink.href =
      "https://wa.me/" +
      STUDIO_WHATSAPP +
      "?text=" +
      encodeURIComponent(whatsappMessage);

    const successSummary = $("#success-summary");

    // Prevent users from submitting the form repeatedly.
    submissionInProgress = true;

    const submitButton = $(
      'button[type="submit"], input[type="submit"]',
      form
    );

    const originalButtonText = submitButton
      ? (
          submitButton.tagName === "INPUT"
            ? submitButton.value
            : submitButton.textContent
        )
      : "";

    if (submitButton) {
      submitButton.disabled = true;

      if (submitButton.tagName === "INPUT") {
        submitButton.value = "Sending request...";
      } else {
        submitButton.textContent = "Sending request...";
      }
    }

    try {
      // Send the booking details to Web3Forms.
      await sendBookingEmail(bookingData);

      // Show success only after Web3Forms accepts the request.
      form.hidden = true;
      successPanel.hidden = false;

      if (successSummary) {
        successSummary.textContent =
          "Your " +
          bookingData.packageName +
          " request for " +
          bookingData.readableDate +
          " at " +
          bookingData.time +
          " has been submitted. Open WhatsApp below to send your request directly to the studio. Your booking is not confirmed until the studio confirms availability.";
      }

      $(".booking-success h3")?.focus();

    } catch (error) {
      console.error("Booking email error:", error);

      let errorMessage =
        "The email submission failed. Your details are still in the form. Please try again.";

      if (!navigator.onLine) {
        errorMessage =
          "You appear to be offline. Your details are still in the form. Reconnect to the internet and try again.";
      } else if (error && error.message) {
        errorMessage =
          "Email submission failed: " +
          error.message +
          " Your details are still in the form.";
      }

      showBookingError(errorMessage);

      // Preserve the prepared WhatsApp link as an alternative.
      if (successSummary) {
        successSummary.textContent =
          "Your booking details are ready. Use WhatsApp below to send your request to the studio.";
      }

    } finally {
      submissionInProgress = false;

      if (submitButton) {
        submitButton.disabled = false;

        if (submitButton.tagName === "INPUT") {
          submitButton.value = originalButtonText;
        } else {
          submitButton.textContent = originalButtonText;
        }
      }
    }
  });

  // ==================== FOOTER YEAR ========================

  const year = $("#current-year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // ==================== INITIALIZE =========================

  updateEstimate();

})();