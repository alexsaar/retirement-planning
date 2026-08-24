# RetireSmart - Browser-Based Retirement Planning Web Application

A modern, privacy-first, fully client-side web application designed to forecast and visualize retirement cash flows, investment portfolio accumulation/decumulation, and longevity runways.

Works 100% in any modern browser without any server backend or login required. Designed for immediate static deployment on **GitHub Pages**, Netlify, Vercel, or any CDN.

---

## 🌟 Key Features

- **100% Client-Side & Privacy-First**: No data is sent to external servers. All inputs and calculations stay locally on your device.
- **LocalStorage Auto-Persistence**: User inputs and custom income streams are saved in browser storage across page reloads.
- **Reset to Defaults**: Restore initial default assumptions with a single click.
- **JSON Plan Export & Import**: Backup your financial plans to `.json` files or load previously saved scenario configurations.
- **CSV Data Export**: Download the full year-by-year financial simulation ledger to Excel or Google Sheets.
- **Multi-Currency Support**: Seamlessly switch between EUR (€), USD ($), GBP (£), and CHF.
- **Inflation Modeling (Real vs Nominal)**: Toggle between future nominal currency values and real purchasing power (in today's money).
- **Dark & Light Mode**: High-contrast UI with automatic system preference detection and manual toggle.

---

## 📊 Modeled Financial Inputs

1. **Current Age** & **Expected Retirement Age**
2. **Target Monthly Spend in Retirement**
3. **Target Life Expectancy Horizon**
4. **Expected Public Statutory Pension** (Monthly gross)
5. **Multiple Private Pensions** (Named dynamic list, e.g. company bAV, private annuity, Riester/Rürup)
6. **Multiple Real Estate Incomes** (Named dynamic list of rental properties)
7. **Real Estate Maintenance Reserve (%)** (Dedicated percentage deducted for maintenance before taxes)
8. **Current Capital Markets Investment Portfolio Value**
9. **Monthly Pre-Retirement Savings Contribution** (Invested continuously until retirement)
10. **Assumed Average Annual Growth Rate (%)**
11. **Income Tax Rate (%)** (Applied to public pensions, private pensions, and net real estate)
12. **Capital Gains Tax Rate (%)** (Applied to portfolio withdrawals)

---

## 📐 Mathematical & Simulation Engine

### 1. Pre-Retirement Accumulation Phase
For each month $m$ up to Retirement Age:
$$P_{m} = P_{m-1} \times (1 + r_{\text{monthly}}) + S_{\text{monthly}}$$

### 2. Net Retirement Monthly Incomes
- **Net Public Pension**: $\text{Gross} \times (1 - \text{IncomeTaxRate})$
- **Net Private Pensions**: $\sum \text{Gross}_i \times (1 - \text{IncomeTaxRate})$
- **Net Real Estate Income**: $\sum (\text{Gross}_i \times (1 - \text{MaintenanceRate})) \times (1 - \text{IncomeTaxRate})$
- **Total Guaranteed Net Income**: $\text{Net Public} + \text{Net Private} + \text{Net Real Estate}$

### 3. Drawdown & Longevity
- **Net Monthly Gap**: $\max(0, \text{Target Spend} - \text{Total Guaranteed Net Income})$
- **Gross Monthly Drawdown**: $\text{Net Gap} / (1 - \text{CapitalGainsTaxRate})$
- **Capital Gains Tax**: $\text{Gross Drawdown} - \text{Net Gap}$
- **Monthly Net Surplus**: If Guaranteed Net Income > Target Spend, the surplus is automatically reinvested.
- **Portfolio Longevity**: Tracks month-by-month decumulation and flags the exact year & age of portfolio depletion (or signals lifetime surplus).

---

## 🚀 Getting Started

### Local Development

1. Clone repository:
   ```bash
   git clone https://github.com/your-username/retirement-planning.git
   cd retirement-planning
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Run unit tests:
   ```bash
   npm test
   ```

### Building for Production / GitHub Pages

1. Build static production bundle:
   ```bash
   npm run build
   ```
   The static build will be placed in the `dist/` directory with relative asset paths configured for GitHub Pages.

2. Preview production build locally:
   ```bash
   npm run preview
   ```

### Deploying to GitHub Pages

You can publish the `dist` directory to the `gh-pages` branch or use GitHub Actions:
- Go to repository **Settings** &rarr; **Pages**.
- Select **Deploy from a branch** &rarr; select branch `gh-pages` and folder `/ (root)`.

---

## 🛠️ Built With

- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chart.js & React-Chartjs-2](https://www.chartjs.org/)
- [Lucide Icons](https://lucide.dev/)
- [Vitest](https://vitest.dev/)
