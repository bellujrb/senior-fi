"use client";

import { useState, useEffect } from "react";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, Search, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { AddBalanceModal } from "@/components/add-balance-modal";
import { toast } from "sonner";

interface Token {
  id: string;
  name: string;
  amount: string;
  purchaseDate: string;
  maturityDate: string;
}

interface Portfolio {
  totalBalance: string;
  availableBalance: string;
  investedBalance: string;
  expectedReturn: string;
  tokens: Token[];
}

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState<Portfolio>({
    totalBalance: "0,00",
    availableBalance: "0,00",
    investedBalance: "0,00",
    expectedReturn: "0,00",
    tokens: []
  });
  const [showAddBalanceModal, setShowAddBalanceModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verifica se está logado
    const isConnected = window.localStorage.getItem("wallet-connected");
    if (!isConnected) {
      router.push("/");
      return;
    }

    // Carrega o portfolio do localStorage
    const savedPortfolio = localStorage.getItem("portfolio");
    if (savedPortfolio) {
      setPortfolio(JSON.parse(savedPortfolio));
    }
  }, [router]);

  const handleAddBalance = (amount: string) => {
    const portfolio = JSON.parse(localStorage.getItem("portfolio") || JSON.stringify({
      totalBalance: "0,00",
      availableBalance: "0,00",
      investedBalance: "0,00",
      expectedReturn: "0,00",
      tokens: []
    }));

    const newAmount = parseFloat(amount.replace(".", "").replace(",", "."));
    const currentBalance = parseFloat(portfolio.availableBalance.replace(".", "").replace(",", "."));
    
    portfolio.availableBalance = (currentBalance + newAmount).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    portfolio.totalBalance = (parseFloat(portfolio.availableBalance.replace(".", "").replace(",", ".")) + 
                            parseFloat(portfolio.investedBalance.replace(".", "").replace(",", "."))).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    localStorage.setItem("portfolio", JSON.stringify(portfolio));
    setPortfolio(portfolio);

    toast.success("Saldo adicionado!", {
      description: `R$ ${amount} foram adicionados à sua carteira.`,
    });
  };

  return (
    <main className="min-h-screen bg-background">
      <NavBar />
      
      <div className="container px-4 md:px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Patrimônio total</h3>
                <div className="text-2xl font-bold">R$ {portfolio.totalBalance}</div>
              </div>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Saldo em carteira</span>
                  <span>R$ {portfolio.availableBalance}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Saldo investido</span>
                  <span>R$ {portfolio.investedBalance}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={() => setShowAddBalanceModal(true)}>Depositar</Button>
                <Button variant="outline">Sacar</Button>
                <Button variant="outline">Extrato</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Retorno esperado</h3>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  R$ {portfolio.expectedReturn}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tokens ativos</span>
                  <span>{portfolio.tokens.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Próximo vencimento</span>
                  <span>
                    {portfolio.tokens.length > 0 
                      ? portfolio.tokens.sort((a, b) => new Date(a.maturityDate).getTime() - new Date(b.maturityDate).getTime())[0].maturityDate
                      : "-"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Tabs defaultValue="tokens">
            <TabsList>
              <TabsTrigger value="tokens">Meus tokens</TabsTrigger>
              <TabsTrigger value="schedule">Cronograma de pagamentos</TabsTrigger>
              <TabsTrigger value="operations">Minhas operações</TabsTrigger>
            </TabsList>
            <div className="flex items-center justify-between my-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Buscar ativo" className="pl-10" />
              </div>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Baixar carteira com Excel
              </Button>
            </div>
            <TabsContent value="tokens" className="space-y-4">
              {portfolio.tokens.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Você ainda não possui tokens em sua carteira.</p>
                  <Button className="mt-4" onClick={() => window.location.href = '/#marketplace'}>
                    Explorar oportunidades
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {portfolio.tokens.map((token) => (
                    <Card key={token.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold">{token.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Comprado em {token.purchaseDate}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">R$ {token.amount}</p>
                            <p className="text-sm text-muted-foreground">
                              Vencimento em {token.maturityDate}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <AddBalanceModal 
        isOpen={showAddBalanceModal}
        onClose={() => setShowAddBalanceModal(false)}
        onAddBalance={handleAddBalance}
      />

      <Footer />
    </main>
  );
}