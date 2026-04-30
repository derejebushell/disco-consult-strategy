import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Plus, Trash2 } from "lucide-react";
import { SectionCard } from "../../components/SectionCard";
import { Field, Input, Select } from "../../components/Field";
import { CurrencyInput } from "../../components/CurrencyInput";
import { ResultCard } from "../../components/ResultCard";
import { formatCurrency, formatCurrencyShort, parseMoney } from "../../lib/formatters";
import {
  calculateEquity,
  calculateUsableEquity,
  calculateYearsToPayoff,
  calculateAnnualCashFlow,
  calculatePortfolioTotals,
  calculateRetirementProjection,
} from "../../lib/calculations";
import { GOLD, GREEN, RED, BLUE } from "../../lib/constants";
import type { AppState } from "../../App";
import type { PropertyAsset } from "../../types/property";

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const PROPERTY_TYPES = ["House", "Townhouse", "Unit / Apartment", "Duplex", "Land", "Other"];
const STATES = ["QLD", "NSW", "VIC", "WA", "SA", "TAS", "ACT", "NT"];
const FREQ_OPTIONS = [
  { value: "weekly", label: "Weekly" },
  { value: "fortnightly", label: "Fortnightly" },
  { value: "monthly", label: "Monthly" },
];
const LOAN_OPTIONS = [
  { value: "principal_and_interest", label: "Principal & Interest" },
  { value: "interest_only", label: "Interest Only" },
];

function emptyProperty(id: string): PropertyAsset {
  return {
    id,
    suburb: "",
    propertyType: "House",
    ownershipType: "investment",
    estimatedValue: "",
    loanAmount: "",
    rentalIncomeWeekly: "",
    interestRate: "5.5",
    loanType: "principal_and_interest",
    repaymentAmount: "",
    repaymentFrequency: "monthly",
    purchaseDate: "",
  };
}

