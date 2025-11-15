import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Phone, Mail, MessageCircle } from "lucide-react";

export default function PrecisaAjuda() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container py-12">
          <h1 className="text-4xl font-bold text-[#003087] mb-6">Precisa de Ajuda?</h1>
          <p className="text-lg text-gray-700 mb-8">
            Nossa equipe está pronta para ajudá-lo. Entre em contato conosco.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Phone className="text-[#FDB714] mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold text-[#003087] mb-2">Telefone</h3>
              <p className="text-gray-700">+55 11 92127-1104</p>
              <p className="text-sm text-gray-600 mt-2">Seg-Sex: 8h às 18h</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Mail className="text-[#FDB714] mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold text-[#003087] mb-2">E-mail</h3>
              <p className="text-gray-700">contato@copartbr.com.br</p>
              <p className="text-sm text-gray-600 mt-2">Resposta em até 24h</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <MessageCircle className="text-[#FDB714] mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold text-[#003087] mb-2">WhatsApp</h3>
              <p className="text-gray-700">+55 11 92127-1104</p>
              <p className="text-sm text-gray-600 mt-2">Atendimento rápido</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-[#003087] mb-4">Envie uma Mensagem</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome</label>
                <input type="text" className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">E-mail</label>
                <input type="email" className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Mensagem</label>
                <textarea className="w-full p-2 border rounded" rows={5}></textarea>
              </div>
              <button type="submit" className="bg-[#FDB714] text-black px-6 py-2 rounded font-semibold hover:bg-[#e5a512]">
                Enviar
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
