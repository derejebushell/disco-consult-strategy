export type ClientType = "owner_occupier" | "investor";

export interface Person {
  name: string;
  age: number;
  employmentType: string;
  annualGrossIncome: number;
  targetRetirementAge: number;
}

export interface Client {
  fullName: string;
  location: string;
  occupation: string;
  incomeRange: string;
  clientType: ClientType;
}

export interface Household {
  householdType: "single" | "couple";
  dependants: number;
  state: string;
  personOne: Person;
  personTwo: Person;
}

export interface DiscoveryNotes {
  opening: string;
  currentSituation: string;
  financePosition: string;
  goals: string;
  timeline: string;
  searchExperience: string;
  painPoints: string;
  propertyCriteria: string;
  qualification: string;
}

export interface OwnerOccupierAnswers {
  // Personal
  fullName: string;
  age: string;
  employmentStatus: string;
  annualIncome: string;
  partnerDetails: string;
  dependants: string;
  // Current living
  rentingOrOwning: string;
  currentSuburb: string;
  timeAtCurrentProperty: string;
  likesAboutCurrent: string;
  dislikesAboutCurrent: string;
  // Purchase motivation
  whyBuying: string;
  whatTriggeredSearch: string;
  ifDontBuy: string;
  lifestyleGoals: string;
  // Finance
  brokerEngaged: string;
  borrowingCapacity: string;
  depositAvailable: string;
  savingsRate: string;
  liabilities: string;
  // Property requirements
  preferredLocations: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  carSpaces: string;
  landSize: string;
  mustHaves: string;
  niceToHaves: string;
  // Lifestyle
  proximityToWork: string;
  schools: string;
  transport: string;
  familyNearby: string;
  futurePlans: string;
  // Flexibility
  openToRenovation: string;
  openToOtherSuburbs: string;
  budgetFlexibility: string;
  // Decision making
  whoIsInvolved: string;
  missedOutBefore: string;
  blockers: string;
}

export interface InvestorAnswers {
  // Personal snapshot
  fullName: string;
  age: string;
  employment: string;
  income: string;
  partnerIncome: string;
  // Current portfolio
  ownsProperty: string;
  numberOfProperties: string;
  portfolioDetails: string;
  // Investment goals
  goalType: string;
  whyInvesting: string;
  longTermGoal: string;
  passiveIncomeGoal: string;
  retirementAge: string;
  // Strategy
  strategyType: string;
  targetHoldPeriod: string;
  numberOfPropertiesDesired: string;
  // Financial position
  borrowingCapacity: string;
  deposit: string;
  usableEquity: string;
  brokerEngaged: string;
  comfortableNegativeCashFlow: string;
  // Criteria
  budgetMin: string;
  budgetMax: string;
  locations: string;
  propertyType: string;
  newVsEstablished: string;
  yieldExpectation: string;
  growthExpectation: string;
  // Risk profile
  riskProfile: string;
  openToInterstate: string;
  openToDifferentAssetTypes: string;
  // Timeline
  purchaseTimeframe: string;
  activelySearching: string;
  madeOffers: string;
  // Experience
  previousExperience: string;
  challenges: string;
  blockers: string;
  // Exit / long term
  retirementAgeTarget: string;
  passiveIncomeTarget: string;
  holdOrSell: string;
  smsfInvolvement: string;
}
