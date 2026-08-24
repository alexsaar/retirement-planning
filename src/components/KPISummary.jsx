import React from 'react';
import { usePlanner } from '../context/PlannerContext';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { 
  Wallet, 
  ShieldCheck, 
  ArrowDownCircle, 
  ArrowUpCircle,
  Hourglass, 
  Percent, 
  AlertTriangle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export function KPISummary() {
  const { plan, results } = usePlanner();
  const { kpis, cashflowBreakdown } = results;
  const currency = plan.currency || 'EUR';

  // Determine longevity status styling
  const isDepleted = kpis.depletionAge !== null;
  const isSurplus = kpis.monthlySurplusNet > 0;

  return (
    <section className="space-y-4">
      {/* Top Banner Status Bar */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm transition ${
          kpis.status === 'excellent' || kpis.status === 'sustainable'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
            : kpis.status === 'warning'
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 shadow-sm shrink-0">
            {kpis.status === 'excellent' || kpis.status === 'sustainable' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">
                Retirement Outlook: {kpis.status === 'excellent' ? 'Fully Self-Sustaining' : kpis.status === 'sustainable' ? 'Fully Funded' : isDepleted ? `Depletes at Age ${kpis.depletionAge}` : 'Attention Needed'}
              </span>
              {plan.adjustForInflation && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300">
                  Real Terms (Inflation Adj.)
                </span>
              )}
            </div>
            <p className="text-xs opacity-90 mt-0.5">{kpis.statusMessage}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto text-xs font-semibold">
          <span className="opacity-80">Longevity Target: Age {plan.endAge}</span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-40"></span>
          <span className="opacity-80">Retirement Age: {plan.retirementAge}</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Projected Portfolio at Retirement */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-brand-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Portfolio at Age {plan.retirementAge}
            </span>
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(kpis.portfolioAtRetirement, currency)}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Contributions: {formatCurrency(kpis.totalContributedPreRetirement, currency, true)}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              +{formatCurrency(kpis.totalPreRetirementGains, currency, true)} gains
            </span>
          </div>
        </div>

        {/* Card 2: Guaranteed Monthly Net Income */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-brand-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Guaranteed Net / Month
            </span>
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(kpis.totalGuaranteedNetMonthly, currency)}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              / mo
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Target: {formatCurrency(kpis.targetMonthlySpend, currency)}
            </span>
            <span
              className={`font-semibold px-1.5 py-0.5 rounded text-[11px] ${
                cashflowBreakdown.guaranteedCoveragePercent >= 100
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {cashflowBreakdown.guaranteedCoveragePercent.toFixed(0)}% covered
            </span>
          </div>
        </div>

        {/* Card 3: Monthly Net Gap / Drawdown */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-brand-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {isSurplus ? 'Net Monthly Surplus' : 'Portfolio Drawdown Needed'}
            </span>
            <div
              className={`p-2 rounded-xl ${
                isSurplus
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                  : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
              }`}
            >
              {isSurplus ? <ArrowUpCircle className="w-4 h-4" /> : <ArrowDownCircle className="w-4 h-4" />}
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-2xl font-bold ${
                isSurplus
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {isSurplus
                ? `+${formatCurrency(kpis.monthlySurplusNet, currency)}`
                : `${formatCurrency(kpis.monthlyDrawdownGross, currency)}`}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              / mo gross
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            {isSurplus ? (
              <span>Reinvested to portfolio</span>
            ) : (
              <>
                <span>Net Gap: {formatCurrency(kpis.monthlyGapNet, currency)}</span>
                <span className="text-slate-400 dark:text-slate-500">
                  Tax: {formatCurrency(kpis.monthlyCapitalGainsTax, currency)}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Card 4: Safe Withdrawal Rate & Longevity */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-brand-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Withdrawal Rate (SWR)
            </span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-2xl font-bold ${
                kpis.withdrawalRatePercent <= 3.5
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : kpis.withdrawalRatePercent <= 4.5
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {formatPercent(kpis.withdrawalRatePercent)}
            </span>
            <span className="text-xs font-medium text-slate-400">
              / yr
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Rule of thumb: &le; 4.0%
            </span>
            <span
              className={`font-semibold px-1.5 py-0.5 rounded text-[11px] ${
                kpis.withdrawalRatePercent <= 4.0
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}
            >
              {kpis.withdrawalRatePercent <= 4.0 ? 'Conservative' : 'Elevated'}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
