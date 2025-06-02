"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RiskIndicator } from "@/components/risk-indicator";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { bestOpportunities } from "@/lib/mock-data";

export function BestOpportunities() {
  return (
    <section id="best-opportunities" className="py-16 bg-white dark:bg-gray-950">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Melhores Oportunidades de Tokens
          </h2>
          <p className="text-muted-foreground max-w-[700px]">
            Invista em tokens de recebíveis de ILPIs avaliados por nosso algoritmo de IA para maximizar retornos e minimizar riscos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {bestOpportunities.map((opportunity, index) => (
            <motion.div
              key={opportunity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="p-4 pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold">{opportunity.name}</h3>
                      <p className="text-sm text-muted-foreground">Por {opportunity.institution}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {opportunity.status}
                    </Badge>
                    <Badge variant="info" className="text-xs">
                      RCVM {opportunity.regulation}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {opportunity.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Rentabilidade</p>
                      <p className="font-semibold text-green-600 dark:text-green-400">{opportunity.yield} ao ano</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Aplicação mínima</p>
                      <p className="font-semibold">R$ {opportunity.minInvestment}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Prazo</p>
                      <p className="font-semibold">{opportunity.term} dias</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Volume total</p>
                      <p className="font-semibold">R$ {opportunity.totalVolume}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm text-muted-foreground">Risco (avaliado por IA)</p>
                      <div className="flex items-center gap-2">
                        <RiskIndicator score={opportunity.riskScore} />
                        <span className="text-sm font-medium">
                          {opportunity.riskScore <= 30 ? "Baixo" : opportunity.riskScore <= 70 ? "Médio" : "Alto"}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">vs. CDI</p>
                      <p className="font-semibold text-blue-600 dark:text-blue-400">+{opportunity.cdiComparison}%</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full" onClick={() => window.location.href = 'marketplace'}>
                    Investir Agora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Button variant="outline" onClick={() => window.location.href = 'marketplace'}>
            Ver todas as oportunidades
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}