export function PortfolioCalculator({ state, setState }: Props) {
  const { calc } = state;

  const setCalc = (key: string, val: string) =>
    setState((s) => ({ ...s, calc: { ...s.calc, [key]: val } }));

  const setProperty = (idx: number, key: keyof PropertyAsset, val: string) =>
    setState((s) => {
      const props = [...s.calc.properties];
      props[idx] = { ...props[idx], [key]: val };
      return { ...s, calc: { ...s.calc, properties: props } };
    });

  const addProperty = () =>
    setState((s) => ({
      ...s,
      calc: {
        ...s.calc,
        properties: [
          ...s.calc.properties,
          emptyProperty(`prop_${Date.now()}`),
        ],
      },
    }));

  const removeProperty = (idx: number) =>
    setState((s) => ({
      ...s,
      calc: {
        ...s.calc,
        properties: s.calc.properties.filter((_, i) => i !== idx),
      },
    }));

  const properties = calc.properties;
  const totals = calculatePortfolioTotals(properties);

  const personOneAge = parseInt(calc.personOneAge) || 0;
  const personOneRetirement = parseInt(calc.personOneRetirementAge) || 65;
  const personTwoAge = parseInt(calc.personTwoAge) || 0;
  const personTwoRetirement = parseInt(calc.personTwoRetirementAge) || 65;

  const yearsToRetirement =
    calc.householdType === "couple"
      ? Math.min(personOneRetirement - personOneAge, personTwoRetirement - personTwoAge)
      : personOneRetirement - personOneAge;

  const annualRetirementIncome = parseMoney(calc.annualRetirementIncomeRequired) || 100000;
  const lifeExpectancy = parseInt(calc.lifeExpectancy) || 85;
  const growthRate = parseFloat(calc.assumedGrowthRate) || 7;
  const yieldRate = parseFloat(calc.assumedYieldRate) || 5;
  const retirementAge = calc.householdType === "couple"
    ? Math.min(personOneRetirement, personTwoRetirement)
    : personOneRetirement;

  const cashSavings = parseMoney(calc.cashSavings);
  const superBalance = parseMoney(calc.superBalance);
  const sharesValue = parseMoney(calc.sharesValue);
  const otherAssets = parseMoney(calc.otherAssetsValue);
  const otherLiabilities = parseMoney(calc.otherLiabilitiesValue);

  const personOneIncome = parseMoney(calc.personOneIncome);
  const personTwoIncome = calc.householdType === "couple" ? parseMoney(calc.personTwoIncome) : 0;
  const totalAnnualIncome = personOneIncome + personTwoIncome;
  const totalMonthlyIncome = totalAnnualIncome / 12;

  const totalAssets = totals.totalPropertyValue + cashSavings + superBalance + sharesValue + otherAssets;
  const totalDebt = totals.totalLoans + otherLiabilities;
  const netWorth = totalAssets - totalDebt;
  const investableCapital = cashSavings + totals.totalUsableEquity;
  const safePurchaseCeiling = investableCapital * 4;

  const currentPassiveIncome = totals.totalAnnualRent;
  const passiveIncomeGoal = parseMoney(calc.passiveIncomeGoal);
  const passiveIncomeGap = passiveIncomeGoal - currentPassiveIncome;

  const retirement = calculateRetirementProjection(
    properties,
    Math.max(0, yearsToRetirement),
    annualRetirementIncome,
    lifeExpectancy,
    retirementAge,
    growthRate,
    yieldRate
  );

  // Chart data
  const chartData = properties.map((p, i) => {
    const val = parseMoney(p.estimatedValue);
    const loan = parseMoney(p.loanAmount);
    const equity = calculateEquity(val, loan);
    const annualRent = p.ownershipType === "investment" ? parseMoney(p.rentalIncomeWeekly) * 52 : 0;
    const annualRep = p.ownershipType === "investment"
      ? (() => {
          switch (p.repaymentFrequency) {
            case "weekly": return parseMoney(p.repaymentAmount) * 52;
            case "fortnightly": return parseMoney(p.repaymentAmount) * 26;
            default: return parseMoney(p.repaymentAmount) * 12;
          }
        })()
      : 0;
    const cashFlow = annualRent - annualRep;
    return {
      name: p.suburb || `Property ${i + 1}`,
      equity,
      annualIncome: annualRent,
      annualRepayments: annualRep,
      cashFlow,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    return (
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-xs space-y-1">
        <p className="font-semibold text-zinc-200 mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* About You */}
      <SectionCard title="About You" subtitle="Household income and retirement timeline">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Field label="Household Type">
              <Select
                value={calc.householdType}
                onChange={(e) => setCalc("householdType", e.target.value)}
                options={[
                  { value: "single", label: "Single" },
                  { value: "couple", label: "Couple" },
                ]}
              />
            </Field>
            <Field label="Dependants">
              <Input
                type="number"
                value={calc.dependants}
                onChange={(e) => setCalc("dependants", e.target.value)}
                placeholder="0"
              />
            </Field>
            <Field label="State">
              <Select
                value={calc.state}
                onChange={(e) => setCalc("state", e.target.value)}
                options={STATES.map((s) => ({ value: s, label: s }))}
                placeholder="Select state..."
              />
            </Field>
          </div>

          {/* Person One */}
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">
              {calc.householdType === "couple" ? "Person One" : "You"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Field label="Name">
                <Input value={calc.personOneName} onChange={(e) => setCalc("personOneName", e.target.value)} placeholder="Jane" />
              </Field>
              <Field label="Age">
                <Input type="number" value={calc.personOneAge} onChange={(e) => setCalc("personOneAge", e.target.value)} placeholder="40" />
              </Field>
              <Field label="Annual Gross Income">
                <CurrencyInput value={calc.personOneIncome} onChange={(v) => setCalc("personOneIncome", v)} />
              </Field>
              <Field label="Goal Retirement Age">
                <Input type="number" value={calc.personOneRetirementAge} onChange={(e) => setCalc("personOneRetirementAge", e.target.value)} placeholder="60" />
              </Field>
            </div>
          </div>

          {/* Person Two */}
          {calc.householdType === "couple" && (
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">Person Two</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Field label="Name">
                  <Input value={calc.personTwoName} onChange={(e) => setCalc("personTwoName", e.target.value)} placeholder="John" />
                </Field>
                <Field label="Age">
                  <Input type="number" value={calc.personTwoAge} onChange={(e) => setCalc("personTwoAge", e.target.value)} placeholder="42" />
                </Field>
                <Field label="Annual Gross Income">
                  <CurrencyInput value={calc.personTwoIncome} onChange={(v) => setCalc("personTwoIncome", v)} />
                </Field>
                <Field label="Goal Retirement Age">
                  <Input type="number" value={calc.personTwoRetirementAge} onChange={(e) => setCalc("personTwoRetirementAge", e.target.value)} placeholder="58" />
                </Field>
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Property Portfolio */}
      <SectionCard title="Property Portfolio">
        <div className="space-y-4">
          {properties.length === 0 && (
            <p className="text-sm text-zinc-600 text-center py-4">No properties added yet.</p>
          )}
          {properties.map((prop, idx) => {
            const val = parseMoney(prop.estimatedValue);
            const loan = parseMoney(prop.loanAmount);
            const equity = calculateEquity(val, loan);
            const usableEquity = calculateUsableEquity(val, loan);
            const payoff = calculateYearsToPayoff(
              loan,
              parseFloat(prop.interestRate) || 0,
              prop.repaymentAmount,
              prop.repaymentFrequency,
              prop.loanType
            );
            const annualCashFlow = calculateAnnualCashFlow(prop);

            return (
              <div key={prop.id} className="rounded-lg border border-zinc-700 bg-zinc-800/40 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-yellow-500">Property {idx + 1}</span>
                    {prop.suburb && <span className="text-xs text-zinc-400">— {prop.suburb}</span>}
                  </div>
                  <button
                    onClick={() => removeProperty(idx)}
                    className="text-zinc-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <Field label="Suburb / Identifier">
                    <Input value={prop.suburb} onChange={(e) => setProperty(idx, "suburb", e.target.value)} placeholder="Newstead, QLD" />
                  </Field>
                  <Field label="Property Type">
                    <Select
                      value={prop.propertyType}
                      onChange={(e) => setProperty(idx, "propertyType", e.target.value)}
                      options={PROPERTY_TYPES.map((t) => ({ value: t, label: t }))}
                    />
                  </Field>
                  <Field label="Ownership Type">
                    <Select
                      value={prop.ownershipType}
                      onChange={(e) => setProperty(idx, "ownershipType", e.target.value as any)}
                      options={[
                        { value: "investment", label: "Investment" },
                        { value: "owner_occupier", label: "Owner Occupier" },
                      ]}
                    />
                  </Field>
                  <Field label="Estimated Value">
                    <CurrencyInput value={prop.estimatedValue} onChange={(v) => setProperty(idx, "estimatedValue", v)} />
                  </Field>
                  <Field label="Current Loan">
                    <CurrencyInput value={prop.loanAmount} onChange={(v) => setProperty(idx, "loanAmount", v)} />
                  </Field>
                  {prop.ownershipType === "investment" && (
                    <Field label="Weekly Rent">
                      <CurrencyInput value={prop.rentalIncomeWeekly} onChange={(v) => setProperty(idx, "rentalIncomeWeekly", v)} placeholder="$500" />
                    </Field>
                  )}
                  <Field label="Interest Rate (%)">
                    <Input
                      type="number"
                      step="0.1"
                      value={prop.interestRate}
                      onChange={(e) => setProperty(idx, "interestRate", e.target.value)}
                      placeholder="5.5"
                    />
                  </Field>
                  <Field label="Loan Type">
                    <Select value={prop.loanType} onChange={(e) => setProperty(idx, "loanType", e.target.value as any)} options={LOAN_OPTIONS} />
                  </Field>
                  <Field label="Repayment Amount">
                    <CurrencyInput value={prop.repaymentAmount} onChange={(v) => setProperty(idx, "repaymentAmount", v)} placeholder="$2,400" />
                  </Field>
                  <Field label="Repayment Frequency">
                    <Select value={prop.repaymentFrequency} onChange={(e) => setProperty(idx, "repaymentFrequency", e.target.value as any)} options={FREQ_OPTIONS} />
                  </Field>
                  <Field label="Purchase Date">
                    <Input type="date" value={prop.purchaseDate} onChange={(e) => setProperty(idx, "purchaseDate", e.target.value)} />
                  </Field>
                </div>

                {/* Per-property summary */}
                {val > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-zinc-700">
                    <div className="text-center">
                      <p className="text-xs text-zinc-500">Equity</p>
                      <p className="text-sm font-semibold text-yellow-400">{formatCurrencyShort(equity)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-zinc-500">Usable Equity</p>
                      <p className="text-sm font-semibold text-yellow-300">{formatCurrencyShort(usableEquity)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-zinc-500">
                        {prop.ownershipType === "investment" ? "Annual Cash Flow" : "Not Applicable"}
                      </p>
                      <p className={`text-sm font-semibold ${annualCashFlow >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {prop.ownershipType === "investment" ? formatCurrencyShort(annualCashFlow) : "—"}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-zinc-500">Payoff</p>
                      <p className="text-sm font-semibold text-zinc-300">
                        {payoff.status === "ok" && payoff.years !== null
                          ? `${Math.round(payoff.years)} yrs`
                          : payoff.status}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <button
            onClick={addProperty}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-dashed border-zinc-700 text-sm text-zinc-500 hover:text-yellow-500 hover:border-yellow-600/50 transition-all"
          >
            <Plus size={14} />
            Add Property
          </button>
        </div>
      </SectionCard>

      {/* Portfolio chart */}
      {chartData.length > 0 && (
        <SectionCard title="Portfolio Breakdown">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 10 }}>
                <XAxis dataKey="name" tick={{ fill: "#71717a", fontSize: 11 }} />
                <YAxis tickFormatter={(v) => formatCurrencyShort(v)} tick={{ fill: "#71717a", fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: "#71717a" }} />
                <Bar dataKey="equity" name="Equity" fill={GOLD} radius={[3, 3, 0, 0]} />
                <Bar dataKey="annualIncome" name="Annual Income" fill={BLUE} radius={[3, 3, 0, 0]} />
                <Bar dataKey="annualRepayments" name="Repayments" fill={RED} radius={[3, 3, 0, 0]} />
                <Bar dataKey="cashFlow" name="Cash Flow" fill={GREEN} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      )}

      {/* Cash and Assets */}
      <SectionCard title="Cash & Assets">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Cash Savings"><CurrencyInput value={calc.cashSavings} onChange={(v) => setCalc("cashSavings", v)} /></Field>
          <Field label="Super Balance"><CurrencyInput value={calc.superBalance} onChange={(v) => setCalc("superBalance", v)} /></Field>
          <Field label="Shares / Other Investments"><CurrencyInput value={calc.sharesValue} onChange={(v) => setCalc("sharesValue", v)} /></Field>
          <Field label="Other Assets"><CurrencyInput value={calc.otherAssetsValue} onChange={(v) => setCalc("otherAssetsValue", v)} /></Field>
          <Field label="Other Liabilities"><CurrencyInput value={calc.otherLiabilitiesValue} onChange={(v) => setCalc("otherLiabilitiesValue", v)} /></Field>
          <Field label="Annual Passive Income Target"><CurrencyInput value={calc.passiveIncomeGoal} onChange={(v) => setCalc("passiveIncomeGoal", v)} /></Field>
        </div>
      </SectionCard>

      {/* Retirement Assumptions */}
      <SectionCard title="Retirement Assumptions">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Field label="Annual Income Required in Retirement" hint="Today's dollars">
            <CurrencyInput value={calc.annualRetirementIncomeRequired} onChange={(v) => setCalc("annualRetirementIncomeRequired", v)} />
          </Field>
          <Field label="Life Expectancy">
            <Input type="number" value={calc.lifeExpectancy} onChange={(e) => setCalc("lifeExpectancy", e.target.value)} placeholder="85" />
          </Field>
          <Field label="Assumed Growth Rate (%)" hint="Property portfolio p.a.">
            <Input type="number" step="0.5" value={calc.assumedGrowthRate} onChange={(e) => setCalc("assumedGrowthRate", e.target.value)} placeholder="7" />
          </Field>
          <Field label="Assumed Yield at Retirement (%)" hint="On future portfolio value">
            <Input type="number" step="0.5" value={calc.assumedYieldRate} onChange={(e) => setCalc("assumedYieldRate", e.target.value)} placeholder="5" />
          </Field>
        </div>
      </SectionCard>

      {/* Results */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-zinc-800" />
          <span className="text-xs text-zinc-500 font-medium uppercase tracking-widest">Results</span>
          <div className="h-px flex-1 bg-zinc-800" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ResultCard
            title="Gross Monthly Income"
            value={formatCurrency(totalMonthlyIncome)}
            color="gold"
            info={{
              description: "Total household gross income divided by 12.",
              formula: "(Person 1 income + Person 2 income) ÷ 12",
              inputs: [`Person 1: ${formatCurrency(personOneIncome)}`, calc.householdType === "couple" ? `Person 2: ${formatCurrency(personTwoIncome)}` : ""].filter(Boolean),
            }}
          />
          <ResultCard
            title="Total Net Worth"
            value={formatCurrency(netWorth)}
            color={netWorth >= 0 ? "gold" : "red"}
            info={{
              description: "All assets minus all debts.",
              formula: "Total assets − Total debt",
              inputs: [
                `Property: ${formatCurrency(totals.totalPropertyValue)}`,
                `Cash: ${formatCurrency(cashSavings)}`,
                `Super: ${formatCurrency(superBalance)}`,
                `Shares: ${formatCurrency(sharesValue)}`,
                `Total debt: −${formatCurrency(totalDebt)}`,
              ],
            }}
          />
          <ResultCard
            title="Total Usable Equity"
            value={formatCurrency(totals.totalUsableEquity)}
            color="gold"
            info={{
              description: "Equity that can potentially be accessed across all properties.",
              formula: "(Property value × 80%) − Loan balance, per property",
              inputs: properties.map((p, i) => {
                const v = parseMoney(p.estimatedValue);
                const l = parseMoney(p.loanAmount);
                return `${p.suburb || `Property ${i + 1}`}: ${formatCurrency(calculateUsableEquity(v, l))}`;
              }),
            }}
          >
            {properties.map((p, i) => {
              const v = parseMoney(p.estimatedValue);
              const l = parseMoney(p.loanAmount);
              return (
                <div key={i} className="flex justify-between text-xs py-1 border-b border-zinc-800 last:border-0">
                  <span className="text-zinc-500">{p.suburb || `Property ${i + 1}`}</span>
                  <span className="text-yellow-400">{formatCurrencyShort(calculateUsableEquity(v, l))}</span>
                </div>
              );
            })}
          </ResultCard>
          <ResultCard
            title="Available War Chest"
            value={formatCurrency(investableCapital)}
            color="gold"
            info={{
              description: "Your immediately deployable capital for the next purchase.",
              formula: "Cash savings + Usable equity",
              inputs: [
                `Cash: ${formatCurrency(cashSavings)}`,
                `Usable equity: ${formatCurrency(totals.totalUsableEquity)}`,
              ],
            }}
          />
          <ResultCard
            title="Safe Purchase Ceiling"
            value={formatCurrency(safePurchaseCeiling)}
            subtitle="Estimate only — confirm with broker"
            color="gold"
            info={{
              description: "A rough strategic ceiling on what may be purchasable, assuming a 20% deposit model. This is not a bank approval.",
              formula: "Available war chest × 4",
              inputs: [`War chest: ${formatCurrency(investableCapital)}`],
            }}
          />
          <ResultCard
            title="Current Passive Income"
            value={formatCurrency(currentPassiveIncome)}
            subtitle="Annual, investment properties only"
            color={currentPassiveIncome > 0 ? "green" : "neutral"}
            info={{
              description: "Total annual rental income from investment properties only.",
              formula: "Sum of (weekly rent × 52) per investment property",
            }}
          />
          <ResultCard
            title="Passive Income Gap"
            value={formatCurrency(Math.abs(passiveIncomeGap))}
            subtitle={passiveIncomeGap > 0 ? "Below target" : passiveIncomeGap < 0 ? "Above target" : "On target"}
            color={passiveIncomeGap <= 0 ? "green" : "red"}
            info={{
              description: "The gap between your current passive income and your target.",
              formula: "Target − Current passive income",
              inputs: [
                `Target: ${formatCurrency(passiveIncomeGoal)}`,
                `Current: ${formatCurrency(currentPassiveIncome)}`,
              ],
            }}
          />
          <ResultCard
            title="Retirement Projection"
            value={formatCurrency(retirement.projectedPassiveIncome)}
            subtitle={`Projected annual passive income at age ${retirementAge} (in ${Math.max(0, yearsToRetirement)} yrs)`}
            color="gold"
            large
            info={{
              description: "Projected annual passive income from investment properties at retirement, based on assumed growth and yield rates.",
              formula: "Future portfolio value × Assumed yield rate",
              inputs: [
                `Years to retirement: ${Math.max(0, yearsToRetirement)}`,
                `Growth rate: ${growthRate}%`,
                `Yield rate: ${yieldRate}%`,
                `Projected portfolio value: ${formatCurrency(retirement.projectedInvestmentValue)}`,
              ],
            }}
          />
          <ResultCard
            title="Retirement Funding Position"
            value={formatCurrency(Math.abs(retirement.annualPosition))}
            subtitle={retirement.annualPosition >= 0 ? "Annual surplus" : "Annual shortfall"}
            color={retirement.annualPosition >= 0 ? "green" : "red"}
            info={{
              description: "Whether your projected passive income will cover your required retirement income.",
              formula: "Projected passive income − Annual income required",
              inputs: [
                `Projected income: ${formatCurrency(retirement.projectedPassiveIncome)}`,
                `Required: ${formatCurrency(annualRetirementIncome)}`,
                `Years in retirement: ${Math.max(0, lifeExpectancy - retirementAge)}`,
                `Lifetime gap: ${retirement.lifetimePosition >= 0 ? "Surplus" : "Shortfall"} of ${formatCurrency(Math.abs(retirement.lifetimePosition))}`,
              ],
            }}
          />
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-zinc-600 leading-relaxed text-center pt-2">
        Projections are estimates only. Results depend on market conditions and individual circumstances. Borrowing capacity must be confirmed by a licensed broker. Tax implications should be discussed with your accountant. Property performance is not guaranteed.
      </p>
    </div>
  );
}

