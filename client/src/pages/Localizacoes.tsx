import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Clock } from "lucide-react";

export default function Localizacoes() {
  const locations = [
    {
      id: "1",
      name: "Copart São Paulo",
      address: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP",
      phone: "(11) 3000-0000",
      hours: "Seg-Sex: 8h-18h | Sáb: 8h-12h",
    },
    {
      id: "2",
      name: "Copart Rio de Janeiro",
      address: "Av. Rio Branco, 500 - Centro, Rio de Janeiro - RJ",
      phone: "(21) 3000-0000",
      hours: "Seg-Sex: 8h-18h | Sáb: 8h-12h",
    },
    {
      id: "3",
      name: "Copart Curitiba",
      address: "Rua XV de Novembro, 300 - Centro, Curitiba - PR",
      phone: "(41) 3000-0000",
      hours: "Seg-Sex: 8h-18h | Sáb: 8h-12h",
    },
    {
      id: "4",
      name: "Copart Belo Horizonte",
      address: "Av. Afonso Pena, 800 - Centro, Belo Horizonte - MG",
      phone: "(31) 3000-0000",
      hours: "Seg-Sex: 8h-18h | Sáb: 8h-12h",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-[#002366] via-[#003087] to-[#004099] text-white py-16">
          <div className="container">
            <h1 className="text-5xl font-bold mb-6">Nossas Localizações</h1>
            <p className="text-xl text-gray-200">
              Encontre a unidade Copart mais próxima de você.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {locations.map((location) => (
                <Card key={location.id}>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-[#003087] mb-4">{location.name}</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 text-gray-700">
                        <MapPin className="text-[#FDB714] mt-1 flex-shrink-0" size={20} />
                        <span>{location.address}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <Phone className="text-[#FDB714]" size={20} />
                        <span>{location.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <Clock className="text-[#FDB714]" size={20} />
                        <span>{location.hours}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
