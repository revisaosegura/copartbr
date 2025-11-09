import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";

interface Bid {
  userId: string;
  userName: string;
  amount: number;
  timestamp: Date;
}

interface BiddingPanelProps {
  vehicleId: number;
  currentBid: number;
  minBidIncrement?: number;
}

export default function BiddingPanel({ vehicleId, currentBid, minBidIncrement = 100 }: BiddingPanelProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bids, setBids] = useState<Bid[]>([]);
  const [highestBid, setHighestBid] = useState(currentBid);
  const [isConnected, setIsConnected] = useState(false);

  // Conectar ao Socket.IO
  useEffect(() => {
    const newSocket = io(window.location.origin, {
      transports: ["websocket", "polling"]
    });

    newSocket.on("connect", () => {
      console.log("[Socket.IO] Conectado");
      setIsConnected(true);
      newSocket.emit("join-auction", vehicleId);
    });

    newSocket.on("disconnect", () => {
      console.log("[Socket.IO] Desconectado");
      setIsConnected(false);
    });

    // Receber histórico de lances
    newSocket.on("bid-history", (history: Bid[]) => {
      setBids(history);
      if (history.length > 0) {
        const highest = Math.max(...history.map(b => b.amount));
        setHighestBid(highest);
      }
    });

    // Receber novo lance
    newSocket.on("new-bid", (data: { vehicleId: number; bid: Bid; totalBids: number }) => {
      setBids(prev => [...prev, data.bid]);
      setHighestBid(data.bid.amount);
      
      // Notificar usuário
      toast.success(`Novo lance: R$ ${(data.bid.amount / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} por ${data.bid.userName}`);
    });

    // Receber erro de lance
    newSocket.on("bid-error", (data: { message: string }) => {
      toast.error(data.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.emit("leave-auction", vehicleId);
      newSocket.close();
    };
  }, [vehicleId]);

  const handlePlaceBid = () => {
    if (!socket || !isConnected) {
      toast.error("Não foi possível conectar ao servidor de lances");
      return;
    }

    const amount = parseFloat(bidAmount.replace(",", "."));
    if (isNaN(amount) || amount <= 0) {
      toast.error("Digite um valor válido");
      return;
    }

    const amountInCents = Math.round(amount * 100);
    const minBid = highestBid + minBidIncrement;

    if (amountInCents < minBid) {
      toast.error(`O lance mínimo é R$ ${(minBid / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
      return;
    }

    // Enviar lance
    socket.emit("place-bid", {
      vehicleId,
      userId: "user-" + Math.random().toString(36).substr(2, 9), // Temporário
      userName: "Usuário Anônimo", // Temporário
      amount: amountInCents
    });

    setBidAmount("");
  };

  const suggestedBid = highestBid + minBidIncrement;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Lance Atual</span>
          {isConnected ? (
            <span className="text-sm text-green-600 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
              Ao vivo
            </span>
          ) : (
            <span className="text-sm text-gray-400">Desconectado</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Lance Atual */}
        <div className="text-center">
          <p className="text-3xl font-bold text-[#003087]">
            R$ {(highestBid / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {bids.length} {bids.length === 1 ? 'lance' : 'lances'}
          </p>
        </div>

        {/* Formulário de Lance */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Seu Lance (mínimo: R$ {(suggestedBid / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
          </label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="0,00"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handlePlaceBid}
              className="bg-[#FDB714] hover:bg-[#e5a512] text-black font-semibold"
              disabled={!isConnected}
            >
              Dar Lance
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={() => setBidAmount((suggestedBid / 100).toFixed(2).replace(".", ","))}
            className="w-full"
            disabled={!isConnected}
          >
            Lance Sugerido: R$ {(suggestedBid / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Button>
        </div>

        {/* Histórico de Lances */}
        {bids.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold text-sm text-gray-700 mb-2">Histórico de Lances</h4>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {bids.slice().reverse().map((bid, index) => (
                <div key={index} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                  <span className="font-medium">{bid.userName}</span>
                  <span className="text-[#003087] font-semibold">
                    R$ {(bid.amount / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
