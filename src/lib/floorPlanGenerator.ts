import { v4 as uuidv4 } from 'uuid';
import { geminiFloorPlanGenerator } from './geminiAI';

// Enhanced types for our floor plan generation
export interface Room {
  id: string;
  name: string;
  type: 'bedroom' | 'bathroom' | 'kitchen' | 'living' | 'dining' | 'veranda' | 'study' | 'storage' | 'laundry' | 'pantry' | 'closet' | 'hallway' | 'foyer';
  width: number;
  length: number;
  x: number;
  y: number;
  description: string;
  doors: { x: number; y: number; rotation: number; width: number; type: 'main' | 'interior' | 'sliding' | 'french' }[];
  windows: { x: number; y: number; width: number; height: number; type: 'standard' | 'bay' | 'sliding' | 'french' }[];
  furniture?: { type: string; x: number; y: number; width: number; length: number; rotation: number; brand?: string }[];
  walls?: { x1: number; y1: number; x2: number; y2: number; thickness: number; type: 'exterior' | 'interior' | 'load-bearing' }[];
  electrical?: { type: 'outlet' | 'switch' | 'light' | 'ceiling-fan'; x: number; y: number }[];
  plumbing?: { type: 'water' | 'drain' | 'gas'; x: number; y: number }[];
  flooring?: string;
  ceilingHeight?: number;
  features?: string[];
}

export interface FloorPlan {
  id: string;
  name: string;
  width: number;
  length: number;
  totalArea: number;
  rooms: Room[];
  description: string;
  createdAt: Date;
  style?: 'modern' | 'traditional' | 'contemporary' | 'minimalist' | 'colonial';
  floors?: number;
  orientation?: 'north' | 'south' | 'east' | 'west';
  features?: string[];
  estimatedCost?: number;
  buildingCode?: string;
}

export async function generateFloorPlan(
  width: number, 
  length: number, 
  requirements?: string,
  style?: string,
  floors?: number
): Promise<FloorPlan> {
  try {
    // Use Gemini AI to generate the floor plan
    const floorPlan = await geminiFloorPlanGenerator.generateFloorPlan(width, length, requirements, style, floors);
    return floorPlan;
  } catch (error) {
    console.error('Error generating floor plan:', error);
    
    // Fallback to a professional architectural plan if Gemini fails
    return generateProfessionalFallbackPlan(width, length, requirements, style);
  }
}

