import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { SectionCard } from "../../components/SectionCard";
import { Field, Input, Select } from "../../components/Field";
import { formatCurrency, formatCurrencyShort, formatPercent, parseMoney } from "../../lib/formatters";
import { calculatePropertyPerformance } from "../../lib/calculations";
import { GOLD, GREEN, RED, BLUE } from "../../lib/constants";
import type { AppState } from "../../App";

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const LINE_CONFIG = [
  { key: "totalPerformance", label: "Total Performance", color: GOLD },
  { key: "equityGrowth", label: "Equity Growth", color: GREEN },
  { key: "loanBalance", label: "Loan Balance", color: RED },
  { key: "cashFlow", label: "Cumulative Cash Flow", color: BLUE },
];

export function PropertyPerformanceDashboard({ state, setState }: Props) {
  const { calc, performance } = state;
  const properties = calc.properties;

  const setPerf = (key: string, val: any) =>
    setState((s) => ({ ...s, performance: { ...s.performance, [key]: val } }));

  const selectedIdx = parseInt(performance.selectedPropertyIdx) || 0;
  const prop = properties[selectedIdx];

  const purchasePrice = prop ? parseMoney(prop.estimatedValue) : 0;
  const loanBalance = prop ? parseMoney(prop.loanAmount) : 0;
  const weeklyRent = prop ? parseMoney(prop.rentalIncomeWeekly) : 0;
  const interestRate = prop ? parseFloat(prop.interestRate) || 5.5 : 5.5;
  const repaymentAmount = prop ? parseMoney(prop.repaymentAmount) : 0;
  const repaymentFrequency = prop?.repaymentFrequency || "monthly";
  const loanType = prop?.loanType || "principal_and_interest";

  const growthRate = parseFloat(performance.growthRate) || 7;
  const yieldRate = parseFloat(performance.yieldRate) || 5;
  const costFactor = parseFloat(performance.costFactor) || 100;

  const data = purchasePrice > 0
    ? calculatePropertyPerformance(
        purchasePrice,
        loanBalance,
        weeklyRent,
        growthRate,
        yieldRate,
        costFactor,
        repaymentAmount,
        repaymentFrequency,
        loanType,
        interestRate
      )
    : [];

  const year10 = data[10];
  const initialCapital = purchasePrice - loanBalance;
  const totalPerf10 = year10 ? year10.totalPerformance : 0;
  const equity10 = year10 ? year10.equityGrowth : 0;
  const returnOnCapital = initialCapital > 0 ? (totalPerf10 / initialCapital) * 100 : 0;

  // Capital returned = year where cumulative cash flow >= initial capital
  const capitalReturnedYear = data.find((d) => d.cashFlow >= initialCapital)?.year ?? null;

  const annualRent = weeklyRent * 52;
  const annualRepayments = (() => {
    switch (repaymentFrequency) {
      case "weekly": return repaymentAmount * 52;
      case "fortnightly": return repaymentAmount * 26;
      default: return repaymentAmount * 12;
    }
  })();
  const annualCashFlow = annualRent - annualRepayments;
  const grossYield = purchasePrice > 0 ? (annualRent / purchasePrice) * 100 : 0;
  const purchaseCosts = purchasePrice * 0.05;
  const lvr = purchasePrice > 0 ? (loanBalance / purchasePrice) * 100 : 0;

  const toggleLine = (key: string) => {
    const current = performance.selectedLines as string[];
    if (current.includes(key)) {
      if (current.length === 1) return;
      setPerf("selectedLines", current.filter((k) => k !== key));
    } else {
      setPerf("selectedLines", [...current, key]);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    return (
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-xs space-y-1">
        <p className="font-semibold text-zinc-200 mb-1">Year {label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.stroke }}>
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    );
  };

  if (properties.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-zinc-600 text-sm">
        Add properties in the Portfolio Calculator to use this dashboard.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <SectionCard title="Dashboard Controls">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Field label="Select Property">
            <Select
              value={performance.selectedPropertyIdx}
              onChange={(e) => setPerf("selectedPropertyIdx", e.target.value)}
              options={properties.map((p, i) => ({
                value: String(i),
                label: p.suburb || `Property ${i + 1}`,
              }))}
            />
          </Field>
          <Field label="Growth Rate (%)" hint="Annual capital growth assumption">
            <Input
              type="number"
              step="0.5"
              value={performance.growthRate}
              onChange={(e) => setPerf("growthRate", e.target.value)}
              placeholder="7"
            />
          </Field>
          <Field label="Yield Rate (%)" hint="Annual rent growth assumption">
            <Input
              type="number"
              step="0.5"
              value={performance.yieldRate}
              onChange={(e) => setPerf("yieldRate", e.target.value)}
              placeholder="5"
            />
          </Field>
          <Field label="Cost Factor (%)" hint="100% = actual repayments only">
            <Input
              type="number"
              step="5"
              value={performance.costFactor}
              onChange={(e) => setPerf("costFactor", e.target.value)}
              placeholder="100"
            />
          </Field>
        </div>
      </SectionCard>

      {/* Property header */}
      {prop && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wide">Property</p>
              <p className="text-sm font-semibold text-zinc-100 mt-1">{prop.suburb || "Unnamed Property"}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wide">Purchase Price</p>
              <p className="text-sm font-semibold text-yellow-400 mt-1">{formatCurrency(purchasePrice)}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wide">Purchase Date</p>
              <p className="text-sm font-semibold text-zinc-100 mt-1">{prop.purchaseDate || "Today"}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wide">Strategy</p>
              <p className="text-sm font-semibold text-zinc-100 mt-1">
                {prop.ownershipType === "investment" ? "Investment" : "Owner Occupier"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Primary metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-yellow-600/30 bg-zinc-900 p-4 text-center">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">10-Year Total Performance</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">{formatCurrencyShort(totalPerf10)}</p>
          <p className="text-xs text-zinc-600 mt-1">Equity + cash flow</p>
        </div>
        <div className="rounded-xl border border-green-600/30 bg-zinc-900 p-4 text-center">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">Return on Capital</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{formatPercent(returnOnCapital)}</p>
          <p className="text-xs text-zinc-600 mt-1">Over 10 years</p>
        </div>
        <div className="rounded-xl border border-yellow-600/30 bg-zinc-900 p-4 text-center">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">Equity at Year 10</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">{formatCurrencyShort(equity10)}</p>
          <p className="text-xs text-zinc-600 mt-1">Projected</p>
        </div>
        <div className="rounded-xl border border-blue-600/30 bg-zinc-900 p-4 text-center">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">Capital Returned</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">
            {capitalReturnedYear !== null ? `Year ${capitalReturnedYear}` : "Not yet"}
          </p>
          <p className="text-xs text-zinc-600 mt-1">Via cash flow</p>
        </div>
      </div>

      {/* Graph */}
      {data.length > 0 && (
        <SectionCard title="Performance Graph">
          <div className="flex flex-wrap gap-2 mb-4">
            {LINE_CONFIG.map((line) => {
              const active = (performance.selectedLines as string[]).includes(line.key);
              return (
                <button
                  key={line.key}
                  onClick={() => toggleLine(line.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    active
                      ? "border-current opacity-100"
                      : "border-zinc-700 opacity-40 hover:opacity-60"
                  }`}
                  style={{ color: active ? line.color : "#71717a" }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: line.color }}
                  />
                  {line.label}
                </button>
              );
            })}
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
                <XAxis
                  dataKey="year"
                  tick={{ fill: "#71717a", fontSize: 11 }}
                  label={{ value: "Year", position: "insideBottom", offset: -2, fill: "#71717a", fontSize: 11 }}
                />
                <YAxis tickFormatter={(v) => formatCurrencyShort(v)} tick={{ fill: "#71717a", fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                {LINE_CONFIG.filter((l) =>
                  (performance.selectedLines as string[]).includes(l.key)
                ).map((line) => (
                  <Line
                    key={line.key}
                    type="monotone"
                    dataKey={line.key}
                    name={line.label}
                    stroke={line.color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      )}

      {/* Secondary metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[
          { label: "Gross Yield", value: formatPercent(grossYield), color: "text-yellow-400" },
          { label: "Weekly Cash Flow", value: formatCurrency(annualCashFlow / 52), color: annualCashFlow >= 0 ? "text-green-400" : "text-red-400" },
          { label: "Annual Cash Flow", value: formatCurrency(annualCashFlow), color: annualCashFlow >= 0 ? "text-green-400" : "text-red-400" },
          { label: "Loan Balance", value: formatCurrencyShort(loanBalance), color: "text-red-400" },
          { label: "LVR", value: formatPercent(lvr), color: lvr > 80 ? "text-red-400" : "text-zinc-100" },
          { label: "Purchase Costs Est.", value: formatCurrencyShort(purchaseCosts), color: "text-zinc-400" },
          {
            label: "Est. Tax Benefit",
            value: annualCashFlow < 0
              ? formatCurrencyShort(Math.abs(annualCashFlow) * 0.3)
              : formatCurrencyShort(annualRent * 0.05),
            color: "text-zinc-400",
          },
          { label: "Initial Capital", value: formatCurrencyShort(initialCapital), color: "text-zinc-100" },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-zinc-800 bg-zinc-900 p-3">
            <p className="text-xs text-zinc-500 uppercase tracking-wide">{m.label}</p>
            <p className={`text-lg font-bold mt-1 ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-zinc-600 text-center">
        Tax benefit estimates are indicative only. Confirm with your accountant. Projections assume stable market conditions and are not guaranteed.
      </p>
    </div>
  );
}
