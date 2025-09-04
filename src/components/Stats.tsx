export function Stats() {
  return (
    <div className="bg-white py-16 border-b">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">2.5M+</div>
            <div className="text-gray-600 text-sm md:text-base">Veículos vendidos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">150+</div>
            <div className="text-gray-600 text-sm md:text-base">Localidades</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">750K+</div>
            <div className="text-gray-600 text-sm md:text-base">Membros ativos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">25+</div>
            <div className="text-gray-600 text-sm md:text-base">Anos de experiência</div>
          </div>
        </div>
      </div>
    </div>
  );
}
