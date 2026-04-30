import { User, Presentation, Map } from "lucide-react";

type StepId = "discovery" | "consult" | "strategy";

interface Step {
  id: StepId;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const steps: Step[] = [
  { id: "discovery", label: "Discovery", icon: User },
  { id: "consult", label: "Consult", icon: Presentation },
  { id: "strategy", label: "Strategy", icon: Map },
];

interface StepNavProps {
  activeStep: StepId;
  onStepChange: (step: StepId) => void;
}

export function StepNav({ activeStep, onStepChange }: StepNavProps) {
  return (
    <nav className="flex items-center gap-2 bg-zinc-900 border-b border-zinc-800 px-6 py-0">
      {steps.map((step, i) => {
        const Icon = step.icon;
        const isActive = activeStep === step.id;
        return (
          <button
            key={step.id}
            onClick={() => onStepChange(step.id)}
            className={`flex items-center gap-3 px-6 py-5 text-xl font-semibold border-b-2 transition-all -mb-px ${
              isActive
                ? "border-yellow-500 text-yellow-400"
                : "border-transparent text-zinc-400 hover:text-zinc-100 hover:border-zinc-600"
            }`}
          >
            <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border-2 flex-shrink-0 ${
              isActive ? "border-yellow-500 text-yellow-400" : "border-zinc-600 text-zinc-500"
            }`}>
              {i + 1}
            </span>
            <Icon size={20} />
            <span>{step.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export type { StepId };
