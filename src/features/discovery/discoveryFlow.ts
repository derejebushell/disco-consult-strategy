export interface DiscoverySection {
  id: string;
  title: string;
  purpose: string;
  script?: string;
  questions?: string[];
  listenFor?: string[];
}

export const discoverySections: DiscoverySection[] = [
  {
    id: "opening",
    title: "Opening",
    purpose: "Set the frame, explain why the call exists, lower resistance, make it conversational.",
    script:
      "\"Hey [Name], good to chat. The goal of this call is to understand your current position, what you're trying to achieve through property, and what has been getting in the way. From there, we'll work out if you need help and whether we're the right fit. Sound fair?\"",
  },
  {
    id: "current_situation",
    title: "Current Situation",
    purpose: "Understand their current position. Work out if they are an investor, owner occupier, renter, or existing portfolio holder.",
    questions: [
      "What's your current living situation?",
      "Do you currently own any property?",
      "If yes, what's the value and loan position?",
      "What's your current income?",
      "Any other debts or liabilities?",
    ],
    listenFor: [
      "Financial pressure",
      "Equity position",
      "Borrowing capacity gaps",
      "Confusion around their current position",
    ],
  },
  {
    id: "finance_position",
    title: "Finance Position",
    purpose: "Understand whether they are ready to buy. Assess broker involvement. Identify deposit or equity constraints.",
    questions: [
      "Have you spoken to a broker?",
      "Do you know your borrowing capacity?",
      "What's your budget range?",
      "How much do you have available for deposit and costs?",
      "Are you saving each month?",
      "Do you have any major liabilities?",
    ],
    listenFor: [
      "Guessing vs confirmed numbers",
      "Deposit shortfall",
      "No broker involvement",
      "Unrealistic budget expectations",
      "Unclear affordability",
    ],
  },
  {
    id: "goals",
    title: "Goals",
    purpose: "Understand what they actually want. Separate surface level goals from deeper motivation.",
    questions: [
      "What's the main goal with this purchase?",
      "Why property specifically?",
      "What does success look like?",
      "Is this a one-off purchase or part of a bigger plan?",
      "Are you trying to build passive income?",
      "Are you trying to retire earlier?",
    ],
    listenFor: [
      "Capital growth focus",
      "Cash flow focus",
      "Balanced strategy",
      "Retirement goals",
      "Family security",
      "Wealth creation",
      "Escaping job reliance",
    ],
  },
  {
    id: "timeline",
    title: "Timeline",
    purpose: "Understand urgency and readiness.",
    questions: [
      "When are you ideally looking to purchase?",
      "How long have you been looking?",
      "What's stopping you from moving forward?",
      "Is there a deadline?",
      "What happens if you don't buy in the next 6 to 12 months?",
    ],
    listenFor: [
      "Urgency",
      "Procrastination",
      "Fear",
      "Lack of knowledge",
      "Decision paralysis",
    ],
  },
  {
    id: "search_experience",
    title: "Search & Experience",
    purpose: "Identify what they have already tried. Work out where they are stuck.",
    questions: [
      "What areas have you been looking in?",
      "What properties have you inspected?",
      "Have you made any offers? What happened?",
      "Have you missed out on anything?",
      "What has been frustrating so far?",
    ],
    listenFor: [
      "Losing at auction",
      "Lack of comparable sales knowledge",
      "Poor area selection",
      "No negotiation strategy",
      "Not knowing what good value looks like",
    ],
  },
  {
    id: "pain_points",
    title: "Pain Points",
    purpose: "Uncover the emotional reason they need help.",
    questions: [
      "What has been the hardest part?",
      "What is frustrating you most?",
      "What do you feel unsure about?",
      "What are you worried about getting wrong?",
      "If nothing changes, what happens?",
    ],
    listenFor: [
      "Fear of overpaying",
      "Fear of buying in the wrong suburb",
      "Fear of choosing the wrong asset",
      "Lack of time",
      "Lack of confidence",
      "Analysis paralysis",
    ],
  },
  {
    id: "property_criteria",
    title: "Property Criteria",
    purpose: "Document what they think they want. Test whether criteria is realistic.",
    questions: [
      "What type of property are you looking for?",
      "What suburbs or regions are you considering?",
      "What are your must-haves?",
      "What are your deal breakers?",
      "Are you flexible on location or asset type?",
      "Would you consider interstate if the numbers made sense?",
    ],
    listenFor: [
      "Unrealistic wish list",
      "Rigid criteria",
      "Emotional bias",
      "Open-mindedness",
      "Alignment with strategy",
    ],
  },
  {
    id: "close",
    title: "Close / Qualification",
    purpose: "Summarise pain. Transition into consult.",
    script:
      "\"Based on what you've said, it sounds like the main issues are [summarise pain points]. What we usually do from here is go deeper in a consult. We map out where you are now, where you're trying to get to, and what the pathway could look like. We'll also show you how we work and whether it makes sense to work together. Does that sound like something you'd want to do?\"",
  },
];
