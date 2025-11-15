import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VehicleCardProps {
  id: string;
  image?: string | null;
  title: string;
  lotNumber?: string | null;
  currentBidCents?: number | null;
  currentBidLabel?: string;
  location?: string | null;
  saleStatus?: string | null;
  auctionDate?: Date | string | null;
  description?: string | null;
}

function formatCurrencyFromCents(value?: number | null): string | null {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value / 100);
}

function formatAuctionDate(value?: Date | string | null): string | null {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString("pt-BR", { dateStyle: "short" });
}

export default function VehicleCard({
  id,
  image,
  title,
  lotNumber,
  currentBidCents,
  currentBidLabel,
  location,
  saleStatus,
  auctionDate,
  description,
}: VehicleCardProps) {
  const formattedBid = currentBidLabel ?? formatCurrencyFromCents(currentBidCents) ?? "Consultar";
  const formattedAuctionDate = formatAuctionDate(auctionDate);
  const displayLocation = location?.trim() || "Localização não informada";
  const displayLotNumber = lotNumber?.trim() || "—";
  const displayDescription = description?.trim() || undefined;
  const imageSrc = image?.trim() || "/placeholder-car.jpg";

  return (
    <Link href={`/veiculo/${id}`}>
      <a>
        <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full">
          <div className="relative h-48 overflow-hidden">
            <img
              src={imageSrc}
              alt={title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
          <CardContent className="p-4 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {saleStatus && (
                <Badge className="bg-[#003087] text-white">{saleStatus}</Badge>
              )}
              {formattedAuctionDate && (
                <Badge variant="outline" className="border-[#003087] text-[#003087]">
                  {formattedAuctionDate}
                </Badge>
              )}
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-lg leading-tight line-clamp-2">{title}</h3>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Nº Lote:</span> {displayLotNumber}
              </p>
            </div>

            {displayDescription && (
              <p className="text-sm text-gray-600 line-clamp-2">{displayDescription}</p>
            )}

            <div className="space-y-1 pt-2">
              <p className="text-lg font-bold text-[#003087]">
                Lance Atual: {formattedBid}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Pátio:</span> {displayLocation}
              </p>
            </div>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
}
