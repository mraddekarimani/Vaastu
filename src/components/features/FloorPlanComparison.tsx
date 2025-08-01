import { useState } from 'react';
import { FloorPlan, Room } from '../../lib/floorPlanGenerator';
import { X, ArrowLeftRight, Calculator, Home, Layers } from 'lucide-react';

interface FloorPlanComparisonProps {
  plans: FloorPlan[];
  onClose: () => void;
}

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

export default function FloorPlanComparison({ plans, onClose }: FloorPlanComparisonProps) {
  const [selectedPlans, setSelectedPlans] = useState<FloorPlan[]>(plans.slice(0, 2));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateEstimatedCost = (plan: FloorPlan) => {
    return Math.round(plan.totalArea * 125000); // ₹125,000 per sq m estimate for Indian construction
  };

  const getRoomCount = (plan: FloorPlan, type: Room['type']) => {
    return plan.rooms.filter(room => room.type === type).length;
  };

  const renderFloorPlan = (plan: FloorPlan, scale: number = 0.3) => (
    <div 
      className="relative bg-white border-2 border-gray-200 mx-auto"
      style={{ 
        width: `${plan.width * 50 * scale}px`, 
        height: `${plan.length * 50 * scale}px` 
      }}
    >
      {plan.rooms.map((room: Room) => (
        <div
          key={room.id}
          className={`absolute border ${roomColors[room.type] || 'bg-gray-100 border-gray-300 text-gray-800'} overflow-hidden`}
          style={{
            width: `${room.width * 50 * scale}px`,
            height: `${room.length * 50 * scale}px`,
            left: `${room.x * 50 * scale}px`,
            top: `${room.y * 50 * scale}px`,
          }}
        >
          <div className="text-xs font-medium truncate p-1" style={{ fontSize: `${8 * scale}px` }}>
            {room.name}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <ArrowLeftRight className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold">Floor Plan Comparison</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Plan Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Select Plans to Compare</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[0, 1].map((index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan {index + 1}
                  </label>
                  <select
                    value={selectedPlans[index]?.id || ''}
                    onChange={(e) => {
                      const plan = plans.find(p => p.id === e.target.value);
                      if (plan) {
                        const newPlans = [...selectedPlans];
                        newPlans[index] = plan;
                        setSelectedPlans(newPlans);
                      }
                    }}
                    className="form-input w-full"
                  >
                    <option value="">Select a plan...</option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {selectedPlans.length === 2 && selectedPlans[0] && selectedPlans[1] && (
            <>
              {/* Visual Comparison */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Visual Comparison</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedPlans.map((plan, index) => (
                    <div key={plan.id} className="text-center">
                      <h4 className="font-medium mb-2">{plan.name}</h4>
                      <div className="border rounded-lg p-4 bg-gray-50">
                        {renderFloorPlan(plan)}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {plan.width}m × {plan.length}m ({Math.round(plan.totalArea)} sq m)
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Comparison */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Detailed Comparison</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Feature
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {selectedPlans[0].name}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {selectedPlans[1].name}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Total Area
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {Math.round(selectedPlans[0].totalArea)} sq m
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {Math.round(selectedPlans[1].totalArea)} sq m
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Dimensions
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {selectedPlans[0].width}m × {selectedPlans[0].length}m
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {selectedPlans[1].width}m × {selectedPlans[1].length}m
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Total Rooms
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {selectedPlans[0].rooms.length}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {selectedPlans[1].rooms.length}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Bedrooms
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getRoomCount(selectedPlans[0], 'bedroom')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getRoomCount(selectedPlans[1], 'bedroom')}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Bathrooms
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getRoomCount(selectedPlans[0], 'bathroom')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getRoomCount(selectedPlans[1], 'bathroom')}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Style
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {selectedPlans[0].style || 'Modern'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {selectedPlans[1].style || 'Modern'}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Floors
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {selectedPlans[0].floors || 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {selectedPlans[1].floors || 1}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Estimated Cost
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(calculateEstimatedCost(selectedPlans[0]))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(calculateEstimatedCost(selectedPlans[1]))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Features Comparison */}
              <div>
                <h3 className="text-lg font-medium mb-4">Features Comparison</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedPlans.map((plan, index) => (
                    <div key={plan.id}>
                      <h4 className="font-medium mb-3">{plan.name}</h4>
                      <div className="space-y-2">
                        {plan.features && plan.features.length > 0 ? (
                          plan.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center text-sm">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              {feature}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No specific features listed</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}