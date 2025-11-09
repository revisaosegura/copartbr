import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Play } from "lucide-react";

export default function Videos() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container py-12">
          <div className="flex items-center gap-3 mb-6">
            <Play className="text-[#003087]" size={40} />
            <h1 className="text-4xl font-bold text-[#003087]">Vídeos Tutoriais</h1>
          </div>
          <p className="text-lg text-gray-700 mb-8">
            Aprenda a usar a plataforma Copart com nossos vídeos tutoriais.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                <Play className="text-[#003087]" size={64} />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">Como se Cadastrar</h3>
                <p className="text-sm text-gray-600">Aprenda a criar sua conta na Copart</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                <Play className="text-[#003087]" size={64} />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">Como Dar Lances</h3>
                <p className="text-sm text-gray-600">Tutorial completo sobre lances</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                <Play className="text-[#003087]" size={64} />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">Retirada de Veículos</h3>
                <p className="text-sm text-gray-600">Como retirar seu veículo</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
