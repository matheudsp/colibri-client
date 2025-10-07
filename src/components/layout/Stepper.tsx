import { FaCheckDouble } from "react-icons/fa";

export const Stepper = ({
  steps,
  currentStep,
  className,
}: {
  steps: string[];
  currentStep: number;
  className?: string;
}) => {
  const progressPercentage =
    steps.length > 1 ? ((currentStep - 1) / (steps.length - 1)) * 100 : 0;

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <div className="relative flex justify-between items-start">
        <div className="absolute left-5 right-5 top-5 h-1">
          <div className="w-full h-full bg-gray-200 rounded-full" />
          <div
            className="absolute top-0 h-full bg-primary-hover rounded-full transition-all duration-500 ease-in-out bg-striped-gradient bg-striped-size animate-progress-stripes"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;
          const isActive = currentStep >= stepNumber;

          return (
            <div
              key={step}
              className="z-10 flex flex-col items-center text-center w-20"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCurrent
                    ? "bg-secondary text-white animate-pulse-shadow"
                    : isActive
                    ? "bg-primary-hover text-white"
                    : "bg-white text-gray-500 border-2 border-gray-200"
                }`}
              >
                {isCompleted ? <FaCheckDouble size={24} /> : stepNumber}
              </div>
              <p
                className={`mt-2 text-xs sm:text-sm transition-colors ${
                  isCurrent ? "font-bold text-secondary" : "text-gray-500"
                }`}
              >
                {step}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
