import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  Check,
  ChevronRight,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

const HERO_CARDS = [
  {
    title: "Venda Direta",
    features: [
      "Disponível 24h por dia",
      "Veículos com laudo",
      "Negociação intermediada",
      "Diversas opções com garantia",
    ],
    primaryCta: { label: "Comprar", href: "/buscar?venda=direta" },
    secondaryCta: { label: "Vender", href: "/vender-meu-carro" },
  },
  {
    title: "Leilão",
    features: [
      "+ de 70 leilões mensais",
      "De Bancos, Seguradoras, e mais",
      "Faça seus lances online",
      "Veículos com procedência",
    ],
    primaryCta: { label: "Comprar", href: "/leiloes" },
    secondaryCta: { label: "Vender", href: "/vender-meu-carro" },
  },
];

const OPPORTUNITY_CARDS = [
  {
    title: "Compre nos Leilões",
    features: [
      "Escolha seu veículo em um catálogo completo com fotos, laudos e vídeos detalhados.",
      "Defina seus limites de lance com antecedência e acompanhe tudo em tempo real.",
      "Conte com dicas exclusivas e orientações personalizadas em cada etapa.",
      "Participe de eventos em diferentes formatos, online ou presenciais, quando quiser.",
    ],
  },
  {
    title: "Compre na Venda Direta",
    features: [
      "Segurança para comprar veículos selecionados e prontos para negociação imediata.",
      "Condições especiais e documentação regularizada para lojistas e consumidores.",
      "Suporte especializado para avaliar propostas e negociar com confiança.",
      "Finalize a compra com facilidade pelo recurso \"Compre Agora\".",
    ],
  },
  {
    title: "Venda com a Copart",
    features: [
      "Aumente seus resultados com uma rede de compradores em todo o Brasil.",
      "Avaliação profissional do veículo com acompanhamento em cada etapa.",
      "Ofertas para públicos qualificados e habilitados a fechar negócio.",
      "Gestão completa de logística, documentação e pós-venda pela Copart.",
    ],
  },
];

const INVENTORY_TABS = [
  { key: "popular", label: "Pesquisas Populares" },
  { key: "destaques", label: "Destaques" },
  { key: "marcas", label: "Marcas" },
  { key: "categorias", label: "Categorias" },
];

const INVENTORY_CONTENT = {
  popular: {
    columns: [
      {
        title: "Itens Mais Populares",
        items: [
          "Fiat",
          "Volkswagen",
          "Honda",
          "Ford",
          "Peugeot",
          "Chevrolet",
          "Motocicletas",
          "Pequena Monta",
        ],
      },
      {
        title: "Marcas / modelos",
        items: [
          "Renault",
          "Citroën",
          "Gol",
          "Palio",
          "Fiesta",
          "Fox",
          "Onix",
          "Civic",
        ],
      },
      {
        title: "Buscas frequentes",
        items: [
          "Motor de partida",
          "Motos",
          "SUVs",
          "Picapes",
          "Utilitários",
          "Pequenos reparos",
          "Blocos",
          "Sucatas",
        ],
      },
    ],
    highlight: {
      title: "Compre Agora",
      description:
        "Encontre veículos selecionados prontos para fechar negócio imediatamente com total conveniência.",
      cta: { label: "Clique aqui!", href: "/buscar?venda=direta" },
    },
  },
  destaques: {
    columns: [
      {
        title: "Veículos buscados",
        items: [
          "SUV premium",
          "Sedans executivos",
          "Veículos seminovos",
          "Blindados",
          "Importados",
          "Utilitários leves",
          "Caminhões",
          "Pequena monta",
        ],
      },
      {
        title: "Estados em alta",
        items: [
          "São Paulo",
          "Rio de Janeiro",
          "Minas Gerais",
          "Paraná",
          "Bahia",
          "Pernambuco",
          "Santa Catarina",
          "Rio Grande do Sul",
        ],
      },
      {
        title: "Próximos eventos",
        items: [
          "Agenda de Leilões",
          "Venda Direta",
          "Leilões Online",
          "Leilões Presenciais",
          "Cadastro de compradores",
          "Documentos necessários",
          "Planos corporativos",
          "Copart Play",
        ],
      },
    ],
    highlight: {
      title: "Faça seu cadastro",
      description:
        "Atendemos a uma audiência diversificada, de consumidores finais a lojistas e desmontes credenciados. Seja protagonista na Copart.",
      cta: { label: "Cadastre-se", href: "/registrar" },
    },
  },
  marcas: {
    columns: [
      {
        title: "Principais",
        items: [
          "Audi",
          "BMW",
          "Chevrolet",
          "Fiat",
          "Ford",
          "Honda",
          "Hyundai",
          "Jeep",
        ],
      },
      {
        title: "Mais buscadas",
        items: [
          "Kia",
          "Mercedes-Benz",
          "Mitsubishi",
          "Nissan",
          "Peugeot",
          "Renault",
          "Toyota",
          "Volkswagen",
        ],
      },
      {
        title: "Segmentos",
        items: [
          "Compactos",
          "SUV",
          "Pickups",
          "Motocicletas",
          "Caminhões",
          "Utilitários",
          "Máquinas",
          "Peças",
        ],
      },
    ],
    highlight: {
      title: "Assine a Copart Play",
      description:
        "Acompanhe transmissões ao vivo, tutoriais exclusivos e conteúdo para potencializar seus resultados nos leilões.",
      cta: { label: "Assistir", href: "/videos" },
    },
  },
  categorias: {
    columns: [
      {
        title: "Tipos de venda",
        items: [
          "Leilão",
          "Venda Direta",
          "Venda Corporativa",
          "Venda para lojistas",
          "Venda para frotas",
          "Venda de peças",
          "Venda de sucatas",
          "Venda internacional",
        ],
      },
      {
        title: "Condições",
        items: [
          "Pequena monta",
          "Média monta",
          "Grande monta",
          "Perda total",
          "Leilão especial",
          "Veículos recuperados",
          "Veículos salvados",
          "Veículos seminovos",
        ],
      },
      {
        title: "Outros filtros",
        items: [
          "Ano",
          "Combustível",
          "Quilometragem",
          "Localização",
          "Categoria",
          "Número do lote",
          "Preço",
          "Tipo de documento",
        ],
      },
    ],
    highlight: {
      title: "Precisa de ajuda?",
      description:
        "Conte com os especialistas Copart para orientar sobre cadastro, lances, pagamento e retirada do veículo.",
      cta: { label: "Fale conosco", href: "/suporte" },
    },
  },
} as const;

