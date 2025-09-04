interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedMake: string;
  setSelectedMake: (make: string) => void;
}

const popularMakes = [
  "Toyota", "Honda", "Ford", "Chevrolet", "BMW", "Mercedes-Benz", 
  "Audi", "Nissan", "Hyundai", "Volkswagen", "Subaru", "Mazda"
];

export function SearchBar({ searchQuery, setSearchQuery, selectedMake, setSelectedMake }: SearchBarProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Vehicles
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by make, model, VIN..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Make
          </label>
          <select
            value={selectedMake}
            onChange={(e) => setSelectedMake(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Makes</option>
            {popularMakes.map((make) => (
              <option key={make} value={make}>{make}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedMake("");
            }}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}
