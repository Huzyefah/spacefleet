// src/App.jsx
import React, { useState } from "react";
import AdminPanel from "./components/AdminPanel";
import AnalyticsPanel from "./components/AnalyticsPanel";
import LeaderboardPanel from "./components/LeaderboardPanel";
import UtilityPanel from "./components/UtilityPanel";

export default function App() {
  const [tab, setTab] = useState("admin");
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    planets: []
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-green-400">
            🌍 Space Fleet Command Center
          </h1>
          <p className="text-center text-gray-400 mt-2">
            Manage your intergalactic crew and analyze fleet operations
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        {/* Navigation */}
        <nav className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setTab("admin")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              tab === "admin"
                ? "bg-green-500 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            👥 Crew Management
          </button>
          <button
            onClick={() => setTab("analytics")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              tab === "analytics"
                ? "bg-green-500 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            📊 Fleet Analytics
          </button>
          <button
            onClick={() => setTab("leaderboard")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              tab === "leaderboard"
                ? "bg-green-500 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            🏆 Crew Rankings
          </button>
          <button
            onClick={() => setTab("utils")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              tab === "utils"
                ? "bg-green-500 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            ⚙️ Fleet Operations
          </button>
        </nav>

        {/* Content Area */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          {tab === "admin" && <AdminPanel onStatsUpdate={setStats} />}
          {tab === "analytics" && <AnalyticsPanel stats={stats} />}
          {tab === "leaderboard" && <LeaderboardPanel />}
          {tab === "utils" && <UtilityPanel />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 p-4 mt-8">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>Space Fleet Command Center v1.0</p>
          <p className="text-sm mt-1">© 2024 Intergalactic Operations</p>
        </div>
      </footer>
    </div>
  );
}
