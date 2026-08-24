export const CURRENCIES = [
  { code: 'EUR', symbol: '€', label: 'EUR (€)', position: 'before' },
  { code: 'USD', symbol: '$', label: 'USD ($)', position: 'before' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)', position: 'before' },
  { code: 'CHF', symbol: 'CHF', label: 'CHF (CHF)', position: 'after' },
];

export const DEFAULT_PLAN = {
  version: 1,
  // Timeline & Spend
  currentAge: 35,
  retirementAge: 67,
  endAge: 95,
  targetMonthlySpend: 3500, // Monthly spend at retirement

  // Capital Market Investment Portfolio
  currentPortfolioValue: 75000,
  monthlySavings: 500, // Monthly contribution until retirement
  portfolioGrowthRate: 6.5, // % per year

  // Guaranteed Incomes (Monthly gross)
  publicPension: 1800,
  privatePensions: [
    { id: 'pp-1', name: 'Company Pension (bAV)', amount: 450 },
    { id: 'pp-2', name: 'Private Annuity (Rürup / Riester)', amount: 250 },
  ],

  // Real Estate Incomes (Monthly gross)
  realEstateIncomes: [
    { id: 're-1', name: 'Rental Apartment (Gross)', amount: 950 },
  ],
  realEstateMaintenanceRate: 15.0, // % of real estate income reserved for maintenance

  // Taxes & Macro
  incomeTaxRate: 25.0, // % on public pension, private pensions, net real estate
  capitalGainsTaxRate: 26.375, // % on investment gains/withdrawals
  
  // Advanced / Macro
  inflationRate: 2.0, // % annual inflation
  adjustForInflation: false, // view in real terms (today's purchasing power) vs nominal
  currency: 'EUR',
};
