import React from "react";

type BrlCurrencyIconProps = React.SVGProps<SVGSVGElement>;

export function BrlCurrencyIcon({
  width = 24,
  height = 24,
  ...props
}: BrlCurrencyIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="14"
        fontWeight="600"
        fontFamily="sans-serif"
      >
        R$
      </text>
    </svg>
  );
}
