import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminPanel({ onStatsUpdate }) {
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [crew, setCrew] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    planet: "Earth",
    email: "",
    rank: "Ensign",
    active: true
  });

  const ranks = ["Ensign", "Lieutenant", "Commander", "Captain", "Admiral"];
  const planets = ["Earth", "Mars", "Venus", "Jupiter", "Saturn", "Neptune"];

  useEffect(() => {
    fetchCrew();
  }, []);

  const fetchCrew = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/users/find`);
      setCrew(response.data);
      updateStats(response.data);
    } catch (error) {
      showFeedback("Error fetching crew data", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (data) => {
    onStatsUpdate({
      totalUsers: data.length,
      activeUsers: data.filter(user => user.active).length,
      planets: [...new Set(data.map(user => user.planet))]
    });
  };

  const showFeedback = (message, type = "success") => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: "", type: "" }), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddCrewMember = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/users/insert`,
        formData
      );
      showFeedback("Crew member added successfully!");
      setFormData({
        name: "",
        age: "",
        planet: "Earth",
        email: "",
        rank: "Ensign",
        active: true
      });
      fetchCrew();
    } catch (error) {
      showFeedback(error.response?.data?.error || "Error adding crew member", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCrewMember = async (id) => {
    setLoading(true);
    try {
      await axios.put(
        `${API_URL}/api/users/updateOne`,
        { active: !crew.find(member => member._id === id).active },
        { params: { _id: id } }
      );
      showFeedback("Crew member status updated!");
      fetchCrew();
    } catch (error) {
      showFeedback("Error updating crew member", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCrewMember = async (id) => {
    setLoading(true);
    try {
      await axios.delete(
        `${API_URL}/api/users/deleteOne`,
        { params: { _id: id } }
      );
      showFeedback("Crew member removed!");
      fetchCrew();
    } catch (error) {
      showFeedback("Error removing crew member", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Crew Management</h2>
      
      {feedback.message && (
        <div className={`p-4 rounded ${
          feedback.type === "error" ? "bg-red-500" : "bg-green-500"
        }`}>
          {feedback.message}
        </div>
      )}

      {/* Add New Crew Member Form */}
      <form onSubmit={handleAddCrewMember} className="bg-gray-700 p-4 rounded-lg space-y-4">
        <h3 className="text-lg font-semibold mb-4">Add New Crew Member</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-gray-600 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-gray-600 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Planet</label>
            <select
              name="planet"
              value={formData.planet}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-gray-600 text-white"
            >
              {planets.map(planet => (
                <option key={planet} value={planet}>{planet}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-gray-600 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Rank</label>
            <select
              name="rank"
              value={formData.rank}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-gray-600 text-white"
            >
              {ranks.map(rank => (
                <option key={rank} value={rank}>{rank}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label className="text-sm font-medium">Active Status</label>
          </div>
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded ${
            loading ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'
          } text-white font-medium`}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Crew Member'}
        </button>
      </form>

      {/* Crew List */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Current Crew</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-600">
                <th className="pb-2">Name</th>
                <th className="pb-2">Rank</th>
                <th className="pb-2">Planet</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {crew.map(member => (
                <tr key={member._id} className="border-b border-gray-600">
                  <td className="py-2">{member.name}</td>
                  <td>{member.rank}</td>
                  <td>{member.planet}</td>
                  <td>
                    <span className={`px-2 py-1 rounded text-sm ${
                      member.active ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {member.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleUpdateCrewMember(member._id)}
                      className="text-blue-400 hover:text-blue-300 mr-2"
                    >
                      Toggle Status
                    </button>
                    <button
                      onClick={() => handleRemoveCrewMember(member._id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
