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
      <header className="bg-zinc-900 border-b border-zinc-800 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-600 flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-black text-zinc-900">Q</span>
            </div>
            <div>
              <p className="text-xl font-bold text-zinc-100 leading-tight">Quantum Buyers Agents</p>
              <p className="text-base text-zinc-400 leading-tight">Access financial freedom through property</p>
            </div>
          </div>
          <div className="hidden sm:block h-8 w-px bg-zinc-700" />
          <span className="hidden sm:block text-base text-zinc-500 font-medium">Discovery · Consult · Strategy</span>
        </div>
        {state.clientName && (
          <div className="flex items-center gap-3 bg-zinc-800 border border-zinc-700 rounded-xl px-5 py-3">
            <span className="text-base text-zinc-400">Client:</span>
            <span className="text-base font-bold text-yellow-400">{state.clientName}</span>
          </div>
        )}
      </header>

      <StepNav
        activeStep={state.activeStep}
        onStepChange={(step) => setState((s) => ({ ...s, activeStep: step }))}
      />

      <main className="flex-1 px-8 py-10 max-w-7xl mx-auto w-full">
        {state.activeStep === "discovery" && <DiscoveryTab state={state} setState={setState} />}
        {state.activeStep === "consult" && <ConsultTab state={state} setState={setState} />}
        {state.activeStep === "strategy" && <StrategyTab state={state} setState={setState} />}
      </main>

      <footer className="bg-zinc-900 border-t border-zinc-800 px-8 py-5 flex items-center justify-between">
        <button
          onClick={() => setState((s) => ({ ...s, activeStep: steps[Math.max(0, currentIdx - 1)] }))}
          disabled={currentIdx === 0}
          className="px-7 py-3 text-base font-semibold text-zinc-300 hover:text-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-zinc-700 hover:border-zinc-500 rounded-xl"
        >
          ← Previous
        </button>
        <span className="text-base text-zinc-500 font-medium">Step {currentIdx + 1} of {steps.length}</span>
        <button
          onClick={() => setState((s) => ({ ...s, activeStep: steps[Math.min(steps.length - 1, currentIdx + 1)] }))}
          disabled={currentIdx === steps.length - 1}
          className="px-7 py-3 text-base font-bold bg-yellow-600 text-zinc-900 hover:bg-yellow-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-xl"
        >
          Next →
        </button>
      </footer>
    </div>
  );
}
