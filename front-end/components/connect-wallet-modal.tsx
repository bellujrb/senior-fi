"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
}

export function ConnectWalletModal({ isOpen, onClose, onConnect }: ConnectWalletModalProps) {
  const { toast } = useToast();
  const router = useRouter();

  const handleConnectWallet = () => {
    localStorage.setItem("wallet-connected", "true");
    toast({
      title: "Carteira conectada!",
      description: "Sua carteira foi conectada com sucesso.",
    });
    onConnect(); 
    onClose();
    router.push("/");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Conectar Carteira</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <Button 
              onClick={handleConnectWallet}
              className="w-full h-14 text-lg"
            >
              <Wallet className="mr-2 h-5 w-5" />
              Conectar Carteira
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
                Criar Carteira
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