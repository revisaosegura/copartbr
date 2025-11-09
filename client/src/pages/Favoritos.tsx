import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Favoritos() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container py-12">
          <h1 className="text-4xl font-bold text-[#003087] mb-6">Meus Favoritos</h1>
          <p className="text-lg text-gray-700 mb-8">
            Gerencie seus veículos favoritos.
          </p>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <p className="text-gray-600">
              Você ainda não adicionou nenhum veículo aos favoritos.
              Navegue pelo catálogo e salve seus veículos preferidos!
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
