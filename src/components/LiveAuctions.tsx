import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";

export function LiveAuctions() {
  const liveAuctions = useQuery(api.auctions.getLiveAuctions);

  if (!liveAuctions || liveAuctions.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        <h3 className="text-xl font-bold text-red-700">Live Auctions</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {liveAuctions.filter((auction): auction is NonNullable<typeof auction> => auction !== null).map((auction) => (
          <LiveAuctionCard key={auction._id} auction={auction} />
        ))}
      </div>
    </div>
  );
}

function LiveAuctionCard({ auction }: { auction: any }) {
  const [timeLeft, setTimeLeft] = useState(auction.timeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev: number) => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg border border-red-200 p-4">
      <div className="flex items-center gap-2 mb-2">
        {auction.vehicle.imageUrls && auction.vehicle.imageUrls.length > 0 ? (
          <img
            src={auction.vehicle.imageUrls[0]}
            alt={`${auction.vehicle.year} ${auction.vehicle.make} ${auction.vehicle.model}`}
            className="w-16 h-16 object-cover rounded"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-400 text-2xl">🚗</span>
          </div>
        )}
        
        <div className="flex-1">
          <h4 className="font-semibold text-sm">
            {auction.vehicle.year} {auction.vehicle.make} {auction.vehicle.model}
          </h4>
          <p className="text-xs text-gray-600">Lot #{auction.vehicle.lotNumber}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Current Bid:</span>
          <span className="font-bold text-green-600">
            {formatCurrency(auction.currentBid)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Time Left:</span>
          <span className="font-bold text-red-600">
            {formatTime(timeLeft)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Total Bids:</span>
          <span className="font-medium">{auction.totalBids}</span>
        </div>
      </div>

      <button className="w-full mt-3 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors">
        Join Auction
      </button>
    </div>
  );
}
