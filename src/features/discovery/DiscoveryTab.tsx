import React, { useState } from "react";
import { MessageSquare, ChevronRight, ChevronLeft, CheckCircle2, StickyNote } from "lucide-react";
import { SectionCard } from "../../components/SectionCard";
import { Field, Input, Select, Textarea } from "../../components/Field";
import { discoverySections } from "./discoveryFlow";
import type { AppState } from "../../App";

interface DiscoveryTabProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const clientTypeOptions = [
  { value: "investor", label: "Investor" },
  { value: "owner_occupier", label: "Owner Occupier" },
];

export function DiscoveryTab({ state, setState }: DiscoveryTabProps) {
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const section = discoverySections[activeSectionIdx];
  const notes = state.discoveryNotes;

  const setNote = (id: string, value: string) => {
    setState((s) => ({
      ...s,
      discoveryNotes: { ...s.discoveryNotes, [id]: value },
    }));
  };

  const setForm = (key: string, value: string) => {
    setState((s) => ({ ...s, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Client snapshot header */}
      <SectionCard title="Client Snapshot" subtitle="Basic client information">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Field label="Full Name">
            <Input
              value={state.clientName}
              onChange={(e) => setForm("clientName", e.target.value)}
              placeholder="Jane Smith"
            />
          </Field>
          <Field label="Location">
            <Input
              value={state.clientLocation}
              onChange={(e) => setForm("clientLocation", e.target.value)}
              placeholder="Brisbane, QLD"
            />
          </Field>
          <Field label="Occupation">
            <Input
              value={state.clientOccupation}
              onChange={(e) => setForm("clientOccupation", e.target.value)}
              placeholder="Engineer"
            />
          </Field>
          <Field label="Client Type">
            <Select
              value={state.clientType}
              onChange={(e) => setForm("clientType", e.target.value)}
              options={clientTypeOptions}
              placeholder="Select type..."
            />
          </Field>
          <Field label="Income Range">
            <Input
              value={state.clientIncomeRange}
              onChange={(e) => setForm("clientIncomeRange", e.target.value)}
              placeholder="$100k – $150k"
            />
          </Field>
          <Field label="Preferred Locations">
            <Input
              value={state.clientPreferredLocations}
              onChange={(e) => setForm("clientPreferredLocations", e.target.value)}
              placeholder="Brisbane, Gold Coast"
            />
          </Field>
        </div>
      </SectionCard>

      {/* Discovery call guide */}
      <div className="flex gap-5">
        {/* Section sidebar */}
        <div className="hidden md:flex flex-col gap-1 w-56 flex-shrink-0">
          {discoverySections.map((s, i) => {
            const hasNote = !!(notes[s.id] && notes[s.id].trim());
            const isActive = i === activeSectionIdx;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSectionIdx(i)}
                className={`flex items-center gap-3 text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-yellow-600/20 text-yellow-400 border border-yellow-600/40"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0 ${
                    hasNote
                      ? "bg-green-600/20 border-green-500 text-green-400"
                      : isActive
                      ? "border-yellow-500 text-yellow-400"
                      : "border-zinc-700 text-zinc-500"
                  }`}
                >
                  {hasNote ? <CheckCircle2 size={12} /> : i + 1}
                </span>
                <span className="truncate">{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Main section panel */}
        <div className="flex-1 min-w-0">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
            {/* Section header */}
            <div className="px-6 py-5 border-b border-zinc-800 bg-zinc-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-yellow-500">
                    Step {activeSectionIdx + 1} of {discoverySections.length}
                  </span>
                  <h3 className="text-xl font-bold text-zinc-100 mt-1">
                    {section.title}
                  </h3>
                  <p className="text-sm text-zinc-400 mt-1">{section.purpose}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Script if present */}
              {section.script && (
                <div className="bg-zinc-800/60 border border-yellow-600/20 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare size={16} className="text-yellow-500" />
                    <span className="text-sm font-bold text-yellow-500 uppercase tracking-wide">
                      Suggested Script
                    </span>
                  </div>
                  <p className="text-base text-zinc-300 leading-relaxed italic">{section.script}</p>
                </div>
              )}

              {/* Questions */}
              {section.questions && section.questions.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-zinc-400 uppercase tracking-wide mb-3">
                    Questions to Ask
                  </p>
                  <ul className="space-y-3">
                    {section.questions.map((q, i) => (
                      <li key={i} className="flex items-start gap-3 text-base text-zinc-200">
                        <span className="text-yellow-500 mt-0.5 flex-shrink-0 text-lg leading-none">›</span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Listen for */}
              {section.listenFor && section.listenFor.length > 0 && (
                <div className="bg-blue-950/30 border border-blue-800/30 rounded-xl p-5">
                  <p className="text-sm font-bold text-blue-400 uppercase tracking-wide mb-3">
                    Listen For
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {section.listenFor.map((item, i) => (
                      <span
                        key={i}
                        className="text-sm bg-blue-900/30 border border-blue-700/30 text-blue-300 rounded-full px-3 py-1.5"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes area */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <StickyNote size={15} className="text-zinc-400" />
                  <p className="text-sm font-bold text-zinc-400">
                    Consultant Notes
                  </p>
                </div>
                <Textarea
                  value={notes[section.id] || ""}
                  onChange={(e) => setNote(section.id, e.target.value)}
                  placeholder={`Notes for ${section.title.toLowerCase()}...`}
                  rows={4}
                />
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setActiveSectionIdx((i) => Math.max(0, i - 1))}
                  disabled={activeSectionIdx === 0}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-zinc-700 hover:border-zinc-500 rounded-lg"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                {/* Mobile section indicator */}
                <div className="flex gap-1.5 md:hidden">
                  {discoverySections.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveSectionIdx(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${
                        i === activeSectionIdx ? "bg-yellow-500" : "bg-zinc-700"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() =>
                    setActiveSectionIdx((i) =>
                      Math.min(discoverySections.length - 1, i + 1)
                    )
                  }
                  disabled={activeSectionIdx === discoverySections.length - 1}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-zinc-900 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-lg"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client type specific questionnaire */}
      {state.clientType === "owner_occupier" ? (
        <OwnerOccupierForm state={state} setState={setState} />
      ) : (
        <InvestorForm state={state} setState={setState} />
      )}
    </div>
  );
}

function OwnerOccupierForm({ state, setState }: DiscoveryTabProps) {
  const f = state.ownerOccupier;
  const set = (key: string, val: string) =>
    setState((s) => ({
      ...s,
      ownerOccupier: { ...s.ownerOccupier, [key]: val },
    }));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pt-2">
        <div className="h-px flex-1 bg-zinc-800" />
        <span className="text-sm text-zinc-400 font-semibold">
          Owner Occupier Questionnaire
        </span>
        <div className="h-px flex-1 bg-zinc-800" />
      </div>

      <SectionCard title="Personal Information" collapsible defaultOpen>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Field label="Full Name"><Input value={f.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Jane Smith" /></Field>
          <Field label="Age"><Input type="number" value={f.age} onChange={(e) => set("age", e.target.value)} placeholder="35" /></Field>
          <Field label="Employment Status"><Input value={f.employmentStatus} onChange={(e) => set("employmentStatus", e.target.value)} placeholder="Full-time employed" /></Field>
          <Field label="Annual Income"><Input value={f.annualIncome} onChange={(e) => set("annualIncome", e.target.value)} placeholder="$120,000" /></Field>
          <Field label="Partner Details"><Input value={f.partnerDetails} onChange={(e) => set("partnerDetails", e.target.value)} placeholder="Nurse, $90k income" /></Field>
          <Field label="Dependants"><Input value={f.dependants} onChange={(e) => set("dependants", e.target.value)} placeholder="2 children" /></Field>
        </div>
      </SectionCard>

      <SectionCard title="Current Living Situation" collapsible defaultOpen>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Field label="Renting or Owning">
            <Select value={f.rentingOrOwning} onChange={(e) => set("rentingOrOwning", e.target.value)} options={[{value:"renting",label:"Renting"},{value:"owning",label:"Owning"}]} placeholder="Select..." />
          </Field>
          <Field label="Current Suburb"><Input value={f.currentSuburb} onChange={(e) => set("currentSuburb", e.target.value)} placeholder="Newstead, QLD" /></Field>
          <Field label="Time at Current Property"><Input value={f.timeAtCurrentProperty} onChange={(e) => set("timeAtCurrentProperty", e.target.value)} placeholder="2 years" /></Field>
          <Field label="What They Like" className="sm:col-span-2 lg:col-span-1"><Textarea value={f.likesAboutCurrent} onChange={(e) => set("likesAboutCurrent", e.target.value)} placeholder="Close to work, good schools..." /></Field>
          <Field label="What They Dislike" className="sm:col-span-2 lg:col-span-1"><Textarea value={f.dislikesAboutCurrent} onChange={(e) => set("dislikesAboutCurrent", e.target.value)} placeholder="Too small, no yard..." /></Field>
        </div>
      </SectionCard>

      <SectionCard title="Purchase Motivation" collapsible defaultOpen>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Why Are They Buying?"><Textarea value={f.whyBuying} onChange={(e) => set("whyBuying", e.target.value)} placeholder="Tired of renting, want stability..." /></Field>
          <Field label="What Triggered the Search?"><Textarea value={f.whatTriggeredSearch} onChange={(e) => set("whatTriggeredSearch", e.target.value)} placeholder="New baby, lease ending..." /></Field>
          <Field label="What Happens If They Don't Buy?"><Textarea value={f.ifDontBuy} onChange={(e) => set("ifDontBuy", e.target.value)} placeholder="Keep renting, losing money..." /></Field>
          <Field label="Lifestyle Goals"><Textarea value={f.lifestyleGoals} onChange={(e) => set("lifestyleGoals", e.target.value)} placeholder="Space for kids, home office..." /></Field>
        </div>
      </SectionCard>

      <SectionCard title="Finance" collapsible defaultOpen>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Field label="Broker Engaged?">
            <Select value={f.brokerEngaged} onChange={(e) => set("brokerEngaged", e.target.value)} options={[{value:"yes",label:"Yes"},{value:"no",label:"No"},{value:"looking",label:"Looking"}]} placeholder="Select..." />
          </Field>
          <Field label="Borrowing Capacity"><Input value={f.borrowingCapacity} onChange={(e) => set("borrowingCapacity", e.target.value)} placeholder="$750,000" /></Field>
          <Field label="Deposit Available"><Input value={f.depositAvailable} onChange={(e) => set("depositAvailable", e.target.value)} placeholder="$120,000" /></Field>
          <Field label="Savings Rate (p/m)"><Input value={f.savingsRate} onChange={(e) => set("savingsRate", e.target.value)} placeholder="$2,000/month" /></Field>
          <Field label="Other Liabilities" className="sm:col-span-2 lg:col-span-2"><Input value={f.liabilities} onChange={(e) => set("liabilities", e.target.value)} placeholder="Car loan $15k, HECS $30k" /></Field>
        </div>
      </SectionCard>

      <SectionCard title="Property Requirements" collapsible defaultOpen>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Field label="Preferred Locations"><Input value={f.preferredLocations} onChange={(e) => set("preferredLocations", e.target.value)} placeholder="Northside Brisbane" /></Field>
          <Field label="Property Type"><Input value={f.propertyType} onChange={(e) => set("propertyType", e.target.value)} placeholder="House" /></Field>
          <Field label="Bedrooms"><Input value={f.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} placeholder="3–4" /></Field>
          <Field label="Bathrooms"><Input value={f.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} placeholder="2" /></Field>
          <Field label="Car Spaces"><Input value={f.carSpaces} onChange={(e) => set("carSpaces", e.target.value)} placeholder="2" /></Field>
          <Field label="Land Size"><Input value={f.landSize} onChange={(e) => set("landSize", e.target.value)} placeholder="500sqm+" /></Field>
          <Field label="Must Haves" className="sm:col-span-2"><Textarea value={f.mustHaves} onChange={(e) => set("mustHaves", e.target.value)} placeholder="Good school zone, 2 bathrooms..." /></Field>
          <Field label="Nice to Haves"><Textarea value={f.niceToHaves} onChange={(e) => set("niceToHaves", e.target.value)} placeholder="Pool, home theatre..." /></Field>
        </div>
      </SectionCard>

      <SectionCard title="Lifestyle & Decision Making" collapsible>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Field label="Proximity to Work"><Input value={f.proximityToWork} onChange={(e) => set("proximityToWork", e.target.value)} placeholder="<30 min commute" /></Field>
          <Field label="Schools"><Input value={f.schools} onChange={(e) => set("schools", e.target.value)} placeholder="Specific school zone" /></Field>
          <Field label="Transport"><Input value={f.transport} onChange={(e) => set("transport", e.target.value)} placeholder="Near train line" /></Field>
          <Field label="Family Nearby"><Input value={f.familyNearby} onChange={(e) => set("familyNearby", e.target.value)} placeholder="Yes, parents in Chermside" /></Field>
          <Field label="Future Plans"><Textarea value={f.futurePlans} onChange={(e) => set("futurePlans", e.target.value)} placeholder="May expand family, might move interstate in 5 years..." /></Field>
          <Field label="Open to Renovation?">
            <Select value={f.openToRenovation} onChange={(e) => set("openToRenovation", e.target.value)} options={[{value:"yes",label:"Yes"},{value:"no",label:"No"},{value:"minor",label:"Minor only"}]} placeholder="Select..." />
          </Field>
          <Field label="Open to Other Suburbs?">
            <Select value={f.openToOtherSuburbs} onChange={(e) => set("openToOtherSuburbs", e.target.value)} options={[{value:"yes",label:"Yes"},{value:"no",label:"No"},{value:"maybe",label:"Maybe"}]} placeholder="Select..." />
          </Field>
          <Field label="Budget Flexibility"><Input value={f.budgetFlexibility} onChange={(e) => set("budgetFlexibility", e.target.value)} placeholder="Could stretch to $850k for the right property" /></Field>
          <Field label="Who Is Involved?"><Input value={f.whoIsInvolved} onChange={(e) => set("whoIsInvolved", e.target.value)} placeholder="Myself and partner" /></Field>
          <Field label="Missed Out Before?">
            <Select value={f.missedOutBefore} onChange={(e) => set("missedOutBefore", e.target.value)} options={[{value:"yes",label:"Yes"},{value:"no",label:"No"}]} placeholder="Select..." />
          </Field>
          <Field label="Key Blockers"><Textarea value={f.blockers} onChange={(e) => set("blockers", e.target.value)} placeholder="Not sure what suburb is best value..." /></Field>
        </div>
      </SectionCard>
    </div>
  );
}

function InvestorForm({ state, setState }: DiscoveryTabProps) {
  const f = state.investor;
  const set = (key: string, val: string) =>
    setState((s) => ({
      ...s,
      investor: { ...s.investor, [key]: val },
    }));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pt-2">
        <div className="h-px flex-1 bg-zinc-800" />
        <span className="text-sm text-zinc-400 font-semibold">
          Investor Questionnaire
        </span>
        <div className="h-px flex-1 bg-zinc-800" />
      </div>

      <SectionCard title="Personal Snapshot" collapsible defaultOpen>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Field label="Full Name"><Input value={f.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Jane Smith" /></Field>
          <Field label="Age"><Input type="number" value={f.age} onChange={(e) => set("age", e.target.value)} placeholder="42" /></Field>
          <Field label="Employment"><Input value={f.employment} onChange={(e) => set("employment", e.target.value)} placeholder="Full-time — IT Manager" /></Field>
          <Field label="Income"><Input value={f.income} onChange={(e) => set("income", e.target.value)} placeholder="$180,000" /></Field>
          <Field label="Partner Income"><Input value={f.partnerIncome} onChange={(e) => set("partnerIncome", e.target.value)} placeholder="$90,000" /></Field>
        </div>
      </SectionCard>

      <SectionCard title="Investment Goals" collapsible defaultOpen>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Primary Goal">
            <Select value={f.goalType} onChange={(e) => set("goalType", e.target.value)} options={[{value:"capital_growth",label:"Capital Growth"},{value:"cash_flow",label:"Cash Flow"},{value:"balanced",label:"Balanced"}]} placeholder="Select goal..." />
          </Field>
          <Field label="Why Investing?"><Textarea value={f.whyInvesting} onChange={(e) => set("whyInvesting", e.target.value)} placeholder="Want to retire at 55 with passive income..." /></Field>
          <Field label="Long Term Goal"><Textarea value={f.longTermGoal} onChange={(e) => set("longTermGoal", e.target.value)} placeholder="Build a $3M portfolio by 55..." /></Field>
          <Field label="Passive Income Target (annual)"><Input value={f.passiveIncomeGoal} onChange={(e) => set("passiveIncomeGoal", e.target.value)} placeholder="$100,000/year" /></Field>
          <Field label="Target Retirement Age"><Input type="number" value={f.retirementAge} onChange={(e) => set("retirementAge", e.target.value)} placeholder="55" /></Field>
        </div>
      </SectionCard>

      <SectionCard title="Strategy" collapsible defaultOpen>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Field label="Strategy Type">
            <Select value={f.strategyType} onChange={(e) => set("strategyType", e.target.value)} options={[{value:"buy_hold",label:"Buy and Hold"},{value:"value_add",label:"Value Add"},{value:"development",label:"Development"}]} placeholder="Select..." />
          </Field>
          <Field label="Target Hold Period"><Input value={f.targetHoldPeriod} onChange={(e) => set("targetHoldPeriod", e.target.value)} placeholder="10+ years" /></Field>
          <Field label="# Properties Desired"><Input type="number" value={f.numberOfPropertiesDesired} onChange={(e) => set("numberOfPropertiesDesired", e.target.value)} placeholder="5" /></Field>
        </div>
      </SectionCard>

      <SectionCard title="Financial Position" collapsible defaultOpen>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Field label="Borrowing Capacity"><Input value={f.borrowingCapacity} onChange={(e) => set("borrowingCapacity", e.target.value)} placeholder="$1,200,000" /></Field>
          <Field label="Available Deposit"><Input value={f.deposit} onChange={(e) => set("deposit", e.target.value)} placeholder="$150,000" /></Field>
          <Field label="Usable Equity"><Input value={f.usableEquity} onChange={(e) => set("usableEquity", e.target.value)} placeholder="$200,000" /></Field>
          <Field label="Broker Engaged?">
            <Select value={f.brokerEngaged} onChange={(e) => set("brokerEngaged", e.target.value)} options={[{value:"yes",label:"Yes"},{value:"no",label:"No"},{value:"looking",label:"Looking"}]} placeholder="Select..." />
          </Field>
          <Field label="Comfortable with Negative Cash Flow?">
            <Select value={f.comfortableNegativeCashFlow} onChange={(e) => set("comfortableNegativeCashFlow", e.target.value)} options={[{value:"yes",label:"Yes"},{value:"no",label:"No"},{value:"depends",label:"Depends on amount"}]} placeholder="Select..." />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Criteria & Risk Profile" collapsible>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Field label="Budget Min"><Input value={f.budgetMin} onChange={(e) => set("budgetMin", e.target.value)} placeholder="$500,000" /></Field>
          <Field label="Budget Max"><Input value={f.budgetMax} onChange={(e) => set("budgetMax", e.target.value)} placeholder="$800,000" /></Field>
          <Field label="Target Locations"><Input value={f.locations} onChange={(e) => set("locations", e.target.value)} placeholder="SE QLD, regional VIC" /></Field>
          <Field label="Property Type"><Input value={f.propertyType} onChange={(e) => set("propertyType", e.target.value)} placeholder="House" /></Field>
          <Field label="New vs Established">
            <Select value={f.newVsEstablished} onChange={(e) => set("newVsEstablished", e.target.value)} options={[{value:"new",label:"New"},{value:"established",label:"Established"},{value:"either",label:"Either"}]} placeholder="Select..." />
          </Field>
          <Field label="Risk Profile">
            <Select value={f.riskProfile} onChange={(e) => set("riskProfile", e.target.value)} options={[{value:"low",label:"Low"},{value:"medium",label:"Medium"},{value:"high",label:"High"}]} placeholder="Select..." />
          </Field>
          <Field label="Open to Interstate?">
            <Select value={f.openToInterstate} onChange={(e) => set("openToInterstate", e.target.value)} options={[{value:"yes",label:"Yes"},{value:"no",label:"No"},{value:"maybe",label:"Maybe"}]} placeholder="Select..." />
          </Field>
          <Field label="Open to Different Asset Types?">
            <Select value={f.openToDifferentAssetTypes} onChange={(e) => set("openToDifferentAssetTypes", e.target.value)} options={[{value:"yes",label:"Yes"},{value:"no",label:"No"},{value:"maybe",label:"Maybe"}]} placeholder="Select..." />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Timeline & Experience" collapsible>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Purchase Timeframe"><Input value={f.purchaseTimeframe} onChange={(e) => set("purchaseTimeframe", e.target.value)} placeholder="3–6 months" /></Field>
          <Field label="Actively Searching?">
            <Select value={f.activelySearching} onChange={(e) => set("activelySearching", e.target.value)} options={[{value:"yes",label:"Yes"},{value:"no",label:"No"}]} placeholder="Select..." />
          </Field>
          <Field label="Made Any Offers?">
            <Select value={f.madeOffers} onChange={(e) => set("madeOffers", e.target.value)} options={[{value:"yes",label:"Yes"},{value:"no",label:"No"}]} placeholder="Select..." />
          </Field>
          <Field label="Previous Investing Experience"><Textarea value={f.previousExperience} onChange={(e) => set("previousExperience", e.target.value)} placeholder="Owns 1 property in Brisbane purchased 2018..." /></Field>
          <Field label="Key Challenges"><Textarea value={f.challenges} onChange={(e) => set("challenges", e.target.value)} placeholder="Unsure which market to target next..." /></Field>
          <Field label="Key Blockers"><Textarea value={f.blockers} onChange={(e) => set("blockers", e.target.value)} placeholder="Waiting for broker confirmation on capacity..." /></Field>
        </div>
      </SectionCard>

      <SectionCard title="Exit / Long Term Plan" collapsible>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Field label="Target Retirement Age"><Input type="number" value={f.retirementAgeTarget} onChange={(e) => set("retirementAgeTarget", e.target.value)} placeholder="55" /></Field>
          <Field label="Passive Income Target (p.a.)"><Input value={f.passiveIncomeTarget} onChange={(e) => set("passiveIncomeTarget", e.target.value)} placeholder="$150,000" /></Field>
          <Field label="Hold or Sell Long Term?">
            <Select value={f.holdOrSell} onChange={(e) => set("holdOrSell", e.target.value)} options={[{value:"hold",label:"Hold long term"},{value:"sell",label:"Sell down at retirement"},{value:"mix",label:"Mix of both"}]} placeholder="Select..." />
          </Field>
          <Field label="SMSF Involvement?">
            <Select value={f.smsfInvolvement} onChange={(e) => set("smsfInvolvement", e.target.value)} options={[{value:"yes",label:"Yes"},{value:"no",label:"No"},{value:"considering",label:"Considering"}]} placeholder="Select..." />
          </Field>
        </div>
      </SectionCard>
    </div>
  );
}
