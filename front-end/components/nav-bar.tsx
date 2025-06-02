"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Wallet, Menu, LogOut, Copy, ExternalLink } from "lucide-react";
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

export function NavBar() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [, setBalance] = useState("0,00");
  const [showWalletModal, setShowWalletModal] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const isConnected = window.localStorage.getItem("wallet-connected");
    if (isConnected) {
      setConnected(true);
      setAddress("0x1234...5678");
      setBalance("0,00");
    }
  }, []);

  const handleWalletConnect = () => {
    setConnected(true);
    setAddress("0x1234...5678");
    setBalance("0,00");
  };

  const handleLogout = () => {
    window.localStorage.removeItem("wallet-connected");
    setConnected(false);
    router.push("/");
    toast({
      title: "Carteira desconectada",
      description: "Sua carteira foi desconectada com sucesso.",
    });
  };

  const copyAddress = () => {
    navigator.clipboard.writeText("0x1234567890abcdef1234567890abcdef12345678");
    toast({
      title: "Endereço copiado!",
      description: "O endereço da sua carteira foi copiado para a área de transferência.",
    });
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
                        <span className="text-sm font-medium">{address}</span>
                        <span className="text-xs text-muted-foreground">Carteira</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Minha Carteira</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="p-2">
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
                            onClick={() => window.open(`https://bscscan.com/address/${address}`, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm font-mono mt-1">{address}</p>
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