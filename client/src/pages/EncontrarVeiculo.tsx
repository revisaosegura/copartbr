import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function EncontrarVeiculo() {
  const [searchTerm, setSearchTerm] = useState("");

  const vehicles = [
    {
      id: "1",
      image: "/car1.jpg",
      title: "2023 FERRARI SF90 STRADALE 4.0 V8 BITURBO HIBRID",
      lotNumber: "1036018",
      currentBid: "R$ 200.000 BRL",
      location: "Leilão Pátio Porto Seguro - SP",
    },
    {
      id: "2",
      image: "/car2.jpg",
      title: "2010 CHRYSLER PT CRUISER",
      lotNumber: "1007147",
      currentBid: "R$ 15.900 BRL",
      location: "Goiânia - GO",
    },
    {
      id: "3",
      image: "/car3.jpg",
      title: "2017 VOLKSWAGEN SAVEIRO CE",
      lotNumber: "1051575",
      currentBid: "R$ 34.900 BRL",
      location: "Embú das Artes - SP",
    },
    {
      id: "4",
      image: "/car4.jpg",
      title: "2018 FORD MUSTANG",
      lotNumber: "1042513",
      currentBid: "R$ 120.050 BRL",
      location: "Curitiba - PR",
    },
    {
      id: "5",
      image: "/car1.jpg",
      title: "2020 BMW X5 M SPORT",
      lotNumber: "1023456",
      currentBid: "R$ 180.000 BRL",
      location: "São Paulo - SP",
    },
    {
      id: "6",
      image: "/car2.jpg",
      title: "2019 TOYOTA COROLLA XEI",
      lotNumber: "1034567",
      currentBid: "R$ 68.900 BRL",
      location: "Rio de Janeiro - RJ",
    },
    {
      id: "7",
      image: "/car3.jpg",
      title: "2021 CHEVROLET ONIX PLUS",
      lotNumber: "1045678",
      currentBid: "R$ 52.000 BRL",
      location: "Belo Horizonte - MG",
    },
    {
      id: "8",
      image: "/car4.jpg",
      title: "2018 JEEP COMPASS LIMITED",
      lotNumber: "1056789",
      currentBid: "R$ 95.000 BRL",
      location: "Porto Alegre - RS",
    },
  ];

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
                {vehicles.length} veículos encontrados
              </h2>
              <select className="px-4 py-2 border rounded">
                <option>Ordenar por: Mais Recentes</option>
                <option>Menor Preço</option>
                <option>Maior Preço</option>
                <option>Marca A-Z</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} {...vehicle} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button className="bg-[#003087] hover:bg-[#002366] text-white font-semibold px-8">
                Carregar Mais Veículos
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
