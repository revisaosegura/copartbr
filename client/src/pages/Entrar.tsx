import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Entrar() {
  const [username, setUsername] = useState("Copart");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "" }));
        const message =
          error?.error?.length > 0
            ? error.error
            : "Credenciais inválidas. Verifique usuário e senha.";
        toast.error(message);
        return;
      }

      toast.success("Login realizado com sucesso!");
      window.location.href = "/admin";
    } catch (error) {
      console.error("Erro ao autenticar:", error);
      toast.error("Não foi possível realizar o login. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
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
                  <label className="block text-sm font-semibold mb-2">Usuário</label>
                  <Input
                    type="text"
                    value={username}
                    onChange={event => setUsername(event.target.value)}
                    placeholder="Copart"
                    autoComplete="username"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Senha</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    placeholder="Copart.2025"
                    autoComplete="current-password"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember" className="text-sm text-gray-700">Lembrar-me</label>
                  </div>
                  <a href="#" className="text-sm text-[#003087] hover:underline">Esqueceu a senha?</a>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#FDB714] hover:bg-[#e5a512] text-black font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Entrando..." : "Entrar"}
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
