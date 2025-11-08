import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Registrar() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Cadastro realizado com sucesso!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-16">
        <div className="container">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8">
              <h1 className="text-3xl font-bold text-[#003087] mb-6 text-center">Criar Conta</h1>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Nome Completo</label>
                  <Input placeholder="Digite seu nome completo" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <Input type="email" placeholder="seu@email.com" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">CPF</label>
                  <Input placeholder="000.000.000-00" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Telefone</label>
                  <Input type="tel" placeholder="(00) 00000-0000" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Senha</label>
                  <Input type="password" placeholder="Crie uma senha forte" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Confirmar Senha</label>
                  <Input type="password" placeholder="Repita sua senha" required />
                </div>
                <div className="flex items-start gap-2">
                  <input type="checkbox" id="terms" required className="mt-1" />
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    Aceito os termos de uso e política de privacidade
                  </label>
                </div>
                <Button type="submit" className="w-full bg-[#FDB714] hover:bg-[#e5a512] text-black font-semibold">
                  Criar Conta
                </Button>
              </form>
              <p className="text-center text-sm text-gray-600 mt-4">
                Já tem uma conta?{" "}
                <Link href="/entrar">
                  <a className="text-[#003087] font-semibold hover:underline">Entrar</a>
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
