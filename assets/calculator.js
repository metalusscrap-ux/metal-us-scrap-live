(function () {
  "use strict";

  const CONFIG = {
    currencyApi: "https://api.frankfurter.dev/v2/rates",
    rateSource: "data/uae-scrap-rates.json",
    adsenseClientId: "",
    adsenseSlots: {
      top: "",
      calculator: "",
      footer: ""
    }
  };

  const FALLBACK_MARKET = {
    market: "UAE indicative scrap market",
    baseCurrency: "AED",
    unit: "kg",
    lastUpdated: "2026-06-29",
    metals: [
      { id: "copper", name: "Copper", description: "Bright wire, pipes, busbars", rates: { clean: 29.5, mixed: 25.5, low: 18 } },
      { id: "aluminium", name: "Aluminium", description: "Profiles, wheels, sheets", rates: { clean: 4.8, mixed: 3.8, low: 2.6 } },
      { id: "brass", name: "Brass", description: "Fittings, valves, taps", rates: { clean: 17, mixed: 14, low: 10 } },
      { id: "stainless", name: "Stainless steel", description: "304/316 sheets and parts", rates: { clean: 3.2, mixed: 2.4, low: 1.35 } },
      { id: "steel", name: "Iron and steel", description: "HMS, fabrication scrap", rates: { clean: 1.05, mixed: 0.8, low: 0.5 } },
      { id: "lead", name: "Lead", description: "Sheets, weights, soft lead", rates: { clean: 6.2, mixed: 5.1, low: 3.6 } },
      { id: "zinc", name: "Zinc", description: "Die cast and zinc pieces", rates: { clean: 5.5, mixed: 4.4, low: 3 } },
      { id: "battery", name: "Car batteries", description: "Lead acid batteries", rates: { clean: 2.7, mixed: 2.25, low: 1.55 } },
      { id: "motors", name: "Electric motors", description: "Small and industrial motors", rates: { clean: 2.4, mixed: 1.85, low: 1.2 } },
      { id: "wire", name: "Insulated copper wire", description: "PVC insulated cable", rates: { clean: 12.5, mixed: 9.5, low: 6 } }
    ]
  };

  const FALLBACK_CURRENCY = {
    date: "2026-06-29",
    rates: {
      AED: 1,
      USD: 0.27229,
      EUR: 0.23862,
      GBP: 0.20599,
      INR: 25.711,
      PKR: 76.019,
      SAR: 1.0211,
      QAR: 0.99115,
      KWD: 0.08396,
      OMR: 0.1047
    }
  };

  const UNIT_TO_KG = {
    g: 0.001,
    kg: 1,
    tonne: 1000
  };

  const CURRENCY_NAMES = {
    AED: "UAE dirham",
    USD: "US dollar",
    EUR: "Euro",
    GBP: "British pound",
    INR: "Indian rupee",
    PKR: "Pakistani rupee",
    SAR: "Saudi riyal",
    QAR: "Qatari riyal",
    KWD: "Kuwaiti dinar",
    OMR: "Omani rial"
  };

  const state = {
    market: FALLBACK_MARKET,
    currency: FALLBACK_CURRENCY,
    currentEstimate: ""
  };

  const $ = (selector) => document.querySelector(selector);

  const elements = {
    calculator: $("#scrapCalculator"),
    metalSelect: $("#metalSelect"),
    gradeSelect: $("#gradeSelect"),
    unitSelect: $("#unitSelect"),
    weightInput: $("#weightInput"),
    currencySelect: $("#currencySelect"),
    resultAmount: $("#resultAmount"),
    ratePerKg: $("#ratePerKg"),
    weightKg: $("#weightKg"),
    aedValue: $("#aedValue"),
    rangeValue: $("#rangeValue"),
    rateStatus: $("#rateStatus"),
    currencyStatus: $("#currencyStatus"),
    ratesTableBody: $("#ratesTableBody"),
    copyEstimate: $("#copyEstimate"),
    estimateSummary: $("#estimateSummary"),
    cookieBanner: $("#cookieBanner"),
    acceptCookies: $("#acceptCookies")
  };

  function formatMoney(amount, currency) {
    const maximumFractionDigits = currency === "KWD" || currency === "OMR" ? 3 : 2;
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency,
      maximumFractionDigits
    }).format(Number.isFinite(amount) ? amount : 0).replace(/[\u00a0\u202f]/g, " ");
  }

  function formatNumber(value, decimals) {
    return new Intl.NumberFormat("en-AE", {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals
    }).format(Number.isFinite(value) ? value : 0);
  }

  function dateLabel(value) {
    if (!value) return "recently";
    const parsed = new Date(`${value}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString("en-AE", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  async function loadMarketRates() {
    try {
      const response = await fetch(`${CONFIG.rateSource}?v=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Rate file unavailable");
      const data = await response.json();
      if (!Array.isArray(data.metals) || !data.metals.length) throw new Error("Rate file is empty");
      state.market = data;
      elements.rateStatus.textContent = `UAE guide rates loaded: ${dateLabel(data.lastUpdated)}`;
    } catch (error) {
      state.market = FALLBACK_MARKET;
      elements.rateStatus.textContent = `Using fallback UAE guide rates: ${dateLabel(FALLBACK_MARKET.lastUpdated)}`;
    }
  }

  async function loadCurrencyRates() {
    const codes = Object.keys(FALLBACK_CURRENCY.rates).filter((code) => code !== "AED");
    const url = `${CONFIG.currencyApi}?base=AED&quotes=${codes.join(",")}`;

    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error("Currency endpoint unavailable");
      const data = await response.json();
      const rates = { AED: 1 };
      let date = data.date;

      if (Array.isArray(data)) {
        data.forEach((item) => {
          rates[item.quote] = Number(item.rate);
          date = item.date || date;
        });
      } else if (data.rates && typeof data.rates === "object") {
        Object.entries(data.rates).forEach(([code, rate]) => {
          rates[code] = Number(rate);
        });
      }

      codes.forEach((code) => {
        if (!Number.isFinite(rates[code])) {
          rates[code] = FALLBACK_CURRENCY.rates[code];
        }
      });

      state.currency = { date: date || FALLBACK_CURRENCY.date, rates };
      elements.currencyStatus.textContent = `Currency updated: ${dateLabel(state.currency.date)}`;
    } catch (error) {
      state.currency = FALLBACK_CURRENCY;
      elements.currencyStatus.textContent = `Using stored currency rates: ${dateLabel(FALLBACK_CURRENCY.date)}`;
    }
  }

  function populateMetals() {
    elements.metalSelect.innerHTML = "";
    state.market.metals.forEach((metal) => {
      const option = document.createElement("option");
      option.value = metal.id;
      option.textContent = metal.name;
      elements.metalSelect.append(option);
    });
  }

  function renderRateTable() {
    elements.ratesTableBody.innerHTML = "";
    state.market.metals.forEach((metal) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="metal-cell"><strong>${metal.name}</strong><span>${metal.description || ""}</span></td>
        <td>${formatMoney(metal.rates.clean, "AED")}</td>
        <td>${formatMoney(metal.rates.mixed, "AED")}</td>
        <td>${formatMoney(metal.rates.low, "AED")}</td>
      `;
      elements.ratesTableBody.append(row);
    });
  }

  function getSelectedMetal() {
    return state.market.metals.find((metal) => metal.id === elements.metalSelect.value) || state.market.metals[0];
  }

  function calculate() {
    const metal = getSelectedMetal();
    const grade = elements.gradeSelect.value;
    const unit = elements.unitSelect.value;
    const currency = elements.currencySelect.value;
    const weight = Math.max(Number(elements.weightInput.value || 0), 0);
    const kg = weight * (UNIT_TO_KG[unit] || 1);
    const aedRate = Number(metal.rates[grade] || 0);
    const aedTotal = kg * aedRate;
    const conversionRate = state.currency.rates[currency] || 1;
    const convertedTotal = aedTotal * conversionRate;
    const convertedRate = aedRate * conversionRate;
    const lowRange = convertedTotal * 0.925;
    const highRange = convertedTotal * 1.075;
    const gradeLabel = elements.gradeSelect.options[elements.gradeSelect.selectedIndex].textContent;
    const unitLabel = elements.unitSelect.options[elements.unitSelect.selectedIndex].textContent;

    elements.resultAmount.textContent = formatMoney(convertedTotal, currency);
    elements.ratePerKg.textContent = `${formatMoney(convertedRate, currency)}/kg`;
    elements.weightKg.textContent = `${formatNumber(kg, kg >= 100 ? 1 : 3)} kg`;
    elements.aedValue.textContent = formatMoney(aedTotal, "AED");
    elements.rangeValue.textContent = `${formatMoney(lowRange, currency)} - ${formatMoney(highRange, currency)}`;

    state.currentEstimate = [
      `${metal.name} (${gradeLabel})`,
      `Input: ${formatNumber(weight, 2)} ${unitLabel}`,
      `Weight: ${formatNumber(kg, 3)} kg`,
      `AED rate: ${formatMoney(aedRate, "AED")}/kg`,
      `Estimate: ${formatMoney(convertedTotal, currency)} (${CURRENCY_NAMES[currency] || currency})`
    ].join(" | ");

    if (elements.estimateSummary) {
      elements.estimateSummary.value = state.currentEstimate;
    }
  }

  async function copyEstimate() {
    if (!state.currentEstimate) calculate();
    try {
      await navigator.clipboard.writeText(state.currentEstimate);
      elements.copyEstimate.textContent = "Copied";
      window.setTimeout(() => {
        elements.copyEstimate.textContent = "Copy estimate";
      }, 1400);
    } catch (error) {
      elements.copyEstimate.textContent = "Copy unavailable";
      window.setTimeout(() => {
        elements.copyEstimate.textContent = "Copy estimate";
      }, 1400);
    }
  }

  function setupAdsense() {
    const client = CONFIG.adsenseClientId.trim();
    if (!client) return;

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
    script.crossOrigin = "anonymous";
    document.head.append(script);

    document.querySelectorAll("[data-ad-slot]").forEach((slot) => {
      const slotId = CONFIG.adsenseSlots[slot.dataset.adSlot];
      if (!slotId) return;
      slot.innerHTML = `
        <ins class="adsbygoogle"
          style="display:block"
          data-ad-client="${client}"
          data-ad-slot="${slotId}"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
      `;
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    });
  }

  function setupCookieNotice() {
    if (!elements.cookieBanner || !elements.acceptCookies) return;
    if (localStorage.getItem("metal-scrap-cookie-ok") === "1") return;
    elements.cookieBanner.classList.add("visible");
    elements.acceptCookies.addEventListener("click", () => {
      localStorage.setItem("metal-scrap-cookie-ok", "1");
      elements.cookieBanner.classList.remove("visible");
    });
  }

  function bindEvents() {
    ["change", "input"].forEach((eventName) => {
      elements.calculator.addEventListener(eventName, calculate);
    });

    elements.calculator.addEventListener("submit", (event) => {
      event.preventDefault();
      calculate();
    });

    elements.copyEstimate.addEventListener("click", copyEstimate);
  }

  async function init() {
    await Promise.all([loadMarketRates(), loadCurrencyRates()]);
    populateMetals();
    renderRateTable();
    bindEvents();
    setupAdsense();
    setupCookieNotice();
    calculate();
  }

  init();
})();