// Enhanced fallback function for professional architectural floor plan generation
function generateProfessionalFallbackPlan(width: number, length: number, requirements?: string, style?: string): FloorPlan {
  const totalArea = width * length;
  
  // Calculate room dimensions based on architectural standards
  const livingWidth = Math.min(5.5, width * 0.45);
  const livingLength = Math.min(4.5, length * 0.35);
  const masterWidth = Math.min(4.2, width * 0.35);
  const masterLength = Math.min(4, length * 0.32);
  const bedroomWidth = Math.min(3.5, width * 0.28);
  const bedroomLength = Math.min(3.8, length * 0.3);
  
  const rooms: Room[] = [
    {
      id: uuidv4(),
      name: 'Front Entrance',
      type: 'foyer',
      width: Math.min(width * 0.8, 6),
      length: 2.5,
      x: (width - Math.min(width * 0.8, 6)) / 2,
      y: 0,
      description: 'Grand entrance foyer with coat closet and elegant design features',
      doors: [{ x: 3, y: 2.5, rotation: 180, width: 1.2, type: 'main' }],
      windows: [{ x: 1.5, y: 0, width: 1.8, height: 1.2, type: 'standard' }],
      furniture: [
        { type: 'console-table', x: 0.3, y: 0.3, width: 0.4, length: 1.2, rotation: 0 },
        { type: 'mirror', x: 0.1, y: 0.5, width: 0.1, length: 0.8, rotation: 0 },
        { type: 'coat-rack', x: 5, y: 0.3, width: 0.3, length: 0.3, rotation: 0 }
      ],
      walls: [
        { x1: 0, y1: 0, x2: 6, y2: 0, thickness: 0.2, type: 'exterior' },
        { x1: 6, y1: 0, x2: 6, y2: 2.5, thickness: 0.15, type: 'interior' },
        { x1: 6, y1: 2.5, x2: 0, y2: 2.5, thickness: 0.15, type: 'interior' },
        { x1: 0, y1: 2.5, x2: 0, y2: 0, thickness: 0.2, type: 'exterior' }
      ],
      electrical: [
        { type: 'switch', x: 0.3, y: 2.2 },
        { type: 'outlet', x: 5.5, y: 0.3 },
        { type: 'light', x: 3, y: 1.25 }
      ],
      flooring: 'marble',
      ceilingHeight: 3.0,
      features: ['coat closet', 'decorative lighting', 'marble flooring']
    },
    {
      id: uuidv4(),
      name: 'Living Room',
      type: 'living',
      width: livingWidth,
      length: livingLength,
      x: 0.5,
      y: 3,
      description: 'Spacious open-plan living area with modern furnishings, entertainment center, and natural light',
      doors: [{ x: livingWidth/2, y: 0, rotation: 0, width: 1.0, type: 'interior' }],
      windows: [
        { x: 0, y: livingLength/2, width: 2.5, height: 1.5, type: 'bay' },
        { x: livingWidth, y: livingLength/2, width: 2, height: 1.2, type: 'standard' }
      ],
      furniture: [
        { type: 'sectional-sofa', x: 0.5, y: 0.5, width: 1.0, length: 3.2, rotation: 0 },
        { type: 'coffee-table', x: 2, y: 2, width: 0.6, length: 1.2, rotation: 0 },
        { type: 'tv-unit', x: livingWidth - 0.4, y: 1.5, width: 0.3, length: 1.8, rotation: 0 },
        { type: 'armchair', x: 0.3, y: 3.5, width: 0.8, length: 0.9, rotation: 45 },
        { type: 'side-table', x: 1.2, y: 3.8, width: 0.4, length: 0.4, rotation: 0 },
        { type: 'bookshelf', x: 0.1, y: 0.3, width: 0.3, length: 2.0, rotation: 0 }
      ],
      walls: [
        { x1: 0, y1: 0, x2: livingWidth, y2: 0, thickness: 0.15, type: 'interior' },
        { x1: livingWidth, y1: 0, x2: livingWidth, y2: livingLength, thickness: 0.2, type: 'exterior' },
        { x1: livingWidth, y1: livingLength, x2: 0, y2: livingLength, thickness: 0.15, type: 'interior' },
        { x1: 0, y1: livingLength, x2: 0, y2: 0, thickness: 0.2, type: 'exterior' }
      ],
      electrical: [
        { type: 'outlet', x: 0.3, y: 0.3 },
        { type: 'outlet', x: livingWidth - 0.3, y: 0.3 },
        { type: 'outlet', x: 0.3, y: livingLength - 0.3 },
        { type: 'switch', x: 0.3, y: 0.8 },
        { type: 'ceiling-fan', x: livingWidth/2, y: livingLength/2 }
      ],
      flooring: 'hardwood',
      ceilingHeight: 3.2,
      features: ['bay window', 'hardwood floors', 'ceiling fan', 'built-in entertainment center']
    },
    {
      id: uuidv4(),
      name: 'Dining Room',
      type: 'dining',
      width: Math.min(4, width * 0.32),
      length: Math.min(3.8, length * 0.28),
      x: Math.min(6.5, width * 0.45),
      y: 3,
      description: 'Elegant dining area with chandelier, perfect for family meals and entertaining guests',
      doors: [],
      windows: [{ x: 4, y: 1.9, width: 2.2, height: 1.5, type: 'french' }],
      furniture: [
        { type: 'dining-table', x: 1, y: 0.9, width: 1.6, length: 2.2, rotation: 0 },
        { type: 'dining-chair', x: 0.5, y: 0.5, width: 0.4, length: 0.4, rotation: 0 },
        { type: 'dining-chair', x: 0.5, y: 1.5, width: 0.4, length: 0.4, rotation: 0 },
        { type: 'dining-chair', x: 0.5, y: 2.5, width: 0.4, length: 0.4, rotation: 0 },
        { type: 'dining-chair', x: 3.1, y: 0.5, width: 0.4, length: 0.4, rotation: 180 },
        { type: 'dining-chair', x: 3.1, y: 1.5, width: 0.4, length: 0.4, rotation: 180 },
        { type: 'dining-chair', x: 3.1, y: 2.5, width: 0.4, length: 0.4, rotation: 180 },
        { type: 'buffet', x: 3.5, y: 0.2, width: 0.4, length: 1.8, rotation: 0 }
      ],
      electrical: [
        { type: 'light', x: 2, y: 1.9 },
        { type: 'switch', x: 0.3, y: 3.5 },
        { type: 'outlet', x: 3.7, y: 1 }
      ],
      flooring: 'hardwood',
      ceilingHeight: 3.2,
      features: ['chandelier', 'french doors to patio', 'built-in buffet']
    },
    {
      id: uuidv4(),
      name: 'Kitchen',
      type: 'kitchen',
      width: Math.min(4.2, width * 0.32),
      length: Math.min(3.5, length * 0.28),
      x: Math.min(width - 4.2, width * 0.78),
      y: 3,
      description: 'Modern kitchen with granite countertops, stainless steel appliances, and ample storage',
      doors: [],
      windows: [{ x: 2.1, y: 0, width: 1.8, height: 1.2, type: 'standard' }],
      furniture: [
        { type: 'l-counter', x: 0.1, y: 0.1, width: 0.6, length: 3.2, rotation: 0 },
        { type: 'l-counter', x: 0.7, y: 0.1, width: 3.4, length: 0.6, rotation: 0 },
        { type: 'island', x: 1.5, y: 1.8, width: 1.2, length: 0.8, rotation: 0 },
        { type: 'refrigerator', x: 3.5, y: 0.7, width: 0.6, length: 0.7, rotation: 0 },
        { type: 'stove', x: 0.1, y: 1.2, width: 0.6, length: 0.6, rotation: 0 },
        { type: 'dishwasher', x: 1.8, y: 0.1, width: 0.6, length: 0.6, rotation: 0 },
        { type: 'sink', x: 1.2, y: 0.1, width: 0.6, length: 0.6, rotation: 0 },
        { type: 'microwave', x: 2.4, y: 0.1, width: 0.6, length: 0.4, rotation: 0 },
        { type: 'pantry-cabinet', x: 3.5, y: 1.5, width: 0.6, length: 0.8, rotation: 0 }
      ],
      walls: [
        { x1: 0, y1: 0, x2: 4.2, y2: 0, thickness: 0.2, type: 'exterior' },
        { x1: 4.2, y1: 0, x2: 4.2, y2: 3.5, thickness: 0.2, type: 'exterior' },
        { x1: 4.2, y1: 3.5, x2: 0, y2: 3.5, thickness: 0.15, type: 'interior' },
        { x1: 0, y1: 3.5, x2: 0, y2: 0, thickness: 0.15, type: 'interior' }
      ],
      electrical: [
        { type: 'outlet', x: 0.5, y: 0.3 },
        { type: 'outlet', x: 1.5, y: 0.3 },
        { type: 'outlet', x: 2.5, y: 0.3 },
        { type: 'outlet', x: 3.5, y: 0.3 },
        { type: 'switch', x: 0.3, y: 3.2 },
        { type: 'light', x: 2.1, y: 1.75 }
      ],
      plumbing: [
        { type: 'water', x: 1.5, y: 0.1 },
        { type: 'drain', x: 1.5, y: 0.1 },
        { type: 'gas', x: 0.4, y: 1.5 }
      ],
      flooring: 'ceramic tile',
      ceilingHeight: 2.8,
      features: ['granite countertops', 'stainless steel appliances', 'kitchen island', 'pantry storage']
    },
    {
      id: uuidv4(),
      name: 'Master Bedroom',
      type: 'bedroom',
      width: masterWidth,
      length: masterLength,
      x: Math.min(width - masterWidth, width * 0.72),
      y: Math.min(length - masterLength - 1, length * 0.55),
      description: 'Luxurious master bedroom with walk-in closet, en-suite bathroom, and private balcony access',
      doors: [
        { x: 0, y: masterLength/2, rotation: 270, width: 0.9, type: 'interior' },
        { x: masterWidth, y: 0.5, rotation: 90, width: 0.8, type: 'interior' }
      ],
      windows: [
        { x: masterWidth/2, y: 0, width: 2.5, height: 1.5, type: 'sliding' },
        { x: masterWidth, y: masterLength/2, width: 1.8, height: 1.2, type: 'standard' }
      ],
      furniture: [
        { type: 'king-bed', x: 0.5, y: 0.5, width: 2.0, length: 2.2, rotation: 0 },
        { type: 'nightstand', x: 2.6, y: 0.5, width: 0.5, length: 0.5, rotation: 0 },
        { type: 'nightstand', x: 0.1, y: 0.5, width: 0.5, length: 0.5, rotation: 0 },
        { type: 'dresser', x: 0.3, y: 3.2, width: 1.6, length: 0.6, rotation: 0 },
        { type: 'armchair', x: 3.2, y: 2.8, width: 0.8, length: 0.9, rotation: 0 },
        { type: 'vanity', x: 2.8, y: 3.2, width: 0.6, length: 1.0, rotation: 0 }
      ],
      electrical: [
        { type: 'outlet', x: 0.3, y: 0.8 },
        { type: 'outlet', x: 2.9, y: 0.8 },
        { type: 'switch', x: 0.3, y: 2 },
        { type: 'ceiling-fan', x: masterWidth/2, y: masterLength/2 }
      ],
      flooring: 'carpet',
      ceilingHeight: 3.0,
      features: ['walk-in closet', 'en-suite bathroom', 'ceiling fan', 'balcony access']
    },
    {
      id: uuidv4(),
      name: 'Walk-in Closet',
      type: 'closet',
      width: 2.2,
      length: 1.8,
      x: Math.min(width - 2.2, width * 0.85),
      y: Math.min(length - 1.8, length * 0.75),
      description: 'Spacious walk-in closet with built-in organizers and full-length mirror',
      doors: [{ x: 0, y: 0.9, rotation: 270, width: 0.8, type: 'sliding' }],
      windows: [],
      furniture: [
        { type: 'closet-system', x: 0.1, y: 0.1, width: 0.6, length: 1.6, rotation: 0 },
        { type: 'closet-system', x: 1.5, y: 0.1, width: 0.6, length: 1.6, rotation: 0 },
        { type: 'dresser-built-in', x: 0.7, y: 0.1, width: 0.8, length: 0.6, rotation: 0 },
        { type: 'mirror', x: 0.7, y: 1.6, width: 0.1, length: 0.8, rotation: 0 }
      ],
      electrical: [
        { type: 'light', x: 1.1, y: 0.9 },
        { type: 'outlet', x: 1.1, y: 0.3 }
      ],
      flooring: 'carpet',
      ceilingHeight: 2.8,
      features: ['built-in organizers', 'full-length mirror', 'LED lighting']
    },
    {
      id: uuidv4(),
      name: 'Bedroom 2',
      type: 'bedroom',
      width: bedroomWidth,
      length: bedroomLength,
      x: 0.3,
      y: Math.min(length - bedroomLength, length * 0.6),
      description: 'Comfortable secondary bedroom with built-in desk and ample natural light',
      doors: [{ x: bedroomWidth, y: bedroomLength/2, rotation: 90, width: 0.8, type: 'interior' }],
      windows: [
        { x: 0, y: bedroomLength/2, width: 1.8, height: 1.2, type: 'standard' },
        { x: bedroomWidth/2, y: 0, width: 1.5, height: 1.2, type: 'standard' }
      ],
      furniture: [
        { type: 'queen-bed', x: 0.3, y: 0.3, width: 1.8, length: 2.0, rotation: 0 },
        { type: 'nightstand', x: 2.2, y: 0.3, width: 0.4, length: 0.4, rotation: 0 },
        { type: 'desk', x: 0.3, y: 3.0, width: 0.6, length: 1.4, rotation: 0 },
        { type: 'desk-chair', x: 0.5, y: 3.5, width: 0.5, length: 0.5, rotation: 0 },
        { type: 'wardrobe', x: 2.8, y: 0.3, width: 0.6, length: 2.5, rotation: 0 }
      ],
      electrical: [
        { type: 'outlet', x: 0.5, y: 0.5 },
        { type: 'outlet', x: 2.5, y: 0.5 },
        { type: 'outlet', x: 0.5, y: 3.2 },
        { type: 'switch', x: 3.2, y: 1.5 },
        { type: 'light', x: bedroomWidth/2, y: bedroomLength/2 }
      ],
      flooring: 'laminate',
      ceilingHeight: 2.8,
      features: ['built-in desk', 'large wardrobe', 'dual windows']
    },
    {
      id: uuidv4(),
      name: 'Bedroom 3',
      type: 'bedroom',
      width: bedroomWidth,
      length: bedroomLength,
      x: Math.min(4.5, width * 0.35),
      y: Math.min(length - bedroomLength, length * 0.6),
      description: 'Bright guest bedroom with garden view and built-in storage',
      doors: [{ x: 0, y: bedroomLength/2, rotation: 270, width: 0.8, type: 'interior' }],
      windows: [
        { x: bedroomWidth/2, y: bedroomLength, width: 1.8, height: 1.2, type: 'standard' },
        { x: bedroomWidth, y: bedroomLength/2, width: 1.5, height: 1.2, type: 'standard' }
      ],
      furniture: [
        { type: 'queen-bed', x: 0.3, y: 0.3, width: 1.8, length: 2.0, rotation: 0 },
        { type: 'nightstand', x: 2.2, y: 0.3, width: 0.4, length: 0.4, rotation: 0 },
        { type: 'wardrobe', x: 2.8, y: 0.3, width: 0.6, length: 2.5, rotation: 0 },
        { type: 'reading-chair', x: 0.3, y: 3.0, width: 0.7, length: 0.7, rotation: 0 },
        { type: 'side-table', x: 1.1, y: 3.2, width: 0.4, length: 0.4, rotation: 0 }
      ],
      electrical: [
        { type: 'outlet', x: 0.5, y: 0.5 },
        { type: 'outlet', x: 2.5, y: 0.5 },
        { type: 'switch', x: 0.3, y: 1.5 },
        { type: 'light', x: bedroomWidth/2, y: bedroomLength/2 }
      ],
      flooring: 'laminate',
      ceilingHeight: 2.8,
      features: ['garden view', 'built-in storage', 'reading nook']
    },
    {
      id: uuidv4(),
      name: 'Master Bathroom',
      type: 'bathroom',
      width: 3.2,
      length: 2.8,
      x: Math.min(width - 3.2, width * 0.78),
      y: Math.min(length - 2.8, length * 0.72),
      description: 'Luxurious master bathroom with soaking tub, separate shower, and double vanity',
      doors: [{ x: 0, y: 1.4, rotation: 270, width: 0.8, type: 'interior' }],
      windows: [{ x: 1.6, y: 0, width: 1.2, height: 1.0, type: 'standard' }],
      furniture: [
        { type: 'double-vanity', x: 0.1, y: 0.1, width: 1.8, length: 0.6, rotation: 0 },
        { type: 'soaking-tub', x: 2.0, y: 0.1, width: 1.1, length: 1.6, rotation: 0 },
        { type: 'walk-in-shower', x: 0.1, y: 1.8, width: 1.2, length: 0.9, rotation: 0 },
        { type: 'toilet', x: 1.4, y: 1.8, width: 0.7, length: 0.7, rotation: 0 },
        { type: 'linen-cabinet', x: 2.2, y: 1.8, width: 0.5, length: 0.9, rotation: 0 }
      ],
      electrical: [
        { type: 'outlet', x: 0.5, y: 0.3 },
        { type: 'outlet', x: 1.5, y: 0.3 },
        { type: 'switch', x: 0.3, y: 0.8 },
        { type: 'light', x: 1.6, y: 1.4 }
      ],
      plumbing: [
        { type: 'water', x: 0.5, y: 0.1 },
        { type: 'water', x: 1.5, y: 0.1 },
        { type: 'water', x: 2.5, y: 0.8 },
        { type: 'water', x: 0.6, y: 2.2 },
        { type: 'drain', x: 0.5, y: 0.1 },
        { type: 'drain', x: 1.5, y: 0.1 },
        { type: 'drain', x: 2.5, y: 0.8 },
        { type: 'drain', x: 0.6, y: 2.2 },
        { type: 'drain', x: 1.7, y: 2.1 }
      ],
      flooring: 'marble tile',
      ceilingHeight: 2.8,
      features: ['double vanity', 'soaking tub', 'walk-in shower', 'heated floors']
    },
    {
      id: uuidv4(),
      name: 'Main Bathroom',
      type: 'bathroom',
      width: Math.min(2.8, width * 0.22),
      length: Math.min(3.2, length * 0.26),
      x: Math.min(4.5, width * 0.35),
      y: Math.min(length - 7.2, length * 0.45),
      description: 'Full bathroom with tub/shower combo and modern fixtures',
      doors: [{ x: 1.4, y: 0, rotation: 0, width: 0.8, type: 'interior' }],
      windows: [{ x: 0, y: 1.6, width: 1.2, height: 1.0, type: 'standard' }],
      furniture: [
        { type: 'vanity', x: 0.1, y: 0.1, width: 1.2, length: 0.6, rotation: 0 },
        { type: 'toilet', x: 1.4, y: 0.1, width: 0.7, length: 0.7, rotation: 0 },
        { type: 'tub-shower', x: 0.1, y: 2.1, width: 0.8, length: 1.0, rotation: 0 },
        { type: 'linen-cabinet', x: 2.2, y: 0.1, width: 0.5, length: 0.8, rotation: 0 }
      ],
      electrical: [
        { type: 'outlet', x: 0.6, y: 0.3 },
        { type: 'switch', x: 1.6, y: 0.3 },
        { type: 'light', x: 1.4, y: 1.6 }
      ],
      plumbing: [
        { type: 'water', x: 0.6, y: 0.1 },
        { type: 'water', x: 0.5, y: 2.6 },
        { type: 'drain', x: 0.6, y: 0.1 },
        { type: 'drain', x: 0.5, y: 2.6 },
        { type: 'drain', x: 1.7, y: 0.4 }
      ],
      flooring: 'ceramic tile',
      ceilingHeight: 2.8,
      features: ['tub/shower combo', 'linen storage', 'exhaust fan']
    },
    {
      id: uuidv4(),
      name: 'Powder Room',
      type: 'bathroom',
      width: Math.min(1.8, width * 0.14),
      length: Math.min(2.2, length * 0.18),
      x: Math.min(2.5, width * 0.2),
      y: Math.min(length - 2.5, length * 0.8),
      description: 'Convenient half bath for guests with modern fixtures',
      doors: [{ x: 0.9, y: 0, rotation: 0, width: 0.7, type: 'interior' }],
      windows: [],
      furniture: [
        { type: 'pedestal-sink', x: 0.1, y: 0.3, width: 0.6, length: 0.5, rotation: 0 },
        { type: 'toilet', x: 0.1, y: 1.4, width: 0.7, length: 0.7, rotation: 0 },
        { type: 'mirror', x: 0.1, y: 0.1, width: 0.1, length: 0.6, rotation: 0 }
      ],
      electrical: [
        { type: 'outlet', x: 0.4, y: 0.5 },
        { type: 'switch', x: 1.5, y: 0.3 },
        { type: 'light', x: 0.9, y: 1.1 }
      ],
      plumbing: [
        { type: 'water', x: 0.4, y: 0.3 },
        { type: 'drain', x: 0.4, y: 0.3 },
        { type: 'drain', x: 0.45, y: 1.7 }
      ],
      flooring: 'ceramic tile',
      ceilingHeight: 2.8,
      features: ['pedestal sink', 'decorative mirror', 'exhaust fan']
    },
    {
      id: uuidv4(),
      name: 'Laundry Room',
      type: 'laundry',
      width: Math.min(2.5, width * 0.18),
      length: Math.min(2.8, length * 0.2),
      x: Math.min(width - 2.5, width * 0.85),
      y: Math.min(length - 2.8, length * 0.78),
      description: 'Efficient laundry room with washer, dryer, and utility sink',
      doors: [{ x: 0, y: 1.4, rotation: 270, width: 0.8, type: 'interior' }],
      windows: [{ x: 1.25, y: 0, width: 1.0, height: 1.0, type: 'standard' }],
      furniture: [
        { type: 'washer', x: 0.1, y: 0.1, width: 0.7, length: 0.7, rotation: 0 },
        { type: 'dryer', x: 0.8, y: 0.1, width: 0.7, length: 0.7, rotation: 0 },
        { type: 'utility-sink', x: 1.6, y: 0.1, width: 0.6, length: 0.6, rotation: 0 },
        { type: 'storage-cabinet', x: 0.1, y: 1.8, width: 2.2, length: 0.6, rotation: 0 },
        { type: 'folding-counter', x: 0.1, y: 0.8, width: 1.5, length: 0.6, rotation: 0 }
      ],
      electrical: [
        { type: 'outlet', x: 0.4, y: 0.3 },
        { type: 'outlet', x: 1.1, y: 0.3 },
        { type: 'outlet', x: 1.9, y: 0.3 },
        { type: 'switch', x: 0.3, y: 1.6 },
        { type: 'light', x: 1.25, y: 1.4 }
      ],
      plumbing: [
        { type: 'water', x: 0.4, y: 0.1 },
        { type: 'water', x: 1.9, y: 0.1 },
        { type: 'drain', x: 0.4, y: 0.1 },
        { type: 'drain', x: 1.9, y: 0.1 }
      ],
      flooring: 'vinyl',
      ceilingHeight: 2.8,
      features: ['utility sink', 'folding counter', 'storage cabinets', 'ventilation']
    },
    {
      id: uuidv4(),
      name: 'Storage Room',
      type: 'storage',
      width: Math.min(2.2, width * 0.18),
      length: Math.min(2.5, length * 0.2),
      x: Math.min(width - 2.2, width * 0.85),
      y: Math.min(length - 5.5, length * 0.55),
      description: 'Utility storage room with built-in shelving and equipment space',
      doors: [{ x: 0, y: 1.25, rotation: 270, width: 0.8, type: 'interior' }],
      windows: [],
      furniture: [
        { type: 'shelving-unit', x: 0.1, y: 0.1, width: 0.4, length: 2.2, rotation: 0 },
        { type: 'shelving-unit', x: 1.7, y: 0.1, width: 0.4, length: 2.2, rotation: 0 },
        { type: 'storage-cabinet', x: 0.6, y: 0.1, width: 1.0, length: 0.6, rotation: 0 },
        { type: 'utility-space', x: 0.6, y: 1.8, width: 1.0, length: 0.6, rotation: 0 }
      ],
      electrical: [
        { type: 'outlet', x: 1.1, y: 0.3 },
        { type: 'switch', x: 0.3, y: 2.2 },
        { type: 'light', x: 1.1, y: 1.25 }
      ],
      flooring: 'concrete',
      ceilingHeight: 2.8,
      features: ['built-in shelving', 'utility connections', 'ventilation', 'tool storage']
    }
  ];

  // Adjust positions based on actual dimensions and ensure no overlaps
  const scaleX = width / 15;
  const scaleY = length / 15;
  
  rooms.forEach(room => {
    room.x *= scaleX;
    room.y *= scaleY;
    room.width *= scaleX;
    room.length *= scaleY;
    
    // Ensure rooms fit within bounds
    room.x = Math.min(room.x, width - room.width);
    room.y = Math.min(room.y, length - room.length);
    
    // Scale furniture positions
    if (room.furniture) {
      room.furniture.forEach(item => {
        item.x *= scaleX;
        item.y *= scaleY;
        item.width *= scaleX;
        item.length *= scaleY;
      });
    }
    
    // Scale wall positions
    if (room.walls) {
      room.walls.forEach(wall => {
        wall.x1 *= scaleX;
        wall.y1 *= scaleY;
        wall.x2 *= scaleX;
        wall.y2 *= scaleY;
      });
    }
    
    // Scale electrical positions
    if (room.electrical) {
      room.electrical.forEach(item => {
        item.x *= scaleX;
        item.y *= scaleY;
      });
    }
    
    // Scale plumbing positions
    if (room.plumbing) {
      room.plumbing.forEach(item => {
        item.x *= scaleX;
        item.y *= scaleY;
      });
    }
  });

  return {
    id: uuidv4(),
    name: `Professional ${width}m x ${length}m Architectural Plan`,
    width,
    length,
    totalArea,
    rooms,
    description: `Professional architectural floor plan featuring ${rooms.length} rooms with modern amenities, optimal space utilization, and contemporary design. ${requirements ? `Special features: ${requirements}` : ''} Total area: ${totalArea} sq m designed for luxury family living with attention to architectural details and building standards.`,
    createdAt: new Date(),
    style: (style as any) || 'modern',
    floors: 1,
    orientation: 'south',
    features: ['open floor plan', 'master suite', 'modern kitchen', 'multiple bathrooms', 'laundry room', 'storage solutions'],
    estimatedCost: Math.round(totalArea * 125000), // ₹125,000 per sq m estimate for Indian construction
    buildingCode: 'NBC-2016'
  };
}