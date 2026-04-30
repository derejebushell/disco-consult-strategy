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
    <nav className="flex items-center gap-1 bg-zinc-900 border-b border-zinc-800 px-4 py-0">
      {steps.map((step, i) => {
        const Icon = step.icon;
        const isActive = activeStep === step.id;
        return (
          <button
            key={step.id}
            onClick={() => onStepChange(step.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all -mb-px ${
              isActive
                ? "border-yellow-500 text-yellow-400"
                : "border-transparent text-zinc-500 hover:text-zinc-300 hover:border-zinc-600"
            }`}
          >
            <span className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold border border-current opacity-60">
              {i + 1}
            </span>
            <Icon size={14} />
            <span>{step.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export type { StepId };