type InventoryTabKey = keyof typeof INVENTORY_CONTENT;

const COPART_OVERVIEW = {
  title: "Quem é a Copart?",
  paragraphs: [
    "Descubra a Copart, a plataforma líder em compra e venda de veículos. Reunimos um dos maiores inventários do mercado, com tecnologia exclusiva e alcance global para ligar vendedores aos compradores certos.",
    "Na Copart, você encontra recursos que vão potencializar a sua jornada, seja para comprar ou vender. Milhares de lotes disponíveis, condições especiais e uma equipe especialista pronta para te ajudar a encontrar as melhores opções todos os dias.",
    "Além disso, oferecemos soluções completas: da assinatura financeira concluída via contrato digital até a entrega rápida na sua loja ou garagem. Faça parte do universo Copart e simplifique a sua experiência de compra e venda de veículos.",
  ],
};

const COPART_CATEGORIES = [
  {
    title: "Venda Direta",
    items: ["Como funciona", "Como vender"],
  },
  {
    title: "Automóveis",
    items: ["Pequena Monta", "Chevrolet", "Fiat", "Honda"],
  },
  {
    title: "Caminhões",
    items: ["Placas grandes", "Semipesados", "Utilitários", "Pequena Monta"],
  },
  {
    title: "Motocicletas",
    items: ["CG 160", "CG 125", "Scooters", "Trail"],
  },
];

