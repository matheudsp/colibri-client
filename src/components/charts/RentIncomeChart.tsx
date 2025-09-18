"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
interface RentIncomeChartProps {
  data?: {
    month: string;
    amount: number;
  }[];
}

const formatAbbreviatedCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value.toString();
};
interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    value: ValueType;
    name: NameType;
  }[];
  label?: string;
}
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border bg-white/80 p-3 shadow-lg backdrop-blur-sm">
        <p className="font-bold text-gray-800">{label}</p>
        <p className="text-sm text-sky-600">
          Receita: {formatCurrency(payload[0].value as number)}
        </p>
      </div>
    );
  }
  return null;
};

export function RentIncomeChart({ data }: RentIncomeChartProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-gray-500">
        Não há dados de receita para exibir.
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.month,
    Receita: item.amount,
  }));

  const average =
    chartData.reduce((sum, item) => sum + item.Receita, 0) / chartData.length;

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 20,
            right: isMobile ? 20 : 30,
            left: isMobile ? -5 : 5,
            bottom: isMobile ? 20 : 5,
          }}
        >
          <defs>
            <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            angle={isMobile ? -45 : 0}
            textAnchor={isMobile ? "end" : "middle"}
            height={isMobile ? 60 : 30}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tickFormatter={(value) =>
              isMobile
                ? formatAbbreviatedCurrency(value as number)
                : formatCurrency(value as number)
            }
            axisLine={false}
            tickLine={false}
            width={isMobile ? 45 : 85}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#0ea5e9" }} />
          {average > 0 && (
            <ReferenceLine
              y={average}
              label={{
                value: `Média: ${formatCurrency(average)}`,
                position: "insideTopLeft",
                fill: "#dc2626",
                fontSize: 12,
              }}
              stroke="#dc2626"
              strokeDasharray="4 4"
            />
          )}
          <Area
            type="monotone"
            dataKey="Receita"
            strokeWidth={2}
            stroke="#0284c7"
            fillOpacity={1}
            fill="url(#colorReceita)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
