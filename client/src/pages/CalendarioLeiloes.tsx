import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar } from "lucide-react";

export default function CalendarioLeiloes() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container py-12">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="text-[#003087]" size={40} />
            <h1 className="text-4xl font-bold text-[#003087]">Calendário de Leilões</h1>
          </div>
          <p className="text-lg text-gray-700 mb-8">
            Planeje-se e não perca nenhum leilão. Confira nossa agenda completa.
          </p>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-[#003087] mb-4">Próximos Leilões</h2>
            <p className="text-gray-600 mb-6">
              Mais de 70 leilões mensais em todo o Brasil.
            </p>
            <div className="space-y-4">
              <div className="border-l-4 border-[#FDB714] pl-4 py-2">
                <h3 className="font-semibold">Segunda-feira, 11/11/2025</h3>
                <p className="text-sm text-gray-600">3 leilões agendados</p>
              </div>
              <div className="border-l-4 border-[#FDB714] pl-4 py-2">
                <h3 className="font-semibold">Terça-feira, 12/11/2025</h3>
                <p className="text-sm text-gray-600">5 leilões agendados</p>
              </div>
              <div className="border-l-4 border-[#FDB714] pl-4 py-2">
                <h3 className="font-semibold">Quarta-feira, 13/11/2025</h3>
                <p className="text-sm text-gray-600">4 leilões agendados</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
