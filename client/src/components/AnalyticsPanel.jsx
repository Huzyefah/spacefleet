import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AnalyticsPanel({ stats }) {
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState({
    crewByPlanet: [],
    crewByRank: [],
    averageAge: 0
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Get crew by planet
      const planetResponse = await axios.get(
        `${API_URL}/api/users/aggregate`
      );
      
      // Get distinct planets
      const planetsResponse = await axios.get(
        `${API_URL}/api/users/distinct/planet`
      );

      // Get total count
      const countResponse = await axios.get(
        `${API_URL}/api/users/count`
      );

      setAnalytics({
        crewByPlanet: planetResponse.data,
        planets: planetsResponse.data,
        totalCrew: countResponse.data.count
      });
    } catch (error) {
      showFeedback("Error fetching analytics", "error");
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (message, type = "success") => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: "", type: "" }), 3000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Fleet Analytics</h2>

      {feedback.message && (
        <div className={`p-4 rounded ${
          feedback.type === "error" ? "bg-red-500" : "bg-green-500"
        }`}>
          {feedback.message}
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Crew</h3>
          <p className="text-3xl font-bold text-green-400">{stats.totalUsers}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Active Crew</h3>
          <p className="text-3xl font-bold text-blue-400">{stats.activeUsers}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Planets</h3>
          <p className="text-3xl font-bold text-purple-400">{stats.planets.length}</p>
        </div>
      </div>

      {/* Crew Distribution */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Crew Distribution by Planet</h3>
        <div className="space-y-4">
          {analytics.crewByPlanet.map(({ _id, total }) => (
            <div key={_id} className="flex items-center">
              <div className="w-32">{_id}</div>
              <div className="flex-1">
                <div 
                  className="bg-green-500 h-6 rounded"
                  style={{ width: `${(total / stats.totalUsers) * 100}%` }}
                />
              </div>
              <div className="w-16 text-right">{total}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Planet List */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Active Planets</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.planets.map(planet => (
            <div key={planet} className="bg-gray-600 p-3 rounded">
              <span className="text-lg">🌍 {planet}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Refresh Button */}
      <button
        onClick={fetchAnalytics}
        className={`w-full py-2 px-4 rounded ${
          loading ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'
        } text-white font-medium`}
        disabled={loading}
      >
        {loading ? 'Refreshing...' : 'Refresh Analytics'}
      </button>
    </div>
  );
}
