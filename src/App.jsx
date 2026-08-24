import React from 'react';
import { Header } from './components/Header';
import { KPISummary } from './components/KPISummary';
import { ChartsSection } from './components/ChartsSection';
import { InputsSection } from './components/InputsSection';
import { LedgerTable } from './components/LedgerTable';
import { 
  Shield, 
  HelpCircle, 
  Sparkles, 
  Github, 
  CheckCircle2,
  PieChart,
  Calculator
} from 'lucide-react';

export function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-brand-500 selection:text-white transition-colors duration-200">
      
      {/* Sticky Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* KPI Metrics */}
        <KPISummary />

        {/* Visual Charts */}
        <ChartsSection />

        {/* Inputs & Parameters */}
        <InputsSection />

        {/* Detailed Ledger Table */}
        <LedgerTable />

        {/* Methodology & Calculation Guide */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                How the Retirement Engine Calculates Your Outlook
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transparent breakdown of mathematical formulas and tax rules
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-400">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                1. Guaranteed Incomes & Taxes
              </h4>
              <p>
                <strong>Public & Private Pensions:</strong> Subject to your configured Income Tax Rate.
              </p>
              <p>
                <strong>Real Estate:</strong> Gross rent is first reduced by your Maintenance Reserve (tax-deductible upkeep), and the remainder is taxed at the Income Tax Rate.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                2. Accumulation & Compounding
              </h4>
              <p>
                Your capital market portfolio compounds monthly at your configured annual rate.
              </p>
              <p>
                Monthly contributions until retirement are added directly to the principal balance before computing monthly growth.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                3. Drawdown & Longevity
              </h4>
              <p>
                If guaranteed net income falls below your target spend, the remaining deficit is drawn from the portfolio.
              </p>
              <p>
                Drawdowns are grossed up to account for Capital Gains Tax. If incomes exceed spend, the surplus is reinvested.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>100% Client-Side Privacy: All data stays strictly in your browser storage.</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Static SPA &bull; No Server Backend Required</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
export default App;
