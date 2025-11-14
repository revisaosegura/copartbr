import { useMemo, useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CalendarDays,
  Clock,
  MapPin,
  Search,
  Car,
  Truck,
  Ship,
  Wrench,
  ShieldCheck,
  Users,
  Smartphone,
  Gavel,
  Award,
  Play,
  Building2,
  BadgeCheck,
  TrendingUp,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";

const QUICK_FILTERS = [
  "SUV",
  "Sedan",
  "Pickup",
  "Motocicletas",
  "Caminhões",
  "Peças",
];

const CATEGORY_DATA = [
  {
    icon: Car,
    label: "Carros e SUVs",
    description: "Veículos prontos para voltar às ruas.",
  },
  {
    icon: Truck,
    label: "Caminhões",
    description: "Frotas completas e utilitários pesados.",
  },
  {
    icon: Ship,
    label: "Leilões Importados",
    description: "Estoque global com logística Copart.",
  },
  {
    icon: Wrench,
    label: "Peças e Sucatas",
    description: "Componentes e lotes para desmontagem.",
  },
];

const REASONS = [
  {
    icon: ShieldCheck,
    title: "Segurança Copart",
    description:
      "Processos auditados, pátios monitorados 24h e suporte especializado em todas as etapas.",
  },
  {
    icon: Users,
    title: "Rede Global",
    description:
      "Milhões de compradores em mais de 190 países com tecnologia proprietária de lances em tempo real.",
  },
  {
    icon: Smartphone,
    title: "Experiência Digital",
    description:
      "Participe de onde estiver com o app Copart e recursos como Copart 360° e streaming de leilões.",
  },
  {
    icon: Award,
    title: "Liderança de Mercado",
    description:
      "Mais de 40 anos de história revolucionando a forma de comprar e vender veículos em leilão.",
  },
];

const SERVICE_CALLOUTS = [
  {
    title: "Seja um Membro Copart",
    description:
      "Cadastre-se gratuitamente para dar lances, salvar buscas e receber alertas personalizados.",
    action: { label: "Criar conta", href: "/registrar" },
    highlight: "Benefícios exclusivos",
  },
  {
    title: "Venda com a Copart",
    description:
      "Conte com nossa equipe para avaliar, armazenar, divulgar e vender sua frota com transparência.",
    action: { label: "Quero vender", href: "/vender-meu-carro" },
    highlight: "Processo seguro",
  },
];

const SUPPORT_STEPS = [
  {
    title: "Escolha seu lote",
    description: "Utilize filtros avançados, fotos 360° e relatórios detalhados.",
  },
  {
    title: "Participe do leilão",
    description: "Acompanhe lances em tempo real com tradução simultânea e notificações.",
  },
  {
    title: "Finalize com confiança",
    description: "Pagamentos protegidos, retirada assistida e documentação orientada pela Copart.",
  },
];

const NEWS_ITEMS = [
  {
    title: "Copart Expande Pátio em São Paulo",
    description: "Nova estrutura com 400 mil m² preparada para receber grandes operações.",
  },
  {
    title: "Tecnologia Copart 360°",
    description: "Visualize os veículos em todos os ângulos com o recurso exclusivo Copart.",
  },
  {
    title: "Agenda de Leilões",
    description: "Leilões diários com lotes especiais de seguradoras e bancos parceiros.",
  },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("todos");
  const [stateFilter, setStateFilter] = useState("");

  const { data: auctions, isLoading: isLoadingAuctions } =
    trpc.vehicles.upcomingAuctions.useQuery({ limit: 4 });

  const { data: vehiclesData, isLoading: isLoadingVehicles } =
    trpc.vehicles.list.useQuery({ limit: 8 });

  const featuredVehicles = vehiclesData?.items ?? [];

  const stats = useMemo(
    () => [
      { label: "Veículos ativos", value: "15.000+" },
      { label: "Leilões por semana", value: "120" },
      { label: "Estados atendidos", value: "26" },
      { label: "Parceiros corporativos", value: "2.500+" },
    ],
    []
  );

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchTerm.trim();
    const params = new URLSearchParams();

    if (query) {
      params.set("q", query);
    }

    if (filterType !== "todos") {
      params.set("tipo", filterType);
    }

    if (stateFilter) {
      params.set("estado", stateFilter);
    }

    const destination = params.toString()
      ? `/buscar?${params.toString()}`
      : "/encontrar-veiculo";

    setLocation(destination);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#002366] text-white">
          <div className="absolute inset-0 opacity-30 bg-[url('/car1.jpg')] bg-cover bg-center" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001a4f]/90 via-[#002f7a]/90 to-[#001a4f]/70" aria-hidden="true" />

          <div className="relative container py-16 md:py-24 lg:py-28">
            <div className="max-w-3xl space-y-6">
              <Badge className="bg-[#FDB714] text-black font-semibold uppercase tracking-wide w-fit">
                Experiência oficial Copart Brasil
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                Seu próximo veículo está na Copart Brasil
              </h1>
              <p className="text-lg md:text-xl text-gray-100 max-w-2xl">
                Acesse o maior inventário de veículos recuperáveis do país com tecnologia de lances em tempo real, fotos 360° e suporte especializado.
              </p>

              <form
                onSubmit={handleSearch}
                className="bg-white rounded-xl shadow-xl p-4 md:p-6 space-y-4 text-gray-900"
              >
                <div className="flex flex-col lg:flex-row gap-3">
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">
                      Procurar por
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        value={searchTerm}
                        onChange={event => setSearchTerm(event.target.value)}
                        placeholder="Marca, modelo, nº do lote ou chassi"
                        className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 focus:border-[#003087] focus:outline-none focus:ring-2 focus:ring-[#FDB714]/60"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-48">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">
                      Tipo de venda
                    </label>
                    <select
                      value={filterType}
                      onChange={event => setFilterType(event.target.value)}
                      className="w-full rounded-lg border border-gray-200 py-3 px-3 focus:border-[#003087] focus:outline-none focus:ring-2 focus:ring-[#FDB714]/60"
                    >
                      <option value="todos">Todos os lotes</option>
                      <option value="leilao">Leilão</option>
                      <option value="venda-direta">Venda Direta</option>
                      <option value="sucata">Sucatas e peças</option>
                    </select>
                  </div>
                  <div className="w-full lg:w-40">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">
                      Estado
                    </label>
                    <select
                      value={stateFilter}
                      onChange={event => setStateFilter(event.target.value)}
                      className="w-full rounded-lg border border-gray-200 py-3 px-3 focus:border-[#003087] focus:outline-none focus:ring-2 focus:ring-[#FDB714]/60"
                    >
                      <option value="">Brasil inteiro</option>
                      <option value="SP">São Paulo</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="PR">Paraná</option>
                      <option value="RS">Rio Grande do Sul</option>
                      <option value="SC">Santa Catarina</option>
                      <option value="BA">Bahia</option>
                    </select>
                  </div>
                  <div className="flex items-end w-full lg:w-auto">
                    <Button
                      type="submit"
                      className="w-full lg:w-auto bg-[#FDB714] hover:bg-[#e5a512] text-black font-bold text-base px-8 py-3"
                    >
                      Buscar veículos
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-semibold text-gray-500 uppercase">Filtros rápidos:</span>
                  {QUICK_FILTERS.map(filter => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setSearchTerm(filter)}
                      className="text-sm font-medium text-[#003087] bg-[#003087]/10 hover:bg-[#003087]/20 px-3 py-1 rounded-full transition-colors"
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </form>
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map(stat => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur border border-white/20 rounded-xl px-4 py-5"
                >
                  <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-200">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Auctions */}
        <section className="py-12 md:py-16">
          <div className="container space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#003087]">
                  Próximos leilões
                </h2>
                <p className="text-gray-600">
                  Agenda atualizada com os eventos oficiais Copart Brasil.
                </p>
              </div>
              <Button
                variant="outline"
                className="border-[#003087] text-[#003087] hover:bg-[#003087] hover:text-white"
                onClick={() => setLocation("/calendario-leiloes")}
              >
                Ver calendário completo
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {isLoadingAuctions && (
                <p className="col-span-full text-center text-gray-500">
                  Carregando agenda de leilões...
                </p>
              )}

              {!isLoadingAuctions && (auctions?.length ?? 0) === 0 && (
                <p className="col-span-full text-center text-gray-500">
                  Nenhum leilão futuro encontrado no momento.
                </p>
              )}

              {auctions?.map(auction => (
                <Card key={auction.id} className="border border-[#003087]/20">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#003087]/10 p-3 rounded-lg">
                        <CalendarDays className="text-[#003087]" size={22} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Data</p>
                        <p className="text-lg font-semibold text-[#003087]">
                          {format(new Date(auction.auctionDate), "dd 'de' MMMM", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <MapPin size={18} className="text-[#003087]" />
                      <span>{auction.location ?? "Localização a confirmar"}</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm text-gray-600">
                      <Clock size={18} className="text-[#003087] mt-0.5" />
                      <div className="space-y-1">
                        {auction.auctionTimes && auction.auctionTimes.length > 0 ? (
                          auction.auctionTimes.map(time => (
                            <span key={time} className="block">
                              {time}
                            </span>
                          ))
                        ) : (
                          <span>Horário a confirmar</span>
                        )}
                      </div>
                    </div>
                    <div className="pt-2">
                      <Badge variant="secondary" className="bg-[#003087]/10 text-[#003087]">
                        {auction.vehicleCount} veículos programados
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Vehicles */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold text-[#003087]">
                  Destaques do inventário
                </h2>
                <p className="text-gray-600">
                  Novos lotes adicionados diretamente das seguradoras e bancos parceiros.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="border-[#003087] text-[#003087] hover:bg-[#003087] hover:text-white"
                  onClick={() => setLocation("/encontrar-veiculo")}
                >
                  Ver todos os veículos
                </Button>
              </div>
            </div>

            {isLoadingVehicles ? (
              <p className="text-center text-gray-500">Carregando veículos em destaque...</p>
            ) : featuredVehicles.length === 0 ? (
              <p className="text-center text-gray-500">
                Ainda não há veículos disponíveis. Volte em breve para conferir novos lotes.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {featuredVehicles.slice(0, 8).map(vehicle => {
                  const currentBid =
                    typeof vehicle.currentBid === "number" ? vehicle.currentBid : 0;

                  return (
                    <VehicleCard
                      key={vehicle.id}
                      id={String(vehicle.id)}
                      image={vehicle.image ?? "/car2.jpg"}
                      title={vehicle.title ?? "Veículo Copart"}
                      lotNumber={vehicle.lotNumber ?? "N/D"}
                      currentBid={`R$ ${(currentBid / 100).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}`}
                      location={vehicle.location ?? "Localização não informada"}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Categories */}
        <section className="py-12 md:py-16 bg-gray-100">
          <div className="container space-y-10">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-[#003087]">
                Todos os segmentos em um só lugar
              </h2>
              <p className="text-gray-600">
                Do carro de passeio ao equipamento pesado, encontre o lote ideal com filtros avançados e relatórios completos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {CATEGORY_DATA.map(category => (
                <Card key={category.label} className="border-transparent bg-white shadow-sm hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 space-y-4">
                    <category.icon className="text-[#003087]" size={28} />
                    <div>
                      <h3 className="text-xl font-semibold text-[#003087]">{category.label}</h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {SERVICE_CALLOUTS.map(callout => (
                <Card key={callout.title} className="border border-[#003087]/10">
                  <CardContent className="p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="space-y-3">
                      <Badge className="bg-[#FDB714] text-black font-semibold w-fit">
                        {callout.highlight}
                      </Badge>
                      <h3 className="text-2xl font-bold text-[#003087]">{callout.title}</h3>
                      <p className="text-gray-600 max-w-xl">{callout.description}</p>
                    </div>
                    <Button
                      className="bg-[#003087] hover:bg-[#001f5d] text-white"
                      onClick={() => setLocation(callout.action.href)}
                    >
                      {callout.action.label}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Reasons */}
        <section className="py-12 md:py-16">
          <div className="container space-y-10">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-[#003087]">
                Por que escolher a Copart Brasil
              </h2>
              <p className="text-gray-600">
                Inovação, segurança e escala global reunidos para entregar a melhor experiência de compra e venda de veículos em leilão.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {REASONS.map(reason => (
                <Card key={reason.title} className="border border-[#003087]/10">
                  <CardContent className="p-6 flex gap-4">
                    <reason.icon className="text-[#003087] flex-shrink-0" size={32} />
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-[#003087]">{reason.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{reason.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Support Steps */}
        <section className="py-12 md:py-16 bg-[#002366] text-white">
          <div className="container space-y-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <Badge className="bg-white/20 text-white border border-white/30">
                  Como funciona
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Uma jornada completa, do clique à entrega
                </h2>
                <p className="text-gray-200">
                  Nossa equipe acompanha cada etapa com transparência, garantindo que você tenha toda a informação necessária para tomar a melhor decisão.
                </p>
              </div>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#002366]"
                onClick={() => setLocation("/como-funciona")}
              >
                Entenda o processo
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SUPPORT_STEPS.map((step, index) => (
                <Card key={step.title} className="bg-white/10 border border-white/10 backdrop-blur">
                  <CardContent className="p-6 space-y-4">
                    <Badge className="bg-[#FDB714] text-black font-bold text-lg w-12 h-12 flex items-center justify-center rounded-full">
                      {index + 1}
                    </Badge>
                    <div>
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                      <p className="text-sm text-gray-100 leading-relaxed">{step.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* News & Highlights */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#003087]">
                  Atualizações Copart
                </h2>
                <p className="text-gray-600">
                  Fique por dentro das novidades e acompanhe nossos pátios pelo Brasil.
                </p>
              </div>

              <div className="space-y-4">
                {NEWS_ITEMS.map(item => (
                  <Card key={item.title} className="border border-[#003087]/10 hover:border-[#003087]/30 transition-colors">
                    <CardContent className="p-6 space-y-2">
                      <div className="flex items-center gap-2 text-[#003087] text-sm font-semibold uppercase">
                        <BadgeCheck size={16} />
                        Notícia Copart
                      </div>
                      <h3 className="text-xl font-bold text-[#003087]">{item.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                      <button className="text-sm font-semibold text-[#003087] hover:text-[#001f5d] flex items-center gap-2">
                        Saiba mais
                        <TrendingUp size={16} />
                      </button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="border border-[#003087]/10 bg-[#f4f7fb]">
              <CardContent className="p-6 space-y-5">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-[#003087]">
                    Assista aos leilões ao vivo
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Acompanhe transmissões simultâneas com narradores especializados e traduções em português.
                  </p>
                </div>
                <div className="bg-[#003087] text-white rounded-xl p-6 flex flex-col items-start gap-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <Play size={28} />
                  </div>
                  <p className="text-lg font-semibold">
                    Copart Virtual: tecnologia que aproxima você dos melhores lotes.
                  </p>
                  <Button
                    className="bg-white text-[#003087] hover:bg-[#FDB714] hover:text-black"
                    onClick={() => setLocation("/videos")}
                  >
                    Ver tutoriais
                  </Button>
                </div>

                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-[#003087]">Estrutura completa</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <Building2 className="text-[#003087] mt-0.5" size={18} />
                      <span>20+ pátios estrategicamente localizados pelo Brasil.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Gavel className="text-[#003087] mt-0.5" size={18} />
                      <span>Leilões digitais e presenciais, com tecnologia Copart exclusivo.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Award className="text-[#003087] mt-0.5" size={18} />
                      <span>Equipe certificada e processos homologados pelas principais seguradoras.</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-12 md:py-16 bg-[#003087] text-white">
          <div className="container flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold">Receba oportunidades em primeira mão</h2>
              <p className="text-gray-200">
                Cadastre seu e-mail para receber alertas personalizados, novos lotes e informações sobre os próximos leilões Copart.
              </p>
            </div>
            <form className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 min-w-0 rounded-lg border border-white/40 bg-white/10 px-4 py-3 text-white placeholder:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FDB714]/70"
              />
              <Button className="bg-[#FDB714] hover:bg-[#e5a512] text-black font-semibold px-6 py-3">
                Quero receber
              </Button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
