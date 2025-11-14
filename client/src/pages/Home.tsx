import { useState, type FormEvent } from "react";
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
  Wrench,
  ShieldCheck,
  Users,
  Smartphone,
  Gavel,
  Play,
  Building2,
  BadgeCheck,
  TrendingUp,
  Headset,
  FileText,
  ArrowRight,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";

const QUICK_FILTERS = [
  "Hatch",
  "Sedan",
  "SUV",
  "Pickups",
  "Motocicletas",
  "Caminhões",
  "Peças",
];

const HERO_METRICS = [
  { label: "Veículos disponíveis", value: "20.000+" },
  { label: "Leilões semanais", value: "120" },
  { label: "Lotes publicados por dia", value: "500+" },
  { label: "Estados atendidos", value: "26" },
];

const CATEGORY_CARDS = [
  {
    icon: Car,
    title: "Carros e SUVs",
    description: "Veículos recuperáveis com fotos 360° e histórico completo.",
  },
  {
    icon: Truck,
    title: "Caminhões e utilitários",
    description: "Linha pesada com opções para frotas e transportadoras.",
  },
  {
    icon: Wrench,
    title: "Peças e sucatas",
    description: "Lotes ideais para reciclagem, oficinas e desmonte credenciado.",
  },
];

const HOW_IT_WORKS = [
  {
    title: "Cadastre-se gratuitamente",
    description:
      "Crie sua conta Copart em minutos para acompanhar lotes, salvar buscas e dar lances.",
  },
  {
    title: "Faça sua pesquisa",
    description:
      "Use filtros avançados, fotos 360° e relatórios para encontrar o veículo ideal.",
  },
  {
    title: "Participe dos leilões",
    description:
      "Acompanhe lances em tempo real em qualquer dispositivo com tradução simultânea.",
  },
  {
    title: "Finalize com suporte",
    description:
      "Conte com a Copart para pagamento seguro, retirada assistida e documentação.",
  },
];

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Transparência em cada etapa",
    description:
      "Inventário auditado, pátios monitorados 24h e processos certificados internacionalmente.",
  },
  {
    icon: Smartphone,
    title: "Experiência 100% digital",
    description:
      "Aplicativo Copart, streaming dos leilões, alertas personalizados e Copart 360°.",
  },
  {
    icon: Users,
    title: "Atendimento especializado",
    description:
      "Consultores dedicados para pessoa física, lojistas, seguradoras e grandes frotistas.",
  },
  {
    icon: TrendingUp,
    title: "Liquidez comprovada",
    description:
      "Milhões de compradores globalmente e melhores resultados para quem compra ou vende.",
  },
];

const SERVICES = [
  {
    icon: Building2,
    title: "Soluções corporativas",
    description:
      "Planos completos para seguradoras, bancos, locadoras e montadoras com gestão integrada.",
  },
  {
    icon: Truck,
    title: "Logística Copart",
    description:
      "Coleta, transporte, armazenamento e entrega com cobertura nacional e internacional.",
  },
  {
    icon: Wrench,
    title: "Serviços de pátio",
    description:
      "Inspeção, limpeza, fotografia profissional, vistoria documental e preparação de lotes.",
  },
  {
    icon: Headset,
    title: "Central de atendimento",
    description:
      "Especialistas para tirar dúvidas sobre cadastro, lances, pagamento e retirada do veículo.",
  },
];

const SUPPORT_LINKS = [
  {
    icon: Gavel,
    title: "Como comprar na Copart",
    description: "Passo a passo completo para participar dos nossos leilões.",
    href: "/como-comprar",
  },
  {
    icon: Play,
    title: "Vídeos tutoriais",
    description: "Assista ao Copart Play e aprenda a navegar pelo portal.",
    href: "/videos",
  },
  {
    icon: BadgeCheck,
    title: "Perguntas frequentes",
    description: "Esclareça rapidamente suas dúvidas sobre cadastro e lances.",
    href: "/perguntas-comuns",
  },
  {
    icon: FileText,
    title: "Vender com a Copart",
    description: "Conheça o processo completo para vender seu estoque conosco.",
    href: "/vender-meu-carro",
  },
];

