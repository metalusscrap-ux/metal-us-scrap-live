Metal US Scrap Live Rates - Metals-API Version

FILES:
- index.html
- netlify.toml
- netlify/functions/rates.js

REQUIRED NETLIFY ENVIRONMENT VARIABLE:
- METALS_API_KEY = your Metals-API access key

OPTIONAL ENVIRONMENT VARIABLES:
- COPPER_SCRAP_FACTOR = 0.82
- ALUMINIUM_SCRAP_FACTOR = 0.65
- LEAD_SCRAP_FACTOR = 0.65
- BRASS_SCRAP_FACTOR = 0.70
- STEEL_SCRAP_FACTOR = 0.70
- STEEL_AED_KG = 1.20
- IRON_AED_KG = 1.10

NOTES:
- Copper uses LME-XCU.
- Aluminium uses LME-ALU.
- Lead uses LME-LEAD.
- Brass uses Y-BRASS if available, otherwise copper/zinc formula.
- Steel tries STEEL-SC if available, otherwise configured STEEL_AED_KG.
- Iron stays configured because iron ore is not the same as UAE iron scrap.

TEST URL AFTER DEPLOY:
https://metalusscrap.com/.netlify/functions/rates
