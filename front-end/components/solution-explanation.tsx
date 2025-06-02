"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRightLeft, Landmark, BarChart, ShieldCheck, Clock, Building } from "lucide-react";
import { motion } from "framer-motion";

export function SolutionExplanation() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const features = [
    {
      icon: <Building className="h-10 w-10 text-blue-600" />,
      title: "Desafio das ILPIs",
      description:
        "Instituições de Longa Permanência para Idosos enfrentam desafios de fluxo de caixa devido a recebíveis de longo prazo, dificultando o pagamento de fornecedores e expansão.",
    },
    {
      icon: <ArrowRightLeft className="h-10 w-10 text-blue-600" />,
      title: "Tokenização de Recebíveis",
      description:
        "A plataforma permite tokenizar recebíveis futuros das ILPIs, convertendo-os em tokens digitais negociáveis na BNB Chain com descontos atrativos.",
    },
    {
      icon: <Landmark className="h-10 w-10 text-blue-600" />,
      title: "Antecipação de Capital",
      description:
        "As ILPIs recebem capital imediato enquanto investidores adquirem tokens com rentabilidade acima do mercado, criando uma relação ganha-ganha.",
    },
    {
      icon: <BarChart className="h-10 w-10 text-blue-600" />,
      title: "Análise de IA",
      description:
        "Nosso algoritmo de inteligência artificial analisa múltiplos fatores para calcular o risco de cada operação, oferecendo transparência aos investidores.",
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-blue-600" />,
      title: "Segurança Blockchain",
      description:
        "Todas as transações são registradas na BNB Chain, garantindo transparência, imutabilidade e rastreabilidade de todo o processo.",
    },
    {
      icon: <Clock className="h-10 w-10 text-blue-600" />,
      title: "Prazos Flexíveis",
      description:
        "Os investidores podem escolher tokens com diferentes prazos de vencimento, adequando o investimento ao seu perfil de liquidez.",
    },
  ];

  return (
    <section id="solution-explanation" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Nossa Solução
          </h2>
          <p className="text-muted-foreground max-w-[700px] mx-auto">
            Uma plataforma descentralizada que conecta instituições de cuidados a idosos com investidores através da tokenização de recebíveis.
          </p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={item}>
              <Card className="h-full transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 max-w-3xl mx-auto">
          <h3 className="text-xl font-bold mb-4 text-center">Como Funciona?</h3>
          <div className="flex flex-col space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-600 text-center text-sm font-bold text-blue-600">1</div>
              <div>
                <p className="font-medium">As ILPIs cadastram seus recebíveis futuros na plataforma</p>
                <p className="text-sm text-muted-foreground">Faturas e contratos são validados e tokenizados com desconto</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-600 text-center text-sm font-bold text-blue-600">2</div>
              <div>
                <p className="font-medium">Nossa IA analisa o risco de cada operação</p>
                <p className="text-sm text-muted-foreground">Fatores como histórico financeiro, gestão e mercado são considerados</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-600 text-center text-sm font-bold text-blue-600">3</div>
              <div>
                <p className="font-medium">Investidores adquirem tokens com desconto</p>
                <p className="text-sm text-muted-foreground">Diversificação entre diferentes ILPIs, prazos e perfis de risco</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-600 text-center text-sm font-bold text-blue-600">4</div>
              <div>
                <p className="font-medium">ILPIs recebem capital imediato</p>
                <p className="text-sm text-muted-foreground">Melhor fluxo de caixa para operações e expansão dos serviços</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-600 text-center text-sm font-bold text-blue-600">5</div>
              <div>
                <p className="font-medium">No vencimento, investidores recebem o valor integral</p>
                <p className="text-sm text-muted-foreground">Pagamentos automáticos via contratos inteligentes na BNB Chain</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}