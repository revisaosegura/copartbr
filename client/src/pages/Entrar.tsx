import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Entrar() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Login realizado com sucesso!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-16">
        <div className="container">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8">
              <h1 className="text-3xl font-bold text-[#003087] mb-6 text-center">Entrar</h1>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <Input type="email" placeholder="seu@email.com" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Senha</label>
                  <Input type="password" placeholder="Digite sua senha" required />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember" className="text-sm text-gray-700">Lembrar-me</label>
                  </div>
                  <a href="#" className="text-sm text-[#003087] hover:underline">Esqueceu a senha?</a>
                </div>
                <Button type="submit" className="w-full bg-[#FDB714] hover:bg-[#e5a512] text-black font-semibold">
                  Entrar
                </Button>
              </form>
              <p className="text-center text-sm text-gray-600 mt-4">
                Não tem uma conta?{" "}
                <Link href="/registrar">
                  <a className="text-[#003087] font-semibold hover:underline">Cadastre-se</a>
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
