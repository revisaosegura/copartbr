import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function ComoFunciona() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#002366] via-[#003087] to-[#004099] text-white py-16">
          <div className="container">
            <h1 className="text-5xl font-bold mb-6">Como Funciona</h1>
            <p className="text-xl text-gray-200">
              Entenda como comprar e vender veículos na Copart de forma simples e segura.
            </p>
          </div>
        </section>

        {/* Como Comprar */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-4xl font-bold text-[#003087] mb-8">Como Comprar</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-[#FDB714] rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4">
                    1
                  </div>
                  <h3 className="text-2xl font-bold text-[#003087] mb-3">Cadastre-se</h3>
                  <p className="text-gray-700">
                    Crie sua conta gratuitamente na plataforma Copart. O processo é rápido e simples, basta preencher seus dados básicos.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-[#FDB714] rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4">
                    2
                  </div>
                  <h3 className="text-2xl font-bold text-[#003087] mb-3">Encontre seu Veículo</h3>
                  <p className="text-gray-700">
                    Navegue pelo nosso catálogo com milhares de veículos. Use os filtros para encontrar exatamente o que você procura.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-[#FDB714] rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4">
                    3
                  </div>
                  <h3 className="text-2xl font-bold text-[#003087] mb-3">Faça seu Lance ou Compre Direto</h3>
                  <p className="text-gray-700">
                    Participe dos leilões fazendo lances ou compre diretamente veículos disponíveis na Venda Direta.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Como Vender */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <h2 className="text-4xl font-bold text-[#003087] mb-8">Como Vender</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-[#003087] rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4">
                    1
                  </div>
                  <h3 className="text-2xl font-bold text-[#003087] mb-3">Cadastre seu Veículo</h3>
                  <p className="text-gray-700">
                    Informe os dados do seu veículo e envie fotos. Nossa equipe fará uma avaliação completa.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-[#003087] rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4">
                    2
                  </div>
                  <h3 className="text-2xl font-bold text-[#003087] mb-3">Defina o Preço</h3>
                  <p className="text-gray-700">
                    Você define o valor mínimo que deseja receber. A Copart seleciona o melhor canal de venda.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-[#003087] rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4">
                    3
                  </div>
                  <h3 className="text-2xl font-bold text-[#003087] mb-3">Receba o Pagamento</h3>
                  <p className="text-gray-700">
                    Após a venda, receba o pagamento de forma segura diretamente na sua conta bancária.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container text-center">
            <h2 className="text-4xl font-bold text-[#003087] mb-6">Pronto para começar?</h2>
            <p className="text-xl text-gray-700 mb-8">
              Cadastre-se agora e tenha acesso a milhares de veículos disponíveis.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/registrar">
                <a>
                  <Button className="bg-[#FDB714] hover:bg-[#e5a512] text-black font-bold text-lg px-8 py-6">
                    Cadastrar Agora
                  </Button>
                </a>
              </Link>
              <Link href="/encontrar-veiculo">
                <a>
                  <Button variant="outline" className="border-[#003087] text-[#003087] hover:bg-[#003087] hover:text-white font-bold text-lg px-8 py-6">
                    Ver Veículos
                  </Button>
                </a>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
