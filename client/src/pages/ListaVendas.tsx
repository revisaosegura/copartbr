import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ListaVendas() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container py-12">
          <h1 className="text-4xl font-bold text-[#003087] mb-6">Lista de Vendas</h1>
          <p className="text-lg text-gray-700 mb-8">
            Visualize todas as vendas disponíveis em nossa plataforma.
          </p>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <p className="text-gray-600">
              Funcionalidade em desenvolvimento. Em breve você poderá visualizar
              todas as vendas ativas e finalizadas.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
