import React, { useState } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { formatCurrency } from '../utils/formatters';
import { Table, Download, ChevronDown, ChevronUp } from 'lucide-react';

export function LedgerTable() {
  const { plan, results } = usePlanner();
  const { annualTimeline } = results;
  const currency = plan.currency || 'EUR';
  const [filter, setFilter] = useState('all'); // 'all' | 'accumulation' | 'retirement'
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredTimeline = annualTimeline.filter((row) => {
    if (filter === 'accumulation') return !row.isRetirementPhase;
    if (filter === 'retirement') return row.isRetirementPhase;
    return true;
  });

  const exportToCSV = () => {
    const headers = [
      'Age',
      'Calendar Year',
      'Phase',
      'Start Portfolio',
      'Annual Savings / Net Income',
      'Investment Returns',
      'Annual Target Spend',
      'Annual Net Drawdown',
      'Annual Taxes',
      'End Portfolio',
    ];

    const rows = annualTimeline.map((r) => [
      r.age,
      r.calendarYear,
      r.isRetirementPhase ? 'Retirement' : 'Accumulation',
      r.startBalance.toFixed(2),
      (r.isRetirementPhase ? r.annualGuaranteedNet : r.annualContribution).toFixed(2),
      r.annualReturns.toFixed(2),
      r.annualTargetSpend.toFixed(2),
      r.annualNetDrawdown.toFixed(2),
      r.annualTaxes.toFixed(2),
      r.endBalance.toFixed(2),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `retiresmart-ledger-${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition w-full">
      
      {/* Header */}
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
            <Table className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              Year-by-Year Simulation Ledger
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              Detailed annual accounting of balances, returns, incomes, taxes, and withdrawals
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-between sm:justify-end">
          {/* Phase Filter */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-[11px] sm:text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 sm:px-2.5 py-1 rounded-lg transition ${
                filter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('accumulation')}
              className={`px-2 sm:px-2.5 py-1 rounded-lg transition ${
                filter === 'accumulation'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Accum.
            </button>
            <button
              onClick={() => setFilter('retirement')}
              className={`px-2 sm:px-2.5 py-1 rounded-lg transition ${
                filter === 'retirement'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Retire.
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Export CSV */}
            <button
              onClick={exportToCSV}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition"
              title="Download full ledger as CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>CSV</span>
            </button>

            {/* Expand/Collapse Toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl transition"
              title={isExpanded ? 'Collapse table view' : 'Expand full table'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Table Container with smooth horizontal scroll */}
      <div
        className={`overflow-x-auto w-full transition-all duration-200 ${
          isExpanded ? 'max-h-[600px]' : 'max-h-72'
        }`}
      >
        <table className="w-full text-left text-xs min-w-[640px]">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 sticky top-0 font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-2.5 px-3 sm:px-4">Age (Year)</th>
              <th className="py-2.5 px-2 sm:px-3">Phase</th>
              <th className="py-2.5 px-2 sm:px-3 text-right">Start Portfolio</th>
              <th className="py-2.5 px-2 sm:px-3 text-right">Incomes / Savings</th>
              <th className="py-2.5 px-2 sm:px-3 text-right">Returns</th>
              <th className="py-2.5 px-2 sm:px-3 text-right">Spend / Drawdown</th>
              <th className="py-2.5 px-2 sm:px-3 text-right">Taxes</th>
              <th className="py-2.5 px-3 sm:px-4 text-right">End Portfolio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
            {filteredTimeline.map((row) => {
              const isRetirement = row.isRetirementPhase;
              const isDepleted = isRetirement && row.endBalance <= 0;
              const isRetirementMilestone = row.age === plan.retirementAge;

              return (
                <tr
                  key={row.age}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition ${
                    isRetirementMilestone
                      ? 'bg-blue-50/50 dark:bg-blue-950/20 font-medium'
                      : isDepleted
                      ? 'bg-rose-50/30 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400'
                      : ''
                  }`}
                >
                  {/* Age & Year */}
                  <td className="py-2 px-3 sm:px-4 font-sans font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    Age {row.age}{' '}
                    <span className="text-[10px] sm:text-[11px] text-slate-400 font-normal">
                      ({row.calendarYear})
                    </span>
                  </td>

                  {/* Phase */}
                  <td className="py-2 px-2 sm:px-3 font-sans whitespace-nowrap">
                    <span
                      className={`inline-block px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-semibold ${
                        isRetirement
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {isRetirement ? 'Retirement' : 'Accum.'}
                    </span>
                  </td>

                  {/* Start Portfolio */}
                  <td className="py-2 px-2 sm:px-3 text-right text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {formatCurrency(row.startBalance, currency)}
                  </td>

                  {/* Incomes / Savings */}
                  <td className="py-2 px-2 sm:px-3 text-right text-emerald-600 dark:text-emerald-400 font-medium whitespace-nowrap">
                    {isRetirement
                      ? `+${formatCurrency(row.annualGuaranteedNet, currency)}`
                      : `+${formatCurrency(row.annualContribution, currency)}`}
                  </td>

                  {/* Returns */}
                  <td className="py-2 px-2 sm:px-3 text-right text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    +{formatCurrency(row.annualReturns, currency)}
                  </td>

                  {/* Spend / Drawdown */}
                  <td className="py-2 px-2 sm:px-3 text-right text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {isRetirement ? (
                      row.annualNetDrawdown > 0 ? (
                        <span className="text-amber-600 dark:text-amber-400">
                          -{formatCurrency(row.annualNetDrawdown, currency)}
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400">
                          +{formatCurrency(row.annualSurplusReinvested, currency)} surp.
                        </span>
                      )
                    ) : (
                      '—'
                    )}
                  </td>

                  {/* Taxes Paid */}
                  <td className="py-2 px-2 sm:px-3 text-right text-rose-600 dark:text-rose-400 whitespace-nowrap">
                    {row.annualTaxes > 0 ? `-${formatCurrency(row.annualTaxes, currency)}` : '—'}
                  </td>

                  {/* End Portfolio */}
                  <td className="py-2 px-3 sm:px-4 text-right font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {formatCurrency(row.endBalance, currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Toggle */}
      <div className="p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[11px] sm:text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center justify-center gap-1 mx-auto"
        >
          {isExpanded ? (
            <>
              <span>Collapse Table</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <span>Show All {annualTimeline.length} Years</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </section>
  );
}
