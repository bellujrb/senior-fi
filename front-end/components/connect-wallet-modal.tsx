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
  const [connectionStatus, setConnectionStatus] = useState<string>("");

  const connectWallet = async () => {
    setConnectionStatus("Iniciando conexão com carteira...");
    if (typeof window.ethereum === "undefined") {
      setConnectionStatus("MetaMask não encontrada");
      toast({
        title: "MetaMask não encontrada",
        description: "Por favor, instale a MetaMask para continuar.",
        variant: "destructive",
      });
      return;
    }
  
    setIsConnecting(true);
    setConnectionStatus("Solicitando conexão da carteira...");

    try {
      setConnectionStatus("Solicitando contas...");
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      
      if (!accounts || accounts.length === 0) {
        throw new Error("Nenhuma conta encontrada");
      }

      const address = accounts[0];
      setConnectionStatus("Conta conectada, verificando rede...");
  
      const chainId = "0x61";
  
      try {
        setConnectionStatus("Trocando para a rede BSC Testnet...");
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId }],
        });
        setConnectionStatus("Rede BSC Testnet configurada");
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            setConnectionStatus("Adicionando rede BSC Testnet...");
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
            setConnectionStatus("Rede BSC Testnet adicionada com sucesso");
          } catch (addError) {
            setConnectionStatus("Erro ao adicionar rede");
            toast({
              title: "Erro na rede",
              description: "Não foi possível adicionar a rede BSC Testnet.",
              variant: "destructive",
            });
            setIsConnecting(false);
            return;
          }
        } else {
          setConnectionStatus("Erro ao trocar de rede");
          toast({
            title: "Erro na rede",
            description: "Não foi possível trocar para a rede BSC Testnet.",
            variant: "destructive",
          });
          setIsConnecting(false);
          return;
        }
      }

      setConnectionStatus("Obtendo saldo da carteira...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(address);
      const balanceInBNB = ethers.formatEther(balance);
      const formattedBalance = parseFloat(balanceInBNB).toFixed(4);

      const walletData = {
        address,
        balance: formattedBalance,
        connected: true,
        timestamp: Date.now()
      };
      
      localStorage.setItem("wallet-data", JSON.stringify(walletData));
      onConnect(address, formattedBalance);

      setConnectionStatus("Carteira conectada com sucesso!");
      toast({
        title: "Carteira conectada!",
        description: `Conectado com sucesso: ${address.slice(0, 6)}...${address.slice(-4)}`,
      });

      onClose();

    } catch (err: any) {
      setConnectionStatus(`Erro: ${err.message || "Não foi possível conectar a carteira"}`);
      toast({
        title: "Erro na conexão",
        description: err.message || "Não foi possível conectar a carteira.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          localStorage.removeItem("wallet-data");
          toast({
            title: "Carteira desconectada",
            description: "Sua carteira foi desconectada.",
          });
        }
      };

      const handleChainChanged = (chainId: string) => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (typeof window.ethereum !== "undefined" && window.ethereum.removeListener) {
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
            
            {connectionStatus && (
              <p className="text-sm text-center text-muted-foreground">
                {connectionStatus}
              </p>
            )}

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