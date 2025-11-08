import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Calendar, Clock, MapPin } from "lucide-react";

export default function Leiloes() {
  const upcomingAuctions = [
    {
      id: "1",
      title: "Leilão Especial - Veículos Premium",
      date: "15 de Novembro, 2024",
      time: "14:00 BRT",
      location: "São Paulo - SP",
      vehicleCount: 150,
    },
    {
      id: "2",
      title: "Leilão Porto Seguro",
      date: "18 de Novembro, 2024",
      time: "10:00 BRT",
      location: "Porto Seguro - BA",
      vehicleCount: 89,
    },
    {
      id: "3",
      title: "Leilão Banco Santander",
      date: "20 de Novembro, 2024",
      time: "15:00 BRT",
      location: "Rio de Janeiro - RJ",
      vehicleCount: 120,
    },
    {
      id: "4",
      title: "Leilão Bradesco Seguros",
      date: "22 de Novembro, 2024",
      time: "09:00 BRT",
      location: "Curitiba - PR",
      vehicleCount: 95,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#002366] via-[#003087] to-[#004099] text-white py-16">
          <div className="container">
            <h1 className="text-5xl font-bold mb-6">Leilões</h1>
            <p className="text-xl text-gray-200">
              Participe dos nossos leilões online e arremate veículos com os melhores preços.
            </p>
          </div>
        </section>

        {/* Próximos Leilões */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-4xl font-bold text-[#003087] mb-8">Próximos Leilões</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingAuctions.map((auction) => (
                <Card key={auction.id} className="hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-[#003087] mb-4">{auction.title}</h3>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-gray-700">
                        <Calendar className="text-[#FDB714]" size={20} />
                        <span>{auction.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <Clock className="text-[#FDB714]" size={20} />
                        <span>{auction.time}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <MapPin className="text-[#FDB714]" size={20} />
                        <span>{auction.location}</span>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-gray-700 mb-4">
                      {auction.vehicleCount} veículos disponíveis
                    </p>
                    <Link href={`/encontrar-veiculo`}>
                      <a>
                        <Button className="w-full bg-[#FDB714] hover:bg-[#e5a512] text-black font-semibold">
                          Ver Veículos do Leilão
                        </Button>
                      </a>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Como Participar */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <h2 className="text-4xl font-bold text-[#003087] mb-8 text-center">Como Participar</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#FDB714] rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold text-[#003087] mb-3">Cadastre-se</h3>
                <p className="text-gray-700">Crie sua conta e complete seu cadastro para participar dos leilões.</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-[#FDB714] rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold text-[#003087] mb-3">Escolha o Veículo</h3>
                <p className="text-gray-700">Navegue pelos leilões e selecione os veículos de seu interesse.</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-[#FDB714] rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold text-[#003087] mb-3">Faça seus Lances</h3>
                <p className="text-gray-700">Participe ao vivo e faça seus lances durante o leilão online.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
