export const CustomLabel = ({
  htmlFor,
  className,
  children,
}: {
  htmlFor: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <label htmlFor={htmlFor} className={`text-base ${className}`}>
    {children}
  </label>
);
