import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function LeaderboardPanel() {
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState({
    topCrew: [],
    topPlanets: [],
    recentActivity: []
  });

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      // Get top crew members
      const crewResponse = await axios.get(
        `${API_URL}/api/users/top`
      );
      
      // Get top planets
      const planetsResponse = await axios.get(
        `${API_URL}/api/users/topPlanets`
      );

      // Get recent activity
      const activityResponse = await axios.get(
        `${API_URL}/api/users/recent`
      );

      setLeaderboard({
        topCrew: crewResponse.data,
        topPlanets: planetsResponse.data,
        recentActivity: activityResponse.data
      });
    } catch (error) {
      showFeedback("Error fetching leaderboard data", "error");
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (message, type = "success") => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: "", type: "" }), 3000);
  };

  const getRankBadge = (rank) => {
    const badges = {
      'Captain': '👑',
      'Commander': '⭐',
      'Lieutenant': '🔹',
      'Ensign': '🔸',
      'Cadet': '🌱'
    };
    return badges[rank] || '👤';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Fleet Leaderboard</h2>

      {feedback.message && (
        <div className={`p-4 rounded ${
          feedback.type === "error" ? "bg-red-500" : "bg-green-500"
        }`}>
          {feedback.message}
        </div>
      )}

      {/* Top Crew Members */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Top Crew Members</h3>
        <div className="space-y-4">
          {leaderboard.topCrew.map((member, index) => (
            <div key={member._id} className="flex items-center bg-gray-600 p-3 rounded">
              <div className="w-8 text-xl">{index + 1}.</div>
              <div className="w-8 text-xl">{getRankBadge(member.rank)}</div>
              <div className="flex-1">
                <div className="font-semibold">{member.name}</div>
                <div className="text-sm text-gray-300">{member.rank} • {member.planet}</div>
              </div>
              <div className="text-right">
                <div className="text-green-400">Active</div>
                <div className="text-sm text-gray-300">Level {member.level || 1}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Planets */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Top Planets</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {leaderboard.topPlanets.map((planet, index) => (
            <div key={planet._id} className="bg-gray-600 p-3 rounded">
              <div className="flex items-center justify-between">
                <span className="text-lg">🌍 {planet._id}</span>
                <span className="text-green-400">{planet.count} crew</span>
              </div>
              <div className="text-sm text-gray-300 mt-1">
                Rank #{index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {leaderboard.recentActivity.map((activity) => (
            <div key={activity._id} className="flex items-center bg-gray-600 p-3 rounded">
              <div className="w-8 text-xl">📝</div>
              <div className="flex-1">
                <div className="font-semibold">{activity.name}</div>
                <div className="text-sm text-gray-300">
                  {activity.action} • {new Date(activity.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Refresh Button */}
      <button
        onClick={fetchLeaderboard}
        className={`w-full py-2 px-4 rounded ${
          loading ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'
        } text-white font-medium`}
        disabled={loading}
      >
        {loading ? 'Refreshing...' : 'Refresh Leaderboard'}
      </button>
    </div>
  );
}
