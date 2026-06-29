exports.handler = async function () {
  const apiKey = process.env.METALS_API_KEY;

  const fallback = {
    source: "Fallback demo/manual UAE scrap reference rates",
    live: false,
    updatedAt: new Date().toISOString(),
    currency: "AED",
    unit: "kg",
    ratesAEDPerKg: {
      copper: Number(process.env.FALLBACK_COPPER_AED_KG || 28.5),
      aluminium: Number(process.env.FALLBACK_ALUMINIUM_AED_KG || 6.8),
      brass: Number(process.env.FALLBACK_BRASS_AED_KG || 18.5),
      steel: Number(process.env.STEEL_AED_KG || 1.2),
      lead: Number(process.env.FALLBACK_LEAD_AED_KG || 6.5),
      iron: Number(process.env.IRON_AED_KG || 1.1)
    }
  };

  const jsonResponse = (statusCode, body, cacheSeconds = 300) => ({
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": `public, max-age=${cacheSeconds}, s-maxage=${cacheSeconds}`
    },
    body: JSON.stringify(body)
  });

  if (!apiKey) {
    return jsonResponse(200, {
      ...fallback,
      error: "METALS_API_KEY is not set in Netlify Environment Variables."
    }, 60);
  }

  try {
    /*
      Metals-API latest endpoint:
      https://metals-api.com/api/latest?access_key=API_KEY&base=USD&symbols=...

      Metals-API returns metal exchange rates. For many metal symbols with USD as base,
      the dashboard/docs note that you calculate USD price by using 1 / response value.

      We request USD base + AED currency. Then:
      USD per troy ounce = 1 / symbolRate
      AED per KG = (USD per troy ounce / 0.0311034768) * USD_AED
      Then scrap factor is applied.
    */
    const endpoint = "https://metals-api.com/api/latest";
    const symbols = [
      "AED",
      "LME-XCU",   // LME Copper
      "LME-ALU",   // LME Aluminium
      "LME-LEAD",  // LME Lead
      "LME-ZNC",   // LME Zinc - used if brass fallback is needed
      "Y-BRASS",   // Yellow Brass, if included in your plan
      "STEEL-SC"   // LME Steel Scrap CFR Turkey, if included in your plan
    ].join(",");

    const url = `${endpoint}?access_key=${encodeURIComponent(apiKey)}&base=USD&symbols=${encodeURIComponent(symbols)}`;
    const response = await fetch(url, { headers: { "Accept": "application/json" } });
    const data = await response.json();

    if (!response.ok || data.success === false || !data.rates) {
      throw new Error(data.error?.info || data.error?.message || "Metals-API request failed.");
    }

    const rates = data.rates;
    const usdToAed = Number(rates.AED || 3.6725);
    const TROY_OUNCE_KG = 0.0311034768;

    function usdPerOzt(symbol) {
      const v = Number(rates[symbol]);
      if (!v || v <= 0) return null;
      return 1 / v;
    }

    function aedPerKgFromOzt(symbol, factor, fallbackValue) {
      const priceUsdOzt = usdPerOzt(symbol);
      if (!priceUsdOzt) return Number(fallbackValue);
      const aedKg = (priceUsdOzt / TROY_OUNCE_KG) * usdToAed;
      return +(aedKg * factor).toFixed(2);
    }

    const copperFactor = Number(process.env.COPPER_SCRAP_FACTOR || 0.82);
    const aluminiumFactor = Number(process.env.ALUMINIUM_SCRAP_FACTOR || 0.65);
    const leadFactor = Number(process.env.LEAD_SCRAP_FACTOR || 0.65);
    const brassFactor = Number(process.env.BRASS_SCRAP_FACTOR || 0.70);
    const steelFactor = Number(process.env.STEEL_SCRAP_FACTOR || 0.70);

    const copper = aedPerKgFromOzt("LME-XCU", copperFactor, fallback.ratesAEDPerKg.copper);
    const aluminium = aedPerKgFromOzt("LME-ALU", aluminiumFactor, fallback.ratesAEDPerKg.aluminium);
    const lead = aedPerKgFromOzt("LME-LEAD", leadFactor, fallback.ratesAEDPerKg.lead);

    let brass;
    if (rates["Y-BRASS"]) {
      brass = aedPerKgFromOzt("Y-BRASS", brassFactor, fallback.ratesAEDPerKg.brass);
    } else {
      // Fallback brass formula: 60% copper + 40% zinc, then scrap factor
      const zincSpot = aedPerKgFromOzt("LME-ZNC", 1, 0);
      brass = zincSpot
        ? +(((copper / copperFactor) * 0.60 + zincSpot * 0.40) * brassFactor).toFixed(2)
        : fallback.ratesAEDPerKg.brass;
    }

    let steel = Number(process.env.STEEL_AED_KG || 0);
    if (!steel && rates["STEEL-SC"]) {
      steel = aedPerKgFromOzt("STEEL-SC", steelFactor, fallback.ratesAEDPerKg.steel);
    }
    if (!steel) steel = fallback.ratesAEDPerKg.steel;

    // Iron ore is not the same as UAE iron scrap, so keep iron as your configured UAE reference.
    const iron = Number(process.env.IRON_AED_KG || fallback.ratesAEDPerKg.iron);

    return jsonResponse(200, {
      source: "Metals-API + UAE scrap factors",
      live: true,
      updatedAt: data.timestamp ? new Date(data.timestamp * 1000).toISOString() : new Date().toISOString(),
      currency: "AED",
      unit: "kg",
      ratesAEDPerKg: {
        copper,
        aluminium,
        brass,
        steel: +Number(steel).toFixed(2),
        lead,
        iron: +Number(iron).toFixed(2)
      }
    }, 900);
  } catch (error) {
    return jsonResponse(200, {
      ...fallback,
      error: error.message || "Unable to fetch live rates from Metals-API."
    }, 60);
  }
};
