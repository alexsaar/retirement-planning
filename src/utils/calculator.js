/**
 * Financial calculation engine for Retirement Planning simulation.
 */

/**
 * Calculates monthly net cash flows, portfolio accumulation, decumulation, and longevity runway.
 * @param {Object} plan - The plan configuration object
 * @returns {Object} Full simulation results including KPIs, time series data, and chart series
 */
export function calculateRetirementPlan(plan) {
  const currentAge = Math.max(18, Number(plan.currentAge) || 35);
  const retirementAge = Math.max(currentAge, Number(plan.retirementAge) || 67);
  const endAge = Math.max(retirementAge + 1, Number(plan.endAge) || 95);
  const targetMonthlySpend = Math.max(0, Number(plan.targetMonthlySpend) || 0);

  const currentPortfolioValue = Math.max(0, Number(plan.currentPortfolioValue) || 0);
  const monthlySavings = Math.max(0, Number(plan.monthlySavings) || 0);
  const nominalGrowthRate = Number(plan.portfolioGrowthRate) / 100 || 0;
  
  const incomeTaxRate = Math.min(100, Math.max(0, Number(plan.incomeTaxRate) || 0)) / 100;
  const capitalGainsTaxRate = Math.min(100, Math.max(0, Number(plan.capitalGainsTaxRate) || 0)) / 100;
  const maintenanceRate = Math.min(100, Math.max(0, Number(plan.realEstateMaintenanceRate) || 0)) / 100;
  
  const inflationRate = Number(plan.inflationRate) / 100 || 0;
  const adjustForInflation = Boolean(plan.adjustForInflation);

  // Effective annual growth rate (real vs nominal)
  // If adjustForInflation is active: r_real = (1 + r) / (1 + i) - 1
  const annualGrowthRate = adjustForInflation
    ? (1 + nominalGrowthRate) / (1 + inflationRate) - 1
    : nominalGrowthRate;

  const monthlyGrowthRate = Math.pow(1 + annualGrowthRate, 1 / 12) - 1;

  // 1. Guaranteed Income Stream Breakdown (Monthly at Retirement)
  const grossPublicPension = Math.max(0, Number(plan.publicPension) || 0);
  const netPublicPension = grossPublicPension * (1 - incomeTaxRate);
  const publicPensionTax = grossPublicPension * incomeTaxRate;

  const privatePensions = Array.isArray(plan.privatePensions) ? plan.privatePensions : [];
  const grossPrivatePensionTotal = privatePensions.reduce((sum, item) => sum + Math.max(0, Number(item.amount) || 0), 0);
  const netPrivatePensionTotal = grossPrivatePensionTotal * (1 - incomeTaxRate);
  const privatePensionTaxTotal = grossPrivatePensionTotal * incomeTaxRate;

  const realEstateIncomes = Array.isArray(plan.realEstateIncomes) ? plan.realEstateIncomes : [];
  const grossRealEstateTotal = realEstateIncomes.reduce((sum, item) => sum + Math.max(0, Number(item.amount) || 0), 0);
  const realEstateMaintenanceTotal = grossRealEstateTotal * maintenanceRate;
  const realEstateTaxableTotal = grossRealEstateTotal - realEstateMaintenanceTotal;
  const realEstateTaxTotal = realEstateTaxableTotal * incomeTaxRate;
  const netRealEstateTotal = realEstateTaxableTotal - realEstateTaxTotal;

  // Total Guaranteed Net Monthly Income
  const totalGuaranteedGrossMonthly = grossPublicPension + grossPrivatePensionTotal + grossRealEstateTotal;
  const totalGuaranteedNetMonthly = netPublicPension + netPrivatePensionTotal + netRealEstateTotal;
  const totalIncomeTaxesMonthly = publicPensionTax + privatePensionTaxTotal + realEstateTaxTotal;

  // 2. Net Monthly Cash Flow Gap & Required Portfolio Drawdown
  const monthlyGapNet = Math.max(0, targetMonthlySpend - totalGuaranteedNetMonthly);
  const monthlySurplusNet = Math.max(0, totalGuaranteedNetMonthly - targetMonthlySpend);
  
  // Gross monthly drawdown needed from portfolio to cover net gap after capital gains tax
  // Net = Gross * (1 - CapGainsTax)  =>  Gross = Net / (1 - CapGainsTax)
  const capGainsFactor = Math.max(0.01, 1 - capitalGainsTaxRate);
  const monthlyDrawdownGross = monthlyGapNet > 0 ? (monthlyGapNet / capGainsFactor) : 0;
  const monthlyCapitalGainsTax = monthlyDrawdownGross - monthlyGapNet;

  // 3. Pre-Retirement Accumulation Simulation
  const accumulationYears = retirementAge - currentAge;
  const accumulationMonths = accumulationYears * 12;

  let simPortfolio = currentPortfolioValue;
  const monthlyAccumulationHistory = [];

  for (let m = 0; m <= accumulationMonths; m++) {
    monthlyAccumulationHistory.push({
      month: m,
      age: currentAge + m / 12,
      portfolio: simPortfolio,
    });
    if (m < accumulationMonths) {
      simPortfolio = simPortfolio * (1 + monthlyGrowthRate) + monthlySavings;
    }
  }

  const portfolioAtRetirement = simPortfolio;
  const totalContributedPreRetirement = monthlySavings * accumulationMonths;
  const initialPrincipal = currentPortfolioValue;
  const totalPreRetirementGains = Math.max(0, portfolioAtRetirement - (initialPrincipal + totalContributedPreRetirement));

  // 4. Safe Withdrawal Rate (SWR) check at Retirement
  // Annual gross withdrawal as % of portfolio at retirement
  const annualGrossDrawdown = monthlyDrawdownGross * 12;
  const withdrawalRatePercent = portfolioAtRetirement > 0 
    ? (annualGrossDrawdown / portfolioAtRetirement) * 100 
    : (annualGrossDrawdown > 0 ? 100 : 0);

  // 5. Full Lifetime Year-by-Year Simulation (from currentAge to endAge)
  const annualTimeline = [];
  let trackingPortfolio = currentPortfolioValue;
  let depletionAge = null;
  let depletionYear = null;
  const currentCalendarYear = new Date().getFullYear();

  for (let age = currentAge; age <= endAge; age++) {
    const isRetirementPhase = age >= retirementAge;
    const yearIndex = age - currentAge;
    const calendarYear = currentCalendarYear + yearIndex;
    const startBalance = trackingPortfolio;

    let annualContribution = 0;
    let annualNetDrawdown = 0;
    let annualGrossDrawdownActual = 0;
    let annualSurplusReinvested = 0;
    let annualReturns = 0;
    let annualTaxes = 0;
    let annualGuaranteedNet = 0;
    let annualTargetSpend = 0;

    if (!isRetirementPhase) {
      // Accumulation year (simulate 12 months)
      let tempBalance = startBalance;
      let yearGains = 0;
      for (let m = 0; m < 12; m++) {
        const monthGain = tempBalance * monthlyGrowthRate;
        yearGains += monthGain;
        tempBalance = tempBalance + monthGain + monthlySavings;
      }
      annualContribution = monthlySavings * 12;
      annualReturns = yearGains;
      trackingPortfolio = tempBalance;
      annualTaxes = 0; // Pre-retirement assumed tax deferred or handled in net contributions
    } else {
      // Decumulation / Retirement year (simulate 12 months)
      annualTargetSpend = targetMonthlySpend * 12;
      annualGuaranteedNet = totalGuaranteedNetMonthly * 12;
      annualTaxes = totalIncomeTaxesMonthly * 12;

      let tempBalance = startBalance;
      let yearGains = 0;
      let yearGrossDrawdown = 0;
      let yearNetDrawdown = 0;
      let yearCapTaxes = 0;
      let yearSurplus = 0;

      for (let m = 0; m < 12; m++) {
        const monthGain = tempBalance * monthlyGrowthRate;
        yearGains += monthGain;
        tempBalance += monthGain;

        if (monthlyGapNet > 0) {
          // Need to withdraw
          const neededGross = monthlyDrawdownGross;
          if (tempBalance >= neededGross) {
            tempBalance -= neededGross;
            yearGrossDrawdown += neededGross;
            yearNetDrawdown += monthlyGapNet;
            yearCapTaxes += (neededGross - monthlyGapNet);
          } else if (tempBalance > 0) {
            // Partial withdrawal before depletion
            const availableGross = tempBalance;
            const availableNet = availableGross * capGainsFactor;
            tempBalance = 0;
            yearGrossDrawdown += availableGross;
            yearNetDrawdown += availableNet;
            yearCapTaxes += (availableGross - availableNet);
            if (depletionAge === null) {
              depletionAge = age + (m + 1) / 12;
              depletionYear = calendarYear;
            }
          } else {
            // Already 0
            if (depletionAge === null) {
              depletionAge = age + m / 12;
              depletionYear = calendarYear;
            }
          }
        } else if (monthlySurplusNet > 0) {
          // Surplus is reinvested into portfolio
          tempBalance += monthlySurplusNet;
          yearSurplus += monthlySurplusNet;
        }
      }

      annualReturns = yearGains;
      annualGrossDrawdownActual = yearGrossDrawdown;
      annualNetDrawdown = yearNetDrawdown;
      annualSurplusReinvested = yearSurplus;
      annualTaxes += yearCapTaxes;
      trackingPortfolio = Math.max(0, tempBalance);

      if (trackingPortfolio <= 0 && depletionAge === null) {
        depletionAge = age;
        depletionYear = calendarYear;
      }
    }

    annualTimeline.push({
      age,
      calendarYear,
      isRetirementPhase,
      startBalance,
      endBalance: trackingPortfolio,
      annualContribution,
      annualReturns,
      annualGrossDrawdown: annualGrossDrawdownActual,
      annualNetDrawdown,
      annualSurplusReinvested,
      annualGuaranteedNet,
      annualTargetSpend,
      annualTaxes,
    });
  }

  // 6. Retirement Readiness Score / Assessment
  let status = 'sustainable';
  let statusMessage = 'Your retirement cashflow is fully funded through age ' + endAge + '+ with a remaining portfolio surplus.';
  
  if (depletionAge !== null) {
    if (depletionAge < retirementAge + 5) {
      status = 'critical';
      statusMessage = `Warning: Portfolio is projected to deplete rapidly at age ${depletionAge.toFixed(1)} (${depletionYear}). Significant gap to bridge.`;
    } else if (depletionAge < endAge) {
      status = 'warning';
      statusMessage = `Portfolio is projected to deplete at age ${depletionAge.toFixed(1)} (${depletionYear}). Adjust spend or increase contributions to ensure longevity.`;
    }
  } else if (monthlyGapNet === 0) {
    status = 'excellent';
    statusMessage = 'Outstanding! Your guaranteed pensions and real estate incomes fully cover your retirement spending without needing any portfolio withdrawals.';
  }

  // 7. Monthly Cashflow Structure at Retirement for Visual Charts
  const cashflowBreakdown = {
    targetSpend: targetMonthlySpend,
    totalGuaranteedGross: totalGuaranteedGrossMonthly,
    totalGuaranteedNet: totalGuaranteedNetMonthly,
    netPublicPension,
    netPrivatePensionTotal,
    netRealEstateTotal,
    realEstateMaintenanceTotal,
    totalIncomeTaxes: totalIncomeTaxesMonthly,
    monthlyGapNet,
    monthlyDrawdownGross,
    monthlyCapitalGainsTax,
    monthlySurplusNet,
    coveragePercent: targetMonthlySpend > 0 ? ((totalGuaranteedNetMonthly + (monthlyDrawdownGross > 0 ? monthlyGapNet : 0)) / targetMonthlySpend) * 100 : 100,
    guaranteedCoveragePercent: targetMonthlySpend > 0 ? (totalGuaranteedNetMonthly / targetMonthlySpend) * 100 : 100,
  };

  return {
    inputs: { ...plan, currentAge, retirementAge, endAge },
    kpis: {
      portfolioAtRetirement,
      totalContributedPreRetirement,
      totalPreRetirementGains,
      totalGuaranteedNetMonthly,
      totalGuaranteedGrossMonthly,
      targetMonthlySpend,
      monthlyGapNet,
      monthlyDrawdownGross,
      monthlyCapitalGainsTax,
      monthlySurplusNet,
      withdrawalRatePercent,
      depletionAge: depletionAge !== null ? Number(depletionAge.toFixed(1)) : null,
      depletionYear,
      isFullyFunded: depletionAge === null,
      status,
      statusMessage,
      endingPortfolio: trackingPortfolio,
    },
    cashflowBreakdown,
    streams: {
      publicPension: { gross: grossPublicPension, net: netPublicPension, tax: publicPensionTax },
      privatePensions: privatePensions.map(p => ({
        ...p,
        amount: Number(p.amount) || 0,
        net: (Number(p.amount) || 0) * (1 - incomeTaxRate),
        tax: (Number(p.amount) || 0) * incomeTaxRate,
      })),
      realEstate: realEstateIncomes.map(r => {
        const gross = Number(r.amount) || 0;
        const maint = gross * maintenanceRate;
        const taxable = gross - maint;
        const tax = taxable * incomeTaxRate;
        const net = taxable - tax;
        return { ...r, amount: gross, maintenance: maint, tax, net };
      }),
    },
    annualTimeline,
    monthlyAccumulationHistory,
  };
}
