"use client";

import { getPropertyTypeLabel } from "@/utils/helpers/getPropertyType";
import { motion } from "framer-motion";

interface PropertiesOccupancyChartProps {
  data?: {
    type: string;
    total: number;
    occupied: number;
  }[];
}

export function PropertiesOccupancyChart({
  data,
}: PropertiesOccupancyChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-gray-500">
        Não há dados de ocupação para exibir.
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-4">
      {data.map((item, index) => {
        const available = item.total - item.occupied;
        const occupiedPercentage =
          item.total > 0 ? (item.occupied / item.total) * 100 : 0;
        const availablePercentage = 100 - occupiedPercentage;

        return (
          <div key={index}>
            {/* Título e contagem */}
            <div className="mb-2 flex justify-between font-medium text-gray-700">
              <span className="font-bold">
                {getPropertyTypeLabel(item.type)}
              </span>
              <span>
                {item.occupied} Alugado(s) / {available} Disponível(is)
              </span>
            </div>

            {/* Barra de progresso visual */}
            <div className="flex h-6 w-full overflow-hidden rounded-full bg-zinc-200">
              {item.occupied > 0 && (
                <motion.div
                  className="flex items-center justify-center bg-sky-500 text-xs font-semibold text-white"
                  style={{ width: `${occupiedPercentage}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${occupiedPercentage}%` }}
                  transition={{ duration: 0.8, delay: 0.2 * index }}
                >
                  {occupiedPercentage > 10 &&
                    `${occupiedPercentage.toFixed(0)}%`}
                </motion.div>
              )}
              {available > 0 && (
                <motion.div
                  className="flex items-center justify-center bg-zinc-400 text-xs font-semibold text-white"
                  style={{ width: `${availablePercentage}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${availablePercentage}%` }}
                  transition={{ duration: 0.8, delay: 0.2 * index }}
                >
                  {availablePercentage > 10 &&
                    `${availablePercentage.toFixed(0)}%`}
                </motion.div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
