import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRoute, Link } from "wouter";
import { MapPin, Calendar, Heart } from "lucide-react";
import { toast } from "sonner";
import BiddingPanel from "@/components/BiddingPanel";
import { trpc } from "@/lib/trpc";

export default function VehicleDetail() {
  const [, params] = useRoute("/veiculo/:id");
  const vehicleId = params?.id;
  const numericId = vehicleId ? Number(vehicleId) : undefined;

  const { data: vehicle, isLoading } = trpc.vehicles.getById.useQuery(
    { id: numericId ?? 0 },
    { enabled: Number.isFinite(numericId) }
  );

  const galleryImages = vehicle?.image ? [vehicle.image] : ["/placeholder-car.jpg"];
  const currentBidFormatted = vehicle
    ? (vehicle.currentBid / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
    : "0,00";
  const auctionDateLabel = vehicle?.auctionDate
    ? new Date(vehicle.auctionDate).toLocaleString("pt-BR", {
        dateStyle: "full",
        timeStyle: "short",
      })
    : "A confirmar";

  if (!vehicleId || !Number.isFinite(numericId)) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">Veículo não encontrado.</p>
        </main>
        <Footer />
      </div>
    );
  }

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
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003087]"></div>
              </div>
            ) : vehicle ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="mb-4">
                    <img
                      src={galleryImages[0]}
                      alt={vehicle.title}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {galleryImages.map((img, idx) => (
                      <img
                        key={`${img}-${idx}`}
                        src={img}
                        alt={`${vehicle.title} ${idx + 1}`}
                        className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75"
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-[#003087] mb-4">{vehicle.title}</h1>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-lg text-gray-600">
                      Lote: <strong>{vehicle.lotNumber}</strong>
                    </span>
                    <button
                      onClick={() => toast.info("Adicionado aos favoritos!")}
                      className="flex items-center gap-2 text-gray-600 hover:text-red-500"
                    >
                      <Heart size={20} /> Favoritar
                    </button>
                  </div>
                  <Card className="mb-6">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 text-gray-600 mb-4">
                        <MapPin size={18} />
                        <span>{vehicle.location || "Localização não disponível"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mb-4">
                        <Calendar size={18} />
                        <span>Leilão: {auctionDateLabel}</span>
                      </div>
                      {vehicle.saleStatus && (
                        <p className="text-sm text-gray-600 mb-4">
                          Status: <strong>{vehicle.saleStatus}</strong>
                        </p>
                      )}
                      <Button
                        variant="outline"
                        className="w-full border-[#003087] text-[#003087] hover:bg-[#003087] hover:text-white"
                        onClick={() => toast.info("Compra direta disponível em breve!")}
                      >
                        Comprar Agora
                      </Button>
                    </CardContent>
                  </Card>
                  <div className="mb-6">
                    <BiddingPanel
                      vehicleId={vehicle.id}
                      currentBid={vehicle.currentBid}
                      minBidIncrement={50000}
                    />
                  </div>
                  <Card className="mb-6">
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-[#003087] mb-2">Lance Atual</h3>
                        <p className="text-3xl font-semibold text-[#003087]">R$ {currentBidFormatted}</p>
                      </div>
                      {vehicle.description && (
                        <p className="text-gray-700 leading-relaxed">{vehicle.description}</p>
                      )}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold text-[#003087] mb-4">Especificações</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div><strong>Ano:</strong> {vehicle.year ?? "N/D"}</div>
                        <div><strong>Marca:</strong> {vehicle.brand ?? "N/D"}</div>
                        <div><strong>Modelo:</strong> {vehicle.model ?? "N/D"}</div>
                        <div><strong>Cor:</strong> {vehicle.color ?? "N/D"}</div>
                        <div><strong>Combustível:</strong> {vehicle.fuel ?? "N/D"}</div>
                        <div><strong>Transmissão:</strong> {vehicle.transmission ?? "N/D"}</div>
                        <div>
                          <strong>Quilometragem:</strong>{" "}
                          {vehicle.mileage ? `${vehicle.mileage.toLocaleString("pt-BR")} km` : "N/D"}
                        </div>
                        <div><strong>Condição:</strong> {vehicle.condition ?? "N/D"}</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded shadow-md p-12 text-center">
                <p className="text-gray-600 text-lg">Veículo não encontrado.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
