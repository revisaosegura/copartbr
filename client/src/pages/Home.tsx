import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { Link } from "wouter";

export default function Home() {
  const featuredVehicles = [
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
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Banner de Destaque */}
      <div className="bg-[#FF6B00] text-white py-3 text-center">
        <p className="font-semibold">
          Venda Seu Veículo De Forma Segura. Acesse o link e{" "}
          <Link href="/vender-meu-carro">
            <a className="underline hover:text-gray-200">Saiba Mais &gt;</a>
          </Link>
        </p>
        <button className="absolute right-4 top-2 text-2xl hover:opacity-80">×</button>
      </div>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#002366] via-[#003087] to-[#004099] text-white py-20">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                <h1 className="text-5xl font-bold mb-6 leading-tight">
                  Conectando <span className="text-[#FDB714]">compradores</span> e{" "}
                  <span className="text-[#FDB714]">vendedores</span> ao redor do mundo.
                </h1>
                <p className="text-xl mb-4">
                  São + de <span className="text-[#FDB714] font-bold">12.487</span> veículos disponíveis para compra online.
                </p>
                <p className="text-lg text-gray-300">
                  De automóveis a caminhões, motocicletas e muito mais.
                </p>
              </div>

              {/* Right Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Venda Direta Card */}
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-[#FDB714] mb-4">Venda Direta</h3>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="text-[#FDB714] mt-1 flex-shrink-0" size={20} />
                        <span>Disponível 24h horas por dia</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="text-[#FDB714] mt-1 flex-shrink-0" size={20} />
                        <span>Veículos com laudo</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="text-[#FDB714] mt-1 flex-shrink-0" size={20} />
                        <span>Negociação intermediada</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="text-[#FDB714] mt-1 flex-shrink-0" size={20} />
                        <span>Diversas opções com garantia</span>
                      </li>
                    </ul>
                    <div className="flex gap-2">
                      <Link href="/venda-direta">
                        <a className="flex-1">
                          <Button className="w-full bg-[#FDB714] hover:bg-[#e5a512] text-black font-semibold">
                            Comprar
                          </Button>
                        </a>
                      </Link>
                      <Link href="/vender-meu-carro">
                        <a className="flex-1">
                          <Button className="w-full bg-white hover:bg-gray-100 text-black font-semibold">
                            Vender
                          </Button>
                        </a>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {/* Leilão Card */}
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-[#FDB714] mb-4">Leilão</h3>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="text-[#FDB714] mt-1 flex-shrink-0" size={20} />
                        <span>+ de 70 leilões mensais</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="text-[#FDB714] mt-1 flex-shrink-0" size={20} />
                        <span>De Bancos, Seguradoras, e mais</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="text-[#FDB714] mt-1 flex-shrink-0" size={20} />
                        <span>Faça seus lances online</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="text-[#FDB714] mt-1 flex-shrink-0" size={20} />
                        <span>Veículos com procedência</span>
                      </li>
                    </ul>
                    <div className="flex gap-2">
                      <Link href="/leiloes">
                        <a className="flex-1">
                          <Button className="w-full bg-[#FDB714] hover:bg-[#e5a512] text-black font-semibold">
                            Comprar
                          </Button>
                        </a>
                      </Link>
                      <Link href="/vender-meu-carro">
                        <a className="flex-1">
                          <Button className="w-full bg-white hover:bg-gray-100 text-black font-semibold">
                            Vender
                          </Button>
                        </a>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Veículos em Destaque */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <h2 className="text-4xl font-bold text-[#003087] mb-8">Veículos em destaque</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} {...vehicle} />
              ))}
            </div>
          </div>
        </section>

        {/* Mais opções, mais vantagens */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-4xl font-bold text-center text-[#003087] mb-4">
              Mais opções, mais vantagens e <span className="text-[#FDB714]">toda a segurança</span> que você procura para comprar e vender.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {/* Compre nos Leilões */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-[#003087] mb-4">Compre nos Leilões</h3>
                  <p className="text-gray-600 mb-4 font-semibold">Economia real com liberdade de escolha</p>
                  <ul className="space-y-3 text-sm text-gray-700">
                    <li>
                      <strong>Escolha o seu veículo</strong> em nosso catálogo, verifique a localização e visite o lote para conferir as condições do veículo.
                    </li>
                    <li>
                      Defina o valor máximo que deseja ofertar por um veículo com um <strong>lance preliminar</strong> ou dispute ao vivo com outros compradores através de <strong>lances firmes.</strong>
                    </li>
                    <li>
                      Veículos com origem conhecida e documentação regular, <strong>prontos para serem arrematados</strong>.
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Compre na Venda Direta */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-[#003087] mb-4">Compre na Venda Direta</h3>
                  <p className="text-gray-600 mb-4 font-semibold">Segurança e tranquilidade para comprar e sair dirigindo</p>
                  <ul className="space-y-3 text-sm text-gray-700">
                    <li>
                      <strong>Selecione o veículo</strong> desejado e agende sua visita na unidade disponível
                    </li>
                    <li>
                      Envie uma proposta ou garanta o seu veículo na hora por meio do botão <strong>"Compre Agora"</strong>
                    </li>
                    <li>
                      Veículos <strong>sem registro</strong> de sinistro, roubo, furto ou histórico de leilão
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Venda com a Copart */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-[#003087] mb-4">Venda com a Copart</h3>
                  <p className="text-gray-600 mb-4 font-semibold">Sem complicação e com a segurança da Copart</p>
                  <ul className="space-y-3 text-sm text-gray-700">
                    <li>
                      Aceitamos todos os modelos veículos com <strong>documentação regularizada</strong>, de antigos e colecionáveis até seminovos e avariados.
                    </li>
                    <li>
                      <strong>Você define o preço</strong> e a Copart seleciona o melhor canal de venda para alcançar a melhor oferta.
                    </li>
                    <li>
                      Não se arrisque com encontros em lugares sem segurança ou com pessoas desconhecidas, <strong>a Copart cuida de todo o processo,</strong> do anúncio ao pagamento.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Quem é a Copart */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <h2 className="text-4xl font-bold text-[#003087] mb-6">Quem é a Copart?</h2>
            <div className="prose max-w-none text-gray-700">
              <p className="text-lg leading-relaxed mb-4">
                Descubra a Copart, a plataforma líder em compra e venda de veículos. Reunimos em um só lugar um amplo catálogo de carros usados, recuperáveis e irrecuperáveis, oferecendo uma experiência simples, segura e eficiente tanto para quem quer comprar quanto para quem quer vender.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                Na Copart, você escolhe como quer negociar: comprando por meio de leilões dinâmicos ou através da Venda Direta, onde é possível adquirir veículos com valores fixos e imediatos, sem a necessidade de participar de um leilão. Para quem deseja vender, a Copart oferece uma oportunidade prática e segura de anunciar veículos de qualquer condição, alcançando milhares de compradores em todo o país.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                Atendemos a uma audiência diversificada, de consumidores finais e revendedores a desmontadores e oficinas, com total transparência e flexibilidade. Seja participando de um leilão ou comprando direto, a Copart transforma sua experiência automotiva. Cadastre-se e descubra como é simples comprar ou vender com quem mais entende de veículos.
              </p>
              <div className="text-center">
                <Link href="/registrar">
                  <a>
                    <Button className="bg-[#FDB714] hover:bg-[#e5a512] text-black font-bold text-lg px-8 py-6">
                      Faça seu cadastro
                    </Button>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categorias */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-4xl font-bold text-center text-[#003087] mb-12">
              Copart: sua plataforma de compra e venda online de veículos!
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Link href="/venda-direta">
                <a>
                  <Card className="hover:shadow-xl transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-4">🏪</div>
                      <h3 className="font-bold text-lg">Venda Direta</h3>
                    </CardContent>
                  </Card>
                </a>
              </Link>
              <Link href="/encontrar-veiculo">
                <a>
                  <Card className="hover:shadow-xl transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-4">🚗</div>
                      <h3 className="font-bold text-lg">Automóveis</h3>
                    </CardContent>
                  </Card>
                </a>
              </Link>
              <Link href="/encontrar-veiculo">
                <a>
                  <Card className="hover:shadow-xl transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-4">🚚</div>
                      <h3 className="font-bold text-lg">Caminhões</h3>
                    </CardContent>
                  </Card>
                </a>
              </Link>
              <Link href="/encontrar-veiculo">
                <a>
                  <Card className="hover:shadow-xl transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-4">🏍️</div>
                      <h3 className="font-bold text-lg">Motocicletas</h3>
                    </CardContent>
                  </Card>
                </a>
              </Link>
            </div>
            <p className="text-center text-lg text-gray-700 mt-8">
              Cadastre-se agora para explorar uma ampla variedade de veículos, caminhões, motos, SUVs e muito mais.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
