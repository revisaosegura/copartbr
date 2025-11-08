import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";

export default function VendaDireta() {
  const vehicles = [
    { id: "1", image: "/car1.jpg", title: "2023 BMW X5", lotNumber: "VD1001", currentBid: "R$ 180.000", location: "São Paulo - SP" },
    { id: "2", image: "/car2.jpg", title: "2021 TOYOTA COROLLA", lotNumber: "VD1002", currentBid: "R$ 68.900", location: "Rio de Janeiro - RJ" },
    { id: "3", image: "/car3.jpg", title: "2022 CHEVROLET ONIX", lotNumber: "VD1003", currentBid: "R$ 52.000", location: "Curitiba - PR" },
    { id: "4", image: "/car4.jpg", title: "2020 JEEP COMPASS", lotNumber: "VD1004", currentBid: "R$ 95.000", location: "Porto Alegre - RS" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-[#002366] via-[#003087] to-[#004099] text-white py-16">
          <div className="container">
            <h1 className="text-5xl font-bold mb-6">Venda Direta</h1>
            <p className="text-xl text-gray-200">Compre veículos com preço fixo, sem precisar participar de leilões.</p>
          </div>
        </section>
        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-[#003087] mb-8">Veículos Disponíveis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {vehicles.map((vehicle) => (<VehicleCard key={vehicle.id} {...vehicle} />))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
