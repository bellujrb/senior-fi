"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Wallet, Menu, LogOut, Copy, ExternalLink, RefreshCw } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { ConnectWalletModal } from "@/components/connect-wallet-modal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NavigationMenuView } from "./navigation-menu";
import { ethers } from 'ethers';

interface WalletData {
  address: string;
  balance: string;
  connected: boolean;
  timestamp: number;
}

export function NavBar() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("0.0000");
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Função para carregar dados da carteira do localStorage
  const loadWalletData = () => {
    try {
      const walletDataString = localStorage.getItem("wallet-data");
      if (walletDataString) {
        const walletData: WalletData = JSON.parse(walletDataString);
        
        // Verificar se os dados não são muito antigos (opcional - 24 horas)
        const isDataFresh = Date.now() - walletData.timestamp < 24 * 60 * 60 * 1000;
        
        if (walletData.connected && isDataFresh) {
          setConnected(true);
          setAddress(walletData.address);
          setBalance(walletData.balance);
          return true;
        } else {
          // Limpar dados antigos
          localStorage.removeItem("wallet-data");
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados da carteira:", error);
      localStorage.removeItem("wallet-data");
    }
    return false;
  };

  // Carregar dados da carteira ao montar o componente
  useEffect(() => {
    loadWalletData();
  }, []);

  // Verificar se a carteira ainda está conectada no MetaMask
  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== "undefined" && connected) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length === 0) {
          // MetaMask foi desconectado
          handleLogout();
        } else if (accounts[0] !== address) {
          // Conta foi alterada
          const newAddress = accounts[0];
          await updateWalletData(newAddress);
        }
      } catch (error) {
        console.error("Erro ao verificar conexão da carteira:", error);
      }
    }
  };

  // Atualizar dados da carteira
  const updateWalletData = async (walletAddress: string) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(walletAddress);
      const balanceInBNB = ethers.formatEther(balance);
      const formattedBalance = parseFloat(balanceInBNB).toFixed(4);

      const walletData: WalletData = {
        address: walletAddress,
        balance: formattedBalance,
        connected: true,
        timestamp: Date.now()
      };

      localStorage.setItem("wallet-data", JSON.stringify(walletData));
      setAddress(walletAddress);
      setBalance(formattedBalance);
    } catch (error) {
      console.error("Erro ao atualizar dados da carteira:", error);
    }
  };

  // Verificar conexão periodicamente
  useEffect(() => {
    if (connected) {
      checkWalletConnection();
      const interval = setInterval(checkWalletConnection, 30000); // Verificar a cada 30 segundos
      return () => clearInterval(interval);
    }
  }, [connected, address]);

  // Handler para quando a carteira for conectada
  const handleWalletConnect = (walletAddress: string, walletBalance: string) => {
    setConnected(true);
    setAddress(walletAddress);
    setBalance(walletBalance);
  };

  // Handler para logout
  const handleLogout = () => {
    localStorage.removeItem("wallet-data");
    setConnected(false);
    setAddress("");
    setBalance("0.0000");
    router.push("/");
    toast({
      title: "Carteira desconectada",
      description: "Sua carteira foi desconectada com sucesso.",
    });
  };

  // Copiar endereço para clipboard
  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Endereço copiado!",
      description: "O endereço da sua carteira foi copiado para a área de transferência.",
    });
  };

  // Atualizar saldo manualmente
  const refreshBalance = async () => {
    if (!connected || !address) return;
    
    setIsRefreshing(true);
    try {
      await updateWalletData(address);
      toast({
        title: "Saldo atualizado",
        description: "O saldo da sua carteira foi atualizado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o saldo da carteira.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Formatar endereço para exibição
  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-8">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2 px-4">
              <span className="font-bold text-xl">SeniorFi</span>
            </Link>
            <div className="hidden md:flex ml-6">
              <NavigationMenuView />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {connected ? (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {address.slice(2, 4).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden md:flex flex-col items-start">
                        <span className="text-sm font-medium">{formatAddress(address)}</span>
                        <span className="text-xs text-muted-foreground">{balance} BNB</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72">
                    <DropdownMenuLabel>Minha Carteira</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="p-3 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Endereço</span>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={copyAddress}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => window.open(`https://testnet.bscscan.com/address/${address}`, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm font-mono bg-muted p-2 rounded">{address}</p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Saldo</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={refreshBalance}
                          disabled={isRefreshing}
                        >
                          <RefreshCw className={cn("h-3 w-3", isRefreshing && "animate-spin")} />
                        </Button>
                      </div>
                      <p className="text-sm font-semibold">{balance} BNB</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/portfolio">Minha Carteira</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Desconectar</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button onClick={() => setShowWalletModal(true)} className="flex items-center gap-2">
                <Wallet size={16} />
                <span className="hidden sm:inline">Conectar Carteira</span>
              </Button>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu size={16} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="flex flex-col gap-6 pt-6">
                  <Link href="/" className="flex items-center space-x-2">
                    <span className="font-bold">SeniorFi</span>
                  </Link>
                  
                  {connected && (
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {address.slice(2, 4).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{formatAddress(address)}</p>
                          <p className="text-xs text-muted-foreground">{balance} BNB</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-muted-foreground">Início</h4>
                      <div className="flex flex-col gap-2 pl-2">
                        <Link href="/#solution-explanation" className="text-sm">
                          Nossa Solução
                        </Link>
                        <Link href="/#solution-explanation" className="text-sm">
                          Como Funciona
                        </Link>
                        <Link href="/#best-opportunities" className="text-sm">
                          Melhores Oportunidades
                        </Link>
                      </div>
                    </div>
                    {connected && (
                      <Link href="/portfolio" className="text-sm font-medium">
                        Minha Carteira
                      </Link>
                    )}
                  </div>
                  {connected && (
                    <Button variant="outline" onClick={handleLogout} className="w-full">
                      <LogOut className="mr-2 h-4 w-4" />
                      Desconectar
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <ConnectWalletModal 
        isOpen={showWalletModal} 
        onClose={() => setShowWalletModal(false)}
        onConnect={handleWalletConnect}
      />
    </>
  );
}