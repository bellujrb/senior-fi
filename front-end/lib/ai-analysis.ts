interface AIAnalysis {
  overallAnalysis: string;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
  confidence: number;
}

const getRiskLevel = (score: number): 'low' | 'medium' | 'high' => {
  if (score <= 30) return 'low';
  if (score <= 70) return 'medium';
  return 'high';
};

const getConfidenceLevel = (score: number): number => {
  if (score <= 20 || score >= 80) return 95;
  if (score <= 30 || score >= 70) return 90;
  if (score <= 40 || score >= 60) return 85;
  return 80;
};

const getStrengths = (score: number): string[] => {
  const strengths: string[] = [];
  
  if (score <= 30) {
    strengths.push(
      "Histórico impecável de pagamentos",
      "Gestão financeira robusta",
      "Garantias sólidas",
      "Equipe administrativa experiente",
      "Localização privilegiada"
    );
  } else if (score <= 70) {
    strengths.push(
      "Histórico positivo de pagamentos",
      "Gestão financeira adequada",
      "Garantias satisfatórias",
      "Equipe administrativa competente",
      "Localização favorável"
    );
  } else {
    strengths.push(
      "Potencial de alta rentabilidade",
      "Oportunidade de crescimento",
      "Mercado em expansão",
      "Possibilidade de reestruturação",
      "Apoio de stakeholders"
    );
  }

  return strengths.slice(0, 3); 
};

const getWeaknesses = (score: number): string[] => {
  const weaknesses: string[] = [];
  
  if (score <= 30) {
    weaknesses.push(
      "Rentabilidade mais conservadora",
      "Prazo de retorno mais longo",
      "Menor potencial de valorização"
    );
  } else if (score <= 70) {
    weaknesses.push(
      "Alguns pontos de atenção na gestão",
      "Garantias moderadas",
      "Prazo de retorno intermediário"
    );
  } else {
    weaknesses.push(
      "Histórico de atrasos em pagamentos",
      "Gestão financeira com pontos de atenção",
      "Garantias limitadas",
      "Equipe administrativa em transição",
      "Localização com desafios"
    );
  }

  return weaknesses.slice(0, 3);
};

const getOverallAnalysis = (score: number): string => {
  if (score <= 30) {
    return "Nossa análise indica um investimento de baixo risco, ideal para investidores conservadores. A ILPI demonstra excelente gestão financeira e histórico consistente de pagamentos.";
  } else if (score <= 70) {
    return "Nossa análise indica um investimento de risco moderado, adequado para investidores que buscam um equilíbrio entre segurança e retorno. A ILPI apresenta pontos fortes e alguns aspectos que requerem atenção.";
  } else {
    return "Nossa análise indica um investimento de alto risco, recomendado apenas para investidores com alta tolerância a riscos. A ILPI apresenta desafios significativos que precisam ser considerados.";
  }
};

const getRecommendation = (score: number): string => {
  if (score <= 30) {
    return "Recomendamos fortemente este investimento para investidores conservadores que buscam segurança e estabilidade. O histórico sólido e as garantias robustas minimizam significativamente os riscos.";
  } else if (score <= 70) {
    return "Recomendamos este investimento para investidores moderados que buscam um equilíbrio entre risco e retorno. Sugerimos monitoramento regular do desempenho da ILPI.";
  } else {
    return "Recomendamos cautela neste investimento. Apesar do potencial de alto retorno, os riscos são significativos. Sugerimos uma análise detalhada e possível diversificação do portfólio.";
  }
};

export function generateAIAnalysis(score: number): AIAnalysis {
  const confidence = getConfidenceLevel(score);

  return {
    overallAnalysis: getOverallAnalysis(score),
    strengths: getStrengths(score),
    weaknesses: getWeaknesses(score),
    recommendation: getRecommendation(score),
    confidence
  };
} 