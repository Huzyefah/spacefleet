import React, { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function UtilityPanel() {
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState("");
  const [selectedRank, setSelectedRank] = useState("");

  const showFeedback = (message, type = "success") => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: "", type: "" }), 3000);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      showFeedback("Please enter a search query", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/users/search`,
        {
          params: { query: searchQuery }
        }
      );
      setSearchResults(response.data);
      showFeedback(`Found ${response.data.length} results`);
    } catch (error) {
      showFeedback("Error performing search", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/users/filter`,
        {
          params: {
            planet: selectedPlanet,
            rank: selectedRank
          }
        }
      );
      setSearchResults(response.data);
      showFeedback(`Found ${response.data.length} results`);
    } catch (error) {
      showFeedback("Error applying filters", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/users/export`,
        { responseType: 'blob' }
      );
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'crew_data.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      showFeedback("Data exported successfully");
    } catch (error) {
      showFeedback("Error exporting data", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Fleet Utilities</h2>

      {feedback.message && (
        <div className={`p-4 rounded ${
          feedback.type === "error" ? "bg-red-500" : "bg-green-500"
        }`}>
          {feedback.message}
        </div>
      )}

      {/* Search Section */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Search Crew</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, rank, or planet..."
            className="flex-1 bg-gray-600 text-white px-4 py-2 rounded"
          />
          <button
            onClick={handleSearch}
            className={`px-4 py-2 rounded ${
              loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'
            } text-white font-medium`}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Filter Crew</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Planet</label>
            <select
              value={selectedPlanet}
              onChange={(e) => setSelectedPlanet(e.target.value)}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded"
            >
              <option value="">All Planets</option>
              <option value="Earth">Earth</option>
              <option value="Mars">Mars</option>
              <option value="Jupiter">Jupiter</option>
              <option value="Saturn">Saturn</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Rank</label>
            <select
              value={selectedRank}
              onChange={(e) => setSelectedRank(e.target.value)}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded"
            >
              <option value="">All Ranks</option>
              <option value="Captain">Captain</option>
              <option value="Commander">Commander</option>
              <option value="Lieutenant">Lieutenant</option>
              <option value="Ensign">Ensign</option>
              <option value="Cadet">Cadet</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleFilter}
          className={`w-full mt-4 px-4 py-2 rounded ${
            loading ? 'bg-gray-500' : 'bg-purple-500 hover:bg-purple-600'
          } text-white font-medium`}
          disabled={loading}
        >
          {loading ? 'Filtering...' : 'Apply Filters'}
        </button>
      </div>

      {/* Export Section */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Export Data</h3>
        <button
          onClick={handleExport}
          className={`w-full px-4 py-2 rounded ${
            loading ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'
          } text-white font-medium`}
          disabled={loading}
        >
          {loading ? 'Exporting...' : 'Export Crew Data'}
        </button>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Search Results</h3>
          <div className="space-y-3">
            {searchResults.map((result) => (
              <div key={result._id} className="flex items-center bg-gray-600 p-3 rounded">
                <div className="flex-1">
                  <div className="font-semibold">{result.name}</div>
                  <div className="text-sm text-gray-300">
                    {result.rank} • {result.planet}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm ${
                    result.active ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {result.active ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
