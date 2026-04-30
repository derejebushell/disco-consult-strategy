import type { PropertyAsset } from "../types/property";
import { parseMoney } from "./formatters";

export function getAnnualRepayment(
  amount: string,
  frequency: string
): number {
  const amt = parseMoney(amount);
  switch (frequency) {
    case "weekly": return amt * 52;
    case "fortnightly": return amt * 26;
    case "monthly": return amt * 12;
    default: return amt * 12;
  }
}

export function getMonthlyRepayment(
  amount: string,
  frequency: string
): number {
  return getAnnualRepayment(amount, frequency) / 12;
}

export function calculateEquity(value: number, loan: number): number {
  return Math.max(0, value - loan);
}

export function calculateUsableEquity(value: number, loan: number): number {
  return Math.max(0, value * 0.8 - loan);
}

export function calculateYearsToPayoff(
  balance: number,
  annualRate: number,
  repaymentAmount: string,
  repaymentFrequency: string,
  loanType: string
): { years: number | null; status: string } {
  if (loanType === "interest_only") {
    return { years: null, status: "Interest only" };
  }
  const monthlyPayment = getMonthlyRepayment(repaymentAmount, repaymentFrequency);
  const r = annualRate / 100 / 12;
  if (r === 0) {
    if (monthlyPayment <= 0) return { years: null, status: "Repayment too low" };
    return { years: balance / monthlyPayment / 12, status: "ok" };
  }
  const interestOnly = balance * r;
  if (monthlyPayment <= interestOnly) {
    return { years: null, status: "Repayment too low" };
  }
  const n = Math.log(monthlyPayment / (monthlyPayment - r * balance)) / Math.log(1 + r);
  return { years: n / 12, status: "ok" };
}

export function calculateAnnualCashFlow(property: PropertyAsset): number {
  if (property.ownershipType !== "investment") return 0;
  const annualRent = parseMoney(property.rentalIncomeWeekly) * 52;
  const annualRepayments = getAnnualRepayment(
    property.repaymentAmount,
    property.repaymentFrequency
  );
  return annualRent - annualRepayments;
}

export interface PortfolioTotals {
  totalPropertyValue: number;
  totalLoans: number;
  totalEquity: number;
  totalUsableEquity: number;
  totalInvestmentValue: number;
  totalAnnualRent: number;
  totalAnnualRepayments: number;
  totalAnnualCashFlow: number;
}

export function calculatePortfolioTotals(properties: PropertyAsset[]): PortfolioTotals {
  let totalPropertyValue = 0;
  let totalLoans = 0;
  let totalEquity = 0;
  let totalUsableEquity = 0;
  let totalInvestmentValue = 0;
  let totalAnnualRent = 0;
  let totalAnnualRepayments = 0;
  let totalAnnualCashFlow = 0;

  for (const p of properties) {
    const value = parseMoney(p.estimatedValue);
    const loan = parseMoney(p.loanAmount);
    totalPropertyValue += value;
    totalLoans += loan;
    totalEquity += calculateEquity(value, loan);
    totalUsableEquity += calculateUsableEquity(value, loan);

    if (p.ownershipType === "investment") {
      totalInvestmentValue += value;
      const annualRent = parseMoney(p.rentalIncomeWeekly) * 52;
      const annualRep = getAnnualRepayment(p.repaymentAmount, p.repaymentFrequency);
      totalAnnualRent += annualRent;
      totalAnnualRepayments += annualRep;
      totalAnnualCashFlow += annualRent - annualRep;
    }
  }

  return {
    totalPropertyValue,
    totalLoans,
    totalEquity,
    totalUsableEquity,
    totalInvestmentValue,
    totalAnnualRent,
    totalAnnualRepayments,
    totalAnnualCashFlow,
  };
}

export interface RetirementProjection {
  yearsToRetirement: number;
  projectedInvestmentValue: number;
  projectedPassiveIncome: number;
  annualPosition: number;
  lifetimePosition: number;
  totalIncomeRequired: number;
  totalProjectedIncome: number;
}

export function calculateRetirementProjection(
  properties: PropertyAsset[],
  yearsToRetirement: number,
  annualRetirementIncomeRequired: number,
  lifeExpectancy: number,
  retirementAge: number,
  growthRate: number,
  yieldRate: number
): RetirementProjection {
  let projectedInvestmentValue = 0;

  for (const p of properties) {
    if (p.ownershipType !== "investment") continue;
    const currentValue = parseMoney(p.estimatedValue);
    projectedInvestmentValue += currentValue * Math.pow(1 + growthRate / 100, yearsToRetirement);
  }

  const projectedPassiveIncome = projectedInvestmentValue * (yieldRate / 100);
  const yearsInRetirement = Math.max(0, lifeExpectancy - retirementAge);
  const totalIncomeRequired = annualRetirementIncomeRequired * yearsInRetirement;
  const totalProjectedIncome = projectedPassiveIncome * yearsInRetirement;
  const annualPosition = projectedPassiveIncome - annualRetirementIncomeRequired;
  const lifetimePosition = totalProjectedIncome - totalIncomeRequired;

  return {
    yearsToRetirement,
    projectedInvestmentValue,
    projectedPassiveIncome,
    annualPosition,
    lifetimePosition,
    totalIncomeRequired,
    totalProjectedIncome,
  };
}

export interface PerformanceDataPoint {
  year: number;
  totalPerformance: number;
  equityGrowth: number;
  loanBalance: number;
  cashFlow: number;
}

export function calculatePropertyPerformance(
  purchasePrice: number,
  loanBalance: number,
  weeklyRent: number,
  growthRate: number,
  yieldRate: number,
  costFactor: number,
  repaymentAmount: number,
  repaymentFrequency: string,
  loanType: string,
  interestRate: number
): PerformanceDataPoint[] {
  const data: PerformanceDataPoint[] = [];
  const annualRepayment = (() => {
    switch (repaymentFrequency) {
      case "weekly": return repaymentAmount * 52;
      case "fortnightly": return repaymentAmount * 26;
      default: return repaymentAmount * 12;
    }
  })();

  let currentLoan = loanBalance;
  let cumulativeCashFlow = 0;

  for (let year = 0; year <= 10; year++) {
    const projectedValue = purchasePrice * Math.pow(1 + growthRate / 100, year);
    const annualRent = weeklyRent * 52 * Math.pow(1 + yieldRate / 100, year);
    const annualCosts = annualRepayment * (costFactor / 100);
    const annualCashFlow = annualRent - annualCosts;
    cumulativeCashFlow += year === 0 ? 0 : annualCashFlow;

    const equity = projectedValue - currentLoan;
    const totalPerformance = equity + cumulativeCashFlow;

    data.push({
      year,
      totalPerformance: Math.round(totalPerformance),
      equityGrowth: Math.round(equity),
      loanBalance: Math.round(currentLoan),
      cashFlow: Math.round(cumulativeCashFlow),
    });

    if (year < 10) {
      if (loanType === "interest_only") {
        // loan doesn't reduce
      } else {
        const monthlyRate = interestRate / 100 / 12;
        let loan = currentLoan;
        for (let m = 0; m < 12; m++) {
          const interestCharge = loan * monthlyRate;
          const principal = annualRepayment / 12 - interestCharge;
          loan = Math.max(0, loan - principal);
        }
        currentLoan = loan;
      }
    }
  }

  return data;
}
