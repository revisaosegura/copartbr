import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShoppingCart, UserPlus, Search, Gavel } from "lucide-react";

export default function ComoComprar() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container py-12">
          <h1 className="text-4xl font-bold text-[#003087] mb-6">Como Comprar</h1>
          <p className="text-lg text-gray-700 mb-8">
            Comprar na Copart é fácil e seguro. Siga nosso passo a passo.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <UserPlus className="text-[#FDB714]" size={32} />
                <h2 className="text-2xl font-semibold text-[#003087]">1. Cadastre-se</h2>
              </div>
              <p className="text-gray-700">
                Crie sua conta gratuitamente e envie sua documentação básica (RG ou CNH com CPF).
                Para pessoa jurídica, envie também o contrato social.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <Search className="text-[#FDB714]" size={32} />
                <h2 className="text-2xl font-semibold text-[#003087]">2. Encontre seu Veículo</h2>
              </div>
              <p className="text-gray-700">
                Use nosso Localizador de Veículos para encontrar o carro ideal.
                Filtre por marca, modelo, ano, localização e muito mais.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <Gavel className="text-[#FDB714]" size={32} />
                <h2 className="text-2xl font-semibold text-[#003087]">3. Dê seu Lance</h2>
              </div>
              <p className="text-gray-700">
                Participe dos leilões online e dê seus lances. Você pode fazer lances
                preliminares ou disputar ao vivo com outros compradores.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <ShoppingCart className="text-[#FDB714]" size={32} />
                <h2 className="text-2xl font-semibold text-[#003087]">4. Finalize a Compra</h2>
              </div>
              <p className="text-gray-700">
                Se você vencer o leilão, finalize o pagamento e retire seu veículo
                no pátio indicado. Simples e seguro!
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
