import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { HelpCircle } from "lucide-react";

export default function PerguntasComuns() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container py-12">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="text-[#003087]" size={40} />
            <h1 className="text-4xl font-bold text-[#003087]">Perguntas Frequentes</h1>
          </div>
          <p className="text-lg text-gray-700 mb-8">
            Encontre respostas para as dúvidas mais comuns sobre a Copart.
          </p>
          
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-[#003087] mb-3">
                Como faço para me cadastrar?
              </h3>
              <p className="text-gray-700">
                O cadastro é gratuito e pode ser feito online. Você precisará enviar
                documentos básicos como RG ou CNH com CPF.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-[#003087] mb-3">
                Posso visitar o veículo antes de comprar?
              </h3>
              <p className="text-gray-700">
                Sim! Você pode agendar uma visita ao pátio para inspecionar o veículo
                pessoalmente antes de dar seu lance.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-[#003087] mb-3">
                Quais são as formas de pagamento?
              </h3>
              <p className="text-gray-700">
                Aceitamos diversas formas de pagamento incluindo transferência bancária,
                PIX e cartão de crédito.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-[#003087] mb-3">
                Como funciona a retirada do veículo?
              </h3>
              <p className="text-gray-700">
                Após a aprovação do pagamento, você receberá instruções para retirar
                o veículo no pátio indicado.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
