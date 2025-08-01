import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  RefreshCw, Download, Save, Check, Plus, Minus, Settings, Sparkles, Home, Users, Lightbulb, 
  Building2, Layers, BrainCircuit, Compass, Palette, Calculator, FileText, Share2
} from 'lucide-react';
import { toPng } from 'html-to-image';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { generateFloorPlan, FloorPlan, Room } from '../lib/floorPlanGenerator';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

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

export default function FloorPlanGenerator() {
  const [width, setWidth] = useState<number>(12);
  const [length, setLength] = useState<number>(15);
  const [requirements, setRequirements] = useState<string>('');
  const [style, setStyle] = useState<string>('modern');
  const [floors, setFloors] = useState<number>(1);
  const [floorPlan, setFloorPlan] = useState<FloorPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showDetails, setShowDetails] = useState(true);
  const [showFurniture, setShowFurniture] = useState(true);
  const [showElectrical, setShowElectrical] = useState(false);
  const [showPlumbing, setShowPlumbing] = useState(false);
  const floorPlanRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const newFloorPlan = await generateFloorPlan(width, length, requirements, style, floors);
      setFloorPlan(newFloorPlan);
    } catch (error) {
      console.error('Error generating floor plan:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!floorPlan || !user) return;
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('floor_plans')
        .insert([
          {
            user_id: user.id,
            name: floorPlan.name,
            width: floorPlan.width,
            length: floorPlan.length,
            total_area: floorPlan.totalArea,
            rooms: floorPlan.rooms,
            description: floorPlan.description,
          },
        ]);
        
      if (error) throw error;
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving floor plan:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    if (!floorPlanRef.current) return;
    
    try {
      const dataUrl = await toPng(floorPlanRef.current, { quality: 0.95 });
      
      const link = document.createElement('a');
      link.download = `${floorPlan?.name || 'floor-plan'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error downloading floor plan:', error);
    }
  };

  const handleShare = async () => {
    if (!floorPlan) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: floorPlan.name,
          text: floorPlan.description,
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

  const increaseZoom = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const decreaseZoom = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  const calculateEstimatedCost = () => {
    if (!floorPlan) return 0;
    return Math.round(floorPlan.totalArea * 125000); // ₹125,000 per sq m estimate for Indian construction
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-6 mb-8">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-xl mr-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-serif font-bold text-gray-900">Professional AI Floor Plan Generator</h1>
                <p className="text-gray-600">Create detailed architectural floor plans with intelligent AI design and luxury features</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-primary-600" />
                  House Specifications
                </h2>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="width" className="form-label">Width (meters)</label>
                    <input
                      type="number"
                      id="width"
                      value={width}
                      onChange={(e) => setWidth(parseInt(e.target.value, 10) || 0)}
                      min="6"
                      max="30"
                      className="form-input"
                    />
                    <p className="text-xs text-gray-500 mt-1">Recommended: 10-20m</p>
                  </div>
                  <div>
                    <label htmlFor="length" className="form-label">Length (meters)</label>
                    <input
                      type="number"
                      id="length"
                      value={length}
                      onChange={(e) => setLength(parseInt(e.target.value, 10) || 0)}
                      min="6"
                      max="30"
                      className="form-input"
                    />
                    <p className="text-xs text-gray-500 mt-1">Recommended: 12-25m</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="style" className="form-label flex items-center">
                      <Palette className="h-4 w-4 mr-2" />
                      Architectural Style
                    </label>
                    <select
                      id="style"
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className="form-input"
                    >
                      <option value="modern">Modern</option>
                      <option value="contemporary">Contemporary</option>
                      <option value="traditional">Traditional</option>
                      <option value="minimalist">Minimalist</option>
                      <option value="colonial">Colonial</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="floors" className="form-label flex items-center">
                      <Layers className="h-4 w-4 mr-2" />
                      Number of Floors
                    </label>
                    <select
                      id="floors"
                      value={floors}
                      onChange={(e) => setFloors(parseInt(e.target.value, 10))}
                      className="form-input"
                    >
                      <option value={1}>Single Story</option>
                      <option value={2}>Two Story</option>
                      <option value={3}>Three Story</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center text-primary-600 mb-3">
                    <Settings className="h-4 w-4 mr-2" />
                    <span className="font-medium">Advanced Design Requirements</span>
                    <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">Professional AI</span>
                  </div>
                  
                  <div className="space-y-4 p-4 bg-gradient-to-r from-gray-50 to-primary-50 rounded-lg border border-primary-200">
                    <div>
                      <label htmlFor="requirements" className="form-label flex items-center">
                        <BrainCircuit className="h-4 w-4 mr-2" />
                        Detailed Requirements & Luxury Features
                      </label>
                      <textarea
                        id="requirements"
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
                        placeholder="Describe your dream home in detail:
• Family size and lifestyle (4-bedroom family home, elderly parents, home office needs)
• Luxury features (gourmet kitchen, spa bathroom, wine cellar, home theater)
• Specific room requirements (master suite with sitting area, guest suite, study)
• Kitchen preferences (island with seating, butler's pantry, walk-in pantry)
• Bathroom features (soaking tub, walk-in shower, double vanity, heated floors)
• Storage needs (walk-in closets, mudroom, utility room, garage)
• Outdoor spaces (covered patio, deck, outdoor kitchen, pool area)
• Special amenities (fireplace, built-in entertainment center, library)
• Accessibility features (single-story, wide hallways, accessible bathrooms)
• Architectural details (coffered ceilings, crown molding, hardwood floors)
• Energy efficiency (solar panels, smart home features, efficient HVAC)
• Any other luxury requirements or preferences..."
                        rows={10}
                        className="form-input"
                      />
                      <p className="text-sm text-gray-600 mt-2 flex items-start">
                        <Lightbulb className="h-4 w-4 mr-1 mt-0.5 text-yellow-500" />
                        The more detailed your requirements, the better our AI can design your luxury home
                      </p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || width < 6 || length < 6}
                  className="btn btn-primary w-full relative overflow-hidden"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      AI is designing your professional floor plan...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Generate Professional Floor Plan
                    </>
                  )}
                </button>
                
                {(width < 6 || length < 6) && (
                  <p className="text-sm text-red-600 mt-2">
                    Minimum dimensions: 6m x 6m
                  </p>
                )}
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Professional AI Features</h2>
                <div className="space-y-4">
                  <div className="flex items-start p-4 bg-white rounded-lg border border-gray-200">
                    <div className="p-2 bg-primary-100 rounded-lg mr-3 mt-1">
                      <BrainCircuit className="h-4 w-4 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Architectural Intelligence</h3>
                      <p className="text-sm text-gray-600">
                        Advanced AI creates professional architectural layouts with proper building codes, structural integrity, and luxury design standards
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-4 bg-white rounded-lg border border-gray-200">
                    <div className="p-2 bg-green-100 rounded-lg mr-3 mt-1">
                      <Layers className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Luxury Room Planning</h3>
                      <p className="text-sm text-gray-600">
                        Creates comprehensive layouts with master suites, gourmet kitchens, spa bathrooms, and premium amenities
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-4 bg-white rounded-lg border border-gray-200">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3 mt-1">
                      <Calculator className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Cost Estimation</h3>
                      <p className="text-sm text-gray-600">
                        Provides detailed cost estimates in Indian Rupees, material specifications, and construction timelines for your project
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-4 bg-white rounded-lg border border-gray-200">
                    <div className="p-2 bg-yellow-100 rounded-lg mr-3 mt-1">
                      <FileText className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Building Code Compliance</h3>
                      <p className="text-sm text-gray-600">
                        Ensures all designs meet current Indian building codes (NBC-2016), safety standards, and accessibility requirements
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-200">
                  <h3 className="font-medium text-primary-900 mb-2 flex items-center">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Professional Design Tips
                  </h3>
                  <ul className="text-sm text-primary-800 space-y-1">
                    <li>• Optimal luxury home dimensions: 12-20m width, 15-25m length</li>
                    <li>• Specify premium materials: marble, hardwood, granite countertops</li>
                    <li>• Include smart home features and energy-efficient systems</li>
                    <li>• Consider outdoor living spaces and entertainment areas</li>
                    <li>• Plan for future needs: aging in place, family growth</li>
                    <li>• Emphasize natural light, views, and architectural details</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {floorPlan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="card p-6"
            >
              <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-gray-900">{floorPlan.name}</h2>
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-gray-600">
                      {floorPlan.width}m × {floorPlan.length}m ({Math.round(floorPlan.totalArea)} sq m)
                    </p>
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                      {floorPlan.style} Style
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {floorPlan.floors} Floor{floorPlan.floors > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center mt-1">
                    <Sparkles className="h-4 w-4 text-primary-600 mr-1" />
                    <span className="text-sm text-primary-600 font-medium">Professional Architectural Design</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <div className="bg-white rounded-md shadow-sm flex border">
                    <button 
                      onClick={decreaseZoom}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-l-md transition-colors"
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                    <span className="py-2 px-3 text-sm font-medium border-l border-r">{Math.round(zoom * 100)}%</span>
                    <button 
                      onClick={increaseZoom}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-r-md transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                  
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
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn btn-primary btn-sm"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Save Plan
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {showSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 rounded-md bg-green-50 p-4 border border-green-200"
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        Professional floor plan saved successfully! You can view it in your saved plans.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {floorPlan.description}
              </p>

              {/* Plan Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-2">
                    <Calculator className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="font-medium text-blue-900">Estimated Cost</h3>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">
                    {formatCurrency(calculateEstimatedCost())}
                  </p>
                  <p className="text-sm text-blue-600">Construction estimate</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center mb-2">
                    <Home className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="font-medium text-green-900">Total Rooms</h3>
                  </div>
                  <p className="text-2xl font-bold text-green-700">{floorPlan.rooms.length}</p>
                  <p className="text-sm text-green-600">Functional spaces</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center mb-2">
                    <Compass className="h-5 w-5 text-purple-600 mr-2" />
                    <h3 className="font-medium text-purple-900">Orientation</h3>
                  </div>
                  <p className="text-2xl font-bold text-purple-700">{floorPlan.orientation || 'South'}</p>
                  <p className="text-sm text-purple-600">Optimal sunlight</p>
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
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showElectrical}
                    onChange={(e) => setShowElectrical(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Electrical</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showPlumbing}
                    onChange={(e) => setShowPlumbing(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Plumbing</span>
                </label>
              </div>
              
              <div className="mb-8 border rounded-lg p-4 overflow-auto bg-white">
                <div 
                  ref={floorPlanRef}
                  className="relative bg-white border-2 border-gray-300 shadow-sm"
                  style={{
                    width: `${floorPlan.width * 50}px`,
                    height: `${floorPlan.length * 50}px`,
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top left',
                    transition: 'transform 0.2s ease-out'
                  }}
                >
                  {floorPlan.rooms.map((room) => (
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

                      {/* Render electrical if enabled */}
                      {showElectrical && room.electrical && room.electrical.map((item, index) => (
                        <div
                          key={index}
                          className={`absolute w-2 h-2 rounded-full ${
                            item.type === 'outlet' ? 'bg-yellow-500' :
                            item.type === 'switch' ? 'bg-blue-500' :
                            item.type === 'light' ? 'bg-orange-500' :
                            'bg-green-500'
                          }`}
                          style={{
                            left: `${item.x * 50 - 4}px`,
                            top: `${item.y * 50 - 4}px`,
                          }}
                          title={item.type}
                        />
                      ))}

                      {/* Render plumbing if enabled */}
                      {showPlumbing && room.plumbing && room.plumbing.map((item, index) => (
                        <div
                          key={index}
                          className={`absolute w-2 h-2 rounded-full ${
                            item.type === 'water' ? 'bg-blue-600' :
                            item.type === 'drain' ? 'bg-gray-600' :
                            'bg-red-600'
                          }`}
                          style={{
                            left: `${item.x * 50 - 4}px`,
                            top: `${item.y * 50 - 4}px`,
                          }}
                          title={item.type}
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
                  {floorPlan.rooms.map((room) => (
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
              {floorPlan.features && floorPlan.features.length > 0 && (
                <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-200">
                  <h3 className="text-lg font-semibold text-primary-900 mb-4">Plan Features & Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {floorPlan.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-primary-800">
                        <Check className="h-4 w-4 text-primary-600 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="btn btn-outline"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Generate Another Professional Plan
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}