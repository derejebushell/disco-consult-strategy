import React from "react";
import { ChevronDown } from "lucide-react";
import { SectionCard } from "../../components/SectionCard";
import { PortfolioCalculator } from "./PortfolioCalculator";
import { PropertyPerformanceDashboard } from "./PropertyPerformanceDashboard";
import { formatCurrency, parseMoney } from "../../lib/formatters";
import { calculatePortfolioTotals, calculateRetirementProjection } from "../../lib/calculations";
import type { AppState } from "../../App";

interface ConsultTabProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const CONSULT_SECTIONS = [
  { id: "journey", label: "Client Journey" },
  { id: "snapshot", label: "Personalised Snapshot" },
  { id: "calculator", label: "Portfolio Position Calculator" },
  { id: "performance_dashboard", label: "Property Performance Dashboard" },
  { id: "current_position", label: "Your Current Position" },
  { id: "future_outcome", label: "Your Future Outcome" },
  { id: "how_we_help", label: "How We Help You" },
  { id: "next_step", label: "Next Step" },
];

export function ConsultTab({ state, setState }: ConsultTabProps) {
  const { activeConsultSection } = state;

  const setSection = (id: string) =>
    setState((s) => ({ ...s, activeConsultSection: id }));


  return (
    <div className="space-y-6">
      {/* Consult nav dropdown */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <select
            value={activeConsultSection}
            onChange={(e) => setSection(e.target.value)}
            className="appearance-none bg-zinc-800 border border-zinc-700 rounded-xl pl-5 pr-12 py-4 text-lg font-medium text-zinc-100 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 cursor-pointer"
          >
            {CONSULT_SECTIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
        </div>
        <p className="text-base text-zinc-500 hidden sm:block">
          Navigate through the consult sections
        </p>
      </div>

      {/* Section content */}
      {activeConsultSection === "journey" && <ClientJourney />}
      {activeConsultSection === "snapshot" && <PersonalisedSnapshot state={state} />}
      {activeConsultSection === "calculator" && (
        <PortfolioCalculator state={state} setState={setState} />
      )}
      {activeConsultSection === "performance_dashboard" && (
        <PropertyPerformanceDashboard state={state} setState={setState} />
      )}
      {activeConsultSection === "current_position" && (
        <CurrentPosition state={state} />
      )}
      {activeConsultSection === "future_outcome" && (
        <FutureOutcome state={state} />
      )}
      {activeConsultSection === "how_we_help" && <HowWeHelp />}
      {activeConsultSection === "next_step" && <NextStep state={state} setState={setState} />}
    </div>
  );
}

function ClientJourney() {
  const steps = [
    {
      number: "01",
      title: "Discovery",
      description:
        "We take the time to understand where you are now — your financial position, your goals, what's been getting in the way, and whether you're ready to move forward.",
      detail: "Qualification · Pain uncovering · Finance assessment · Goal setting",
    },
    {
      number: "02",
      title: "Strategy & Planning",
      description:
        "We build a tailored acquisition strategy for you — defining your budget, target locations, property criteria, and the step-by-step plan to get you there.",
      detail: "Investment brief · Risk profile · Location analysis · Buying criteria",
    },
    {
      number: "03",
      title: "Acquisition",
      description:
        "We go to work. Our team sources, analyses, negotiates, and secures the right property — so you can move forward with confidence.",
      detail: "Property sourcing · Due diligence · Negotiation · Settlement support",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <p className="text-base font-semibold text-zinc-400 mb-2">How We Work</p>
        <h2 className="text-3xl font-bold text-zinc-100">Your Journey with Quantum</h2>
        <p className="text-base text-zinc-500 mt-2 max-w-lg mx-auto">
          A clear, repeatable process built around your goals — from first conversation to settled property.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {steps.map((step) => (
          <div
            key={step.number}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 flex flex-col gap-5 hover:border-yellow-600/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black text-yellow-600/30">{step.number}</span>
              <h3 className="text-xl font-bold text-zinc-100">{step.title}</h3>
            </div>
            <p className="text-base text-zinc-400 leading-relaxed">{step.description}</p>
            <div className="mt-auto pt-4 border-t border-zinc-800">
              <p className="text-base text-zinc-500">{step.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PersonalisedSnapshot({ state }: { state: AppState }) {
  const name = state.clientName || "your client";
  const locations = state.clientPreferredLocations || "their target market";
  const clientType = state.clientType === "investor" ? "investor" : "home buyer";
  const notes = state.discoveryNotes;

  const painPoints = notes.pain_points?.trim();
  const goals = notes.goals?.trim();
  const financeNotes = notes.finance_position?.trim();
  const timelineNotes = notes.timeline?.trim();

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-yellow-600/30 bg-gradient-to-br from-zinc-900 to-zinc-800 p-8">
        <p className="text-base font-bold text-yellow-500 mb-3">Personalised for</p>
        <h2 className="text-3xl font-bold text-zinc-100 mb-4">{name}</h2>
        <p className="text-base text-zinc-300 leading-relaxed">
          Based on what you've shared today, you're an {clientType} looking to move forward in{" "}
          <span className="text-yellow-400 font-medium">{locations}</span>. Here's a summary of
          where you are and what we heard.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {goals && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-base font-bold text-yellow-500 mb-2">Goals</p>
            <p className="text-base text-zinc-300 whitespace-pre-wrap">{goals}</p>
          </div>
        )}
        {financeNotes && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-base font-bold text-yellow-500 mb-2">Finance Position</p>
            <p className="text-base text-zinc-300 whitespace-pre-wrap">{financeNotes}</p>
          </div>
        )}
        {painPoints && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-base font-bold text-yellow-500 mb-2">What's Been Getting in the Way</p>
            <p className="text-base text-zinc-300 whitespace-pre-wrap">{painPoints}</p>
          </div>
        )}
        {timelineNotes && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-base font-bold text-yellow-500 mb-2">Timeline</p>
            <p className="text-base text-zinc-300 whitespace-pre-wrap">{timelineNotes}</p>
          </div>
        )}
      </div>

      {!goals && !financeNotes && !painPoints && !timelineNotes && (
        <div className="text-center py-8 text-zinc-600 text-base">
          Complete the Discovery sections to populate this snapshot.
        </div>
      )}
    </div>
  );
}

function CurrentPosition({ state }: { state: AppState }) {
  const { calc } = state;
  const totals = calculatePortfolioTotals(calc.properties);
  const cashSavings = parseMoney(calc.cashSavings);
  const superBalance = parseMoney(calc.superBalance);
  const sharesValue = parseMoney(calc.sharesValue);
  const otherAssets = parseMoney(calc.otherAssetsValue);
  const otherLiabilities = parseMoney(calc.otherLiabilitiesValue);
  const totalAssets = totals.totalPropertyValue + cashSavings + superBalance + sharesValue + otherAssets;
  const totalDebt = totals.totalLoans + otherLiabilities;
  const netWorth = totalAssets - totalDebt;
  const personOneIncome = parseMoney(calc.personOneIncome);
  const personTwoIncome = calc.householdType === "couple" ? parseMoney(calc.personTwoIncome) : 0;

  const items = [
    { label: "Total Property Value", value: totals.totalPropertyValue, color: "text-yellow-400" },
    { label: "Total Loans", value: totals.totalLoans, color: "text-red-400" },
    { label: "Total Equity", value: totals.totalEquity, color: "text-yellow-400" },
    { label: "Usable Equity", value: totals.totalUsableEquity, color: "text-yellow-300" },
    { label: "Cash Savings", value: cashSavings, color: "text-zinc-100" },
    { label: "Super", value: superBalance, color: "text-zinc-100" },
    { label: "Other Assets", value: sharesValue + otherAssets, color: "text-zinc-100" },
    { label: "Net Worth", value: netWorth, color: netWorth >= 0 ? "text-green-400" : "text-red-400" },
    { label: "Annual Household Income", value: personOneIncome + personTwoIncome, color: "text-yellow-400" },
    { label: "Current Passive Income", value: totals.totalAnnualRent, color: totals.totalAnnualRent > 0 ? "text-green-400" : "text-zinc-500" },
    { label: "Annual Cash Flow", value: totals.totalAnnualCashFlow, color: totals.totalAnnualCashFlow >= 0 ? "text-green-400" : "text-red-400" },
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <p className="text-base font-semibold text-zinc-400 mb-1">Where You Stand Today</p>
        <h2 className="text-2xl font-bold text-zinc-100">Your Current Position</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.label} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-base font-semibold text-zinc-400">{item.label}</p>
            <p className={`text-2xl font-bold mt-1 ${item.color}`}>{formatCurrency(item.value)}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-zinc-600 text-center">Populate the Portfolio Calculator to see your current position.</p>
    </div>
  );
}

function FutureOutcome({ state }: { state: AppState }) {
  const { calc } = state;
  const personOneAge = parseInt(calc.personOneAge) || 0;
  const personOneRetirement = parseInt(calc.personOneRetirementAge) || 65;
  const personTwoAge = parseInt(calc.personTwoAge) || 0;
  const personTwoRetirement = parseInt(calc.personTwoRetirementAge) || 65;

  const yearsToRetirement =
    calc.householdType === "couple"
      ? Math.min(personOneRetirement - personOneAge, personTwoRetirement - personTwoAge)
      : personOneRetirement - personOneAge;

  const retirementAge = calc.householdType === "couple"
    ? Math.min(personOneRetirement, personTwoRetirement)
    : personOneRetirement;

  const growthRate = parseFloat(calc.assumedGrowthRate) || 7;
  const yieldRate = parseFloat(calc.assumedYieldRate) || 5;
  const lifeExpectancy = parseInt(calc.lifeExpectancy) || 85;
  const annualRetirementIncome = parseMoney(calc.annualRetirementIncomeRequired) || 100000;
  const retirement = calculateRetirementProjection(
    calc.properties,
    Math.max(0, yearsToRetirement),
    annualRetirementIncome,
    lifeExpectancy,
    retirementAge,
    growthRate,
    yieldRate
  );

  const isSurplus = retirement.annualPosition >= 0;

  return (
    <div className="space-y-5">
      <div className="text-center mb-4">
        <p className="text-base font-semibold text-zinc-400 mb-1">Looking Ahead</p>
        <h2 className="text-2xl font-bold text-zinc-100">Your Future Outcome</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-yellow-600/30 bg-zinc-900 p-6">
          <p className="text-base font-semibold text-zinc-400">Projected Portfolio Value</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">{formatCurrency(retirement.projectedInvestmentValue)}</p>
          <p className="text-base text-zinc-500 mt-1">At retirement (investment properties)</p>
        </div>
        <div className="rounded-2xl border border-green-600/30 bg-zinc-900 p-6">
          <p className="text-base font-semibold text-zinc-400">Projected Passive Income</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{formatCurrency(retirement.projectedPassiveIncome)}</p>
          <p className="text-base text-zinc-500 mt-1">Annual, at retirement</p>
        </div>
        <div className={`rounded-2xl border ${isSurplus ? "border-green-600/30" : "border-red-600/30"} bg-zinc-900 p-6`}>
          <p className="text-base font-semibold text-zinc-400">Annual {isSurplus ? "Surplus" : "Shortfall"}</p>
          <p className={`text-2xl font-bold mt-1 ${isSurplus ? "text-green-400" : "text-red-400"}`}>
            {formatCurrency(Math.abs(retirement.annualPosition))}
          </p>
          <p className="text-base text-zinc-500 mt-1">vs required {formatCurrency(annualRetirementIncome)}/yr</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-base font-semibold text-zinc-400">Years to Retirement</p>
          <p className="text-2xl font-bold text-zinc-100 mt-1">{Math.max(0, yearsToRetirement)}</p>
          <p className="text-base text-zinc-500 mt-1">Target age {retirementAge}</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-base font-semibold text-zinc-400">Total Income Required</p>
          <p className="text-2xl font-bold text-zinc-100 mt-1">{formatCurrency(retirement.totalIncomeRequired)}</p>
          <p className="text-base text-zinc-500 mt-1">Over {Math.max(0, lifeExpectancy - retirementAge)} yrs of retirement</p>
        </div>
        <div className={`rounded-2xl border ${retirement.lifetimePosition >= 0 ? "border-green-600/30" : "border-red-600/30"} bg-zinc-900 p-6`}>
          <p className="text-base font-semibold text-zinc-400">Lifetime {retirement.lifetimePosition >= 0 ? "Surplus" : "Shortfall"}</p>
          <p className={`text-2xl font-bold mt-1 ${retirement.lifetimePosition >= 0 ? "text-green-400" : "text-red-400"}`}>
            {formatCurrency(Math.abs(retirement.lifetimePosition))}
          </p>
          <p className="text-base text-zinc-500 mt-1">Total over retirement</p>
        </div>
      </div>

      <p className="text-sm text-zinc-600 text-center">
        Projections assume {growthRate}% annual growth and {yieldRate}% yield. For illustration only.
      </p>
    </div>
  );
}

function HowWeHelp() {
  const services = [
    {
      title: "Strategy First",
      description:
        "We don't just find you a property. We build a strategy around your goals, timeline, and financial position before we start searching.",
    },
    {
      title: "Data-Driven Research",
      description:
        "Our team analyses markets using supply and demand data, infrastructure pipelines, population trends, and employment drivers.",
    },
    {
      title: "Off-Market Access",
      description:
        "Through our network of agents and developers, we access properties before they hit the public market.",
    },
    {
      title: "Negotiation & Due Diligence",
      description:
        "We negotiate on your behalf and manage the full due diligence process so you don't overpay or miss critical risks.",
    },
    {
      title: "End-to-End Support",
      description:
        "From first consultation through to settlement and beyond — we're with you at every step.",
    },
    {
      title: "Ongoing Portfolio Growth",
      description:
        "We don't stop at one property. We help you plan and execute your full portfolio acquisition strategy.",
    },
  ];

  return (
    <div className="space-y-5">
      <div className="text-center mb-4">
        <p className="text-base font-semibold text-zinc-400 mb-1">Why Quantum</p>
        <h2 className="text-2xl font-bold text-zinc-100">How We Help You</h2>
        <p className="text-base text-zinc-500 mt-2 max-w-lg mx-auto">
          Access financial freedom through property. Here's what working with Quantum looks like.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((s) => (
          <div
            key={s.title}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 hover:border-yellow-600/40 transition-colors"
          >
            <div className="w-1.5 h-6 bg-yellow-600 rounded-full mb-4" />
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">{s.title}</h3>
            <p className="text-base text-zinc-400 leading-relaxed">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function NextStep({ state, setState }: ConsultTabProps) {
  const set = (key: string, val: string) =>
    setState((s) => ({ ...s, [key]: val }));

  return (
    <div className="space-y-5">
      <div className="text-center mb-4">
        <p className="text-base font-semibold text-zinc-400 mb-1">What Happens Now</p>
        <h2 className="text-2xl font-bold text-zinc-100">Next Step</h2>
      </div>

      <div className="rounded-2xl border border-yellow-600/30 bg-zinc-900 p-8 text-center space-y-5">
        <p className="text-base text-zinc-300 leading-relaxed max-w-lg mx-auto">
          If this makes sense and you're ready to move forward, the next step is to engage Quantum as
          your buyer's agent. We'll lock in your strategy, define your buying criteria, and begin the
          search.
        </p>
        <div className="inline-flex items-center gap-2 bg-yellow-600/20 border border-yellow-600/40 rounded-xl px-5 py-3">
          <span className="text-base font-semibold text-yellow-400">
            Access Financial Freedom Through Property
          </span>
        </div>
      </div>

      <SectionCard title="Consult Decision" subtitle="Document the outcome of this consult">
        <div className="space-y-5">
          <div>
            <label className="text-base font-semibold text-zinc-300 block mb-2">
              Outcome
            </label>
            <select
              value={state.consultDecisionOutcome}
              onChange={(e) => set("consultDecisionOutcome", e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-4 text-lg text-zinc-100 focus:outline-none focus:border-yellow-600"
            >
              <option value="">Select outcome...</option>
              <option value="engaged">Client Engaged ✓</option>
              <option value="follow_up">Follow Up Required</option>
              <option value="not_ready">Not Ready Yet</option>
              <option value="not_a_fit">Not a Fit</option>
            </select>
          </div>
          <div>
            <label className="text-base font-semibold text-zinc-300 block mb-2">
              Notes
            </label>
            <textarea
              value={state.consultNotes}
              onChange={(e) => set("consultNotes", e.target.value)}
              rows={5}
              placeholder="Key points from the consult, agreed next steps, follow up date..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-4 text-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-yellow-600 resize-none"
            />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
