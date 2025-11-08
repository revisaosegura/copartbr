import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRoute, Link } from "wouter";
import { MapPin, Calendar, Eye, Heart } from "lucide-react";
import { toast } from "sonner";

export default function VehicleDetail() {
  const [, params] = useRoute("/veiculo/:id");
  const vehicleId = params?.id;

  const vehicle = {
    id: vehicleId,
    title: "2023 FERRARI SF90 STRADALE 4.0 V8 BITURBO HIBRID",
    lotNumber: "1036018",
    currentBid: "R$ 200.000 BRL",
    location: "Leilão Pátio Porto Seguro - SP",
    year: "2023",
    brand: "Ferrari",
    model: "SF90 Stradale",
    color: "Vermelho",
    fuel: "Híbrido",
    transmission: "Automática",
    mileage: "5.000 km",
    condition: "Excelente",
    auctionDate: "15 de Novembro, 2024",
    images: ["/car1.jpg", "/car2.jpg", "/car3.jpg", "/car4.jpg"],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-8 bg-gray-50">
          <div className="container">
            <Link href="/encontrar-veiculo">
              <a className="text-[#003087] hover:underline mb-4 inline-block">&larr; Voltar para busca</a>
            </Link>
          </div>
        </section>
        <section className="py-8">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="mb-4">
                  <img src={vehicle.images[0]} alt={vehicle.title} className="w-full h-96 object-cover rounded-lg" />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {vehicle.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`${vehicle.title} ${idx + 1}`} className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75" />
                  ))}
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-[#003087] mb-4">{vehicle.title}</h1>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-lg text-gray-600">Lote: <strong>{vehicle.lotNumber}</strong></span>
                  <button onClick={() => toast.info("Adicionado aos favoritos!")} className="flex items-center gap-2 text-gray-600 hover:text-red-500">
                    <Heart size={20} /> Favoritar
                  </button>
                </div>
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-[#FDB714] mb-2">Lance Atual: {vehicle.currentBid}</div>
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <MapPin size={18} />
                      <span>{vehicle.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mb-6">
                      <Calendar size={18} />
                      <span>Leilão: {vehicle.auctionDate}</span>
                    </div>
                    <div className="flex gap-3">
                      <Button className="flex-1 bg-[#FDB714] hover:bg-[#e5a512] text-black font-semibold" onClick={() => toast.success("Lance registrado!")}>
                        Fazer Lance
                      </Button>
                      <Button variant="outline" className="flex-1 border-[#003087] text-[#003087] hover:bg-[#003087] hover:text-white" onClick={() => toast.info("Compra direta disponível em breve!")}>
                        Comprar Agora
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-[#003087] mb-4">Especificações</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div><strong>Ano:</strong> {vehicle.year}</div>
                      <div><strong>Marca:</strong> {vehicle.brand}</div>
                      <div><strong>Modelo:</strong> {vehicle.model}</div>
                      <div><strong>Cor:</strong> {vehicle.color}</div>
                      <div><strong>Combustível:</strong> {vehicle.fuel}</div>
                      <div><strong>Transmissão:</strong> {vehicle.transmission}</div>
                      <div><strong>Quilometragem:</strong> {vehicle.mileage}</div>
                      <div><strong>Condição:</strong> {vehicle.condition}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