const SOCIAL_LINKS = [
  { label: "Facebook", icon: Facebook, href: "https://www.facebook.com/CopartBrasil" },
  { label: "Instagram", icon: Instagram, href: "https://www.instagram.com/copartbr" },
  { label: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/company/copart" },
  { label: "YouTube", icon: Youtube, href: "https://www.youtube.com/user/CopartInc" },
  { label: "Twitter", icon: Twitter, href: "https://twitter.com/Copart" },
];

const PARTNERS = [
  { name: "Allianz", logo: "allianz.svg" },
  { name: "Banco Toyota", logo: "banco-toyota.svg" },
  { name: "CNP Seguradora", logo: "cnp-seguradora.svg" },
  { name: "Consórcio Embracon", logo: "consorcio-embracon.svg" },
  { name: "Gente Seguradora", logo: "gente-seguradora.svg" },
  { name: "Gol Plus", logo: "gol-plus.svg" },
  { name: "Justos", logo: "justos.svg" },
  { name: "Usebens", logo: "usebens.svg" },
  { name: "BPorto", logo: "bporto.svg" },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [activeInventoryTab, setActiveInventoryTab] = useState<InventoryTabKey>("popular");

  const { data: auctions } = trpc.vehicles.upcomingAuctions.useQuery({ limit: 4 });

  const { data: vehiclesData, isLoading: isLoadingVehicles } =
    trpc.vehicles.list.useQuery({ limit: 8 });

  const featuredVehicles = vehiclesData?.items ?? [];
  const liveAuctionsCount = auctions?.length ?? 0;

  const handleQuickFilter = (filter: string) => {
    setLocation(`/buscar?q=${encodeURIComponent(filter)}`);
  };

  const inventoryContent = useMemo(() => INVENTORY_CONTENT[activeInventoryTab], [activeInventoryTab]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-[#041238] text-white">
          <div className="absolute inset-0">
            <img
              src="/car3.jpg"
              alt="Showroom Copart"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#030b21] via-[#031c52]/95 to-[#0d45b8]/90" aria-hidden="true" />
          </div>

          <div className="relative container py-16 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,560px)_minmax(0,460px)] items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold leading-tight max-w-2xl">
                  Conectando <span className="text-[#fdb714]">compradores</span> e <span className="text-[#fdb714]">vendedores</span>{" "}
                  ao redor do mundo.
                </h1>
                <p className="text-lg md:text-xl text-white/85 max-w-xl">
                  São + de <span className="text-[#fdb714]">12,640</span> veículos disponíveis para compra online. De automóveis a
                  caminhões, motocicletas e muito mais.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {HERO_CARDS.map(card => (
                  <div
                    key={card.title}
                    className="rounded-[28px] bg-[#071d4a]/95 shadow-[0_25px_60px_-25px_rgba(8,24,66,0.85)] overflow-hidden"
                  >
                    <div className="space-y-4 px-7 pt-7 pb-6">
                      <h2 className="text-2xl font-bold text-[#fdb714]">{card.title}</h2>
                      <ul className="space-y-2 text-sm text-white/90">
                        {card.features.map(feature => (
                          <li key={feature} className="flex items-start gap-2">
                            <Check className="mt-0.5 h-4 w-4 text-[#fdb714]" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white px-6 pb-6 pt-4 flex flex-col gap-3">
                      <Button
                        className="h-11 rounded-xl bg-[#fdb714] text-[#0b2a64] font-semibold hover:bg-[#e7a90f]"
                        onClick={() => setLocation(card.primaryCta.href)}
                      >
                        {card.primaryCta.label}
                      </Button>
                      <Button
                        className="h-11 rounded-xl bg-[#fdb714] text-[#0b2a64] font-semibold hover:bg-[#e7a90f]"
                        onClick={() => setLocation(card.secondaryCta.href)}
                      >
                        {card.secondaryCta.label}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-12 md:py-16">
          <div className="container space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold text-[#002366]">Veículos em destaque</h2>
                <p className="text-gray-600">
                  Explore oportunidades selecionadas com base nas buscas e leilões em destaque desta semana.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <Button
                  className="bg-[#00a650] hover:bg-[#008843] text-white font-semibold rounded-full px-6"
                  onClick={() => setLocation("/leiloes")}
                >
                  {liveAuctionsCount > 0
                    ? `${liveAuctionsCount} Leilão${liveAuctionsCount > 1 ? "es" : ""} ao Vivo Acontecendo Agora!`
                    : "Agenda completa de leilões"}
                </Button>
                <Button
                  variant="outline"
                  className="border-[#002366] text-[#002366] hover:bg-[#002366] hover:text-white rounded-full"
                  onClick={() => setLocation("/encontrar-veiculo")}
                >
                  Ver todos os veículos
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="-mx-4 px-4">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {isLoadingVehicles && (
                    <p className="col-span-full text-center text-gray-500">Carregando destaques...</p>
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
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-br from-[#00163a] via-[#012a6b] to-[#000d2f] py-20 text-white">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-40 -top-32 h-80 w-80 rounded-full bg-[#0a3fa4]/35 blur-3xl" />
            <div className="absolute -bottom-36 -right-24 h-[26rem] w-[26rem] rounded-full bg-[#001f5a]/40 blur-3xl" />
            <div
              className="absolute left-8 top-10 h-48 w-48 opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            />
          </div>

          <div className="container relative space-y-12">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-bold text-white md:text-4xl">Um mar de oportunidades</h2>
              <p className="mx-auto max-w-3xl text-base text-white/80 md:text-lg">
                Mais opções, mais vantagens e <span className="font-semibold text-white">toda a segurança</span> que você procura para
                comprar e vender.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {OPPORTUNITY_CARDS.map(card => (
                <Card
                  key={card.title}
                  className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_30px_60px_-40px_rgba(0,0,0,0.9)]"
                >
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <CardContent className="relative flex h-full flex-col gap-8 p-10">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#00a0e3] to-[#0071ce]" />
                        <h3 className="text-2xl font-semibold text-white">{card.title}</h3>
                      </div>
                      <ul className="space-y-4">
                        {card.features.map(feature => (
                          <li key={feature} className="flex items-start gap-3">
                            <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#00a0e3]/30 to-[#0071ce]/30 text-white">
                              <Check className="h-3.5 w-3.5" />
                            </span>
                            <p className="text-sm leading-relaxed text-white/80">{feature}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button
                className="rounded-full bg-gradient-to-r from-[#00a0e3] via-[#0071ce] to-[#004b9b] px-10 py-3 text-base font-semibold text-white shadow-lg transition-all hover:translate-y-[-2px] hover:from-[#0071ce] hover:via-[#005fa3] hover:to-[#003f84]"
                onClick={() => setLocation("/registrar")}
              >
                Cadastre-se Agora
              </Button>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-16">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f3f7ff] via-white to-[#dce9ff]" aria-hidden="true" />

          <div className="container relative space-y-10">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0d47d6] uppercase tracking-[0.12em]">
                Pesquisar Inventário da Copart
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {INVENTORY_TABS.map(tab => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveInventoryTab(tab.key as InventoryTabKey)}
                    className={`rounded-full border px-6 py-2 text-sm font-semibold uppercase tracking-[0.16em] transition ${
                      activeInventoryTab === tab.key
                        ? "border-transparent bg-[#0d47d6] text-white shadow-[0_18px_40px_-24px_rgba(13,71,214,0.8)]"
                        : "border-[#0d47d6]/40 bg-white/80 text-[#0d47d6] hover:border-[#0d47d6] hover:bg-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,1.1fr)]">
              <div className="rounded-[32px] border border-[#c6d7ff] bg-white/95 p-10 shadow-[0_45px_120px_-60px_rgba(10,58,170,0.55)]">
                <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
                  {inventoryContent.columns.map(column => (
                    <div key={column.title} className="space-y-5">
                      <div className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-[#00a0e3]" />
                        <span className="text-sm font-semibold uppercase tracking-[0.28em] text-[#0d47d6]">
                          {column.title}
                        </span>
                      </div>
                      <div className="grid gap-3 text-sm font-medium text-[#003087] md:text-base">
                        {column.items.map(item => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => handleQuickFilter(item)}
                            className="group flex items-center gap-3 text-left transition"
                          >
                            <span className="h-2 w-2 rounded-full bg-[#00a0e3]/40 transition group-hover:bg-[#00a0e3]" />
                            <span className="border-b border-transparent group-hover:border-[#00a0e3] group-hover:text-[#0d47d6]">
                              {item}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[36px] border border-[#4c7dff]/30 bg-gradient-to-br from-[#042a92] via-[#0157d5] to-[#02a0ff] text-white shadow-[0_50px_120px_-70px_rgba(3,40,130,0.8)]">
                <div className="absolute inset-0">
                  <img
                    src="/car4.jpg"
                    alt="Destaque Compre Agora"
                    className="h-full w-full object-cover object-right"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#041c5d]/90 via-[#0157d5]/85 to-[#01a4ff]/80" />
                </div>

                <div className="relative flex h-full flex-col justify-between p-8">
                  <div className="space-y-4">
                    <Badge className="w-fit rounded-full bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
                      Destaque
                    </Badge>
                    <h3 className="text-4xl font-extrabold uppercase tracking-[0.32em]">
                      {inventoryContent.highlight.title}
                    </h3>
                    {inventoryContent.highlight.description && (
                      <p className="max-w-xs text-sm font-medium uppercase tracking-[0.24em] text-white/80">
                        {inventoryContent.highlight.description}
                      </p>
                    )}
                  </div>
                  <Button
                    className="mt-6 h-12 w-fit rounded-full bg-white px-8 text-sm font-bold uppercase tracking-[0.28em] text-[#0d47d6] transition hover:bg-[#f0f4ff]"
                    onClick={() => setLocation(inventoryContent.highlight.cta.href)}
                  >
                    {inventoryContent.highlight.cta.label}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-r from-[#120d17] via-[#0b101f] to-[#05163a] py-20 text-white">
          <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-[#fdb714]/10 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-[#0b5bf4]/20 blur-3xl" />

          <div className="container relative grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[#1b1728] via-[#14172a] to-[#060a16] p-12 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#fdb714]/10 blur-3xl" />
              <div className="absolute -left-16 bottom-0 h-60 w-60 rounded-full bg-[#ff6f1e]/10 blur-3xl" />

              <div className="relative space-y-6">
                <h2 className="text-4xl font-extrabold text-white">
                  {COPART_OVERVIEW.title}
                </h2>
                <div className="space-y-4 text-base leading-relaxed text-white/80">
                  {COPART_OVERVIEW.paragraphs.map(paragraph => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                <Button
                  className="mt-6 h-12 w-fit rounded-full bg-gradient-to-r from-[#fdb714] via-[#ff9d23] to-[#ff6f1e] px-10 text-sm font-extrabold uppercase tracking-[0.2em] text-[#1f1200] shadow-[0_12px_30px_rgba(253,183,20,0.35)] transition hover:shadow-[0_16px_40px_rgba(253,183,20,0.45)]"
                  onClick={() => setLocation("/registrar")}
                >
                  Faça seu cadastro
                </Button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[#0a2a77] via-[#0c3a9c] to-[#0e4fca] p-12 shadow-[0_40px_100px_-50px_rgba(11,86,220,0.8)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_55%)]" />
              <div className="relative space-y-8">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
                    Copart
                  </p>
                  <h3 className="text-2xl font-bold leading-tight">
                    Copart: sua plataforma de compra e venda online de veículos!
                  </h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {COPART_CATEGORIES.map(category => (
                    <div
                      key={category.title}
                      className="group overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/15 via-white/5 to-transparent p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition hover:border-white/25"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-lg font-semibold text-white">
                            {category.title}
                          </h4>
                          <Badge className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white">
                            Confira
                          </Badge>
                        </div>
                        <ul className="space-y-2 text-sm text-white/80">
                          {category.items.map(item => (
                            <li
                              key={item}
                              className="flex items-center gap-2"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-white to-white/60" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="container space-y-12">
            <div className="space-y-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-[#002366]">Nossas Mídias Sociais</h2>
              <div className="flex flex-wrap items-center justify-center gap-5">
                {SOCIAL_LINKS.map(link => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-14 w-14 items-center justify-center rounded-full border border-[#dce6ff] bg-white text-[#002366] shadow-[0_10px_30px_rgba(0,35,102,0.12)] transition-transform duration-300 hover:-translate-y-1 hover:border-white hover:bg-[#002366] hover:text-white"
                  >
                    <span className="sr-only">{link.label}</span>
                    <link.icon className="h-6 w-6" />
                  </a>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#0058ff] via-[#0043e5] to-[#021e7c] px-8 py-10 text-white shadow-[0_35px_60px_rgba(1,33,120,0.35)]">
              <div className="pointer-events-none absolute -left-12 -top-16 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 right-10 h-56 w-56 rounded-full bg-[#00d4ff]/20 blur-3xl" />
              <div className="relative z-10 flex flex-col gap-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
                <p className="text-lg font-medium leading-relaxed">
                  Cadastre-se agora para explorar uma ampla variedade de veículos, caminhões, motos, SUVs e muito mais.
                </p>
                <Button
                  asChild
                  className="rounded-full bg-[#ffbc3a] px-8 py-6 text-base font-semibold text-[#002366] shadow-[0_18px_40px_rgba(0,0,0,0.25)] transition-colors duration-300 hover:bg-[#ffb121]"
                >
                  <a href="/registrar">Cadastre-se</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="container space-y-10">
            <h2 className="text-center text-3xl md:text-4xl font-bold text-[#002366]">Nossos Parceiros</h2>
            <p className="text-center text-base text-[#4c5c86]">
              Trabalhamos com instituições líderes que compartilham nosso compromisso com confiança, inovação e segurança.
            </p>
            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-12 gap-y-10 md:grid-cols-3 lg:grid-cols-6">
              {PARTNERS.map(partner => (
                <div
                  key={partner.name}
                  className="flex items-center justify-center rounded-2xl bg-white/80 p-4 shadow-[0_18px_35px_rgba(0,27,83,0.08)] ring-1 ring-[#d8e1ff]"
                >
                  <img
                    src={`/partners/${partner.logo}`}
                    alt={partner.name}
                    className="h-10 w-auto max-w-[120px] object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <span className="h-2 w-2 rounded-full bg-[#002366]" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
