export type OwnershipType = "owner_occupier" | "investment";
export type LoanType = "principal_and_interest" | "interest_only";
export type RepaymentFrequency = "weekly" | "fortnightly" | "monthly";

export interface PropertyAsset {
  id: string;
  suburb: string;
  propertyType: string;
  ownershipType: OwnershipType;
  estimatedValue: string;
  loanAmount: string;
  rentalIncomeWeekly: string;
  interestRate: string;
  loanType: LoanType;
  repaymentAmount: string;
  repaymentFrequency: RepaymentFrequency;
  purchaseDate: string;
}

export interface OtherAssets {
  cashSavings: string;
  superBalance: string;
  sharesValue: string;
  otherAssetsValue: string;
}

export interface Liabilities {
  otherLiabilitiesValue: string;
}

export interface RetirementAssumptions {
  passiveIncomeGoal: string;
  annualRetirementIncomeRequired: string;
  lifeExpectancy: string;
  assumedGrowthRate: string;
  assumedYieldRate: string;
}
