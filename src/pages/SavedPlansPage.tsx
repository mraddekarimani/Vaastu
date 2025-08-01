import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Clock, Download, Trash2, ArrowLeft, Check, Eye, Share2, Calculator, Home, Palette } from 'lucide-react';
import { toPng } from 'html-to-image';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { FloorPlan, Room } from '../lib/floorPlanGenerator';

// Enhanced room colors based on type
const roomColors = {
  bedroom: 'bg-blue-100 border-blue-300 text-blue-800',
  bathroom: 'bg-green-100 border-green-300 text-green-800',
  kitchen: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  living: 'bg-purple-100 border-purple-300 text-purple-800',
  dining: 'bg-red-100 border-red-300 text-red-800',
  veranda: 'bg-orange-100 border-orange-300 text-orange-800',
  study: 'bg-indigo-100 border-indigo-300 text-indigo-800',
  storage: 'bg-gray-100 border-gray-300 text-gray-800',
  laundry: 'bg-cyan-100 border-cyan-300 text-cyan-800',
  pantry: 'bg-amber-100 border-amber-300 text-amber-800',
  closet: 'bg-pink-100 border-pink-300 text-pink-800',
  hallway: 'bg-slate-100 border-slate-300 text-slate-800',
  foyer: 'bg-emerald-100 border-emerald-300 text-emerald-800'
};

