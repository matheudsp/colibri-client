"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

const chartData = [
  { name: "01", value: 1800 },
  { name: "02", value: 2400 },
  { name: "03", value: 3200 },
  { name: "04", value: 3900 },
  { name: "05", value: 4600 },
  { name: "06", value: 4100 },
  { name: "07", value: 5400 },
  { name: "08", value: 6000 },
  { name: "09", value: 7200 },
  { name: "10", value: 6800 },
  { name: "11", value: 7500 },
  { name: "12", value: 8200 },
  { name: "13", value: 7900 },
  { name: "14", value: 8600 },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  const value = payload[0].value;
  return (
    <div
      className="p-3 rounded-lg shadow-lg"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="text-xs text-foreground-muted">Dia {label}</div>
      <div className="font-semibold text-foreground">
        R$ {value.toLocaleString()}
      </div>
      <div className="text-xs text-foreground-muted">Exemplo ilustrativo</div>
    </div>
  );
}

export function StatsChart() {
  return (
    <div className="rounded-2xl p-6 bg-card border border-border shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm text-foreground-muted">
            Recebíveis processados (últimos 14 dias)
          </p>
          <p className="text-2xl font-bold text-foreground">R$ 8.240</p>
        </div>
      </div>

      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 8, right: 16, left: -16, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--primary)"
                  stopOpacity={0.22}
                />
                <stop
                  offset="45%"
                  stopColor="var(--primary)"
                  stopOpacity={0.12}
                />
                <stop
                  offset="100%"
                  stopColor="var(--primary)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="3 6"
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "var(--foreground-muted)", fontSize: 12 }}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(v) => `R$ ${Math.round(v / 1000)}k`}
              tick={{ fill: "var(--foreground-muted)", fontSize: 12 }}
              axisLine={false}
            />

            <Tooltip content={<CustomTooltip />} />

            <ReferenceLine
              y={chartData.reduce((s, d) => s + d.value, 0) / chartData.length}
              strokeOpacity={0.12}
              stroke="var(--foreground-muted)"
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--primary)"
              fill="url(#gradPrimary)"
              strokeWidth={3}
              dot={{
                r: 4,
                stroke: "var(--background)",
                strokeWidth: 2,
              }}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
              animationDuration={900}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-foreground-muted">
        <div>
          Inquilinos <strong className="text-foreground">18</strong>
        </div>
        <div>
          Contratos <strong className="text-foreground">14</strong>
        </div>
      </div>
    </div>
  );
}
