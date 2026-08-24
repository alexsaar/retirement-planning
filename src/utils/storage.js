import { DEFAULT_PLAN } from './defaults';

const STORAGE_KEY = 'retiresmart_plan_data_v1';

/**
 * Loads the retirement plan from localStorage, falling back to DEFAULT_PLAN.
 */
export function loadPlanFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PLAN };

    const parsed = JSON.parse(raw);
    return sanitizePlan(parsed);
  } catch (err) {
    console.warn('Failed to load plan from localStorage:', err);
    return { ...DEFAULT_PLAN };
  }
}

/**
 * Saves the retirement plan to localStorage.
 */
export function savePlanToStorage(plan) {
  try {
    const sanitized = sanitizePlan(plan);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
  } catch (err) {
    console.error('Failed to save plan to localStorage:', err);
  }
}

/**
 * Clears saved plan and resets to DEFAULT_PLAN.
 */
export function clearPlanStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear plan storage:', err);
  }
  return { ...DEFAULT_PLAN };
}

/**
 * Ensures all required fields exist and have valid types/defaults.
 */
export function sanitizePlan(input) {
  if (!input || typeof input !== 'object') {
    return { ...DEFAULT_PLAN };
  }

  return {
    version: 1,
    currentAge: Number.isFinite(Number(input.currentAge)) ? Number(input.currentAge) : DEFAULT_PLAN.currentAge,
    retirementAge: Number.isFinite(Number(input.retirementAge)) ? Number(input.retirementAge) : DEFAULT_PLAN.retirementAge,
    endAge: Number.isFinite(Number(input.endAge)) ? Number(input.endAge) : DEFAULT_PLAN.endAge,
    targetMonthlySpend: Number.isFinite(Number(input.targetMonthlySpend)) ? Number(input.targetMonthlySpend) : DEFAULT_PLAN.targetMonthlySpend,

    currentPortfolioValue: Number.isFinite(Number(input.currentPortfolioValue)) ? Number(input.currentPortfolioValue) : DEFAULT_PLAN.currentPortfolioValue,
    monthlySavings: Number.isFinite(Number(input.monthlySavings)) ? Number(input.monthlySavings) : DEFAULT_PLAN.monthlySavings,
    portfolioGrowthRate: Number.isFinite(Number(input.portfolioGrowthRate)) ? Number(input.portfolioGrowthRate) : DEFAULT_PLAN.portfolioGrowthRate,

    publicPension: Number.isFinite(Number(input.publicPension)) ? Number(input.publicPension) : DEFAULT_PLAN.publicPension,
    
    privatePensions: Array.isArray(input.privatePensions)
      ? input.privatePensions.map((p, idx) => ({
          id: p.id || `pp-${Date.now()}-${idx}`,
          name: typeof p.name === 'string' ? p.name : `Private Pension ${idx + 1}`,
          amount: Number.isFinite(Number(p.amount)) ? Math.max(0, Number(p.amount)) : 0,
        }))
      : DEFAULT_PLAN.privatePensions,

    realEstateIncomes: Array.isArray(input.realEstateIncomes)
      ? input.realEstateIncomes.map((r, idx) => ({
          id: r.id || `re-${Date.now()}-${idx}`,
          name: typeof r.name === 'string' ? r.name : `Real Estate ${idx + 1}`,
          amount: Number.isFinite(Number(r.amount)) ? Math.max(0, Number(r.amount)) : 0,
        }))
      : DEFAULT_PLAN.realEstateIncomes,
    
    realEstateMaintenanceRate: Number.isFinite(Number(input.realEstateMaintenanceRate))
      ? Number(input.realEstateMaintenanceRate)
      : DEFAULT_PLAN.realEstateMaintenanceRate,

    incomeTaxRate: Number.isFinite(Number(input.incomeTaxRate)) ? Number(input.incomeTaxRate) : DEFAULT_PLAN.incomeTaxRate,
    capitalGainsTaxRate: Number.isFinite(Number(input.capitalGainsTaxRate)) ? Number(input.capitalGainsTaxRate) : DEFAULT_PLAN.capitalGainsTaxRate,
    
    inflationRate: Number.isFinite(Number(input.inflationRate)) ? Number(input.inflationRate) : DEFAULT_PLAN.inflationRate,
    adjustForInflation: Boolean(input.adjustForInflation),
    currency: typeof input.currency === 'string' ? input.currency : DEFAULT_PLAN.currency,
  };
}

/**
 * Exports plan as a downloadable JSON file.
 */
export function exportPlanToJsonFile(plan) {
  const sanitized = sanitizePlan(plan);
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(sanitized, null, 2));
  const downloadAnchor = document.createElement('a');
  const timestamp = new Date().toISOString().slice(0, 10);
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `retiresmart-plan-${timestamp}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Imports plan from a user-selected JSON file.
 */
export function importPlanFromJsonFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file selected'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const validated = sanitizePlan(parsed);
        resolve(validated);
      } catch (err) {
        reject(new Error('Invalid JSON file format.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsText(file);
  });
}
