import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, LayoutGrid, Settings, PlusCircle, Info, TrendingUp, ArrowLeftRight, BarChart3, Calculator } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import FloorPlanComparison from '../components/features/FloorPlanComparison';
import FloorPlanAnalytics from '../components/features/FloorPlanAnalytics';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { FloorPlan } from '../lib/floorPlanGenerator';

export default function DashboardPage() {
  const { user } = useAuth();
  const [recentPlans, setRecentPlans] = useState<FloorPlan[]>([]);
  const [allPlans, setAllPlans] = useState<FloorPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [stats, setStats] = useState({
    totalPlans: 0,
    totalArea: 0,
    averageRooms: 0,
    estimatedValue: 0
  });

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
        
        const plans = data || [];
        setAllPlans(plans);
        setRecentPlans(plans.slice(0, 3));
        
        // Calculate statistics
        const totalPlans = plans.length;
        const totalArea = plans.reduce((sum, plan) => sum + plan.totalArea, 0);
        const totalRooms = plans.reduce((sum, plan) => sum + plan.rooms.length, 0);
        const averageRooms = totalPlans > 0 ? totalRooms / totalPlans : 0;
        const estimatedValue = plans.reduce((sum, plan) => sum + (plan.totalArea * 125000), 0); // ₹125,000 per sq m
        
        setStats({
          totalPlans,
          totalArea: Math.round(totalArea),
          averageRooms: Math.round(averageRooms * 10) / 10,
          estimatedValue
        });
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPlans();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}! Manage your floor plans and explore advanced features.
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center mb-2">
                <LayoutGrid className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="font-medium text-blue-900">Total Plans</h3>
              </div>
              <p className="text-3xl font-bold text-blue-700">{stats.totalPlans}</p>
              <p className="text-sm text-blue-600">Floor plans created</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <div className="flex items-center mb-2">
                <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="font-medium text-green-900">Total Area</h3>
              </div>
              <p className="text-3xl font-bold text-green-700">{stats.totalArea.toLocaleString()}</p>
              <p className="text-sm text-green-600">Square meters designed</p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <div className="flex items-center mb-2">
                <BarChart3 className="h-6 w-6 text-purple-600 mr-2" />
                <h3 className="font-medium text-purple-900">Avg. Rooms</h3>
              </div>
              <p className="text-3xl font-bold text-purple-700">{stats.averageRooms}</p>
              <p className="text-sm text-purple-600">Rooms per plan</p>
            </div>
            
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <div className="flex items-center mb-2">
                <Calculator className="h-6 w-6 text-orange-600 mr-2" />
                <h3 className="font-medium text-orange-900">Est. Value</h3>
              </div>
              <p className="text-3xl font-bold text-orange-700">
                {formatCurrency(stats.estimatedValue / 10000000).replace('₹', '₹')}Cr
              </p>
              <p className="text-sm text-orange-600">Total construction value</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Link 
              to="/floor-plan-generator" 
              className="card p-6 border-2 border-primary-200 bg-primary-50 hover:bg-primary-100 transition-colors"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-primary-100">
                  <PlusCircle className="h-6 w-6 text-primary-600" />
                </div>
                <h2 className="ml-3 text-lg font-medium text-gray-900">Create New Plan</h2>
              </div>
              <p className="text-gray-600">
                Generate a new professional floor plan with AI-powered design and luxury features.
              </p>
            </Link>
            
            <Link 
              to="/saved-plans" 
              className="card p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-blue-100">
                  <LayoutGrid className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="ml-3 text-lg font-medium text-gray-900">View All Plans</h2>
              </div>
              <p className="text-gray-600">
                Browse, edit, and manage all your saved floor plans with advanced filtering.
              </p>
            </Link>
            
            <Link 
              to="/profile" 
              className="card p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-yellow-100">
                  <Settings className="h-6 w-6 text-yellow-600" />
                </div>
                <h2 className="ml-3 text-lg font-medium text-gray-900">Account Settings</h2>
              </div>
              <p className="text-gray-600">
                Update your profile information, preferences, and subscription details.
              </p>
            </Link>
          </div>

          {/* Advanced Features */}
          {allPlans.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <button
                onClick={() => setShowComparison(true)}
                className="card p-6 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-indigo-100">
                    <ArrowLeftRight className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h2 className="ml-3 text-lg font-medium text-gray-900">Compare Plans</h2>
                </div>
                <p className="text-gray-600">
                  Side-by-side comparison of your floor plans with detailed analysis and metrics.
                </p>
              </button>
              
              <button
                onClick={() => setShowAnalytics(true)}
                className="card p-6 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-green-100">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                  </div>
                  <h2 className="ml-3 text-lg font-medium text-gray-900">Analytics</h2>
                </div>
                <p className="text-gray-600">
                  Detailed analytics and insights about your floor plan designs and preferences.
                </p>
              </button>
            </div>
          )}
          
          <div className="card p-6 mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Recent Floor Plans</h2>
              <Link to="/saved-plans" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View all
              </Link>
            </div>
            
            {isLoading ? (
              <div className="py-12 text-center text-gray-500">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p>Loading your recent plans...</p>
              </div>
            ) : recentPlans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentPlans.map((plan) => (
                  <div key={plan.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-4 border-b">
                      <h3 className="font-medium truncate">{plan.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(plan.createdAt).toLocaleDateString()}
                        {plan.style && (
                          <>
                            <span className="mx-1">•</span>
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
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-500">
                          Est. {formatCurrency(Math.round(plan.totalArea * 125000))}
                        </span>
                        <Link 
                          to={`/saved-plans?id=${plan.id}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          View details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center border rounded-lg">
                <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No floor plans yet</h3>
                <p className="text-gray-600 mb-6">
                  You haven't created any floor plans yet. Generate your first professional plan now!
                </p>
                <Link to="/floor-plan-generator" className="btn btn-primary">
                  Create Your First Plan
                </Link>
              </div>
            )}
          </div>
          
          <div className="card p-6 bg-gradient-to-r from-primary-600 to-secondary-700 text-white">
            <div className="md:flex items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-6">
                <h2 className="text-xl font-semibold mb-2">Upgrade to Vaastu Premium</h2>
                <p className="text-white/80">
                  Get access to advanced features like 3D visualization, unlimited floor plans, 
                  professional CAD exports, and expert design consultation.
                </p>
              </div>
              <div className="flex-shrink-0">
                <a href="#" className="btn bg-white text-primary-700 hover:bg-gray-100">
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showComparison && (
        <FloorPlanComparison
          plans={allPlans}
          onClose={() => setShowComparison(false)}
        />
      )}

      {showAnalytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Floor Plan Analytics</h2>
              <button
                onClick={() => setShowAnalytics(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <FloorPlanAnalytics plans={allPlans} />
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}