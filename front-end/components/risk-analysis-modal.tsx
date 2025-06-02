'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, AlertTriangle, CheckCircle2, BarChart3, Clock, Building2, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateAIAnalysis } from "@/lib/ai-analysis";

interface RiskAnalysisModalProps {
  token: {
    name: string;
    institution: string;
    riskScore: number;
    term: string;
    yield: string;
  };
}

export function RiskAnalysisModal({ token }: RiskAnalysisModalProps) {
  const riskLevel = token.riskScore <= 30 ? "Baixo" : token.riskScore <= 70 ? "Médio" : "Alto";
  const riskColor = token.riskScore <= 30 ? "text-green-500" : token.riskScore <= 70 ? "text-yellow-500" : "text-red-500";
  const aiAnalysis = generateAIAnalysis(token.riskScore);

  const calculateFactorScore = (baseScore: number, variation: number) => {
    if (baseScore > 70) {
      const score = 100 - baseScore + variation;
      return Math.min(Math.max(score, 0), 100);
    }
    if (baseScore <= 30) {
      const score = 100 - baseScore + variation;
      return Math.min(Math.max(score, 0), 100);
    }
    return Math.min(Math.max(50 + variation, 0), 100);
  };

  const riskFactors = [
    {
      name: "Histórico da ILPI",
      score: calculateFactorScore(token.riskScore, 5),
      description: token.riskScore <= 30 
        ? "A instituição possui histórico excelente de pagamentos e gestão financeira sólida."
        : token.riskScore <= 70
        ? "A instituição possui histórico positivo de pagamentos, com alguns pontos de atenção."
        : "A instituição possui histórico com alguns atrasos e pontos de atenção na gestão financeira.",
      icon: Building2,
    },
    {
      name: "Capacidade de Pagamento",
      score: calculateFactorScore(token.riskScore, -5),
      description: token.riskScore <= 30
        ? "A ILPI demonstra capacidade excepcional de geração de receita para honrar os compromissos."
        : token.riskScore <= 70
        ? "A ILPI demonstra capacidade adequada de geração de receita para honrar os compromissos."
        : "A ILPI demonstra capacidade limitada de geração de receita, necessitando atenção.",
      icon: BarChart3,
    },
    {
      name: "Prazo do Investimento",
      score: calculateFactorScore(token.riskScore, 10),
      description: token.riskScore <= 30
        ? "O prazo de retorno é muito adequado para o perfil de risco do investimento."
        : token.riskScore <= 70
        ? "O prazo de retorno é adequado, mas requer monitoramento."
        : "O prazo de retorno é extenso e requer atenção especial.",
      icon: Clock,
    },
    {
      name: "Garantias",
      score: calculateFactorScore(token.riskScore, 15),
      description: token.riskScore <= 30
        ? "O recebível possui garantias robustas que minimizam significativamente o risco de inadimplência."
        : token.riskScore <= 70
        ? "O recebível possui garantias adequadas que mitigam o risco de inadimplência."
        : "O recebível possui garantias limitadas, aumentando o risco de inadimplência.",
      icon: Shield,
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2">
          <Shield className="h-4 w-4" />
          Análise de Risco
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Análise de Risco - {token.name}</DialogTitle>
          <DialogDescription>
            Análise detalhada de risco realizada por nossa IA para {token.institution}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Score de Risco</h3>
                <span className={cn("font-medium", riskColor)}>{riskLevel}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Score calculado com base em múltiplos fatores de risco e análise de dados históricos.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Fatores de Risco</h3>
              {riskFactors.map((factor, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <factor.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{factor.name}</span>
                    </div>
                    <span className={cn(
                      "text-sm font-medium",
                      factor.score >= 80 ? "text-green-500" : 
                      factor.score >= 60 ? "text-yellow-500" : 
                      "text-red-500"
                    )}>
                      {factor.score}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{factor.description}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Análise da IA</h3>
              <div className="rounded-lg border p-4 space-y-4">
                <p className="text-sm">{aiAnalysis.overallAnalysis}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4 text-green-500" />
                    <span className="font-medium text-sm">Pontos Fortes:</span>
                  </div>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {aiAnalysis.strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ThumbsDown className="h-4 w-4 text-red-500" />
                    <span className="font-medium text-sm">Pontos de Atenção:</span>
                  </div>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {aiAnalysis.weaknesses.map((weakness, index) => (
                      <li key={index}>{weakness}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-start gap-3">
                    {token.riskScore <= 30 ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : token.riskScore <= 70 ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <p className="text-sm">{aiAnalysis.recommendation}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Confiança da análise: {aiAnalysis.confidence}%</span>
                        <span>•</span>
                        <span>Última atualização: {new Date().toLocaleDateString("pt-BR")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 