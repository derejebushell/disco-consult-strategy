import React from "react";
import { SectionCard } from "../../components/SectionCard";
import { Field, Input, Select, Textarea } from "../../components/Field";
import type { AppState } from "../../App";

interface StrategyTabProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export function StrategyTab({ state, setState }: StrategyTabProps) {
  const { strategy } = state;
  const set = (key: string, val: string) =>
    setState((s) => ({ ...s, strategy: { ...s.strategy, [key]: val } }));

  return (
    <div className="space-y-5">
      <div className="text-center mb-2">
        <p className="text-base font-semibold text-zinc-400 mb-1">Post Sign-On</p>
        <h2 className="text-3xl font-bold text-zinc-100">Strategy Plan</h2>
        <p className="text-base text-zinc-500 mt-2 max-w-lg mx-auto">
          Build the client's acquisition strategy after they've engaged Quantum.
        </p>
      </div>

      {/* Client Vision */}
      <SectionCard title="Client Vision & Risk Profile">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Field label="Portfolio Vision" className="sm:col-span-2 lg:col-span-3">
            <Textarea
              value={strategy.portfolioVision}
              onChange={(e) => set("portfolioVision", e.target.value)}
              rows={3}
              placeholder="e.g. Build a $3M portfolio by age 55 focused on SE QLD growth markets..."
            />
          </Field>
          <Field label="Risk Profile">
            <Select
              value={strategy.riskProfile}
              onChange={(e) => set("riskProfile", e.target.value)}
              options={[
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
              ]}
              placeholder="Select..."
            />
          </Field>
          <Field label="Target Holding Period">
            <Input
              value={strategy.holdingPeriod}
              onChange={(e) => set("holdingPeriod", e.target.value)}
              placeholder="10+ years"
            />
          </Field>
          <Field label="Preferred Property Type">
            <Input
              value={strategy.preferredPropertyType}
              onChange={(e) => set("preferredPropertyType", e.target.value)}
              placeholder="Houses, townhouses"
            />
          </Field>
          <Field label="Client Notes / Constraints" className="sm:col-span-2 lg:col-span-3">
            <Textarea
              value={strategy.clientConstraints}
              onChange={(e) => set("clientConstraints", e.target.value)}
              rows={2}
              placeholder="Any constraints, non-negotiables, or family considerations..."
            />
          </Field>
        </div>
      </SectionCard>

      {/* Buying Strategy */}
      <SectionCard title="Buying Strategy">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Field label="Budget Min">
            <Input
              value={strategy.budgetMin}
              onChange={(e) => set("budgetMin", e.target.value)}
              placeholder="$500,000"
            />
          </Field>
          <Field label="Budget Max">
            <Input
              value={strategy.budgetMax}
              onChange={(e) => set("budgetMax", e.target.value)}
              placeholder="$800,000"
            />
          </Field>
          <Field label="Strategy Type">
            <Select
              value={strategy.strategyType}
              onChange={(e) => set("strategyType", e.target.value)}
              options={[
                { value: "buy_hold", label: "Buy and Hold" },
                { value: "value_add", label: "Value Add / Reno" },
                { value: "development", label: "Development" },
                { value: "balanced", label: "Balanced" },
              ]}
              placeholder="Select..."
            />
          </Field>
          <Field label="Yield Focus (%)">
            <Input
              type="number"
              step="0.5"
              value={strategy.yieldFocus}
              onChange={(e) => set("yieldFocus", e.target.value)}
              placeholder="5"
            />
          </Field>
          <Field label="Growth Focus (%)">
            <Input
              type="number"
              step="0.5"
              value={strategy.growthFocus}
              onChange={(e) => set("growthFocus", e.target.value)}
              placeholder="7"
            />
          </Field>
          <Field label="Target # of Properties">
            <Input
              type="number"
              value={strategy.targetProperties}
              onChange={(e) => set("targetProperties", e.target.value)}
              placeholder="5"
            />
          </Field>
          <Field label="Target Locations" className="sm:col-span-2 lg:col-span-3">
            <Textarea
              value={strategy.locationPlan}
              onChange={(e) => set("locationPlan", e.target.value)}
              rows={2}
              placeholder="SE QLD — focus on Ipswich, Logan, Moreton Bay. Consider regional VIC for yield play..."
            />
          </Field>
          <Field label="Buying Criteria" className="sm:col-span-2 lg:col-span-3">
            <Textarea
              value={strategy.buyingCriteria}
              onChange={(e) => set("buyingCriteria", e.target.value)}
              rows={3}
              placeholder="Houses on 400sqm+, established, within 30km of a major employment hub, 5%+ yield, strong rental demand..."
            />
          </Field>
        </div>
      </SectionCard>

      {/* PIE Framework */}
      <SectionCard title="Market Analysis — PIE Framework" subtitle="Population · Infrastructure · Employment" collapsible>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="space-y-2">
            <p className="text-base font-bold text-yellow-500 mb-2">Population</p>
            <Textarea
              value={strategy.piePopulation}
              onChange={(e) => set("piePopulation", e.target.value)}
              rows={4}
              placeholder="Population growth trends, net migration, demographics..."
            />
          </div>
          <div className="space-y-2">
            <p className="text-base font-bold text-yellow-500 mb-2">Infrastructure</p>
            <Textarea
              value={strategy.pieInfrastructure}
              onChange={(e) => set("pieInfrastructure", e.target.value)}
              rows={4}
              placeholder="Major infrastructure pipeline, transport, schools, hospitals..."
            />
          </div>
          <div className="space-y-2">
            <p className="text-base font-bold text-yellow-500 mb-2">Employment</p>
            <Textarea
              value={strategy.pieEmployment}
              onChange={(e) => set("pieEmployment", e.target.value)}
              rows={4}
              placeholder="Major employers, industry diversification, unemployment rate..."
            />
          </div>
        </div>
      </SectionCard>

      {/* Acquisition Plan */}
      <SectionCard title="Acquisition Plan & Next Steps">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Acquisition Plan" className="sm:col-span-2">
            <Textarea
              value={strategy.acquisitionPlan}
              onChange={(e) => set("acquisitionPlan", e.target.value)}
              rows={5}
              placeholder="Phase 1: Purchase first investment by Q3 2025 in SE QLD. Budget $650–700K. Target house, 5%+ yield. Leverage $200K equity from PPOR as deposit.&#10;&#10;Phase 2: Reassess borrowing capacity 12 months post-settlement..."
            />
          </Field>
          <Field label="Immediate Next Steps">
            <Textarea
              value={strategy.immediateNextSteps}
              onChange={(e) => set("immediateNextSteps", e.target.value)}
              rows={4}
              placeholder="1. Refer to broker for formal pre-approval&#10;2. Sign engagement agreement&#10;3. Brief sent within 5 days&#10;4. Search begins immediately"
            />
          </Field>
          <Field label="Key Milestones & Dates">
            <Textarea
              value={strategy.milestones}
              onChange={(e) => set("milestones", e.target.value)}
              rows={4}
              placeholder="Pre-approval: by 15 May&#10;Brief delivered: by 20 May&#10;First shortlist: within 3 weeks&#10;Target settlement: Q3 2025"
            />
          </Field>
        </div>
      </SectionCard>

      {/* Disclaimer */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <p className="text-sm text-zinc-600 leading-relaxed">
          This strategy document is prepared for discussion purposes only. It is not financial advice, tax advice, or a credit assessment. All projections are estimates. Investment performance is not guaranteed. Borrowing capacity must be confirmed by a licensed mortgage broker. Tax implications should be discussed with your accountant.
        </p>
      </div>
    </div>
  );
}
