import { CheckIcon } from "lucide-react";

export const Stepper = ({
  steps,
  currentStep,
  className,
}: {
  steps: string[];
  currentStep: number;
  className?: string;
}) => {
  return (
    <nav
      className={`flex items-start justify-center w-full max-w-md mx-auto ${className}`}
    >
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = currentStep > stepNumber;
        const isCurrent = currentStep === stepNumber;

        return (
          <div key={step} className="flex items-center w-full">
            <div className="flex flex-col items-center text-center ">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCurrent
                    ? "bg-secondary text-white scale-110"
                    : isCompleted
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {isCompleted ? <CheckIcon size={24} /> : stepNumber}
              </div>

              <p
                className={`mt-2 text-xs sm:text-sm w-20 ${
                  isCurrent ? "font-bold text-secondary" : "text-gray-500"
                }`}
              >
                {step}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 sm:mx-4 transition-all duration-300 ${
                  isCompleted ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
};
