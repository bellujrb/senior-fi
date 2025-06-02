"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiskIndicator } from "@/components/risk-indicator";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { allTokens, type Opportunity } from "@/lib/mock-data";
import { useRouter } from "next/navigation";
import { RiskAnalysisModal } from "@/components/risk-analysis-modal";

interface PortfolioToken {
  id: string;
  name: string;
  amount: string;
  purchaseDate: string;
  expectedReturn: string;
  maturityDate: string;
}

interface Portfolio {
  availableBalance: string;
  totalBalance: string;
  investedBalance: string;
  expectedReturn: string;
  tokens: PortfolioToken[];
}

export function TokenMarketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("yield");
  const [selectedToken, setSelectedToken] = useState<Opportunity | null>(null);
  const [investmentAmounts, setInvestmentAmounts] = useState<Map<string, string>>(new Map());
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [portfolio, setPortfolio] = useState<Portfolio>({
    availableBalance: "0,00",
    totalBalance: "0,00",
    investedBalance: "0,00",
    expectedReturn: "0,00",
    tokens: []
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPortfolio = localStorage.getItem("portfolio");
      if (storedPortfolio) {
        setPortfolio(JSON.parse(storedPortfolio));
      }
    }
  }, []);

  const handleAmountSelect = (amount: string, token: Opportunity) => {
    setSelectedToken(token);
    setInvestmentAmounts(new Map(investmentAmounts.set(token.id, amount)));
  };

  const handlePurchase = (token: Opportunity) => {
    if (typeof window === 'undefined') return;
    
    if (!window.localStorage.getItem("wallet-connected")) {
      toast.error("Conecte sua carteira", {
        description: "É necessário conectar uma carteira para investir.",
      });
      return;
    }

    const investmentAmount = investmentAmounts.get(token.id) || "";
    const minInvestment = parseFloat(token.minInvestment.replace(".", "").replace(",", "."));
    const investment = parseFloat(investmentAmount.replace(".", "").replace(",", "."));

    if (investment < minInvestment) {
      toast.error("Valor mínimo não atingido", {
        description: `O valor mínimo de investimento é R$ ${token.minInvestment}`,
      });
      return;
    }

    const availableBalance = parseFloat(portfolio.availableBalance.replace(".", "").replace(",", "."));

    if (investment > availableBalance) {
      toast.error("Saldo insuficiente", {
        description: `Seu saldo disponível é de R$ ${portfolio.availableBalance}. Por favor, faça um depósito ou escolha um valor menor.`,
      });
      return;
    }
    
    setSelectedToken(token);
    setShowConfirmDialog(true);
  };

  const confirmPurchase = () => {
    if (!selectedToken || typeof window === 'undefined') return;

    const investmentAmount = investmentAmounts.get(selectedToken.id) || "";

    const updatedPortfolio = {
      ...portfolio,
      tokens: [
        ...portfolio.tokens,
        {
          id: selectedToken.id,
          name: selectedToken.name,
          amount: investmentAmount,
          purchaseDate: new Date().toLocaleDateString("pt-BR"),
          expectedReturn: selectedToken.yield,
          maturityDate: new Date(Date.now() + parseInt(selectedToken.term) * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR")
        }
      ]
    };

    const investedAmount = parseFloat(investmentAmount.replace(".", "").replace(",", "."));
    const availableAmount = parseFloat(updatedPortfolio.availableBalance.replace(".", "").replace(",", "."));
    
    updatedPortfolio.investedBalance = (parseFloat(updatedPortfolio.investedBalance.replace(".", "").replace(",", ".")) + investedAmount).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    
    updatedPortfolio.availableBalance = (availableAmount - investedAmount).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    updatedPortfolio.totalBalance = (parseFloat(updatedPortfolio.investedBalance.replace(".", "").replace(",", ".")) + parseFloat(updatedPortfolio.availableBalance.replace(".", "").replace(",", "."))).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    setPortfolio(updatedPortfolio);
    localStorage.setItem("portfolio", JSON.stringify(updatedPortfolio));

    setShowConfirmDialog(false);
    toast.success("Investimento realizado!", {
      description: `Você investiu R$ ${investmentAmount} em ${selectedToken.name}`,
    });    
    setInvestmentAmounts(new Map(investmentAmounts.set(selectedToken.id, "")));
    setSelectedToken(null);
  };

  const filteredTokens = allTokens.filter(token => {
    if (activeFilter === "available" && token.status !== "Em captação") {
      return false;
    }
    
    if (searchTerm !== "") {
      return token.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
             token.institution.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    return true;
  }).sort((a, b) => {
    if (sortBy === "yield") {
      return parseFloat(b.yield.replace("%", "").replace(",", ".")) - 
             parseFloat(a.yield.replace("%", "").replace(",", "."));
    } else if (sortBy === "term") {
      return parseInt(a.term) - parseInt(b.term);
    } else {
      return parseFloat(b.yield.replace("%", "").replace(",", ".")) - 
             parseFloat(a.yield.replace("%", "").replace(",", "."));
    }
  });

  return (
    <section id="marketplace" className="py-16 bg-white dark:bg-gray-950">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Ofertas de Tokens (Marketplace)
          </h2>
          <p className="text-muted-foreground max-w-[700px]">
            Explore todas as oportunidades de investimento em recebíveis tokenizados de ILPIs.
            Filtre por status, prazo ou rentabilidade.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nome ou instituição..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                className="gap-2"
                onClick={() => setSortBy(sortBy === "yield" ? "term" : "yield")}
              >
                <ArrowUpDown className="h-4 w-4" />
                <span>Ordenar por {sortBy === "yield" ? "Rentabilidade" : "Prazo"}</span>
              </Button>
              <Button 
                variant="outline"
                size="icon"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveFilter}>
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="available">Disponíveis</TabsTrigger>
              <TabsTrigger value="low-risk">Menor Risco</TabsTrigger>
              <TabsTrigger value="high-yield">Maior Rendimento</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTokens.map((token, index) => {
            const capturedAmount = parseFloat(token.capturedAmount.replace(/\./g, "").replace(",", ".")) || 0;
            const totalVolume = parseFloat(token.totalVolume.replace(/\./g, "").replace(",", ".")) || 0;
            
            return (
              <motion.div
                key={token.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                  <CardHeader className="p-4 pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold">{token.name}</h3>
                        <p className="text-sm text-muted-foreground">Por {token.institution}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge 
                        variant={token.status === "Finalizada" ? "secondary" : "info"} 
                        className="text-xs"
                      >
                        {token.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        RCVM {token.regulation}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {token.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Risco</p>
                        <div className="flex items-center gap-2">
                          <RiskIndicator score={token.riskScore} />
                        </div>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-sm text-muted-foreground">Rentabilidade</p>
                        <p className="text-lg font-bold text-green-500">{token.yield}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Prazo</span>
                        <span className="font-medium">{token.term} dias</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Valor Mínimo</span>
                        <span className="font-medium">R$ {token.minInvestment}</span>
                      </div>
                    </div>

                    <RiskAnalysisModal token={token} />

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleAmountSelect(token.minInvestment, token)}
                      >
                        Mínimo
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleAmountSelect(token.totalVolume, token)}
                      >
                        Máximo
                      </Button>
                    </div>

                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Valor do investimento"
                        value={investmentAmounts.get(token.id) || ""}
                        onChange={(e) => setInvestmentAmounts(new Map(investmentAmounts.set(token.id, e.target.value)))}
                        className="pr-20"
                      />
                      <Button
                        className="absolute right-1 top-1 h-7"
                        onClick={() => handlePurchase(token)}
                      >
                        Investir
                      </Button>
                    </div>
                  </CardContent>
                  {token.status === "Finalizada" && (
                    <CardFooter className="p-4 pt-0">
                      <Button variant="outline" className="w-full" disabled>
                        Captação Finalizada
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredTokens.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 mb-4 text-muted-foreground">
              <Search className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium mb-2">Nenhum token encontrado</h3>
            <p className="text-muted-foreground">
              Tente ajustar seus filtros ou termos de busca.
            </p>
          </div>
        )}

        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar investimento</AlertDialogTitle>
              <AlertDialogDescription>
                Você está prestes a investir R$ {selectedToken && investmentAmounts.get(selectedToken.id)} em {selectedToken?.name}.
                Este valor será debitado do seu saldo em carteira.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmPurchase}>
                Confirmar Investimento
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </section>
  );
}