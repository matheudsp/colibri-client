"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

export type AggregatedPaymentData = {
  title: string;
  paid: number;
  pending: number;
  overdue: number;
  tenants: string[];
};

interface PaymentsByPropertyChartProps {
  data: AggregatedPaymentData[];
}

const COLORS = {
  paid: "#16a34a", // green-600
  pending: "#f59e0b", // amber-500
  overdue: "#dc2626", // red-600
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 border z-0 border-gray-200 rounded-lg shadow-lg">
        <p className="font-bold text-gray-800">{label}</p>
        <ul className="mt-2 space-y-1 text-sm">
          {payload.map((p: any) => (
            <li key={p.dataKey} style={{ color: p.color }}>
              <span className="font-semibold">{p.name}:</span>{" "}
              {p.value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </li>
          ))}
        </ul>
        <div className="mt-3 border-t pt-2">
          <p className="text-xs font-semibold text-gray-600">Inquilino:</p>
          <p className="text-xs text-gray-500">{data.tenants.join(", ")}</p>
        </div>
      </div>
    );
  }
  return null;
};

export function PaymentsByPropertyChart({
  data,
}: PaymentsByPropertyChartProps) {
  const chartHeight = Math.min(800, 80 + data.length * 50);

  return (
    <div style={{ width: "100%", height: chartHeight }}>
      <ResponsiveContainer>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            tickFormatter={(value) =>
              new Intl.NumberFormat("pt-BR", {
                notation: "compact",
                compactDisplay: "short",
                style: "currency",
                currency: "BRL",
              }).format(value)
            }
          />
          <YAxis
            dataKey="title"
            type="category"
            width={180}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(240, 240, 240, 0.5)" }}
          />
          <Legend />
          <Bar dataKey="paid" stackId="a" name="Pagos" fill={COLORS.paid} />
          <Bar
            dataKey="pending"
            stackId="a"
            name="A Pagar"
            fill={COLORS.pending}
          />
          <Bar
            dataKey="overdue"
            stackId="a"
            name="Vencidos"
            fill={COLORS.overdue}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
