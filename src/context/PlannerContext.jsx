import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { DEFAULT_PLAN } from '../utils/defaults';
import { loadPlanFromStorage, savePlanToStorage, clearPlanStorage, exportPlanToJsonFile, importPlanFromJsonFile } from '../utils/storage';
import { calculateRetirementPlan } from '../utils/calculator';

const PlannerContext = createContext(null);

export function PlannerProvider({ children }) {
  const [plan, setPlan] = useState(() => loadPlanFromStorage());
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('retiresmart_theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Sync theme with DOM and localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('retiresmart_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('retiresmart_theme', 'light');
    }
  }, [darkMode]);

  // Sync plan to localStorage whenever it changes
  useEffect(() => {
    savePlanToStorage(plan);
  }, [plan]);

  // Recalculate simulation whenever plan changes
  const results = useMemo(() => {
    return calculateRetirementPlan(plan);
  }, [plan]);

  // Field updater
  const updateField = (field, value) => {
    setPlan((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Multiple Private Pensions Management
  const addPrivatePension = () => {
    const newId = `pp-${Date.now()}`;
    setPlan((prev) => ({
      ...prev,
      privatePensions: [
        ...prev.privatePensions,
        { id: newId, name: `Private Pension ${prev.privatePensions.length + 1}`, amount: 300 },
      ],
    }));
  };

  const removePrivatePension = (id) => {
    setPlan((prev) => ({
      ...prev,
      privatePensions: prev.privatePensions.filter((p) => p.id !== id),
    }));
  };

  const updatePrivatePension = (id, field, value) => {
    setPlan((prev) => ({
      ...prev,
      privatePensions: prev.privatePensions.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    }));
  };

  // Multiple Real Estate Incomes Management
  const addRealEstate = () => {
    const newId = `re-${Date.now()}`;
    setPlan((prev) => ({
      ...prev,
      realEstateIncomes: [
        ...prev.realEstateIncomes,
        { id: newId, name: `Rental Property ${prev.realEstateIncomes.length + 1}`, amount: 600 },
      ],
    }));
  };

  const removeRealEstate = (id) => {
    setPlan((prev) => ({
      ...prev,
      realEstateIncomes: prev.realEstateIncomes.filter((r) => r.id !== id),
    }));
  };

  const updateRealEstate = (id, field, value) => {
    setPlan((prev) => ({
      ...prev,
      realEstateIncomes: prev.realEstateIncomes.map((r) =>
        r.id === id ? { ...r, [field]: value } : r
      ),
    }));
  };

  // Reset to Defaults
  const resetPlan = () => {
    const defaultState = clearPlanStorage();
    setPlan(defaultState);
  };

  // Export Plan to JSON
  const exportPlan = () => {
    exportPlanToJsonFile(plan);
  };

  // Import Plan from JSON
  const importPlan = async (file) => {
    try {
      const imported = await importPlanFromJsonFile(file);
      setPlan(imported);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Apply Preset Scenarios
  const applyPreset = (presetKey) => {
    if (presetKey === 'frugal_early') {
      setPlan((prev) => ({
        ...prev,
        currentAge: 32,
        retirementAge: 55,
        targetMonthlySpend: 2600,
        currentPortfolioValue: 120000,
        monthlySavings: 1200,
        portfolioGrowthRate: 7.0,
      }));
    } else if (presetKey === 'real_estate_focus') {
      setPlan((prev) => ({
        ...prev,
        currentAge: 40,
        retirementAge: 65,
        targetMonthlySpend: 4000,
        currentPortfolioValue: 50000,
        monthlySavings: 400,
        realEstateIncomes: [
          { id: 're-1', name: 'Apartment 1 (Munich)', amount: 1400 },
          { id: 're-2', name: 'Apartment 2 (Leipzig)', amount: 850 },
        ],
        realEstateMaintenanceRate: 15.0,
      }));
    } else if (presetKey === 'conservative') {
      setPlan((prev) => ({
        ...prev,
        currentAge: 45,
        retirementAge: 67,
        targetMonthlySpend: 3200,
        currentPortfolioValue: 90000,
        monthlySavings: 600,
        portfolioGrowthRate: 4.5,
        inflationRate: 2.5,
      }));
    }
  };

  return (
    <PlannerContext.Provider
      value={{
        plan,
        results,
        darkMode,
        setDarkMode,
        updateField,
        addPrivatePension,
        removePrivatePension,
        updatePrivatePension,
        addRealEstate,
        removeRealEstate,
        updateRealEstate,
        resetPlan,
        exportPlan,
        importPlan,
        applyPreset,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
}

export function usePlanner() {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
}
