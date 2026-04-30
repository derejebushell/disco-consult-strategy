import { useState } from "react";
import { StepNav } from "./components/StepNav";
import { DiscoveryTab } from "./features/discovery/DiscoveryTab";
import { ConsultTab } from "./features/consult/ConsultTab";
import { StrategyTab } from "./features/strategy/StrategyTab";
import type { StepId } from "./components/StepNav";
import type { PropertyAsset } from "./types/property";

export interface CalcState {
  householdType: string; dependants: string; state: string;
  personOneName: string; personOneAge: string; personOneIncome: string; personOneRetirementAge: string;
  personTwoName: string; personTwoAge: string; personTwoIncome: string; personTwoRetirementAge: string;
  properties: PropertyAsset[];
  cashSavings: string; superBalance: string; sharesValue: string;
  otherAssetsValue: string; otherLiabilitiesValue: string; passiveIncomeGoal: string;
  annualRetirementIncomeRequired: string; lifeExpectancy: string;
  assumedGrowthRate: string; assumedYieldRate: string;
}

export interface PerformanceState {
  selectedPropertyIdx: string; growthRate: string; yieldRate: string;
  costFactor: string; selectedLines: string[];
}

export interface StrategyState {
  portfolioVision: string; riskProfile: string; holdingPeriod: string;
  preferredPropertyType: string; clientConstraints: string;
  budgetMin: string; budgetMax: string; strategyType: string;
  yieldFocus: string; growthFocus: string; targetProperties: string;
  locationPlan: string; buyingCriteria: string;
  piePopulation: string; pieInfrastructure: string; pieEmployment: string;
  acquisitionPlan: string; immediateNextSteps: string; milestones: string;
}

export interface OwnerOccupierState {
  fullName: string; age: string; employmentStatus: string; annualIncome: string;
  partnerDetails: string; dependants: string; rentingOrOwning: string;
  currentSuburb: string; timeAtCurrentProperty: string; likesAboutCurrent: string;
  dislikesAboutCurrent: string; whyBuying: string; whatTriggeredSearch: string;
  ifDontBuy: string; lifestyleGoals: string; brokerEngaged: string;
  borrowingCapacity: string; depositAvailable: string; savingsRate: string;
  liabilities: string; preferredLocations: string; propertyType: string;
  bedrooms: string; bathrooms: string; carSpaces: string; landSize: string;
  mustHaves: string; niceToHaves: string; proximityToWork: string; schools: string;
  transport: string; familyNearby: string; futurePlans: string;
  openToRenovation: string; openToOtherSuburbs: string; budgetFlexibility: string;
  whoIsInvolved: string; missedOutBefore: string; blockers: string;
}

export interface InvestorState {
  fullName: string; age: string; employment: string; income: string; partnerIncome: string;
  goalType: string; whyInvesting: string; longTermGoal: string; passiveIncomeGoal: string;
  retirementAge: string; strategyType: string; targetHoldPeriod: string;
  numberOfPropertiesDesired: string; borrowingCapacity: string; deposit: string;
  usableEquity: string; brokerEngaged: string; comfortableNegativeCashFlow: string;
  budgetMin: string; budgetMax: string; locations: string; propertyType: string;
  newVsEstablished: string; yieldExpectation: string; growthExpectation: string;
  riskProfile: string; openToInterstate: string; openToDifferentAssetTypes: string;
  purchaseTimeframe: string; activelySearching: string; madeOffers: string;
  previousExperience: string; challenges: string; blockers: string;
  retirementAgeTarget: string; passiveIncomeTarget: string; holdOrSell: string;
  smsfInvolvement: string;
}

export interface AppState {
  activeStep: StepId;
  activeConsultSection: string;
  clientName: string; clientLocation: string; clientOccupation: string;
  clientType: string; clientIncomeRange: string; clientPreferredLocations: string;
  discoveryNotes: Record<string, string>;
  ownerOccupier: OwnerOccupierState;
  investor: InvestorState;
  calc: CalcState;
  performance: PerformanceState;
  strategy: StrategyState;
  consultDecisionOutcome: string;
  consultNotes: string;
}

function emptyOwnerOccupier(): OwnerOccupierState {
  return {
    fullName: "", age: "", employmentStatus: "", annualIncome: "", partnerDetails: "",
    dependants: "", rentingOrOwning: "", currentSuburb: "", timeAtCurrentProperty: "",
    likesAboutCurrent: "", dislikesAboutCurrent: "", whyBuying: "", whatTriggeredSearch: "",
    ifDontBuy: "", lifestyleGoals: "", brokerEngaged: "", borrowingCapacity: "",
    depositAvailable: "", savingsRate: "", liabilities: "", preferredLocations: "",
    propertyType: "", bedrooms: "", bathrooms: "", carSpaces: "", landSize: "",
    mustHaves: "", niceToHaves: "", proximityToWork: "", schools: "", transport: "",
    familyNearby: "", futurePlans: "", openToRenovation: "", openToOtherSuburbs: "",
    budgetFlexibility: "", whoIsInvolved: "", missedOutBefore: "", blockers: "",
  };
}

