import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar } from "lucide-react";

export default function LeiloesHoje() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container py-12">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="text-[#003087]" size={40} />
            <h1 className="text-4xl font-bold text-[#003087]">Leilões de Hoje</h1>
          </div>
          <p className="text-lg text-gray-700 mb-8">
            Confira todos os leilões acontecendo hoje e participe em tempo real.
          </p>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-[#003087] mb-4">Leilões Ativos</h2>
            <p className="text-gray-600 mb-6">
              Visualize os leilões que estão acontecendo agora e dê seus lances.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                <h3 className="font-semibold text-lg mb-2">Leilão São Paulo - SP</h3>
                <p className="text-sm text-gray-600 mb-2">Início: 10:00</p>
                <p className="text-sm text-gray-600">Veículos: 150+</p>
              </div>
              <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                <h3 className="font-semibold text-lg mb-2">Leilão Rio de Janeiro - RJ</h3>
                <p className="text-sm text-gray-600 mb-2">Início: 14:00</p>
                <p className="text-sm text-gray-600">Veículos: 200+</p>
              </div>
              <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                <h3 className="font-semibold text-lg mb-2">Leilão Curitiba - PR</h3>
                <p className="text-sm text-gray-600 mb-2">Início: 16:00</p>
                <p className="text-sm text-gray-600">Veículos: 100+</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
