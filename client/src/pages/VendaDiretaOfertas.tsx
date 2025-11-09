import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tag } from "lucide-react";

export default function VendaDiretaOfertas() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container py-12">
          <div className="flex items-center gap-3 mb-6">
            <Tag className="text-[#003087]" size={40} />
            <h1 className="text-4xl font-bold text-[#003087]">Ofertas de Venda Direta</h1>
          </div>
          <p className="text-lg text-gray-700 mb-8">
            Compre agora sem precisar participar de leilões. Preços fixos e disponibilidade imediata.
          </p>
          
          <div className="bg-[#FDB714] p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-bold text-[#003087] mb-2">Compre Agora!</h2>
            <p className="text-[#003087]">
              Mais de 100 veículos disponíveis para compra imediata com preço fixo.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-[#003087] mb-4">Vantagens da Venda Direta</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-[#FDB714] font-bold">✓</span>
                <span>Compra imediata sem precisar esperar o leilão</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FDB714] font-bold">✓</span>
                <span>Preço fixo, sem surpresas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FDB714] font-bold">✓</span>
                <span>Disponibilidade imediata para retirada</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FDB714] font-bold">✓</span>
                <span>Processo simplificado de compra</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
