import React, { useRef, useState } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { CURRENCIES } from '../utils/defaults';
import { 
  TrendingUp, 
  RotateCcw, 
  Download, 
  Upload, 
  Moon, 
  Sun, 
  Sparkles, 
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  Sliders,
  DollarSign
} from 'lucide-react';

export function Header() {
  const {
    plan,
    updateField,
    resetPlan,
    exportPlan,
    importPlan,
    darkMode,
    setDarkMode,
    applyPreset,
  } = usePlanner();

  const fileInputRef = useRef(null);
  const mobileFileInputRef = useRef(null);
  const [importNotification, setImportNotification] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await importPlan(file);
    if (res.success) {
      setImportNotification({ type: 'success', message: 'Plan imported successfully!' });
      setMobileMenuOpen(false);
    } else {
      setImportNotification({ type: 'error', message: res.error || 'Failed to import plan.' });
    }
    setTimeout(() => setImportNotification(null), 4000);
    e.target.value = '';
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-18">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 shrink-0">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-brand-700 dark:from-white dark:via-slate-200 dark:to-brand-400 bg-clip-text text-transparent truncate">
                  RetireSmart
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-300 rounded-full shrink-0">
                  Client-Side
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden lg:block truncate">
                Privacy-first Cashflow & Portfolio Longevity Simulator
              </p>
            </div>
          </div>

          {/* Desktop Toolbar (visible on md screens and up) */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 shrink-0">
            
            {/* Scenario Presets */}
            <div className="hidden xl:flex items-center">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    applyPreset(e.target.value);
                    e.target.value = '';
                  }
                }}
                defaultValue=""
                className="text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-0 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 cursor-pointer transition focus:ring-2 focus:ring-brand-500"
              >
                <option value="" disabled>Load Preset...</option>
                <option value="frugal_early">⚡ Early FIRE (Age 55)</option>
                <option value="real_estate_focus">🏢 Real Estate Focus</option>
                <option value="conservative">🛡️ Conservative / Low Risk</option>
              </select>
            </div>

            {/* Currency Selector */}
            <div className="relative flex items-center">
              <select
                value={plan.currency || 'EUR'}
                onChange={(e) => updateField('currency', e.target.value)}
                className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 border-0 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition focus:ring-2 focus:ring-brand-500"
                title="Select Currency"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Inflation Toggle */}
            <button
              type="button"
              onClick={() => updateField('adjustForInflation', !plan.adjustForInflation)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                plan.adjustForInflation
                  ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 ring-1 ring-amber-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              title={
                plan.adjustForInflation
                  ? 'Adjusting for inflation: figures represent real purchasing power (in today\'s money)'
                  : 'Nominal mode: figures represent future nominal values'
              }
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">
                {plan.adjustForInflation ? 'Real Values (Inflation Adj.)' : 'Nominal Values'}
              </span>
              <span className="lg:hidden">
                {plan.adjustForInflation ? 'Real' : 'Nom'}
              </span>
            </button>

            {/* JSON Export */}
            <button
              onClick={exportPlan}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-1.5"
              title="Export Plan as JSON"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export</span>
            </button>

            {/* JSON Import */}
            <label className="px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Import</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Reset to Defaults */}
            <div className="relative">
              <button
                onClick={() => setShowResetConfirm(!showResetConfirm)}
                className="px-2.5 py-1.5 text-xs font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-lg transition flex items-center gap-1.5"
                title="Reset all inputs to defaults"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              {showResetConfirm && (
                <div className="absolute right-0 mt-2 w-64 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Reset all inputs and income streams to default values?
                  </p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="px-2.5 py-1 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        resetPlan();
                        setShowResetConfirm(false);
                      }}
                      className="px-2.5 py-1 text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white rounded shadow-sm"
                    >
                      Confirm Reset
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>

          {/* Mobile Right Controls (Only on screens < md) */}
          <div className="flex md:hidden items-center gap-1.5 shrink-0">
            {/* Quick Currency Selector on Mobile */}
            <select
              value={plan.currency || 'EUR'}
              onChange={(e) => updateField('currency', e.target.value)}
              className="text-xs font-bold bg-slate-100 dark:bg-slate-800 border-0 rounded-lg px-2 py-1.5 text-slate-800 dark:text-slate-200 cursor-pointer focus:ring-1 focus:ring-brand-500"
              title="Currency"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol}
                </option>
              ))}
            </select>

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
              aria-label="Open Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-in slide-in-from-top-2 duration-200">
            
            {/* Inflation Toggle */}
            <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                    Inflation Adjustment
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {plan.adjustForInflation ? 'Showing Real Purchasing Power' : 'Showing Nominal Values'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => updateField('adjustForInflation', !plan.adjustForInflation)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  plan.adjustForInflation
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {plan.adjustForInflation ? 'Active' : 'Off'}
              </button>
            </div>

            {/* Presets Grid */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Load Preset Scenario
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    applyPreset('frugal_early');
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 text-center text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-950 dark:hover:text-brand-300 rounded-xl border border-slate-200 dark:border-slate-700 transition"
                >
                  ⚡ Early FIRE
                </button>
                <button
                  onClick={() => {
                    applyPreset('real_estate_focus');
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 text-center text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-950 dark:hover:text-brand-300 rounded-xl border border-slate-200 dark:border-slate-700 transition"
                >
                  🏢 Real Estate
                </button>
                <button
                  onClick={() => {
                    applyPreset('conservative');
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 text-center text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-950 dark:hover:text-brand-300 rounded-xl border border-slate-200 dark:border-slate-700 transition"
                >
                  🛡️ Low Risk
                </button>
              </div>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  exportPlan();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 p-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>Export JSON</span>
              </button>

              <label className="flex items-center justify-center gap-2 p-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer">
                <Upload className="w-4 h-4 text-slate-500" />
                <span>Import JSON</span>
                <input
                  ref={mobileFileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Reset Button */}
            <div>
              <button
                onClick={() => {
                  if (window.confirm('Reset all values to defaults?')) {
                    resetPlan();
                    setMobileMenuOpen(false);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 p-2.5 text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/40 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset All Inputs to Defaults</span>
              </button>
            </div>

          </div>
        )}

        {/* Import Notification Toast */}
        {importNotification && (
          <div className="pb-2">
            <div
              className={`flex items-center gap-2 p-2.5 text-xs rounded-lg ${
                importNotification.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              }`}
            >
              {importNotification.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{importNotification.message}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
