'use client';

import Link from "next/link";
import { BarChart3, Github, Twitter, Linkedin, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function Footer() {
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    if (!email) {
      toast({
        title: "E-mail não informado",
        description: "Por favor, informe seu e-mail para assinar a newsletter.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Assinatura realizada com sucesso!",
      description: "Você receberá nossas atualizações em breve.",
    });

    e.currentTarget.reset();
  };

  return (
    <footer className="border-t bg-background">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span className="font-bold text-xl">SeniorFi</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Tokenização de recebíveis para ILPIs, unindo tecnologia blockchain e cuidado com idosos.
            </p>
            <div className="flex space-x-3">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold">Empresa</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Nosso Time
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Carreiras
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Contato
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold">Recursos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Para ILPIs
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Para Investidores
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">Assine nossa newsletter</h4>
            <p className="text-sm text-muted-foreground">
              Receba atualizações sobre novas oportunidades e conteúdos exclusivos.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  name="email"
                  type="email"
                  placeholder="Seu email"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <Button type="submit" className="w-full">Assinar</Button>
            </form>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Seus dados estão seguros conosco</span>
            </div>
          </div>
        </div>
        <div className="border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; 2025 SeniorFi. Todos os direitos reservados.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
              Termos de Uso
            </Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
              Política de Privacidade
            </Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
              Compliance
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}