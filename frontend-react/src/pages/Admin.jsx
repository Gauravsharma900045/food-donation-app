import React, { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import { showToast } from '../utils/helpers';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [foods, setFoods] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, foodsRes, statsRes] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getFood(),
        adminAPI.getStats()
      ]);
      setUsers(usersRes.data);
      setFoods(foodsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      showToast('Error loading admin data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(id);
        showToast('User deleted!', 'success');
        fetchData();
      } catch (error) {
        showToast('Error deleting user', 'error');
      }
    }
  };

  const handleDeleteFood = async (id) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        await adminAPI.deleteFood(id);
        showToast('Food item deleted!', 'success');
        fetchData();
      } catch (error) {
        showToast('Error deleting food item', 'error');
      }
    }
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFoods = foods.filter(f =>
    f.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-dark text-text pt-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black mb-2">Admin Panel</h1>
          <p className="text-muted">Manage users and food items</p>
        </div>

        {/* Stats */}
        {stats && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-card border border-green-500/10 rounded-lg p-6">
              <div className="text-3xl font-black text-primary-green mb-2">{stats.totalUsers}</div>
              <div className="text-muted text-sm">Total Users</div>
            </div>
            <div className="bg-card border border-primary-orange/10 rounded-lg p-6">
              <div className="text-3xl font-black text-primary-orange mb-2">{stats.totalFoods}</div>
              <div className="text-muted text-sm">Total Food Items</div>
            </div>
            <div className="bg-card border border-blue-500/10 rounded-lg p-6">
              <div className="text-3xl font-black text-blue-400 mb-2">{stats.activeDonors}</div>
              <div className="text-muted text-sm">Active Donors</div>
            </div>
            <div className="bg-card border border-green-500/10 rounded-lg p-6">
              <div className="text-3xl font-black text-primary-green mb-2">{stats.activeReceivers}</div>
              <div className="text-muted text-sm">Active Receivers</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-green-500/10">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'users'
                ? 'border-primary-green text-primary-green'
                : 'border-transparent text-muted hover:text-text'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('foods')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'foods'
                ? 'border-primary-green text-primary-green'
                : 'border-transparent text-muted hover:text-text'
            }`}
          >
            Food Items
          </button>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-3 bg-card border border-green-500/10 rounded-lg text-text placeholder-muted focus:outline-none focus:border-primary-green"
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-green-500/20 border-t-primary-green rounded-full animate-spin"></div>
            </div>
          </div>
        ) : activeTab === 'users' ? (
          <div className="bg-card border border-green-500/10 rounded-lg overflow-hidden">
            {filteredUsers.length === 0 ? (
              <div className="p-12 text-center text-muted">No users found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-card2 border-b border-green-500/10">
                      <th className="px-6 py-4 text-left text-xs font-bold text-muted uppercase">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-muted uppercase">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-muted uppercase">Role</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-muted uppercase">Phone</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-muted uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user._id} className="border-b border-green-500/10 hover:bg-card2 transition-colors">
                        <td className="px-6 py-4">{user.name}</td>
                        <td className="px-6 py-4 text-muted text-sm">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                            user.role === 'admin'
                              ? 'bg-primary-orange/10 text-primary-orange'
                              : user.role === 'donor'
                              ? 'bg-primary-green/10 text-primary-green'
                              : 'bg-blue-500/10 text-blue-400'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted text-sm">{user.phone}</td>
                        <td className="px-6 py-4">
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-card border border-green-500/10 rounded-lg overflow-hidden">
            {filteredFoods.length === 0 ? (
              <div className="p-12 text-center text-muted">No food items found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-card2 border-b border-green-500/10">
                      <th className="px-6 py-4 text-left text-xs font-bold text-muted uppercase">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-muted uppercase">Description</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-muted uppercase">Type</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-muted uppercase">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-muted uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFoods.map(food => (
                      <tr key={food._id} className="border-b border-green-500/10 hover:bg-card2 transition-colors">
                        <td className="px-6 py-4 font-semibold">{food.category}</td>
                        <td className="px-6 py-4 text-muted text-sm max-w-xs truncate">{food.description}</td>
                        <td className="px-6 py-4 text-xs">{food.type}</td>
                        <td className="px-6 py-4 text-muted text-sm">{new Date(food.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteFood(food._id)}
                            className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
