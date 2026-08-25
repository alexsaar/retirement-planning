import React from 'react';
import { usePlanner } from '../context/PlannerContext';
import { CURRENCIES } from '../utils/defaults';
import { formatPercent } from '../utils/formatters';
import {
  Calendar,
  TrendingUp,
  Landmark,
  Building2,
  Receipt,
  Plus,
  Trash2,
} from 'lucide-react';

export function InputsSection() {
  const {
    plan,
    updateField,
    addPrivatePension,
    removePrivatePension,
    updatePrivatePension,
    addRealEstate,
    removeRealEstate,
    updateRealEstate,
  } = usePlanner();

  const currency = plan.currency || 'EUR';
  const currObj = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      
      {/* 1. Timeline & Target Spending */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 w-full">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              1. Profile, Timeline & Target Spend
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              Set your current age, planned retirement age, and desired monthly budget
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Current Age */}
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Current Age
            </label>
            <div className="relative">
              <input
                type="number"
                min="18"
                max="90"
                value={plan.currentAge}
                onChange={(e) => updateField('currentAge', Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              />
              <span className="absolute right-3 top-2.5 text-[11px] sm:text-xs text-slate-400">years</span>
            </div>
          </div>

          {/* Expected Retirement Age */}
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Expected Retirement Age
            </label>
            <div className="relative">
              <input
                type="number"
                min={plan.currentAge}
                max="100"
                value={plan.retirementAge}
                onChange={(e) => updateField('retirementAge', Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              />
              <span className="absolute right-3 top-2.5 text-[11px] sm:text-xs text-slate-400">years</span>
            </div>
          </div>

          {/* Life Expectancy Horizon */}
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Target Life Expectancy
            </label>
            <div className="relative">
              <input
                type="number"
                min={plan.retirementAge + 1}
                max="115"
                value={plan.endAge}
                onChange={(e) => updateField('endAge', Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              />
              <span className="absolute right-3 top-2.5 text-[11px] sm:text-xs text-slate-400">years</span>
            </div>
          </div>

          {/* Assumed Spend at Retirement Age */}
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Target Monthly Spend in Retirement
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">
                {currObj.symbol}
              </span>
              <input
                type="number"
                min="0"
                step="50"
                value={plan.targetMonthlySpend}
                onChange={(e) => updateField('targetMonthlySpend', Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-7 pr-12 py-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              />
              <span className="absolute right-3 top-2.5 text-[11px] sm:text-xs text-slate-400">/ mo</span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Capital Market Investment Portfolio */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 w-full">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              2. Capital Market Investment Portfolio
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              Current investment value, monthly contributions, and expected returns
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          
          {/* Current Portfolio Value */}
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Current Portfolio Value
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">
                {currObj.symbol}
              </span>
              <input
                type="number"
                min="0"
                step="1000"
                value={plan.currentPortfolioValue}
                onChange={(e) => updateField('currentPortfolioValue', Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-7 pr-3.5 py-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Monthly Savings Contribution */}
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Monthly Contribution (Pre-Retirement)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">
                {currObj.symbol}
              </span>
              <input
                type="number"
                min="0"
                step="50"
                value={plan.monthlySavings}
                onChange={(e) => updateField('monthlySavings', Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-7 pr-12 py-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              />
              <span className="absolute right-3 top-2.5 text-[11px] sm:text-xs text-slate-400">/ mo</span>
            </div>
          </div>

          {/* Portfolio Growth Rate */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300">
                Expected Annual Return
              </label>
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                {formatPercent(plan.portfolioGrowthRate)}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <input
                type="range"
                min="1.0"
                max="14.0"
                step="0.1"
                value={plan.portfolioGrowthRate}
                onChange={(e) => updateField('portfolioGrowthRate', Number(e.target.value))}
                className="w-full accent-brand-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <input
                type="number"
                min="0"
                max="25"
                step="0.1"
                value={plan.portfolioGrowthRate}
                onChange={(e) => updateField('portfolioGrowthRate', Number(e.target.value))}
                className="w-16 shrink-0 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-1.5 text-xs font-bold text-slate-900 dark:text-white text-right focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

        </div>
      </div>

      {/* 3. Guaranteed Pensions (Public & Multiple Private) */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 w-full">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 shrink-0">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                3. Public & Private Pensions
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                Expected gross monthly pensions (subject to income tax)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={addPrivatePension}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-xl transition shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Private Pension</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Public Pension Input */}
        <div className="p-3 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Public Statutory Pension (Gross)
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Statutory pension insurance payment estimate
              </p>
            </div>

            <div className="relative w-full sm:w-56">
              <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">
                {currObj.symbol}
              </span>
              <input
                type="number"
                min="0"
                step="50"
                value={plan.publicPension}
                onChange={(e) => updateField('publicPension', Number(e.target.value))}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-7 pr-12 py-1.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
              <span className="absolute right-3 top-2 text-xs text-slate-400">/ mo</span>
            </div>
          </div>
        </div>

        {/* Dynamic Private Pensions List */}
        <div className="space-y-2.5">
          <label className="block text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400">
            Private Pensions & Annuity Contracts ({plan.privatePensions.length})
          </label>

          {plan.privatePensions.length === 0 ? (
            <div className="text-center py-5 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-500 dark:text-slate-400 px-3">
              No private pensions added. Click &quot;Add&quot; above to include company pensions, annuities, or private policies.
            </div>
          ) : (
            plan.privatePensions.map((pension, idx) => (
              <div
                key={pension.id}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl"
              >
                {/* Pension Name */}
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={pension.name}
                    placeholder="e.g. Company Pension, Allianz Annuity"
                    onChange={(e) => updatePrivatePension(pension.id, 'name', e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Amount & Delete */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:w-44">
                    <span className="absolute left-2.5 top-1.5 text-xs font-bold text-slate-400">
                      {currObj.symbol}
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="25"
                      value={pension.amount}
                      onChange={(e) => updatePrivatePension(pension.id, 'amount', Number(e.target.value))}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-6 pr-10 py-1.5 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="absolute right-2.5 top-1.5 text-[10px] text-slate-400">/ mo</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removePrivatePension(pension.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition shrink-0"
                    title="Remove Pension"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4. Real Estate Incomes & Maintenance Reserve */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 w-full">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                4. Real Estate Investments & Maintenance
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                Gross rental income streams and maintenance reserve allocation
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={addRealEstate}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-xl transition shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Property</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Maintenance Reserve Slider */}
        <div className="p-3 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Maintenance Reserve Percentage
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Saved for repairs & upkeep (deducted before tax)
              </p>
            </div>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              {formatPercent(plan.realEstateMaintenanceRate)}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={plan.realEstateMaintenanceRate}
              onChange={(e) => updateField('realEstateMaintenanceRate', Number(e.target.value))}
              className="w-full accent-amber-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <input
              type="number"
              min="0"
              max="100"
              value={plan.realEstateMaintenanceRate}
              onChange={(e) => updateField('realEstateMaintenanceRate', Number(e.target.value))}
              className="w-16 shrink-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 dark:text-white text-right focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Dynamic Real Estate Incomes List */}
        <div className="space-y-2.5">
          <label className="block text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400">
            Rental Properties ({plan.realEstateIncomes.length})
          </label>

          {plan.realEstateIncomes.length === 0 ? (
            <div className="text-center py-5 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-500 dark:text-slate-400 px-3">
              No real estate properties added. Click &quot;Add&quot; above to include rental units or commercial real estate.
            </div>
          ) : (
            plan.realEstateIncomes.map((property, idx) => (
              <div
                key={property.id}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl"
              >
                {/* Property Name */}
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={property.name}
                    placeholder="e.g. 2-Room Flat Central, Studio Apartment"
                    onChange={(e) => updateRealEstate(property.id, 'name', e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Amount & Delete */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:w-44">
                    <span className="absolute left-2.5 top-1.5 text-xs font-bold text-slate-400">
                      {currObj.symbol}
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={property.amount}
                      onChange={(e) => updateRealEstate(property.id, 'amount', Number(e.target.value))}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-6 pr-10 py-1.5 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="absolute right-2.5 top-1.5 text-[10px] text-slate-400">/ mo</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeRealEstate(property.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition shrink-0"
                    title="Remove Property"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 5. Tax Rates & Macroeconomic Parameters */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 w-full">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 shrink-0">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              5. Taxes & Inflation Assumptions
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              Tax rates applied to retirement income streams and portfolio withdrawals
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          
          {/* Income Tax Rate */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300">
                Income Tax Rate
              </label>
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                {formatPercent(plan.incomeTaxRate)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="50"
                step="0.5"
                value={plan.incomeTaxRate}
                onChange={(e) => updateField('incomeTaxRate', Number(e.target.value))}
                className="w-full accent-rose-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={plan.incomeTaxRate}
                onChange={(e) => updateField('incomeTaxRate', Number(e.target.value))}
                className="w-16 shrink-0 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 dark:text-white text-right focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <span className="block text-[10px] text-slate-400 mt-0.5">
              On Public, Private Pensions & Net Real Estate
            </span>
          </div>

          {/* Capital Gains Tax Rate */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300">
                Capital Gains Tax Rate
              </label>
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                {formatPercent(plan.capitalGainsTaxRate, 2)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="45"
                step="0.25"
                value={plan.capitalGainsTaxRate}
                onChange={(e) => updateField('capitalGainsTaxRate', Number(e.target.value))}
                className="w-full accent-rose-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={plan.capitalGainsTaxRate}
                onChange={(e) => updateField('capitalGainsTaxRate', Number(e.target.value))}
                className="w-16 shrink-0 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 dark:text-white text-right focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <span className="block text-[10px] text-slate-400 mt-0.5">
              Applied to portfolio retirement drawdowns
            </span>
          </div>

          {/* Inflation Rate */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300">
                Assumed Inflation Rate
              </label>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                {formatPercent(plan.inflationRate)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={plan.inflationRate}
                onChange={(e) => updateField('inflationRate', Number(e.target.value))}
                className="w-full accent-amber-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <input
                type="number"
                min="0"
                max="20"
                step="0.1"
                value={plan.inflationRate}
                onChange={(e) => updateField('inflationRate', Number(e.target.value))}
                className="w-16 shrink-0 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 dark:text-white text-right focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <span className="block text-[10px] text-slate-400 mt-0.5">
              Long-term annual purchasing power degradation
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}
