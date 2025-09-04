export function HowItWorks() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Como Funciona</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Participar dos leilões da Copart é simples e seguro. Siga estes passos para começar a comprar veículos online.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Registre-se</h3>
            <p className="text-gray-600">
              Crie sua conta gratuita e complete o processo de verificação para começar a participar dos leilões.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Busque Veículos</h3>
            <p className="text-gray-600">
              Use nossos filtros avançados para encontrar o veículo perfeito. Veja fotos, relatórios e histórico.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Faça Lances</h3>
            <p className="text-gray-600">
              Participe dos leilões ao vivo ou faça lances pré-autorizados. Acompanhe em tempo real.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">4</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Retire o Veículo</h3>
            <p className="text-gray-600">
              Após ganhar o leilão, efetue o pagamento e retire seu veículo em uma de nossas localidades.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Por que escolher a Copart?</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Maior Inventário</h3>
                  <p className="text-gray-600">Mais de 50.000 veículos disponíveis mensalmente em todo o Brasil.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Transparência Total</h3>
                  <p className="text-gray-600">Fotos detalhadas, relatórios de condição e histórico completo de cada veículo.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Leilões Ao Vivo</h3>
                  <p className="text-gray-600">Participe de leilões em tempo real com nossa plataforma online avançada.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Suporte Especializado</h3>
                  <p className="text-gray-600">Equipe de especialistas para ajudar em todas as etapas do processo.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Tipos de Veículos</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl mb-2">🚗</div>
                <h3 className="font-semibold">Carros</h3>
                <p className="text-sm text-gray-600">Sedans, hatchbacks, SUVs</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl mb-2">🚚</div>
                <h3 className="font-semibold">Caminhões</h3>
                <p className="text-sm text-gray-600">Pickups, comerciais</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl mb-2">🏍️</div>
                <h3 className="font-semibold">Motocicletas</h3>
                <p className="text-sm text-gray-600">Todas as cilindradas</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl mb-2">🚛</div>
                <h3 className="font-semibold">Pesados</h3>
                <p className="text-sm text-gray-600">Equipamentos industriais</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Perguntas Frequentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Preciso pagar para me registrar?</h3>
              <p className="text-gray-600 mb-4">Não, o registro é completamente gratuito. Você só paga quando ganhar um leilão.</p>

              <h3 className="font-semibold mb-2">Como funciona o pagamento?</h3>
              <p className="text-gray-600 mb-4">Aceitamos transferência bancária, PIX e cartão de crédito. O pagamento deve ser feito em até 3 dias úteis.</p>

              <h3 className="font-semibold mb-2">Posso inspecionar o veículo antes?</h3>
              <p className="text-gray-600">Sim, oferecemos dias de inspeção em nossas localidades. Também fornecemos relatórios detalhados online.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Há taxas adicionais?</h3>
              <p className="text-gray-600 mb-4">Sim, há uma taxa de documentação e taxa de leilão que variam conforme o valor do veículo.</p>

              <h3 className="font-semibold mb-2">Como retiro o veículo?</h3>
              <p className="text-gray-600 mb-4">Após o pagamento, você tem até 5 dias úteis para retirar o veículo em nossa localidade.</p>

              <h3 className="font-semibold mb-2">Posso revender o veículo?</h3>
              <p className="text-gray-600">Sim, muitos de nossos clientes são revendedores. Oferecemos condições especiais para dealers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