export default function SavedPlansPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<FloorPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<FloorPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [showFurniture, setShowFurniture] = useState(true);
  const [filterStyle, setFilterStyle] = useState('all');
  const location = useLocation();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  useEffect(() => {
    async function fetchPlans() {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('floor_plans')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setPlans(data || []);
        
        // Check if we should select a specific plan from the URL
        const params = new URLSearchParams(location.search);
        const planId = params.get('id');
        
        if (planId && data) {
          const plan = data.find(p => p.id === planId);
          if (plan) {
            setSelectedPlan(plan);
          }
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPlans();
  }, [user, location.search]);

  const handleDownload = async () => {
    if (!selectedPlan) return;
    
    try {
      const element = document.getElementById(`floor-plan-${selectedPlan.id}`);
      if (!element) return;
      
      const dataUrl = await toPng(element, { quality: 0.95 });
      
      // Create download link
      const link = document.createElement('a');
      link.download = `${selectedPlan.name}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error downloading floor plan:', error);
    }
  };

  const handleShare = async () => {
    if (!selectedPlan) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedPlan.name,
          text: selectedPlan.description,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleDelete = async () => {
    if (!selectedPlan || !user) return;
    
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from('floor_plans')
        .delete()
        .eq('id', selectedPlan.id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setPlans(plans.filter(p => p.id !== selectedPlan.id));
      setSelectedPlan(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error deleting floor plan:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const calculateEstimatedCost = (plan: FloorPlan) => {
    return Math.round(plan.totalArea * 125000); // ₹125,000 per sq m estimate for Indian construction
  };

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStyle = filterStyle === 'all' || plan.style === filterStyle;
    return matchesSearch && matchesStyle;
  });

  const uniqueStyles = [...new Set(plans.map(plan => plan.style).filter(Boolean))];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {showSuccess && (
            <div className="mb-6 rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Floor plan deleted successfully!
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-serif font-bold text-gray-900">Saved Floor Plans</h1>
            <Link to="/floor-plan-generator" className="btn btn-primary">
              Create New Plan
            </Link>
          </div>
          
          {selectedPlan ? (
            <div className="card p-6">
              <div className="flex items-center mb-6">
                <button 
                  onClick={() => setSelectedPlan(null)}
                  className="flex items-center text-primary-600 hover:text-primary-700"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to all plans
                </button>
              </div>
              
              <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-gray-900">{selectedPlan.name}</h2>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(selectedPlan.createdAt).toLocaleDateString()}
                    </div>
                    {selectedPlan.style && (
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                        {selectedPlan.style} Style
                      </span>
                    )}
                    {selectedPlan.floors && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {selectedPlan.floors} Floor{selectedPlan.floors > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button 
                    onClick={handleShare}
                    className="btn btn-outline btn-sm"
                  >
                    <Share2 className="h-5 w-5 mr-2" />
                    Share
                  </button>
                  
                  <button 
                    onClick={handleDownload}
                    className="btn btn-outline btn-sm"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download
                  </button>
                  
                  <button 
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="btn btn-outline btn-sm text-red-600 hover:bg-red-50 hover:border-red-300"
                  >
                    {isDeleting ? (
                      <span className="animate-pulse">Deleting...</span>
                    ) : (
                      <>
                        <Trash2 className="h-5 w-5 mr-2" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">
                {selectedPlan.description}
              </p>

              {/* Plan Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-2">
                    <Calculator className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="font-medium text-blue-900">Estimated Cost</h3>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">
                    {formatCurrency(calculateEstimatedCost(selectedPlan))}
                  </p>
                  <p className="text-sm text-blue-600">Construction estimate</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center mb-2">
                    <Home className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="font-medium text-green-900">Total Rooms</h3>
                  </div>
                  <p className="text-2xl font-bold text-green-700">{selectedPlan.rooms.length}</p>
                  <p className="text-sm text-green-600">Functional spaces</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center mb-2">
                    <Palette className="h-5 w-5 text-purple-600 mr-2" />
                    <h3 className="font-medium text-purple-900">Style</h3>
                  </div>
                  <p className="text-2xl font-bold text-purple-700 capitalize">{selectedPlan.style || 'Modern'}</p>
                  <p className="text-sm text-purple-600">Architectural design</p>
                </div>
              </div>

              {/* Display Controls */}
              <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showDetails}
                    onChange={(e) => setShowDetails(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Room Details</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showFurniture}
                    onChange={(e) => setShowFurniture(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Furniture</span>
                </label>
              </div>
              
              <div className="mb-8 border rounded-lg p-4 overflow-auto">
                <div 
                  id={`floor-plan-${selectedPlan.id}`}
                  className="relative bg-white border-2 border-gray-200"
                  style={{ 
                    width: `${selectedPlan.width * 50}px`, 
                    height: `${selectedPlan.length * 50}px` 
                  }}
                >
                  {selectedPlan.rooms.map((room: Room) => (
                    <div
                      key={room.id}
                      className={`absolute border-2 ${roomColors[room.type] || 'bg-gray-100 border-gray-300 text-gray-800'} p-2 overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
                      style={{
                        width: `${room.width * 50}px`,
                        height: `${room.length * 50}px`,
                        left: `${room.x * 50}px`,
                        top: `${room.y * 50}px`,
                      }}
                    >
                      {showDetails && (
                        <>
                          <div className="text-xs font-semibold truncate">{room.name}</div>
                          <div className="text-xs truncate">
                            {room.width.toFixed(1)}m × {room.length.toFixed(1)}m
                          </div>
                          <div className="text-xs truncate">
                            {(room.width * room.length).toFixed(1)} sq m
                          </div>
                          {room.flooring && (
                            <div className="text-xs truncate opacity-75">
                              {room.flooring}
                            </div>
                          )}
                        </>
                      )}

                      {/* Render furniture if available and enabled */}
                      {showFurniture && room.furniture && room.furniture.map((item, index) => (
                        <div
                          key={index}
                          className="absolute bg-gray-600 opacity-40 border border-gray-700 rounded-sm"
                          style={{
                            width: `${item.width * 50}px`,
                            height: `${item.length * 50}px`,
                            left: `${item.x * 50}px`,
                            top: `${item.y * 50}px`,
                            transform: `rotate(${item.rotation}deg)`
                          }}
                          title={`${item.type}${item.brand ? ` (${item.brand})` : ''}`}
                        />
                      ))}

                      {/* Render doors */}
                      {room.doors && room.doors.map((door, index) => (
                        <div
                          key={index}
                          className="absolute bg-brown-600 border border-brown-800"
                          style={{
                            width: `${(door.width || 0.9) * 50}px`,
                            height: '4px',
                            left: `${door.x * 50}px`,
                            top: `${door.y * 50}px`,
                            transform: `rotate(${door.rotation}deg)`,
                            transformOrigin: 'left center'
                          }}
                          title={`${door.type} door`}
                        />
                      ))}

                      {/* Render windows */}
                      {room.windows && room.windows.map((window, index) => (
                        <div
                          key={index}
                          className="absolute bg-cyan-400 border border-cyan-600 opacity-70"
                          style={{
                            width: `${window.width * 50}px`,
                            height: '6px',
                            left: `${window.x * 50}px`,
                            top: `${window.y * 50}px`,
                          }}
                          title={`${window.type} window`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Detailed Room Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedPlan.rooms.map((room: Room) => (
                    <div key={room.id} className="card p-4 border hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-4 h-4 rounded-full ${(roomColors[room.type] || 'bg-gray-100').replace('bg-', 'bg-').replace('border-', 'bg-').replace('text-', 'bg-')}`}></div>
                        <h4 className="font-medium text-gray-900">{room.name}</h4>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {room.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Dimensions:</span> {room.width.toFixed(1)}m × {room.length.toFixed(1)}m
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Area:</span> {(room.width * room.length).toFixed(1)} sq m
                      </p>
                      {room.flooring && (
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Flooring:</span> {room.flooring}
                        </p>
                      )}
                      {room.ceilingHeight && (
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Ceiling:</span> {room.ceilingHeight}m
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mb-3">{room.description}</p>
                      
                      {room.features && room.features.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-medium text-gray-700 mb-1">Features:</p>
                          <div className="flex flex-wrap gap-1">
                            {room.features.map((feature, index) => (
                              <span key={index} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {room.furniture && room.furniture.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">Furniture & Fixtures:</p>
                          <div className="flex flex-wrap gap-1">
                            {room.furniture.map((item, index) => (
                              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {item.type.replace('-', ' ')}
                                {item.brand && ` (${item.brand})`}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Plan Information */}
              {selectedPlan.features && selectedPlan.features.length > 0 && (
                <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-200">
                  <h3 className="text-lg font-semibold text-primary-900 mb-4">Plan Features & Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedPlan.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-primary-800">
                        <Check className="h-4 w-4 text-primary-600 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="card p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="form-input pl-10"
                      placeholder="Search your floor plans..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="md:w-48">
                    <select
                      value={filterStyle}
                      onChange={(e) => setFilterStyle(e.target.value)}
                      className="form-input"
                    >
                      <option value="all">All Styles</option>
                      {uniqueStyles.map(style => (
                        <option key={style} value={style} className="capitalize">
                          {style}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              {isLoading ? (
                <div className="py-12 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p>Loading your saved plans...</p>
                </div>
              ) : filteredPlans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPlans.map((plan) => (
                    <div 
                      key={plan.id} 
                      className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer bg-white"
                      onClick={() => setSelectedPlan(plan)}
                    >
                      <div className="p-4 border-b">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium truncate">{plan.name}</h3>
                          <Eye className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          {new Date(plan.createdAt).toLocaleDateString()}
                          {plan.style && (
                            <>
                              <span>•</span>
                              <span className="capitalize">{plan.style}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                          {plan.description}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="text-gray-600">
                            {plan.width}m × {plan.length}m ({Math.round(plan.totalArea)} sq m)
                          </div>
                          <div className="text-primary-600 font-medium">
                            {plan.rooms.length} rooms
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          Est. {formatCurrency(calculateEstimatedCost(plan))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center border rounded-lg bg-white">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  {searchQuery || filterStyle !== 'all' ? (
                    <>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                      <p className="text-gray-600 mb-4">
                        No floor plans match your search criteria. Try different keywords or clear your filters.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setFilterStyle('all');
                        }}
                        className="btn btn-outline"
                      >
                        Clear Filters
                      </button>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No floor plans yet</h3>
                      <p className="text-gray-600 mb-6">
                        You haven't saved any floor plans yet. Generate your first professional plan now!
                      </p>
                      <Link to="/floor-plan-generator" className="btn btn-primary">
                        Create Your First Plan
                      </Link>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}