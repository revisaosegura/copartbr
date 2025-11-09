import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PesquisasSalvas() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container py-12">
          <h1 className="text-4xl font-bold text-[#003087] mb-6">Pesquisas Salvas</h1>
          <p className="text-lg text-gray-700 mb-8">
            Acesse rapidamente suas pesquisas salvas.
          </p>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <p className="text-gray-600">
              Você ainda não salvou nenhuma pesquisa.
              Faça uma busca e salve para acessar rapidamente depois!
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
