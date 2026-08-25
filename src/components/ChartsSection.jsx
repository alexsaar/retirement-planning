import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { usePlanner } from '../context/PlannerContext';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { LineChart, BarChart3, PieChart } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function ChartsSection() {
  const { plan, results, darkMode } = usePlanner();
  const { annualTimeline, kpis, cashflowBreakdown } = results;
  const currency = plan.currency || 'EUR';
  const [activeTab, setActiveTab] = useState('trajectory');

  const textColor = darkMode ? '#94a3b8' : '#475569';
  const gridColor = darkMode ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)';
  const tooltipBg = darkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)';
  const tooltipTitleColor = darkMode ? '#f8fafc' : '#0f172a';
  const tooltipBodyColor = darkMode ? '#cbd5e1' : '#334155';
  const tooltipBorder = darkMode ? '#334155' : '#e2e8f0';

  // 1. Lifetime Portfolio Trajectory Dataset
  const trajectoryLabels = annualTimeline.map((d) => `Age ${d.age} (${d.calendarYear})`);
  const trajectoryData = annualTimeline.map((d) => Math.round(d.endBalance));

  const trajectoryChartData = {
    labels: trajectoryLabels,
    datasets: [
      {
        label: 'Portfolio Balance',
        data: trajectoryData,
        borderColor: '#10b981',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 350);
          gradient.addColorStop(0, darkMode ? 'rgba(16, 185, 129, 0.35)' : 'rgba(16, 185, 129, 0.25)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
          return gradient;
        },
        borderWidth: 2.5,
        pointRadius: (ctx) => {
          const age = annualTimeline[ctx.dataIndex]?.age;
          if (age === plan.currentAge || age === plan.retirementAge || age === Math.floor(kpis.depletionAge)) return 5;
          return 0;
        },
        pointHoverRadius: 6,
        pointBackgroundColor: (ctx) => {
          const age = annualTimeline[ctx.dataIndex]?.age;
          if (age === Math.floor(kpis.depletionAge)) return '#ef4444';
          if (age === plan.retirementAge) return '#3b82f6';
          return '#10b981';
        },
        fill: true,
        tension: 0.25,
      },
    ],
  };

  const trajectoryOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: tooltipTitleColor,
        bodyColor: tooltipBodyColor,
        borderColor: tooltipBorder,
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            const item = annualTimeline[index];
            const val = formatCurrency(item.endBalance, currency);
            const phase = item.isRetirementPhase ? 'Retirement Phase' : 'Accumulation Phase';
            return [`Portfolio Value: ${val}`, `Phase: ${phase}`];
          },
          afterBody: (tooltipItems) => {
            const item = annualTimeline[tooltipItems[0].dataIndex];
            if (item.isRetirementPhase) {
              return [
                `Net Drawdown: ${formatCurrency(item.annualNetDrawdown, currency)}/yr`,
                `Returns: +${formatCurrency(item.annualReturns, currency)}/yr`,
              ];
            } else {
              return [
                `Annual Savings: ${formatCurrency(item.annualContribution, currency)}/yr`,
                `Returns: +${formatCurrency(item.annualReturns, currency)}/yr`,
              ];
            }
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: {
          color: textColor,
          maxRotation: 45,
          minRotation: 0,
          autoSkip: true,
          maxTicksLimit: 8,
          font: { size: 10 },
        },
      },
      y: {
        grid: { color: gridColor },
        ticks: {
          color: textColor,
          callback: (value) => formatCurrency(value, currency, true),
          font: { size: 10 },
        },
        min: 0,
      },
    },
  };

  // 2. Cashflow Breakdown at Retirement
  const cashflowLabels = ['Target Spend', 'Income Sources'];
  
  const cashflowBarData = {
    labels: cashflowLabels,
    datasets: [
      {
        label: 'Target Monthly Spend',
        data: [cashflowBreakdown.targetSpend, 0],
        backgroundColor: darkMode ? '#f43f5e' : '#e11d48',
        borderRadius: 6,
        stack: 'spend',
      },
      {
        label: 'Net Public Pension',
        data: [0, cashflowBreakdown.netPublicPension],
        backgroundColor: '#3b82f6',
        borderRadius: 4,
        stack: 'income',
      },
      {
        label: 'Net Private Pensions',
        data: [0, cashflowBreakdown.netPrivatePensionTotal],
        backgroundColor: '#8b5cf6',
        borderRadius: 4,
        stack: 'income',
      },
      {
        label: 'Net Real Estate',
        data: [0, cashflowBreakdown.netRealEstateTotal],
        backgroundColor: '#10b981',
        borderRadius: 4,
        stack: 'income',
      },
      {
        label: 'Portfolio Drawdown (Net)',
        data: [0, cashflowBreakdown.monthlyGapNet],
        backgroundColor: '#f59e0b',
        borderRadius: 4,
        stack: 'income',
      },
    ],
  };

  const cashflowBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: textColor,
          boxWidth: 10,
          padding: 10,
          font: { size: 11 },
        },
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: tooltipTitleColor,
        bodyColor: tooltipBodyColor,
        borderColor: tooltipBorder,
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context) => {
            const val = formatCurrency(context.raw, currency);
            return `${context.dataset.label}: ${val} / mo`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: textColor, font: { size: 11 } },
      },
      y: {
        grid: { color: gridColor },
        ticks: {
          color: textColor,
          callback: (value) => formatCurrency(value, currency, true),
          font: { size: 10 },
        },
        stacked: true,
      },
    },
  };

  // 3. Income Source Donut Chart
  const donutData = {
    labels: ['Public Pension', 'Private Pensions', 'Real Estate', 'Portfolio Drawdown'],
    datasets: [
      {
        data: [
          cashflowBreakdown.netPublicPension,
          cashflowBreakdown.netPrivatePensionTotal,
          cashflowBreakdown.netRealEstateTotal,
          cashflowBreakdown.monthlyGapNet,
        ],
        backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'],
        borderWidth: 2,
        borderColor: darkMode ? '#0f172a' : '#ffffff',
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: textColor,
          boxWidth: 10,
          padding: 10,
          font: { size: 11 },
        },
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: tooltipTitleColor,
        bodyColor: tooltipBodyColor,
        borderColor: tooltipBorder,
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context) => {
            const val = formatCurrency(context.raw, currency);
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const pct = total > 0 ? ((context.raw / total) * 100).toFixed(1) : 0;
            return `${context.label}: ${val} / mo (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <section className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 sm:space-y-5 w-full">
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Visual Projections & Trajectory
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
            Interactive modeling of wealth accumulation, drawdown, and cashflows
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="w-full sm:w-auto overflow-x-auto no-scrollbar flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setActiveTab('trajectory')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg transition whitespace-nowrap ${
              activeTab === 'trajectory'
                ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            <span>Trajectory</span>
          </button>

          <button
            onClick={() => setActiveTab('cashflow')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg transition whitespace-nowrap ${
              activeTab === 'cashflow'
                ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Cashflow</span>
          </button>

          <button
            onClick={() => setActiveTab('sources')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg transition whitespace-nowrap ${
              activeTab === 'sources'
                ? 'bg-white dark:bg-slate-700 text-brand-700 dark:text-brand-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Sources</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas Container */}
      <div className="h-64 sm:h-80 md:h-96 w-full relative">
        {activeTab === 'trajectory' && (
          <div className="h-full w-full">
            <Line data={trajectoryChartData} options={trajectoryOptions} />
          </div>
        )}

        {activeTab === 'cashflow' && (
          <div className="h-full w-full">
            <Bar data={cashflowBarData} options={cashflowBarOptions} />
          </div>
        )}

        {activeTab === 'sources' && (
          <div className="h-full w-full flex items-center justify-center">
            <div className="h-full w-full max-w-xs sm:max-w-md">
              <Doughnut data={donutData} options={donutOptions} />
            </div>
          </div>
        )}
      </div>

      {/* Milestone Legend & Context Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] sm:text-xs">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></span>
          <span>
            <strong>Retirement Age ({plan.retirementAge}):</strong> Transition to decumulation
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
          <span>
            <strong>Target Age ({plan.endAge}):</strong> Horizon target
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${kpis.depletionAge ? 'bg-rose-500' : 'bg-emerald-400'}`}></span>
          <span className="truncate">
            <strong>Longevity:</strong> {kpis.depletionAge ? `Depletes at age ${kpis.depletionAge}` : `Funded through age ${plan.endAge}+`}
          </span>
        </div>
      </div>
    </section>
  );
}
