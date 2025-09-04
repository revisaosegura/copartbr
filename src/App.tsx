import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { VehicleGrid } from "./components/VehicleGrid";
import { SearchBar } from "./components/SearchBar";
import { LiveAuctions } from "./components/LiveAuctions";
import { useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-blue-600">AutoBid</h1>
            <nav className="hidden md:flex gap-6">
              <a href="#" className="text-gray-600 hover:text-blue-600">Browse</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">Live Auctions</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">How It Works</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Authenticated>
              <SignOutButton />
            </Authenticated>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <Content />
      </main>
      
      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const createSampleData = useMutation(api.sampleData.createSampleVehicles);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Unauthenticated>
        <div className="text-center py-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Next Vehicle at Auction
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Browse thousands of vehicles and bid in real-time auctions
          </p>
          <div className="max-w-md mx-auto">
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>

      <Authenticated>
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {loggedInUser?.name || loggedInUser?.email}!
            </h2>
            <p className="text-gray-600">Find your next vehicle from our auction inventory</p>
            <button
              onClick={async () => {
                try {
                  await createSampleData({});
                  toast.success("Sample vehicles created!");
                } catch (error) {
                  toast.error("Failed to create sample data");
                }
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create Sample Data
            </button>
          </div>

          <SearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedMake={selectedMake}
            setSelectedMake={setSelectedMake}
          />

          <LiveAuctions />

          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Browse Vehicles</h3>
            <VehicleGrid 
              searchQuery={searchQuery}
              selectedMake={selectedMake}
            />
          </div>
        </div>
      </Authenticated>
    </div>
  );
}
