'use strict';

(() => {
  /* =========================================================
     SERVERLESS LEAD CAPTURE CONFIGURATION (OPTIONAL)
     Paste your URLs/Keys inside the quotes below.
  ========================================================= */
  const GOOGLE_SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyocNGIxakY0gZj7mmPVei7Ze0LoYOO_c9JSeXVXcRhFTNpNIZ9YaozMv3isddx5s5jiA/exec'; // Paste your https://script.google.com/macros/s/.../exec URL here
  const WEB3FORMS_ACCESS_KEY = '424146bc-0397-4b36-95e3-62fa5204c5d1';      // Paste your Web3Forms Access Key here (optional, for instant email alerts)

  const header = document.querySelector('#site-header');
  const menuToggle = document.querySelector('#menu-toggle');
  const primaryNav = document.querySelector('#primary-nav');
  const modalBackdrop = document.querySelector('#booking-modal');
  const modal = document.querySelector('.booking-modal');
  const bookingForm = document.querySelector('#booking-form');
  const packageSelect = document.querySelector('#client-package');
  const confirmation = document.querySelector('#booking-confirmation');
  const confirmationSummary = document.querySelector('#confirmation-summary');
  const whatsappLink = document.querySelector('#whatsapp-link');
  const shootDate = document.querySelector('#shoot-date');
  const shootHour = document.querySelector('#shoot-hour');
  const shootMinute = document.querySelector('#shoot-minute');
  const shootPeriodInputs = [...document.querySelectorAll('input[name="shootPeriod"]')];
  const livePackageSummary = document.querySelector('#live-package-summary');
  const liveSlotSummary = document.querySelector('#live-slot-summary');
  const livePriceSummary = document.querySelector('#live-price-summary');

  let lastFocusedElement = null;

  const localDate = (date) => [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-');

  const getSelectedAmPmTime = () => {
    const hour = shootHour?.value || '04';
    const minute = shootMinute?.value || '30';
    const period = shootPeriodInputs.find((r) => r.checked)?.value || 'PM';
    return `${hour}:${minute} ${period}`;
  };

  const parsePrice = (text) => {
    const match = String(text || '').replace(/,/g, '').match(/₹\s*(\d+)/);
    return match ? Number(match[1]) : 0;
  };

  // Silently send booking lead to Google Sheets & Web3Forms in the background
  function captureLeadInBackground(leadData) {
    // 1. Send to Google Sheets (via Google Apps Script Web App)
    if (GOOGLE_SHEETS_WEBHOOK_URL) {
      fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(leadData)
      }).catch(() => {
        // Fail silently so the client's WhatsApp booking flow is never interrupted
      });
    }

    // 2. Send Instant Email Notification (via Web3Forms)
    if (WEB3FORMS_ACCESS_KEY) {
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `New Shoot Booking: ${leadData.name} (${leadData.package})`,
          from_name: 'Shoot by Swaruu Website',
          ...leadData
        })
      }).catch(() => {
        // Fail silently so the client's WhatsApp booking flow is never interrupted
      });
    }
  }

  const year = document.querySelector('#current-year');
  if (year) year.textContent = new Date().getFullYear();

  if (shootDate) {
    const today = localDate(new Date());
    shootDate.min = today;
    shootDate.value = today;
  }

  // Update live summary bar inside booking modal
  function updateLiveSummary() {
    if (!bookingForm) return;
    const selectedPkg = packageSelect?.value || '1 REEL — ₹2,000';
    const basePrice = parsePrice(selectedPkg);
    const checkedAddons = [...bookingForm.querySelectorAll('input[name="addons"]:checked')];
    const addonsTotal = checkedAddons.reduce((sum, input) => sum + parsePrice(input.value), 0);
    const total = basePrice + addonsTotal;

    if (livePackageSummary) {
      livePackageSummary.textContent = checkedAddons.length
        ? `${selectedPkg.split('—')[0].trim()} + ${checkedAddons.length} Add-on${checkedAddons.length > 1 ? 's' : ''}`
        : selectedPkg;
    }

    if (liveSlotSummary) {
      const dateVal = shootDate?.value
        ? new Date(`${shootDate.value}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'Select date';
      const timeVal = getSelectedAmPmTime();
      liveSlotSummary.textContent = `${dateVal} · ${timeVal}`;
    }

    if (livePriceSummary) {
      livePriceSummary.textContent = `₹${total.toLocaleString('en-IN')}`;
    }
  }

  shootDate?.addEventListener('change', updateLiveSummary);
  shootHour?.addEventListener('change', updateLiveSummary);
  shootMinute?.addEventListener('change', updateLiveSummary);
  shootPeriodInputs.forEach((radio) => radio.addEventListener('change', updateLiveSummary));
  packageSelect?.addEventListener('change', updateLiveSummary);
  bookingForm?.querySelectorAll('input[name="addons"]').forEach((checkbox) => {
    checkbox.addEventListener('change', updateLiveSummary);
  });

  function closeMenu() {
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open navigation');
    primaryNav?.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  }

  menuToggle?.addEventListener('click', () => {
    const shouldOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(shouldOpen));
    menuToggle.setAttribute('aria-label', shouldOpen ? 'Close navigation' : 'Open navigation');
    primaryNav?.classList.toggle('is-open', shouldOpen);
    document.body.classList.toggle('menu-open', shouldOpen);
  });
  primaryNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 820) closeMenu(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 16);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  function openModal(selectedPackage, selectedAddon) {
    if (!modalBackdrop || !bookingForm || !packageSelect) return;
    lastFocusedElement = document.activeElement;
    if (selectedPackage && [...packageSelect.options].some((option) => option.value === selectedPackage)) {
      packageSelect.value = selectedPackage;
    }
    if (selectedAddon) {
      const checkbox = [...bookingForm.querySelectorAll('input[name="addons"]')].find((item) => item.value === selectedAddon);
      if (checkbox) checkbox.checked = true;
    }
    updateLiveSummary();
    bookingForm.hidden = false;
    confirmation.hidden = true;
    modalBackdrop.classList.add('is-open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    closeMenu();
    window.setTimeout(() => document.querySelector('#client-name')?.focus(), 80);
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('is-open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    lastFocusedElement?.focus?.();
  }

  document.querySelectorAll('[data-book]').forEach((element) => {
    element.addEventListener('click', (event) => {
      if (element.tagName === 'A' && element.getAttribute('href') === '#booking-modal') event.preventDefault();
      openModal(element.dataset.book);
    });
  });
  document.querySelectorAll('[data-addon]').forEach((button) => {
    button.addEventListener('click', () => openModal('1 REEL — ₹2,000', button.dataset.addon));
  });
  document.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', closeModal));
  modalBackdrop?.addEventListener('click', (event) => { if (event.target === modalBackdrop) closeModal(); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalBackdrop?.classList.contains('is-open')) closeModal();
    if (event.key !== 'Tab' || !modalBackdrop?.classList.contains('is-open') || !modal) return;
    const focusable = [...modal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])')]
      .filter((element) => !element.closest('[hidden]'));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  bookingForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!bookingForm.reportValidity()) return;
    const formData = new FormData(bookingForm);
    const addons = formData.getAll('addons').map(String);
    const formattedTime = getSelectedAmPmTime();

    const booking = {
      name: String(formData.get('name') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      package: String(formData.get('package') || ''),
      date: String(formData.get('date') || ''),
      time: formattedTime,
      shootType: String(formData.get('shootType') || ''),
      location: String(formData.get('location') || '').trim(),
      mapLink: String(formData.get('mapLink') || '').trim(),
      addons,
      message: String(formData.get('message') || '').trim()
    };

    const readableDate = booking.date
      ? new Date(`${booking.date}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
      : booking.date;

    const estimatedTotal = livePriceSummary?.textContent || booking.package;

    // Trigger silent background lead capture (Google Sheets + Email)
    captureLeadInBackground({
      name: booking.name,
      phone: booking.phone,
      package: booking.package,
      date: readableDate,
      time: booking.time,
      shootType: booking.shootType,
      location: booking.location,
      mapLink: booking.mapLink || 'Not provided',
      addons: addons.length ? addons.join(', ') : 'None',
      estimatedTotal,
      message: booking.message || 'Not provided'
    });

    confirmationSummary.textContent = `Your ${booking.package} request for ${readableDate} at ${booking.time} in ${booking.location} is ready. Open WhatsApp to send the request; your shoot is not booked until the studio confirms it.`;

    const messageLines = [
      '*NEW SHOOT BOOKING — SHOOT BY SWARUU*',
      `*Name / Brand:* ${booking.name}`,
      `*Client WhatsApp:* ${booking.phone}`,
      `*Package:* ${booking.package}`,
      `*Preferred shoot date:* ${readableDate}`,
      `*Preferred shoot timing:* ${booking.time}`,
      `*Shoot type:* ${booking.shootType}`,
      `*Location (Area / Venue):* ${booking.location}`
    ];

    if (booking.mapLink) {
      messageLines.push(`*Google Maps Link:* ${booking.mapLink}`);
    }

    messageLines.push(
      `*Additional services:* ${addons.length ? addons.join(', ') : 'None'}`,
      `*Estimated Total:* ${estimatedTotal}`,
      `*Creative brief:* ${booking.message || 'Not provided'}`,
      '',
      'Please confirm availability and share payment details. I understand that the date is confirmed only after the 50% advance payment.'
    );

    const message = messageLines.join('\n');
    whatsappLink.href = `https://wa.me/918310873925?text=${encodeURIComponent(message)}`;
    bookingForm.hidden = true;
    confirmation.hidden = false;
    confirmation.querySelector('h3')?.focus();
  });

  // Single-open accordion for the booking terms.
  const accordionItems = [...document.querySelectorAll('#terms-accordion .accordion-item')];
  accordionItems.forEach((item) => {
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');
    const sign = trigger?.querySelector('b');
    trigger?.addEventListener('click', () => {
      const shouldOpen = trigger.getAttribute('aria-expanded') !== 'true';
      accordionItems.forEach((other) => {
        const otherTrigger = other.querySelector('.accordion-trigger');
        const otherContent = other.querySelector('.accordion-content');
        otherTrigger?.setAttribute('aria-expanded', 'false');
        if (otherContent) otherContent.hidden = true;
        other.classList.remove('is-open');
        const otherSign = otherTrigger?.querySelector('b');
        if (otherSign) otherSign.textContent = '+';
      });
      if (shouldOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        if (content) content.hidden = false;
        item.classList.add('is-open');
        if (sign) sign.textContent = '−';
      }
    });
  });

  updateLiveSummary();
})();