function emptyInvestor(): InvestorState {
  return {
    fullName: "", age: "", employment: "", income: "", partnerIncome: "",
    goalType: "", whyInvesting: "", longTermGoal: "", passiveIncomeGoal: "",
    retirementAge: "", strategyType: "", targetHoldPeriod: "", numberOfPropertiesDesired: "",
    borrowingCapacity: "", deposit: "", usableEquity: "", brokerEngaged: "",
    comfortableNegativeCashFlow: "", budgetMin: "", budgetMax: "", locations: "",
    propertyType: "", newVsEstablished: "", yieldExpectation: "", growthExpectation: "",
    riskProfile: "", openToInterstate: "", openToDifferentAssetTypes: "",
    purchaseTimeframe: "", activelySearching: "", madeOffers: "", previousExperience: "",
    challenges: "", blockers: "", retirementAgeTarget: "", passiveIncomeTarget: "",
    holdOrSell: "", smsfInvolvement: "",
  };
}

const initialState: AppState = {
  activeStep: "discovery",
  activeConsultSection: "journey",
  clientName: "", clientLocation: "", clientOccupation: "",
  clientType: "investor", clientIncomeRange: "", clientPreferredLocations: "",
  discoveryNotes: {},
  ownerOccupier: emptyOwnerOccupier(),
  investor: emptyInvestor(),
  calc: {
    householdType: "single", dependants: "", state: "QLD",
    personOneName: "", personOneAge: "", personOneIncome: "", personOneRetirementAge: "60",
    personTwoName: "", personTwoAge: "", personTwoIncome: "", personTwoRetirementAge: "60",
    properties: [],
    cashSavings: "", superBalance: "", sharesValue: "",
    otherAssetsValue: "", otherLiabilitiesValue: "", passiveIncomeGoal: "",
    annualRetirementIncomeRequired: "100000", lifeExpectancy: "85",
    assumedGrowthRate: "7", assumedYieldRate: "5",
  },
  performance: {
    selectedPropertyIdx: "0", growthRate: "7", yieldRate: "5",
    costFactor: "100", selectedLines: ["totalPerformance", "equityGrowth"],
  },
  strategy: {
    portfolioVision: "", riskProfile: "", holdingPeriod: "",
    preferredPropertyType: "", clientConstraints: "",
    budgetMin: "", budgetMax: "", strategyType: "",
    yieldFocus: "", growthFocus: "", targetProperties: "",
    locationPlan: "", buyingCriteria: "",
    piePopulation: "", pieInfrastructure: "", pieEmployment: "",
    acquisitionPlan: "", immediateNextSteps: "", milestones: "",
  },
  consultDecisionOutcome: "", consultNotes: "",
};

export default function QuantumDiscoveryApp() {
  const [state, setState] = useState<AppState>(initialState);
  const steps: StepId[] = ["discovery", "consult", "strategy"];
  const currentIdx = steps.indexOf(state.activeStep);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <header className="bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-yellow-600 flex items-center justify-center">
              <span className="text-xs font-black text-zinc-900">Q</span>
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-100 leading-none">Quantum</p>
              <p className="text-xs text-zinc-500 leading-none">Buyers Agents</p>
            </div>
          </div>
          <div className="hidden sm:block h-4 w-px bg-zinc-700" />
          <span className="hidden sm:block text-xs text-zinc-600">Discovery · Consult · Strategy</span>
        </div>
        {state.clientName && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Client:</span>
            <span className="text-xs font-semibold text-yellow-400">{state.clientName}</span>
          </div>
        )}
      </header>

      <StepNav
        activeStep={state.activeStep}
        onStepChange={(step) => setState((s) => ({ ...s, activeStep: step }))}
      />

      <main className="flex-1 px-4 py-6 max-w-6xl mx-auto w-full">
        {state.activeStep === "discovery" && <DiscoveryTab state={state} setState={setState} />}
        {state.activeStep === "consult" && <ConsultTab state={state} setState={setState} />}
        {state.activeStep === "strategy" && <StrategyTab state={state} setState={setState} />}
      </main>

      <footer className="bg-zinc-900 border-t border-zinc-800 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setState((s) => ({ ...s, activeStep: steps[Math.max(0, currentIdx - 1)] }))}
          disabled={currentIdx === 0}
          className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-zinc-800 hover:border-zinc-700 rounded-lg"
        >
          ← Previous
        </button>
        <span className="text-xs text-zinc-600">Step {currentIdx + 1} of {steps.length}</span>
        <button
          onClick={() => setState((s) => ({ ...s, activeStep: steps[Math.min(steps.length - 1, currentIdx + 1)] }))}
          disabled={currentIdx === steps.length - 1}
          className="px-4 py-2 text-xs font-semibold bg-yellow-600 text-zinc-900 hover:bg-yellow-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-lg"
        >
          Next →
        </button>
      </footer>
    </div>
  );
}
