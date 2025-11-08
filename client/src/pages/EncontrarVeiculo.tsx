import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { getVehicles, updateVehiclePrices, addNewVehicles } from "@/lib/vehicleData";

export default function EncontrarVeiculo() {
  const [searchTerm, setSearchTerm] = useState("");
  const [vehicles, setVehicles] = useState(getVehicles(20));
  const [displayCount, setDisplayCount] = useState(20);

  useEffect(() => {
    // Atualizar preços a cada 30 segundos
    const priceInterval = setInterval(() => {
      updateVehiclePrices();
      setVehicles(getVehicles(displayCount));
    }, 30000);

    // Adicionar novos veículos a cada 2 minutos
    const newVehiclesInterval = setInterval(() => {
      addNewVehicles(3);
      setVehicles(getVehicles(displayCount));
    }, 120000);

    return () => {
      clearInterval(priceInterval);
      clearInterval(newVehiclesInterval);
    };
  }, [displayCount]);

  const handleLoadMore = () => {
    const newCount = displayCount + 20;
    setDisplayCount(newCount);
    setVehicles(getVehicles(newCount));
  };

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.lotNumber.includes(searchTerm)
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#002366] via-[#003087] to-[#004099] text-white py-16">
          <div className="container">
            <h1 className="text-5xl font-bold mb-6">Encontrar um Veículo</h1>
            <p className="text-xl text-gray-200 mb-8">
              Explore nosso catálogo com milhares de veículos disponíveis para compra.
            </p>
            <div className="max-w-2xl">
              <div className="flex gap-4">
                <Input
                  type="text"
                  placeholder="Buscar por marca, modelo ou número do lote..."
                  className="bg-white text-gray-900"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button className="bg-[#FDB714] hover:bg-[#e5a512] text-black font-semibold px-8">
                  Buscar
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Filtros */}
        <section className="py-8 bg-gray-50">
          <div className="container">
            <div className="flex flex-wrap gap-4">
              <Button variant="outline">Todos os Veículos</Button>
              <Button variant="outline">Automóveis</Button>
              <Button variant="outline">Caminhões</Button>
              <Button variant="outline">Motocicletas</Button>
              <Button variant="outline">SUVs</Button>
              <Button variant="outline">Vans</Button>
            </div>
          </div>
        </section>

        {/* Lista de Veículos */}
        <section className="py-16">
          <div className="container">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-[#003087]">
                {filteredVehicles.length} veículos encontrados
              </h2>
              <select className="px-4 py-2 border rounded">
                <option>Ordenar por: Mais Recentes</option>
                <option>Menor Preço</option>
                <option>Maior Preço</option>
                <option>Marca A-Z</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} {...vehicle} />
              ))}
            </div>
            {displayCount < getVehicles().length && (
              <div className="mt-12 text-center">
                <Button 
                  onClick={handleLoadMore}
                  className="bg-[#003087] hover:bg-[#002366] text-white font-semibold px-8"
                >
                  Carregar Mais Veículos
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