const BLOG_ITEMS = [
  {
    title: "Copart inaugura novo pátio em São Paulo",
    description:
      "Estrutura ampliada para receber operações de grandes frotistas e seguradoras.",
  },
  {
    title: "Experiência Copart 360°",
    description:
      "Visualize os veículos em todos os ângulos com fotos e vídeos de alta definição.",
  },
  {
    title: "Agenda oficial de leilões",
    description: "Confira as próximas oportunidades com lotes exclusivos Copart Brasil.",
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

  const handleQuickFilter = (filter: string) => {
    const params = new URLSearchParams();
    params.set("q", filter);
    setLocation(`/buscar?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-[#001c44] text-white">
          <div
            className="absolute inset-0 bg-[url('/car1.jpg')] bg-cover bg-center opacity-20"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001030]/95 via-[#001c44]/90 to-[#001030]/80" aria-hidden="true" />

          <div className="relative container py-16 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,520px)_1fr] items-start">
              <div className="space-y-8">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="bg-[#FDB714] text-black font-semibold uppercase tracking-wide">
                    Copart Brasil
                  </Badge>
                  <span className="text-sm text-white/70">
                    Leilões oficiais de veículos recuperados e salvados
                  </span>
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                    Encontre seu próximo veículo com a Copart Brasil
                  </h1>
                  <p className="text-lg md:text-xl text-white/80 max-w-2xl">
                    Carros, motos, caminhões e sucatas direto das seguradoras e parceiros corporativos
                    com tecnologia exclusiva de lances online.
                  </p>
                </div>

                <form
                  onSubmit={handleSearch}
                  className="bg-white text-gray-900 rounded-2xl shadow-2xl p-6 space-y-4"
                >
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                        Procurar por
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          value={searchTerm}
                          onChange={event => setSearchTerm(event.target.value)}
                          placeholder="Marca, modelo, nº do lote ou chassi"
                          className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 focus:border-[#003087] focus:outline-none focus:ring-2 focus:ring-[#FDB714]/60"
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-48">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                        Tipo de venda
                      </label>
                      <select
                        value={filterType}
                        onChange={event => setFilterType(event.target.value)}
                        className="w-full rounded-xl border border-gray-200 py-3 px-3 focus:border-[#003087] focus:outline-none focus:ring-2 focus:ring-[#FDB714]/60"
                      >
                        <option value="todos">Todos os lotes</option>
                        <option value="leilao">Leilão</option>
                        <option value="venda-direta">Venda Direta</option>
                        <option value="sucata">Sucatas e peças</option>
                      </select>
                    </div>
                    <div className="w-full lg:w-48">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                        Estado
                      </label>
                      <select
                        value={stateFilter}
                        onChange={event => setStateFilter(event.target.value)}
                        className="w-full rounded-xl border border-gray-200 py-3 px-3 focus:border-[#003087] focus:outline-none focus:ring-2 focus:ring-[#FDB714]/60"
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
                        onClick={() => handleQuickFilter(filter)}
                        className="text-sm font-medium text-[#003087] bg-[#003087]/10 hover:bg-[#003087]/20 px-3 py-1 rounded-full transition-colors"
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </form>

                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    className="border-white/60 text-white hover:bg-white/10"
                    onClick={() => setLocation("/registrar")}
                  >
                    Criar conta gratuita
                    <ArrowRight className="ml-2" size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                    onClick={() => setLocation("/vender-meu-carro")}
                  >
                    Quero vender com a Copart
                    <ArrowRight className="ml-2" size={16} />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4">
                {HERO_METRICS.map(metric => (
                  <div
                    key={metric.label}
                    className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6"
                  >
                    <p className="text-3xl font-bold text-white">{metric.value}</p>
                    <p className="text-sm text-white/80">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container space-y-10">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-[#002366]">
                Descubra as principais categorias
              </h2>
              <p className="text-gray-600">
                Estoque atualizado diariamente com veículos recuperados, salvados e sinistrados leves.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CATEGORY_CARDS.map(card => (
                <Card key={card.title} className="border-[#002366]/10 shadow-sm">
                  <CardContent className="p-6 space-y-4">
                    <div className="bg-[#002366]/10 w-12 h-12 flex items-center justify-center rounded-xl text-[#002366]">
                      <card.icon size={26} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-[#002366]">{card.title}</h3>
                      <p className="text-gray-600">{card.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleQuickFilter(card.title)}
                      className="inline-flex items-center text-sm font-semibold text-[#002366] hover:underline"
                    >
                      Buscar categoria
                      <ArrowRight className="ml-2" size={16} />
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold text-[#002366]">
                  Próximos leilões Copart Brasil
                </h2>
                <p className="text-gray-600">
                  Consulte a agenda oficial e programe seus lances com antecedência.
                </p>
              </div>
              <Button
                variant="outline"
                className="border-[#002366] text-[#002366] hover:bg-[#002366] hover:text-white"
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
                <Card key={auction.id} className="border-[#002366]/10">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#002366]/10 p-3 rounded-xl">
                        <CalendarDays className="text-[#002366]" size={22} />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">Data</p>
                        <p className="text-lg font-semibold text-[#002366]">
                          {format(new Date(auction.auctionDate), "dd 'de' MMMM", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={18} className="text-[#002366]" />
                      <span>{auction.location ?? "Localização a confirmar"}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <Clock size={18} className="text-[#002366] mt-0.5" />
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
                      <Badge variant="secondary" className="bg-[#002366]/10 text-[#002366]">
                        {auction.vehicleCount} veículos programados
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold text-[#002366]">Destaques do estoque</h2>
                <p className="text-gray-600">
                  Lotes recém-adicionados prontos para receber seu lance.
                </p>
              </div>
              <Button
                variant="outline"
                className="border-[#002366] text-[#002366] hover:bg-[#002366] hover:text-white"
                onClick={() => setLocation("/encontrar-veiculo")}
              >
                Ver todos os veículos
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {isLoadingVehicles && (
                <p className="col-span-full text-center text-gray-500">
                  Carregando veículos em destaque...
                </p>
              )}

              {!isLoadingVehicles && featuredVehicles.length === 0 && (
                <p className="col-span-full text-center text-gray-500">
                  Nenhum veículo disponível no momento. Volte em breve!
                </p>
              )}

              {featuredVehicles.map(vehicle => {
                const displayTitle =
                  vehicle.title ||
                  [vehicle.brand, vehicle.model, vehicle.year]
                    .filter(Boolean)
                    .join(" ") ||
                  "Veículo Copart";

                return (
                  <VehicleCard
                    key={vehicle.id}
                    id={String(vehicle.id)}
                    image={vehicle.image ?? ""}
                    title={displayTitle}
                    lotNumber={vehicle.lotNumber}
                    currentBid={`R$ ${(vehicle.currentBid / 100).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}`}
                    location={vehicle.location ?? ""}
                  />
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container space-y-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
              <div className="space-y-4">
                <Badge className="bg-[#002366] text-white font-semibold uppercase tracking-wide">
                  Como funciona
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-[#002366]">
                  Comprar na Copart é simples e seguro
                </h2>
                <p className="text-gray-600">
                  Em poucos passos você participa dos leilões oficiais, acompanha os lotes e garante o veículo que precisa.
                </p>
                <Button
                  className="bg-[#FDB714] hover:bg-[#e5a512] text-black font-semibold"
                  onClick={() => setLocation("/como-comprar")}
                >
                  Ver passo a passo
                  <ArrowRight className="ml-2" size={16} />
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {HOW_IT_WORKS.map((step, index) => (
                  <Card key={step.title} className="border-[#002366]/10">
                    <CardContent className="p-6 space-y-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#002366] text-white font-semibold text-lg">
                        {index + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-[#002366]">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {BENEFITS.map(benefit => (
                <Card key={benefit.title} className="border-[#002366]/10">
                  <CardContent className="p-6 flex gap-4">
                    <div className="flex-shrink-0 bg-[#002366]/10 text-[#002366] rounded-xl h-12 w-12 flex items-center justify-center">
                      <benefit.icon size={26} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-[#002366]">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container space-y-10">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold text-[#002366]">Serviços e soluções Copart</h2>
                <p className="text-gray-600">
                  Uma plataforma completa para quem compra e vende veículos recuperados.
                </p>
              </div>
              <Button
                variant="outline"
                className="border-[#002366] text-[#002366] hover:bg-[#002366] hover:text-white"
                onClick={() => setLocation("/suporte")}
              >
                Fale com a Copart
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {SERVICES.map(service => (
                <Card key={service.title} className="border-[#002366]/10">
                  <CardContent className="p-6 space-y-3">
                    <div className="bg-[#002366]/10 text-[#002366] rounded-xl h-12 w-12 flex items-center justify-center">
                      <service.icon size={26} />
                    </div>
                    <h3 className="text-xl font-semibold text-[#002366]">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold text-[#002366]">Conteúdos e novidades</h2>
                <p className="text-gray-600">
                  Fique por dentro das notícias, atualizações e eventos da Copart Brasil.
                </p>
              </div>
              <Button
                variant="outline"
                className="border-[#002366] text-[#002366] hover:bg-[#002366] hover:text-white"
                onClick={() => setLocation("/videos")}
              >
                Acessar Copart Play
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {BLOG_ITEMS.map(item => (
                <Card key={item.title} className="border-[#002366]/10">
                  <CardContent className="p-6 space-y-3">
                    <h3 className="text-xl font-semibold text-[#002366]">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                    <button
                      type="button"
                      className="inline-flex items-center text-sm font-semibold text-[#002366] hover:underline"
                      onClick={() => setLocation("/videos")}
                    >
                      Ver mais conteúdos
                      <ArrowRight className="ml-2" size={16} />
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-[#001c44] text-white">
          <div className="container grid gap-10 lg:grid-cols-[minmax(0,520px)_1fr] items-center">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                Receba oportunidades e lotes exclusivos diretamente no seu e-mail
              </h2>
              <p className="text-white/80">
                Assine a newsletter Copart Brasil e seja avisado sobre novos leilões, veículos especiais e conteúdos educativos.
              </p>
            </div>

            <form
              className="bg-white/10 backdrop-blur rounded-2xl p-6 grid gap-4 md:grid-cols-[1fr_auto]"
              onSubmit={event => {
                event.preventDefault();
                setLocation("/registrar");
              }}
            >
              <div className="md:col-span-1">
                <label className="text-xs uppercase tracking-wide font-semibold text-white/70 block mb-2">
                  Seu e-mail
                </label>
                <input
                  type="email"
                  required
                  placeholder="seuemail@exemplo.com"
                  className="w-full rounded-xl border border-white/30 bg-white/10 py-3 px-4 text-white placeholder:text-white/50 focus:border-[#FDB714] focus:outline-none focus:ring-2 focus:ring-[#FDB714]/60"
                />
              </div>
              <Button
                type="submit"
                className="bg-[#FDB714] hover:bg-[#e5a512] text-black font-semibold px-8"
              >
                Quero receber novidades
              </Button>
            </form>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-[#002366]">
                Precisa de ajuda?
              </h2>
              <p className="text-gray-600">
                A Copart Brasil conta com canais exclusivos para apoiar você em cada etapa.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {SUPPORT_LINKS.map(link => (
                <Card key={link.title} className="border-[#002366]/10">
                  <CardContent className="p-6 space-y-3">
                    <div className="bg-[#002366]/10 text-[#002366] rounded-xl h-12 w-12 flex items-center justify-center">
                      <link.icon size={26} />
                    </div>
                    <h3 className="text-xl font-semibold text-[#002366]">{link.title}</h3>
                    <p className="text-gray-600">{link.description}</p>
                    <button
                      type="button"
                      className="inline-flex items-center text-sm font-semibold text-[#002366] hover:underline"
                      onClick={() => setLocation(link.href)}
                    >
                      Acessar
                      <ArrowRight className="ml-2" size={16} />
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
