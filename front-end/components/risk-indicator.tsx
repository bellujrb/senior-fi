"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface RiskIndicatorProps {
  score: number;
}

export function RiskIndicator({ score }: RiskIndicatorProps) {
  const getRiskColor = (score: number) => {
    if (score <= 30) return "bg-green-500";
    if (score <= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getRiskLabel = () => {
    if (score <= 30) return "Baixo Risco";
    if (score <= 70) return "Risco Médio";
    return "Alto Risco";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <div className={cn("rounded-full flex items-center justify-center h-4 w-4")}>
              <div className={cn("rounded-full w-full h-full", getRiskColor(score))}></div>
            </div>
            <span className="text-sm font-medium">{getRiskLabel()}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="flex flex-col gap-2 p-4 max-w-xs">
          <div className="flex items-center gap-2">
            <div className={cn("rounded-full w-3 h-3", getRiskColor(score))}></div>
            <span className="font-semibold">{getRiskLabel()}</span>
          </div>
          <p className="text-sm">
            Avaliação gerada por nosso algoritmo de IA considerando histórico financeiro, 
            gestão da ILPI, índices de inadimplência e fatores de mercado.
          </p>
          {score <= 30 && (
            <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-1">
              Alta probabilidade de pagamento no prazo.
            </p>
          )}
          {score <= 70 && (
            <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium mt-1">
              Moderada probabilidade de atraso ou renegociação.
            </p>
          )}
          {score > 70 && (
            <p className="text-sm text-red-600 dark:text-red-400 font-medium mt-1">
              Maior probabilidade de atraso ou inadimplência.
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}