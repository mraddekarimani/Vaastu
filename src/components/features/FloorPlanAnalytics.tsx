import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FloorPlan, Room } from '../../lib/floorPlanGenerator';
import { TrendingUp, Home, Calculator, Palette, Calendar } from 'lucide-react';

interface FloorPlanAnalyticsProps {
  plans: FloorPlan[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

export default function FloorPlanAnalytics({ plans }: FloorPlanAnalyticsProps) {
  const [analytics, setAnalytics] = useState<any>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  useEffect(() => {
    if (plans.length === 0) return;

    // Calculate analytics
    const totalPlans = plans.length;
    const totalArea = plans.reduce((sum, plan) => sum + plan.totalArea, 0);
    const averageArea = totalArea / totalPlans;
    const totalRooms = plans.reduce((sum, plan) => sum + plan.rooms.length, 0);
    const averageRooms = totalRooms / totalPlans;
    const totalCost = plans.reduce((sum, plan) => sum + (plan.estimatedCost || plan.totalArea * 125000), 0); // ₹125,000 per sq m

    // Room type distribution
    const roomTypeCount: { [key: string]: number } = {};
    plans.forEach(plan => {
      plan.rooms.forEach(room => {
        roomTypeCount[room.type] = (roomTypeCount[room.type] || 0) + 1;
      });
    });

    const roomTypeData = Object.entries(roomTypeCount).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count
    }));

    // Style distribution
    const styleCount: { [key: string]: number } = {};
    plans.forEach(plan => {
      const style = plan.style || 'modern';
      styleCount[style] = (styleCount[style] || 0) + 1;
    });

    const styleData = Object.entries(styleCount).map(([style, count]) => ({
      name: style.charAt(0).toUpperCase() + style.slice(1),
      value: count
    }));

    // Area distribution
    const areaRanges = [
      { range: '< 100 sq m', min: 0, max: 100 },
      { range: '100-150 sq m', min: 100, max: 150 },
      { range: '150-200 sq m', min: 150, max: 200 },
      { range: '200-250 sq m', min: 200, max: 250 },
      { range: '> 250 sq m', min: 250, max: Infinity }
    ];

    const areaData = areaRanges.map(range => ({
      name: range.range,
      count: plans.filter(plan => plan.totalArea >= range.min && plan.totalArea < range.max).length
    }));

    // Monthly creation trend (last 6 months)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const count = plans.filter(plan => {
        const planDate = new Date(plan.createdAt);
        return planDate.getMonth() === date.getMonth() && planDate.getFullYear() === date.getFullYear();
      }).length;
      monthlyData.push({ month: monthName, plans: count });
    }

    setAnalytics({
      totalPlans,
      averageArea: Math.round(averageArea),
      averageRooms: Math.round(averageRooms * 10) / 10,
      totalCost,
      roomTypeData,
      styleData,
      areaData,
      monthlyData
    });
  }, [plans]);

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center mb-2">
            <Home className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-medium text-blue-900">Total Plans</h3>
          </div>
          <p className="text-2xl font-bold text-blue-700">{analytics.totalPlans}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center mb-2">
            <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="font-medium text-green-900">Avg. Area</h3>
          </div>
          <p className="text-2xl font-bold text-green-700">{analytics.averageArea} sq m</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center mb-2">
            <Palette className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="font-medium text-purple-900">Avg. Rooms</h3>
          </div>
          <p className="text-2xl font-bold text-purple-700">{analytics.averageRooms}</p>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center mb-2">
            <Calculator className="h-5 w-5 text-orange-600 mr-2" />
            <h3 className="font-medium text-orange-900">Total Value</h3>
          </div>
          <p className="text-2xl font-bold text-orange-700">
            {formatCurrency(analytics.totalCost / 10000000).replace('₹', '₹')}Cr
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Room Type Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Room Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.roomTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.roomTypeData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Style Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Architectural Styles</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.styleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Area Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Area Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.areaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trend */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Creation Trend (Last 6 Months)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="plans" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Insights & Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Most Popular Room Type</h4>
            <p className="text-blue-700">
              {analytics.roomTypeData.length > 0 && 
                analytics.roomTypeData.reduce((prev: any, current: any) => 
                  prev.value > current.value ? prev : current
                ).name
              } rooms are the most common in your designs.
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-900 mb-2">Preferred Style</h4>
            <p className="text-green-700">
              {analytics.styleData.length > 0 && 
                analytics.styleData.reduce((prev: any, current: any) => 
                  prev.value > current.value ? prev : current
                ).name
              } style is your most used architectural approach.
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-medium text-purple-900 mb-2">Size Preference</h4>
            <p className="text-purple-700">
              Your average floor plan size of {analytics.averageArea} sq m indicates a preference for 
              {analytics.averageArea > 200 ? ' luxury' : analytics.averageArea > 150 ? ' spacious' : ' efficient'} homes.
            </p>
          </div>
          
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h4 className="font-medium text-orange-900 mb-2">Design Complexity</h4>
            <p className="text-orange-700">
              With an average of {analytics.averageRooms} rooms per plan, your designs show 
              {analytics.averageRooms > 8 ? ' high' : analytics.averageRooms > 6 ? ' moderate' : ' simple'} complexity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}