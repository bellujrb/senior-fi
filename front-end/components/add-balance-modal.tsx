"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface AddBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBalance: (amount: string) => void;
}

export function AddBalanceModal({ isOpen, onClose, onAddBalance }: AddBalanceModalProps) {
  const [amount, setAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"pix" | "boleto" | null>(null);

  const handleAmountChange = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    
    if (!numbers) {
      setAmount("");
      return;
    }

    const number = parseInt(numbers);
    const formatted = (number / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    setAmount(formatted);
  };

  const handleAmountSelect = (value: string) => {
    setAmount(value);
  };

  const handleConfirm = () => {
    if (!amount) {
      toast.error("Valor inválido", {
        description: "Por favor, insira um valor válido.",
      });
      return;
    }

    if (!selectedPaymentMethod) {
      toast.error("Método de pagamento não selecionado", {
        description: "Por favor, selecione um método de pagamento.",
      });
      return;
    }

    onAddBalance(amount);
    onClose();
    setAmount("");
    setSelectedPaymentMethod(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar saldo</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Valor do depósito</h4>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                onClick={() => handleAmountSelect("100,00")}
                className={amount === "100,00" ? "border-primary" : ""}
              >
                R$ 100
              </Button>
              <Button
                variant="outline"
                onClick={() => handleAmountSelect("500,00")}
                className={amount === "500,00" ? "border-primary" : ""}
              >
                R$ 500
              </Button>
              <Button
                variant="outline"
                onClick={() => handleAmountSelect("1000,00")}
                className={amount === "1000,00" ? "border-primary" : ""}
              >
                R$ 1.000
              </Button>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                R$
              </span>
              <Input
                type="text"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="pl-8"
                placeholder="0,00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Método de pagamento</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedPaymentMethod("pix")}
                className={selectedPaymentMethod === "pix" ? "border-primary" : ""}
              >
                PIX
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedPaymentMethod("boleto")}
                className={selectedPaymentMethod === "boleto" ? "border-primary" : ""}
              >
                Boleto
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm}>
              Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 