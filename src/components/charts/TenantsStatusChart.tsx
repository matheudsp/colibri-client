"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

interface TenantsStatusChartProps {
  data: {
    goodPayer: number;
    late: number;
    defaulted: number;
  };
}

const STATUS_INFO = {
  goodPayer: { name: "Bons Pagadores", color: "#22c55e" }, // Verde
  late: { name: "Atrasados", color: "#f59e0b" }, // Âmbar
  defaulted: { name: "Inadimplentes", color: "#ef4444" }, // Vermelho
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    value: ValueType;
    name: NameType;
    payload: {
      name: string;
      value: number;
      totalTenants: number;
    };
    fill: string;
  }[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const { name, value, totalTenants } = payload[0].payload;
    const percentage =
      totalTenants > 0 ? ((value as number) / totalTenants) * 100 : 0;
    return (
      <div className="rounded-md border border-border bg-white/80 p-3 shadow-lg backdrop-blur-xs">
        <p className="font-bold" style={{ color: payload[0].fill }}>
          {name}
        </p>
        <p className="text-sm text-gray-600">
          {value} Inquilino(s) ({percentage.toFixed(1)}%)
        </p>
      </div>
    );
  }
  return null;
};

interface CustomLegendProps {
  payload?: readonly {
    value: string | undefined;
    color: string;
    payload?: {
      value: number;
    };
  }[];
}

const renderLegend = (props: CustomLegendProps) => {
  const { payload } = props;
  if (!payload) return null;

  return (
    <ul className="mt-4 flex flex-col items-center justify-center gap-2 md:flex-row md:gap-x-6">
      {payload.map((entry, index) => (
        <li
          key={`item-${index}`}
          className="flex items-center space-x-2 text-sm text-gray-600"
        >
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span>
            {entry.value}:{" "}
            <span className="font-semibold">{entry.payload?.value}</span>
          </span>
        </li>
      ))}
    </ul>
  );
};

export function TenantsStatusChart({ data }: TenantsStatusChartProps) {
  const totalTenants = data.goodPayer + data.late + data.defaulted;

  const chartData = [
    {
      name: STATUS_INFO.goodPayer.name,
      value: data.goodPayer,
      color: STATUS_INFO.goodPayer.color,
    },
    {
      name: STATUS_INFO.late.name,
      value: data.late,
      color: STATUS_INFO.late.color,
    },
    {
      name: STATUS_INFO.defaulted.name,
      value: data.defaulted,
      color: STATUS_INFO.defaulted.color,
    },
  ]
    .filter((entry) => entry.value > 0)
    .map((d) => ({ ...d, totalTenants }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-gray-500">
        Não há dados de inquilinos para exibir.
      </div>
    );
  }

  return (
    <div className="relative h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            labelLine={false}
            outerRadius={110}
            innerRadius={70}
            dataKey="value"
            strokeWidth={2}
            stroke="white"
          >
            {chartData.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            /* eslint-disable  @typescript-eslint/no-explicit-any */
            content={renderLegend as any}
            verticalAlign="bottom"
            wrapperStyle={{ bottom: 0 }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-bold text-gray-800">{totalTenants}</span>
        <span className="text-sm text-gray-500">Inquilinos</span>
      </div>
    </div>
  );
}
