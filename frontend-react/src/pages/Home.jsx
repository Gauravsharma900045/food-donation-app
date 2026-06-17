import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { foodAPI } from '../utils/api';

const Home = ({ isAuthenticated }) => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const response = await foodAPI.getAll();
      setFoods(response.data);
    } catch (error) {
      console.error('Error fetching foods:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFoods = foods.filter(food =>
    food.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    food.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-dark text-text">
      {/* Hero Section */}
      <div className="pt-24 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            Share Food, <span className="text-primary-green">Save Lives</span>
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto mb-8">
            FoodShare connects food donors with those in need. Reduce food waste and fight hunger in your community.
          </p>
          
          {!isAuthenticated && (
            <div className="flex gap-4 justify-center">
              <Link to="/register" className="px-8 py-3 bg-primary-green text-white font-semibold rounded-lg hover:bg-primary-green-dark transition-colors">
                Get Started
              </Link>
              <Link to="/login" className="px-8 py-3 border border-green-500/40 text-primary-green font-semibold rounded-lg hover:bg-green-500/10 transition-colors">
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-card border border-green-500/10 rounded-lg p-6 text-center">
            <div className="text-3xl font-black text-primary-green mb-2">{foods.length}</div>
            <div className="text-muted">Food Items Available</div>
          </div>
          <div className="bg-card border border-green-500/10 rounded-lg p-6 text-center">
            <div className="text-3xl font-black text-primary-green mb-2">1000+</div>
            <div className="text-muted">Community Members</div>
          </div>
          <div className="bg-card border border-green-500/10 rounded-lg p-6 text-center">
            <div className="text-3xl font-black text-primary-green mb-2">5000+</div>
            <div className="text-muted">Meals Shared</div>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-12">
          <input
            type="text"
            placeholder="Search by category or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-3 bg-card border border-green-500/10 rounded-lg text-text placeholder-muted focus:outline-none focus:border-primary-green transition-colors"
          />
        </div>

        {/* Food List */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-8">Available Food Items</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block">
                <div className="w-12 h-12 border-4 border-green-500/20 border-t-primary-green rounded-full animate-spin"></div>
              </div>
            </div>
          ) : filteredFoods.length === 0 ? (
            <div className="text-center py-12 text-muted">
              <p className="text-lg">No food items found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFoods.map(food => (
                <div key={food._id} className="bg-card border border-green-500/10 rounded-lg overflow-hidden hover:border-primary-green transition-colors">
                  {food.image && (
                    <img src={food.image} alt={food.category} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2">{food.category}</h3>
                    <p className="text-muted text-sm mb-4">{food.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-green-500/10 text-primary-green px-3 py-1 rounded-full">
                        {food.type || 'Available'}
                      </span>
                      <span className="text-xs text-muted">{new Date(food.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
