import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Info } from "lucide-react";

export default function VendaDiretaSobre() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container py-12">
          <div className="flex items-center gap-3 mb-6">
            <Info className="text-[#003087]" size={40} />
            <h1 className="text-4xl font-bold text-[#003087]">O que é Venda Direta?</h1>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold text-[#003087] mb-4">Entenda a Venda Direta</h2>
            <p className="text-gray-700 mb-4">
              A Venda Direta é uma modalidade de compra onde você adquire o veículo imediatamente,
              sem precisar participar de leilões. Os veículos têm preço fixo e estão disponíveis
              para compra instantânea.
            </p>
            <p className="text-gray-700 mb-4">
              Esta opção é ideal para quem precisa de agilidade e não quer esperar pela data do leilão.
              Você visualiza o preço, decide na hora e finaliza a compra de forma rápida e segura.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-[#003087] mb-3">Como Funciona</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Navegue pelos veículos disponíveis</li>
                <li>Escolha o veículo desejado</li>
                <li>Clique em "Comprar Agora"</li>
                <li>Finalize o pagamento</li>
                <li>Retire seu veículo</li>
              </ol>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-[#003087] mb-3">Vantagens</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Compra imediata</li>
                <li>• Preço fixo e transparente</li>
                <li>• Sem disputas de leilão</li>
                <li>• Processo simplificado</li>
                <li>• Disponibilidade garantida</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
