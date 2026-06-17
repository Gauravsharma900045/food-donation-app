import React, { useState, useEffect } from 'react';
import { foodAPI, notificationAPI } from '../utils/api';
import { showToast } from '../utils/helpers';

const Dashboard = ({ user }) => {
  const [foods, setFoods] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddFood, setShowAddFood] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    type: 'fresh',
    quantity: '1'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [foodRes, notifRes] = await Promise.all([
        foodAPI.getAll(),
        notificationAPI.getAll()
      ]);
      setFoods(foodRes.data);
      setNotifications(notifRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('Error loading dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    try {
      await foodAPI.create(formData);
      showToast('Food item added successfully!', 'success');
      setFormData({ category: '', description: '', type: 'fresh', quantity: '1' });
      setShowAddFood(false);
      fetchData();
    } catch (error) {
      showToast('Error adding food item', 'error');
    }
  };

  const handleDeleteFood = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await foodAPI.delete(id);
        showToast('Food item deleted!', 'success');
        fetchData();
      } catch (error) {
        showToast('Error deleting food item', 'error');
      }
    }
  };

  const userFoods = foods.filter(f => f.donorId === user?._id);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-dark text-text pt-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black mb-2">Dashboard</h1>
            <p className="text-muted">Welcome back, {user?.name}!</p>
          </div>
          {user?.role === 'donor' && (
            <button
              onClick={() => setShowAddFood(true)}
              className="px-6 py-3 bg-primary-green text-white font-semibold rounded-lg hover:bg-primary-green-dark transition-colors"
            >
              + Add Food Item
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-card border border-green-500/10 rounded-lg p-6">
            <div className="text-3xl font-black text-primary-green mb-2">{foods.length}</div>
            <div className="text-muted text-sm">Total Items Available</div>
          </div>
          <div className="bg-card border border-green-500/10 rounded-lg p-6">
            <div className="text-3xl font-black text-primary-green mb-2">{userFoods.length}</div>
            <div className="text-muted text-sm">My Donations</div>
          </div>
          <div className="bg-card border border-green-500/10 rounded-lg p-6">
            <div className="text-3xl font-black text-primary-green mb-2">{unreadNotifications}</div>
            <div className="text-muted text-sm">Notifications</div>
          </div>
          <div className="bg-card border border-green-500/10 rounded-lg p-6">
            <div className="text-3xl font-black text-primary-green mb-2">Active</div>
            <div className="text-muted text-sm">Account Status</div>
          </div>
        </div>

        {/* Add Food Modal */}
        {showAddFood && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-green-500/20 rounded-lg max-w-md w-full p-8">
              <h2 className="text-2xl font-bold mb-6">Add Food Item</h2>
              <form onSubmit={handleAddFood} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-muted mb-2 uppercase">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    placeholder="e.g., Vegetables, Fruits"
                    className="w-full px-4 py-2 bg-dark border border-green-500/10 rounded-lg text-text placeholder-muted focus:outline-none focus:border-primary-green"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted mb-2 uppercase">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe the food..."
                    className="w-full px-4 py-2 bg-dark border border-green-500/10 rounded-lg text-text placeholder-muted focus:outline-none focus:border-primary-green"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-muted mb-2 uppercase">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-4 py-2 bg-dark border border-green-500/10 rounded-lg text-text focus:outline-none focus:border-primary-green"
                    >
                      <option>fresh</option>
                      <option>cooked</option>
                      <option>packaged</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted mb-2 uppercase">Quantity</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      className="w-full px-4 py-2 bg-dark border border-green-500/10 rounded-lg text-text focus:outline-none focus:border-primary-green"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddFood(false)}
                    className="flex-1 px-4 py-2 border border-green-500/20 text-muted rounded-lg hover:bg-dark2 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-green text-white font-semibold rounded-lg hover:bg-primary-green-dark transition-colors"
                  >
                    Add Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-green-500/20 border-t-primary-green rounded-full animate-spin"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Foods List */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Available Food Items</h2>
              {foods.length === 0 ? (
                <div className="text-center py-12 text-muted">No items available</div>
              ) : (
                <div className="space-y-4">
                  {foods.map(food => (
                    <div key={food._id} className="bg-card border border-green-500/10 rounded-lg p-6">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="text-lg font-bold mb-2">{food.category}</h3>
                          <p className="text-muted text-sm mb-3">{food.description}</p>
                          <div className="flex gap-2">
                            <span className="text-xs bg-green-500/10 text-primary-green px-2 py-1 rounded">
                              {food.type}
                            </span>
                            <span className="text-xs text-muted">
                              {new Date(food.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        {food.donorId === user?._id && (
                          <button
                            onClick={() => handleDeleteFood(food._id)}
                            className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Sidebar */}
            <div>
              <h2 className="text-xl font-bold mb-6">Notifications</h2>
              {notifications.length === 0 ? (
                <div className="bg-card border border-green-500/10 rounded-lg p-6 text-center text-muted">
                  No notifications
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.slice(0, 5).map(notif => (
                    <div key={notif._id} className="bg-card border border-green-500/10 rounded-lg p-4 text-sm">
                      <p className="text-text font-medium mb-1">{notif.message}</p>
                      <p className="text-xs text-muted">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
