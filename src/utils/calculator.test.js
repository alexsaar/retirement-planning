import { describe, it, expect } from 'vitest';
import { calculateRetirementPlan } from './calculator';
import { DEFAULT_PLAN } from './defaults';

describe('Retirement Calculator Engine', () => {
  it('correctly calculates guaranteed gross and net incomes', () => {
    const customPlan = {
      ...DEFAULT_PLAN,
      publicPension: 2000,
      privatePensions: [{ id: '1', name: 'Company', amount: 500 }],
      realEstateIncomes: [{ id: '1', name: 'Apartment', amount: 1000 }],
      realEstateMaintenanceRate: 20, // 200 maint -> 800 taxable
      incomeTaxRate: 25, // 25% tax
      capitalGainsTaxRate: 25,
      targetMonthlySpend: 3000,
    };

    const res = calculateRetirementPlan(customPlan);

    // Public pension: 2000 gross -> 1500 net (500 tax)
    expect(res.streams.publicPension.net).toBe(1500);

    // Private pension: 500 gross -> 375 net (125 tax)
    expect(res.streams.privatePensions[0].net).toBe(375);

    // Real estate: 1000 gross -> 200 maint -> 800 taxable -> 600 net (200 tax)
    expect(res.streams.realEstate[0].maintenance).toBe(200);
    expect(res.streams.realEstate[0].tax).toBe(200);
    expect(res.streams.realEstate[0].net).toBe(600);

    // Total guaranteed net: 1500 + 375 + 600 = 2475
    expect(res.cashflowBreakdown.totalGuaranteedNet).toBe(2475);

    // Monthly net gap: 3000 - 2475 = 525
    expect(res.cashflowBreakdown.monthlyGapNet).toBe(525);

    // Gross drawdown needed with 25% cap gains tax: 525 / (1 - 0.25) = 700
    expect(res.cashflowBreakdown.monthlyDrawdownGross).toBe(700);
    expect(res.cashflowBreakdown.monthlyCapitalGainsTax).toBe(175);
  });

  it('correctly compounds accumulation phase', () => {
    const plan = {
      ...DEFAULT_PLAN,
      currentAge: 30,
      retirementAge: 40, // 10 years = 120 months
      currentPortfolioValue: 10000,
      monthlySavings: 1000,
      portfolioGrowthRate: 6.0,
      adjustForInflation: false,
    };

    const res = calculateRetirementPlan(plan);
    expect(res.kpis.portfolioAtRetirement).toBeGreaterThan(10000 + 1000 * 120);
    expect(res.annualTimeline.length).toBe(plan.endAge - plan.currentAge + 1);
  });

  it('detects when guaranteed income exceeds spend creating a surplus', () => {
    const surplusPlan = {
      ...DEFAULT_PLAN,
      publicPension: 4000,
      incomeTaxRate: 20, // net 3200
      targetMonthlySpend: 2500,
    };

    const res = calculateRetirementPlan(surplusPlan);
    expect(res.kpis.monthlyGapNet).toBe(0);
    expect(res.kpis.monthlySurplusNet).toBeGreaterThan(0);
    expect(res.kpis.withdrawalRatePercent).toBe(0);
    expect(res.kpis.status).toBe('excellent');
  });

  it('handles inflation adjustment toggle correctly', () => {
    const nominalPlan = {
      ...DEFAULT_PLAN,
      currentAge: 30,
      retirementAge: 60,
      portfolioGrowthRate: 7.0,
      inflationRate: 2.0,
      adjustForInflation: false,
    };

    const realPlan = {
      ...nominalPlan,
      adjustForInflation: true,
    };

    const resNominal = calculateRetirementPlan(nominalPlan);
    const resReal = calculateRetirementPlan(realPlan);

    // Real portfolio accumulation value should be less than nominal because growth is deflated
    expect(resReal.kpis.portfolioAtRetirement).toBeLessThan(resNominal.kpis.portfolioAtRetirement);
  });

  it('accurately predicts depletion age when spend exceeds resources', () => {
    const depletePlan = {
      ...DEFAULT_PLAN,
      currentAge: 65,
      retirementAge: 65,
      endAge: 95,
      currentPortfolioValue: 20000,
      monthlySavings: 0,
      portfolioGrowthRate: 2.0,
      publicPension: 0,
      privatePensions: [],
      realEstateIncomes: [],
      targetMonthlySpend: 2000,
    };

    const res = calculateRetirementPlan(depletePlan);
    expect(res.kpis.isFullyFunded).toBe(false);
    expect(res.kpis.depletionAge).toBeDefined();
    expect(res.kpis.depletionAge).toBeLessThan(70);
  });
});
