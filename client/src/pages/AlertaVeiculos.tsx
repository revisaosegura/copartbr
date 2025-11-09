import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AlertaVeiculos() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container py-12">
          <h1 className="text-4xl font-bold text-[#003087] mb-6">Alerta de Veículos</h1>
          <p className="text-lg text-gray-700 mb-8">
            Configure alertas para ser notificado quando novos veículos corresponderem aos seus critérios.
          </p>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <p className="text-gray-600">
              Configure alertas personalizados e receba notificações quando veículos
              que correspondam aos seus critérios forem adicionados.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
