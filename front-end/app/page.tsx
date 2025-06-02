import { NavBar } from "@/components/nav-bar";
import { BestOpportunities } from "@/components/best-opportunities";
import { SolutionExplanation } from "@/components/solution-explanation";
import { TokenMarketplace } from "@/components/token-marketplace";
import { Footer } from "@/components/footer";
import { HeroSection6 } from "@/components/hero-section";
import { FaqSection } from "@/components/faq";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <NavBar />
      <HeroSection6 />
      <SolutionExplanation />
      <BestOpportunities />
      <FaqSection
        title="Perguntas Frequentes"
        items={[
          {
            question: "O que é a SeniorFi?",
            answer: "É uma plataforma descentralizada que permite que ILPIs tokenizem seus recebíveis futuros (faturas a vencer) e os vendam com desconto para investidores, que recebem o valor total posteriormente."
          },
          {
            question: "Qual problema vocês resolvem?",
            answer: "ILPIs enfrentam fluxo de caixa apertado e dificuldades para pagar despesas emergenciais, pois dependem de pagamentos futuros. A plataforma antecipa esses recebíveis, melhorando o fluxo financeiro."
          },
          {
            question: "Como funciona a tokenização dos recebíveis?",
            answer: "As ILPIs emitem tokens que representam suas dívidas futuras. Esses tokens são listados em um marketplace onde investidores podem comprá-los com desconto."
          },
          {
            question: "Como os investidores avaliam o risco da compra dos tokens?",
            answer: "Uma inteligência artificial calcula e exibe o risco de inadimplência de cada token, ajudando investidores a tomar decisões informadas."
          },
          {
            question: "Quais são os perfis de usuários na plataforma?",
            answer: "Temos dois perfis principais: ILPI, que emite tokens e recebe antecipação; e Investidor, que compra tokens no marketplace e recebe o valor cheio no vencimento."
          },
          {
            question: "Como é feita a validação dos recebíveis tokenizados?",
            answer: "A validação pode ser realizada via oráculos, auditorias manuais ou integração com os sistemas financeiros das ILPIs, garantindo que os tokens representem dívidas legítimas."
          },
          {
            question: "Em qual rede blockchain a plataforma está sendo desenvolvida?",
            answer: "Está sendo desenvolvido na BNB Chain Testnet, com smart contracts em Solidity."
          },
        ]}
      />

      <Footer />
    </main>
  );
}