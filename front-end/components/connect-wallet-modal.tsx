"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (address: string, balance: string) => void;
}

export function ConnectWalletModal({ isOpen, onClose, onConnect }: ConnectWalletModalProps) {
  const { toast } = useToast();
  const router = useRouter();

  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      toast({
        title: "MetaMask não encontrada",
        description: "Por favor, instale a MetaMask para continuar.",
        variant: "destructive",
      });
      return;
    }
  
    setIsConnecting(true);

    try {
      // Solicita conexão da conta
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      
      if (!accounts || accounts.length === 0) {
        throw new Error("Nenhuma conta encontrada");
      }

      const address = accounts[0];
      console.log("Conta conectada:", address);
  
      // ID da rede BSC Testnet (hexadecimal)
      const chainId = "0x61"; // 97 decimal
  
      try {
        // Tenta mudar para a BSC Testnet
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId }],
        });
        console.log("Rede trocada para BSC Testnet");
      } catch (switchError: any) {
        // Se a rede ainda não estiver adicionada, adiciona
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId,
                  chainName: "BNB Smart Chain Testnet",
                  nativeCurrency: {
                    name: "BNB",
                    symbol: "BNB",
                    decimals: 18,
                  },
                  rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
                  blockExplorerUrls: ["https://testnet.bscscan.com"],
                },
              ],
            });
            console.log("Rede BSC Testnet adicionada com sucesso");
          } catch (addError) {
            console.error("Erro ao adicionar rede:", addError);
            toast({
              title: "Erro na rede",
              description: "Não foi possível adicionar a rede BSC Testnet.",
              variant: "destructive",
            });
            setIsConnecting(false);
            return;
          }
        } else {
          console.error("Erro ao trocar de rede:", switchError);
          toast({
            title: "Erro na rede",
            description: "Não foi possível trocar para a rede BSC Testnet.",
            variant: "destructive",
          });
          setIsConnecting(false);
          return;
        }
      }

      // Obter saldo da carteira
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(address);
      const balanceInBNB = ethers.formatEther(balance);
      const formattedBalance = parseFloat(balanceInBNB).toFixed(4);

      // Salvar informações no localStorage
      const walletData = {
        address,
        balance: formattedBalance,
        connected: true,
        timestamp: Date.now()
      };
      
      localStorage.setItem("wallet-data", JSON.stringify(walletData));

      // Chamar callback de conexão
      onConnect(address, formattedBalance);

      toast({
        title: "Carteira conectada!",
        description: `Conectado com sucesso: ${address.slice(0, 6)}...${address.slice(-4)}`,
      });

      // Fechar modal
      onClose();

    } catch (err: any) {
      console.error("Erro ao conectar carteira:", err);
      toast({
        title: "Erro na conexão",
        description: err.message || "Não foi possível conectar a carteira.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Listener para mudanças de conta
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // Usuário desconectou a carteira
          localStorage.removeItem("wallet-data");
          toast({
            title: "Carteira desconectada",
            description: "Sua carteira foi desconectada.",
          });
        }
      };

      const handleChainChanged = (chainId: string) => {
        // Recarregar a página quando a rede for alterada
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [toast]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Conectar Carteira</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <Button 
              onClick={connectWallet}
              className="w-full h-14 text-lg"
              disabled={isConnecting}
            >
              <Wallet className="mr-2 h-5 w-5" />
              {isConnecting ? "Conectando..." : "Conectar MetaMask"}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  ou
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground text-center">
                Não tem uma carteira?
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open('https://metamask.io/download/', '_blank')}
              >
                Instalar MetaMask
              </Button>
            </div>
          </div>

          <div className="rounded-lg border p-4 bg-muted/50">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Segurança</p>
                <p className="text-xs text-muted-foreground">
                  Sua carteira é protegida por criptografia de ponta a ponta. 
                  Nunca compartilhe sua chave privada ou seed phrase.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}