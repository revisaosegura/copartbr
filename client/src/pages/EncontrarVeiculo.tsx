import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Printer, Mail, Heart, BarChart2, Settings, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function EncontrarVeiculo() {
  const [showFilters, setShowFilters] = useState(true);
  const [selectedMakes, setSelectedMakes] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [resultsPerPage, setResultsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  // Buscar veículos do backend
  // Mock de veículos enquanto a API não está disponível
  const vehicles: any[] = [];
  const isLoading = false;

  const totalVehicles = vehicles?.length || 0;
  const totalPages = Math.ceil(totalVehicles / resultsPerPage);

  // Filtros disponíveis
  const makes = ["HONDA", "FORD", "VOLKSWAGEN", "FIAT", "CHEVROLET", "TOYOTA", "HYUNDAI", "NISSAN"];
  const years = ["2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016"];
  const conditions = ["RECUPERÁVEL", "IRRECUPERÁVEL", "RUNS AND DRIVES"];

  const toggleMake = (make: string) => {
    setSelectedMakes(prev =>
      prev.includes(make) ? prev.filter(m => m !== make) : [...prev, make]
    );
  };

  const toggleYear = (year: string) => {
    setSelectedYears(prev =>
      prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
    );
  };

  const toggleCondition = (condition: string) => {
    setSelectedConditions(prev =>
      prev.includes(condition) ? prev.filter(c => c !== condition) : [...prev, condition]
    );
  };

  const clearAllFilters = () => {
    setSelectedMakes([]);
    setSelectedYears([]);
    setSelectedConditions([]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Banner laranja */}
      <div className="bg-[#FF6600] text-white py-2 text-center">
        <p className="text-sm">
          Venda Seu Veículo De Forma Segura. Acesse o link e{" "}
          <Link href="/vender-meu-carro" className="underline font-semibold">
            Saiba Mais
          </Link>
        </p>
      </div>

      <main className="flex-1 bg-gray-100">
        <div className="container py-6">
          <div className="flex gap-6">
            {/* Sidebar de Filtros */}
            <aside className={`${showFilters ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden flex-shrink-0`}>
              <div className="bg-white rounded shadow-md p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#003087]">Opções de filtro</h2>
                  <button onClick={() => setShowFilters(!showFilters)}>
                    {showFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>

                <button
                  onClick={clearAllFilters}
                  className="text-sm text-[#003087] underline mb-4 hover:text-[#FDB714]"
                >
                  Limpar tudo
                </button>

                {/* Filtro de Marca */}
                <div className="mb-6">
                  <h3 className="font-semibold text-sm mb-2 text-[#003087]">MARCA</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {makes.map(make => (
                      <label key={make} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1">
                        <input
                          type="checkbox"
                          checked={selectedMakes.includes(make)}
                          onChange={() => toggleMake(make)}
                          className="rounded"
                        />
                        <span>{make}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Filtro de Ano */}
                <div className="mb-6">
                  <h3 className="font-semibold text-sm mb-2 text-[#003087]">ANO</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {years.map(year => (
                      <label key={year} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1">
                        <input
                          type="checkbox"
                          checked={selectedYears.includes(year)}
                          onChange={() => toggleYear(year)}
                          className="rounded"
                        />
                        <span>{year}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Filtro de Condição */}
                <div className="mb-6">
                  <h3 className="font-semibold text-sm mb-2 text-[#003087]">CONDIÇÃO</h3>
                  <div className="space-y-2">
                    {conditions.map(condition => (
                      <label key={condition} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1">
                        <input
                          type="checkbox"
                          checked={selectedConditions.includes(condition)}
                          onChange={() => toggleCondition(condition)}
                          className="rounded"
                        />
                        <span>{condition}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Checkbox Excluir Vendas Futuras */}
                <div className="mb-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span>Excluir Vendas Futuras</span>
                  </label>
                </div>
              </div>
            </aside>

            {/* Área Principal */}
            <div className="flex-1 min-w-0">
              {/* Cabeçalho de Resultados */}
              <div className="bg-white rounded shadow-md p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold text-[#003087]">Resultados de Busca</h1>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      <Printer size={16} className="mr-1" /> Imprimir
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Mail size={16} className="mr-1" /> E-mail
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm text-gray-600">Filtros aplicados:</span>
                  <span className="text-sm">Nenhum filtro aplicado</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Heart size={16} className="mr-1" /> Adicionar aos Favoritos
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <BarChart2 size={16} className="mr-1" /> Comparar
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Settings size={16} className="mr-1" /> Personalizar Lista
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    Ocultar Imagens
                  </Button>
                </div>
              </div>

              {/* Controles de Paginação Superior */}
              <div className="bg-white rounded shadow-md p-3 mb-4 flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span>
                    Mostrando {(currentPage - 1) * resultsPerPage + 1} a{" "}
                    {Math.min(currentPage * resultsPerPage, totalVehicles)} de {totalVehicles} registros
                  </span>
                  <div className="flex items-center gap-2">
                    <label>Mostrar</label>
                    <select
                      value={resultsPerPage}
                      onChange={(e) => setResultsPerPage(Number(e.target.value))}
                      className="border rounded px-2 py-1"
                    >
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <label>resultados</label>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  <span className="px-3">{currentPage}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Próximo
                  </Button>
                </div>
              </div>

              {/* Grid de Veículos */}
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003087]"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {vehicles && vehicles.length > 0 ? (
                    vehicles.map((vehicle: any) => (
                      <div key={vehicle.id} className="bg-white rounded shadow-md p-4 flex gap-4 hover:shadow-lg transition-shadow">
                        {/* Imagem do Veículo */}
                        <div className="w-48 h-36 flex-shrink-0">
                          <img
                            src={vehicle.images?.[0] || "/placeholder-car.jpg"}
                            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>

                        {/* Informações do Veículo */}
                        <div className="flex-1 min-w-0">
                          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-sm mb-2">
                            <div>
                              <span className="font-semibold">Lote:</span>
                              <p>{vehicle.lotNumber}</p>
                            </div>
                            <div>
                              <span className="font-semibold">Ano:</span>
                              <p>{vehicle.year}</p>
                            </div>
                            <div>
                              <span className="font-semibold">Marca:</span>
                              <p>{vehicle.make}</p>
                            </div>
                            <div>
                              <span className="font-semibold">Modelo:</span>
                              <p className="truncate">{vehicle.model}</p>
                            </div>
                            <div>
                              <span className="font-semibold">Condição:</span>
                              <p className="text-xs truncate">{vehicle.condition}</p>
                            </div>
                            <div>
                              <span className="font-semibold">Localização:</span>
                              <p className="text-xs truncate">{vehicle.location}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex gap-4">
                              <div>
                                <span className="text-xs text-gray-600">Lance Atual:</span>
                                <p className="text-lg font-bold text-[#003087]">
                                  R$ {vehicle.currentBid?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                                </p>
                              </div>
                              <div>
                                <span className="text-xs text-gray-600">Data do Leilão:</span>
                                <p className="text-sm">{new Date(vehicle.auctionDate).toLocaleDateString('pt-BR')}</p>
                              </div>
                            </div>

                            <Link href={`/veiculo/${vehicle.id}`}>
                              <Button className="bg-[#003087] hover:bg-[#002366] text-white">
                                Dar Lance Agora
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white rounded shadow-md p-12 text-center">
                      <p className="text-gray-600 text-lg">Nenhum veículo encontrado</p>
                      <p className="text-gray-500 text-sm mt-2">Tente ajustar seus filtros de busca</p>
                    </div>
                  )}
                </div>
              )}

              {/* Controles de Paginação Inferior */}
              <div className="bg-white rounded shadow-md p-3 mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <label>Visitar a página</label>
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => setCurrentPage(Number(e.target.value))}
                    className="border rounded px-2 py-1 w-16"
                  />
                  <Button variant="outline" size="sm">Ir</Button>
                </div>

                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Voltar ao Topo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
