import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";

interface VehicleCardProps {
  id: string;
  image: string;
  title: string;
  lotNumber: string;
  currentBid: string;
  location: string;
}

export default function VehicleCard({
  id,
  image,
  title,
  lotNumber,
  currentBid,
  location,
}: VehicleCardProps) {
  return (
    <Link href={`/veiculo/${id}`}>
      <a>
        <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
          <div className="relative h-48 overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <CardContent className="p-4">
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">Nº Lote:</span> {lotNumber}
            </p>
            <p className="text-lg font-bold text-[#003087] mb-1">
              Lance Atual: {currentBid}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Pátio:</span> {location}
            </p>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
}
