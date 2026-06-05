// South African tax calculations — 2024/2025 tax year

const BRACKETS = [
  { threshold: 1817000, base: 644489, rate: 0.45 },
  { threshold: 857900,  base: 251258, rate: 0.41 },
  { threshold: 673000,  base: 179147, rate: 0.39 },
  { threshold: 512800,  base: 121475, rate: 0.36 },
  { threshold: 370500,  base: 77362,  rate: 0.31 },
  { threshold: 237100,  base: 42678,  rate: 0.26 },
  { threshold: 0,       base: 0,      rate: 0.18 },
];

const PRIMARY_REBATE = 17235;
const UIF_RATE = 0.01;
const UIF_CAP_MONTHLY = 177.12;

function calcAnnualPAYE(annualGross) {
  for (const bracket of BRACKETS) {
    if (annualGross > bracket.threshold) {
      const tax = bracket.base + (annualGross - bracket.threshold) * bracket.rate;
      return Math.max(0, tax - PRIMARY_REBATE);
    }
  }
  return 0;
}

/**
 * Given a monthly gross salary, returns monthly PAYE, UIF, and net take-home.
 */
export function calcMonthlyTax(monthlyGross) {
  const gross = Number(monthlyGross) || 0;
  const annualPAYE = calcAnnualPAYE(gross * 12);
  const paye = Math.round(annualPAYE / 12);
  const uif = Math.round(Math.min(gross * UIF_RATE, UIF_CAP_MONTHLY));
  const netPay = Math.round(gross - paye - uif);
  return { paye, uif, netPay };
}
