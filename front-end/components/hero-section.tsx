'use client'
import { Button } from '@/components/ui/button'
import { ArrowRight, Mail, SendHorizonal } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

export function HeroSection6() {
    const { toast } = useToast()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string

        if (!email) {
            toast({
                title: "E-mail não informado",
                description: "Por favor, informe o e-mail da sua ILPI.",
                variant: "destructive"
            })
            return
        }

        toast({
            title: "Cadastro realizado com sucesso!",
            description: "Entraremos em contato em breve.",
        })

        e.currentTarget.reset()
    }

    return (
        <main>
            <section className="overflow-hidden">
                <div className="relative mx-auto w-[80%] px-6 py-28 lg:py-20">
                    <div className="lg:flex lg:items-center lg:gap-12">
                        <div className="relative z-10 mx-auto max-w-xl text-center lg:ml-0 lg:w-1/2 lg:text-left">
                            <Link
                                href="/"
                                className="rounded-lg mx-auto flex w-fit items-center gap-2 border p-1 pr-3 lg:ml-0">
                                <span className="bg-muted rounded-[calc(var(--radius)-0.25rem)] px-2 py-1 text-xs">Inovação Financeira</span>
                                <span className="text-sm">Para ILPIs e investidores</span>
                                <span className="bg-(--color-border) block h-4 w-px"></span>
                                <ArrowRight className="size-4" />
                            </Link>

                            <h1 className="mt-10 text-balance text-4xl font-bold md:text-5xl xl:text-5xl">
                                Conectamos investidores a instituições que cuidam de vidas
                            </h1>

                            <p className="mt-8 text-muted-foreground">
                                ILPIs agora podem antecipar seus recebíveis de forma simples, segura e com análise de risco por IA.
                                Investidores acessam uma nova classe de ativos com impacto social real.
                            </p>


                            <div>
                                <form
                                    onSubmit={handleSubmit}
                                    className="mx-auto my-10 max-w-sm lg:my-12 lg:ml-0 lg:mr-auto">
                                    <div className="bg-background relative grid grid-cols-[1fr_auto] items-center rounded-[1rem] border pr-1 shadow shadow-zinc-950/5 has-[input:focus]:ring-2 has-[input:focus]:ring-muted">
                                        <Mail className="text-caption pointer-events-none absolute inset-y-0 left-5 my-auto size-5" />

                                        <input
                                            name="email"
                                            placeholder="E-mail da sua ILPI"
                                            className="h-14 w-full bg-transparent pl-12 focus:outline-none"
                                            type="email"
                                        />

                                        <div className="md:pr-1.5 lg:pr-0">
                                            <Button type="submit" aria-label="Cadastrar ILPI">
                                                <span className="hidden md:block">Quero me cadastrar</span>
                                                <SendHorizonal
                                                    className="relative mx-auto size-5 md:hidden"
                                                    strokeWidth={2}
                                                />
                                            </Button>
                                        </div>
                                    </div>
                                </form>

                                <ul className="list-inside list-disc space-y-2 text-left text-sm text-muted-foreground">
                                    <li>Capital para ILPIs de forma rápida e sem burocracia</li>
                                    <li>Investimento com propósito e retorno atrativo</li>
                                    <li>Risco avaliado com inteligência artificial</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="absolute inset-0 -mx-4 rounded-3xl p-3 lg:col-span-3 hidden lg:block">
                        <div aria-hidden className="absolute z-[1] inset-0 bg-gradient-to-r from-background from-35%" />
                        <div className="relative">
                            <img
                                className="hidden dark:block object-cover rounded-xl"
                                src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2796&q=80"
                                alt="Cuidado com idosos"
                                width={2796}
                                height={2008}
                            />
                            <img
                                className="dark:hidden object-cover rounded-xl"
                                src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2796&q=80"
                                alt="Cuidado com idosos"
                                width={2796}
                                height={2008}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
